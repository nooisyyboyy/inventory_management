import Order from "../../../../models/orderModel";
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
          subItem: { $exists: true },
          placedBy: currentUser,
        })
          .populate("subItem")
          .sort({ updatedAt: -1 })
          .limit(6);
        if (!fetchedOrders) {
          throw new Error("No item found");
        }
        return res.json({ orders: fetchedOrders });
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
