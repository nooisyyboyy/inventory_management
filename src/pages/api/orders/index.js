import Item from "../../../models/itemModel";
import Order from "../../../models/orderModel";
import SubItem from "../../../models/subitemModel";
import authMiddleware from "../../../utils/authMiddleware";
import connectMongo from "../../../utils/connectMongoose";

const requestHandler = async (req, res) => {
  try {
    await connectMongo();
    let currentUser = await authMiddleware(req, res);
    if (!currentUser) {
      return res.status(401).json({ message: "User Authentication Required" });
    }
    switch (req.method) {
      case "POST":
        var query = { placedBy: currentUser };

        if (req.body.Query) {
          if (req.body.Querytype) {
            query = {
              ...query,
              soldTo: { $regex: req.body.Query, $options: "i" },
            };
          } else
            query = {
              ...query,
              name: { $regex: req.body.Query, $options: "i" },
            };
        }
        if (req.body.Order) {
          query = { ...query, orderType: req.body.Order };
        }
        if (req.body.Item) {
          if (req.body.Item === "item") {
            query = { ...query, item: { $exists: true } };
          }
          if (req.body.Item === "subItem") {
            query = { ...query, subItem: { $exists: true } };
          }
        }
        if (req.body.Date) {
          if (req.body.Date.split(" ").length === 0) {
          } else if (req.body.Date.split(" ").length === 1) {
            query.placedOn = { $regex: req.body.Date, $options: "i" };
            console.log(query);
          } else if (req.body.Date.split(" ").length === 2)
            query = {
              ...query,
              $and: [
                {
                  placedOn: {
                    $regex: req.body.Date.split(" ")[0],
                    $options: "i",
                  },
                },
                {
                  placedOn: {
                    $regex: req.body.Date.split(" ")[1],
                    $options: "i",
                  },
                },
              ],
            };
          else if (req.body.Date.split(" ").length === 3)
            query = { ...query, placedOn: req.body.Date };
        }
        console.log(query, "query");
        let fetchedOrders2 = await Order.find(query)
          .populate({
            path: "item",
            populate: {
              path: "subitems",
              populate: {
                path: "subitemInfo",
                model: SubItem,
                options: { strictPopulate: false },
              },
            },
          })
          .populate({ path: "subItem", model: SubItem })
          .sort({ updatedAt: -1 });
        console.log(fetchedOrders2.length);
        return res.json({ orders: fetchedOrders2 });
    }
  } catch (error) {
    console.log(error);
    if (
      error === "No user found" ||
      error === "No token found" ||
      error === "token invalid" ||
      error === "No user found"
    ) {
      return res.status(401).send({ message: error.message });
    }
    res.json({ error });
  }
};

export default requestHandler;
