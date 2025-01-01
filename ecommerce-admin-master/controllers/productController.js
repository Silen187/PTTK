import { handleGet, handlePost, handlePut, handleDelete } from "../middleware/productMiddleware";

export const getProduct = async (req, res) => {
  await handleGet(req, res);
};

export const createProduct = async (req, res) => {
  await handlePost(req, res);
};

export const updateProduct = async (req, res) => {
  await handlePut(req, res);
};

export const deleteProduct = async (req, res) => {
  await handleDelete(req, res);
};