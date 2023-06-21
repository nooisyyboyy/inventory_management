import API from "./index";

export const getOrders = (filter) => {
  return API.post("/orders", filter);
};
