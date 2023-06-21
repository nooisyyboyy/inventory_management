import mongoose from "mongoose";

const connectMongo = async () =>
  mongoose
    .connect("mongodb://localhost:27017/management")
    .then(() => console.log("db connected"));

export default connectMongo;
