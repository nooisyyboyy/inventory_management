import Order from "../../../../models/orderModel";
import SubItem from "../../../../models/subitemModel";
import authMiddleware from "../../../../utils/authMiddleware";
import connectMongo from "../../../../utils/connectMongoose";

const requestHandler = async (req, res) => {
  try {
    await connectMongo();
    let currentUser = await authMiddleware(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "User Authentication Required" });
    }
    switch (req.method) {
      case "GET":
        let fetchedOrders = await Order.find({
          orderType: "restock",
          subItem: req.query.id,
        }).populate("subItem", "item");
        if (!fetchedOrders) {
          throw new Error("No item found");
        }
        return res.json({ orders: fetchedOrders });

      case "POST":
        let updatedSubItem = await SubItem.findByIdAndUpdate(
          req.query.id,
          { $inc: { quantity: req.body.quantity } },
          { new: true }
        );
        let currentDate = new Date();
        currentDate = currentDate.toLocaleString("en-US", {
          year: "numeric",
          day: "numeric",
          month: "short",
        });
        console.log(currentDate.toString(), "date");
        let savedOrder = await Order.create({
          quantity: req.body.quantity,
          orderType: "restock",
          name: updatedSubItem.name,
          subItem: updatedSubItem,
          placedBy: currentUser,
          placedOn: currentDate.toString(),
        });

        return res.json({ message: "Restocked Successfully", savedOrder });
    }
  } catch (error) {
    console.log(error);
    if (
      error === "No user found" ||
      error === "No token found" ||
      error === "token invalid" ||
      error === "No user found"
    ) {
      return res.status(401).send({ message: error.message });
    }
    res.json({ error });
  }
};

export default requestHandler;
