import React from "react";
import Item from "../../../models/itemModel";
import SubItem from "../../../models/subitemModel";
import User from "../../../models/userModel";
import authMiddleware from "../../../utils/authMiddleware";
import connectMongo from "../../../utils/connectMongoose";

const getUser = async (req, res) => {
  try {
    await connectMongo();
    let currentUser = await authMiddleware(req, res);

    if (req.method === "GET") {
      console.log(currentUser);
      let fetchedItem = await Item.find({
        createdBy: currentUser,
      }).populate({
        path: "subitems",
        populate: {
          path: "subitemInfo",
          model: SubItem,
          options: { strictPopulate: false },
        },
      });

      return res.json({
        message: "Item fetched successfully",
        fetchedItem,
      });
    } else if (req.method === "POST") {
      let savedItem = await Item.create({
        ...req.body,
        subitems: req.body.subItems,
        createdBy: currentUser,
      });
      return res.json({ message: "Item Created Successfully", savedItem });
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

export default getUser;
