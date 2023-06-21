import Item from "../../../models/itemModel";
import SubItem from "../../../models/subitemModel";
import authMiddleware from "../../../utils/authMiddleware";
import connectMongo from "../../../utils/connectMongoose";

const requestHandler = async (req, res) => {
  try {
    await connectMongo();
    let currentUser = await authMiddleware(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "User Authentication Required" });
    }

    switch (req.method) {
      case "GET":
        let fetchedItem = await Item.findById(req.query.id).populate({
          path: "subitems",
          populate: {
            path: "subitemInfo",
            model: SubItem,
            options: { strictPopulate: false },
          },
        });
        if (!fetchedItem) {
          throw new Error("No item found");
        }

        if (
          fetchedItem.createdBy._id.toString() !== currentUser._id.toString()
        ) {
          throw new Error("Access Denied");
        }
        return res.json({ subItem: fetchedItem });
      case "PATCH":
        let existingItem = await Item.findById(req.query.id);
        if (!existingItem) {
          throw new Error("No item found");
        }
        if (existingItem.createdBy.toString() !== currentUser._id.toString()) {
          throw new Error("Access Denied");
        } else {
          let updatedItem = await Item.findByIdAndUpdate(
            req.query.id,
            { $set: { ...req.body, subitems: req.body.subitems } },
            { new: true }
          );
          return res.json(updatedItem);
        }
      case "DELETE":
        let existingItem1 = await Item.findById(req.query.id);
        if (!existingItem1) {
          throw new Error("No item found");
        }
        if (
          existingItem1.createdBy._id.toString() !== currentUser._id.toString()
        ) {
          throw new Error("Access Denied");
        }
        let deletedItem = await Item.findByIdAndDelete(req.query.id);
        return res.json({ subItem: deletedItem });
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
