import Item from "../../../../models/itemModel";
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
          item: req.query.id,
        }).populate("item");
        if (!fetchedOrders) {
          throw new Error("No item found");
        }
        return res.json({ orders: fetchedOrders });

      case "POST":
        console.log(req.body, "body");
        let fetchedItem = await Item.find({
          createdBy: currentUser,
          _id: req.query.id,
        }).populate({
          path: "subitems",
          populate: {
            path: "subitemInfo",
            model: SubItem,
            options: { strictPopulate: false },
          },
        });
        let currentDate = new Date();
        currentDate = currentDate.toLocaleString("en-US", {
          year: "numeric",
          day: "numeric",
          month: "short",
        });
        console.log(currentDate.toString(), "date");
        console.log(
          {
            quantity: req.body.quantity,
            orderType: "sell",
            soldTo: req.body.soldTo,
            name: fetchedItem[0].name,
            item: fetchedItem[0],
            placedBy: currentUser,
            placedOn: currentDate.toString(),
          },
          "item doc"
        );
        Order.create({
          quantity: req.body.quantity,
          orderType: "sell",
          soldTo: req.body.soldTo,
          name: fetchedItem[0].name,
          item: fetchedItem[0],
          placedBy: currentUser,
          placedOn: currentDate.toString(),
        }).catch((err) => console.log(err));
        fetchedItem[0].subitems.map((subItemData) => {
          SubItem.findByIdAndUpdate(subItemData.subitemInfo._id, {
            $inc: {
              quantity: parseInt(req.body.quantity) * subItemData.quantity * -1,
            },
          })
            .then((item) => {
              Order.create({
                quantity: parseInt(req.body.quantity) * subItemData.quantity,
                orderType: "sell",
                name: item.name,
                subItem: item,
                placedBy: currentUser,
                placedOn: currentDate.toString(),
              }).catch((err) => console.log(err));
            })
            .then((item) => {})
            .catch((err) => console.log(err));
        });

        return res.json({ message: "Item Sold Successfully" });
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
