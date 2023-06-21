import { Schema, model, models } from "mongoose";

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subitems: [
      {
        subitemInfo: {
          type: Schema.Types.ObjectId,
          ref: "SubItem",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Item = models.Item || model("Item", itemSchema);
export default Item;
