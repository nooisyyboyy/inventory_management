import API from "./index";

export const addSubItem = (itemInfo) => {
  return API.post("/subItems", itemInfo);
};

export const getSubItem = () => {
  return API.get("/subItems");
};

export const deleteSubItem = (itemId) => {
  return API.delete("/subItems/" + itemId);
};

export const updateSubItem = (itemId, updatedData) => {
  return API.patch("/subItems/" + itemId, updatedData);
};

export const searchSubItem = (searchQuery) => {
  return API.post("/subItems/search", { searchQuery });
};
