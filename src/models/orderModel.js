import { Schema, model, models } from "mongoose";
import SubItem from "./subitemModel";
import Item from "./itemModel";

const orderSchema = new Schema(
  {
    orderType: {
      type: String,
      enum: ["restock", "sell"],
    },
    name: String,
    subItem: {
      type: Schema.Types.ObjectId,
      ref: SubItem,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: Item,
    },
    quantity: Number,
    placedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    soldTo: String,
    placedOn: String,
  },
  { timestamps: true }
);
const Order = models.Order || model("Order", orderSchema);
export default Order;
