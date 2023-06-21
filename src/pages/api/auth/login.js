import { setCookies } from "cookies-next";
import jsonwebtoken from "jsonwebtoken";
import User from "../../../models/userModel";
import connectMongo from "../../../utils/connectMongoose";

export default async function login(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jsonwebtoken.sign(
        { id: user._id },
        "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"
      );
      setCookies("token", token, { req, res });
      return res.json({ message: "LoggedIn Successfully", user, token });
    } else {
      user = await User.create({
        email: req.body.email,
        name: req.body.name,
        googleId: req.body.googleId,
      });
      const token = jsonwebtoken.sign(
        { id: user._id },
        "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"
      );

      setCookies("token", token, { req, res });
      return res.json({ message: "Register Successfully", user, token });
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
