// /controllers/orderControllers.js
import {
  getOrders as getOrdersMiddleware,
  createOrder as createOrderMiddleware,
  updateOrder as updateOrderMiddleware,
  deleteOrder as deleteOrderMiddleware,
  getOrderDetails as getOrderDetailsMiddleware,
} from "@/middleware/orderMiddleware";

export const getOrders = async (req, res) => await getOrdersMiddleware(req, res);
export const createOrder = async (req, res) => await createOrderMiddleware(req, res);
export const updateOrder = async (req, res) => await updateOrderMiddleware(req, res);
export const deleteOrder = async (req, res) => await deleteOrderMiddleware(req, res);
export const getOrderDetails = async (req, res) => await getOrderDetailsMiddleware(req, res);