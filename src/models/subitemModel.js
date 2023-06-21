import { Schema, model, models } from "mongoose";

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "Unit",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const SubItem = models.SubItem || model("SubItem", itemSchema);
export default SubItem;
