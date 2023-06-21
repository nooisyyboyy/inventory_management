import connectMongo from "../../utils/connectMongoose";
import { getCookies } from "cookies-next";

import Item from "../../models/itemModel";

export default async function saveItem(req, res) {
  try {
    const cookies = getCookies({ req, res });

    console.log({ cookies });
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");
    console.log("CREATING DOCUMENT");
    console.log("CREATED DOCUMENT");
    // const savedItem = await Item.create(req.body);
    res.json("noen");
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
