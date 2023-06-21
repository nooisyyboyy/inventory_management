import API from "./index";

export const getListOfItems = () => {
  return API.get("/items");
};

export const AddItem = (itemData) => {
  console.log({ itemData });
  return API.post("/items", itemData);
};

export const deleteItem = (itemId) => {
  return API.delete("/items/" + itemId);
};

export const updateItem = (itemId, updatedData) => {
  return API.patch("/items/" + itemId, updatedData);
};

export const getItem = (itemId) => {
  return API.get("/items/" + itemId);
};
