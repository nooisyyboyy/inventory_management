import SubItem from "../../../models/subitemModel";
import User from "../../../models/userModel";
import authMiddleware from "../../../utils/authMiddleware";
import connectMongo from "../../../utils/connectMongoose";

const requestHandler = async (req, res) => {
  try {
    await connectMongo();
    let currentUser = await authMiddleware(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "User Authentication Required" });
    }
    if (req.method === "GET") {
      let fetchedItems = await SubItem.find({ createdBy: currentUser });
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
    res.json({ error });
  }
};

export default requestHandler;
