import { message } from "antd";
import { getCookie } from "cookies-next";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/userModel";

const authMiddleware = async (req, res) => {
  return new Promise((resolve, reject) => {
    let token = getCookie("token", { req, res });
    if (!token) {
      reject("No token found");
    } else {
      jsonwebtoken.verify(
        token,
        "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",
        (err, decoded) => {
          err && reject("token invalid");

          User.findById(decoded.id.toString())
            .then((currentUser) => {
              req.currentUser = currentUser;
              resolve(currentUser);
            })
            .catch((err) => {
              reject("No user found");
            });
        }
      );
    }
  });
};

export default authMiddleware;
