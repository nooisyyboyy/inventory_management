import User from "../../../models/userModel";
import authMiddleware from "../../../utils/authMiddleware";
import connectMongo from "../../../utils/connectMongoose";

const getUser = async (req, res) => {
  try {
    await connectMongo();
    let currentUser = await authMiddleware(req, res);

    if (req.method === "GET") {
      return res.json({
        message: "User fetched successfully",
        user: currentUser,
      });
    } else if (req.method == "PATCH") {
      let updatedUser = await User.findByIdAndUpdate(
        currentUser._id.toString(),
        req.body
      );
      return res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.log(error === "No token found");

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

export default getUser;
