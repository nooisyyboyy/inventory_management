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
    if (req.method === "POST") {
      let fetchedItems = await SubItem.find({
        createdBy: currentUser,
        name: { $regex: req.body.searchQuery, $options: "i" },
      })
        .sort({ updatedAt: -1 })
        .limit(5);
      return res.json({ subItems: fetchedItems });
    } else if (req.method === "POST") {
      let savedItem = await SubItem.create({
        ...req.body,
        createdBy: currentUser,
      });
      return res.status(200).json({ savedItem });
    }
  } catch (error) {
    if (
      error === "No user found" ||
      error === "No token found" ||
      error === "token invalid" ||
      error === "No user found"
    ) {
      return res.status(401).send({ message: error.message });
    }
    console.log(error);
    res.status(400).json({ error });
  }
};

export default requestHandler;
