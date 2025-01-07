import {
  getInventoryByProduct,
  createInventoryRecord,
  updateInventoryRecord,
  deleteInventoryRecord,
} from "@/middleware/inventoryMiddleware";

export const getInventory = async (req, res) => {
  await getInventoryByProduct(req, res);
};

export const createInventory = async (req, res) => {
  await createInventoryRecord(req, res);
};

export const updateInventory = async (req, res) => {
  await updateInventoryRecord(req, res);
};

export const deleteInventory = async (req, res) => {
  await deleteInventoryRecord(req, res);
};
