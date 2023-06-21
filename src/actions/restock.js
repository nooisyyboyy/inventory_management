import API from "./index";

export const restockSubItem = (subItemId, updatedData) => {
  return API.post("/orders/restock/" + subItemId, updatedData);
};

export const getRestockOrders = () => {
  return API.get("/orders/restock");
};
