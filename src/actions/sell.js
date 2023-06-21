import API from "./index";

export const sellItem = (itemId, updatedData) => {
  return API.post("/orders/sell/" + itemId, updatedData);
};

export const getSellOrders = () => {
  return API.get("/orders/sell");
};
