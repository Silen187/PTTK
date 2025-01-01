import {
    getOrders as getOrdersMiddleware,
    createOrder as createOrderMiddleware,
    updateOrder as updateOrderStatusMiddleware,
    getOrderDetails as getOrderDetailsMiddleware,
    deleteOrder as deleteOrderMiddleware,
  } from "@/middleware/orderMiddleware";

  // Lấy chi tiết đơn hàng
  export const getOrderDetails = async (req, res) => {
    await getOrderDetailsMiddleware(req, res);
  };
  // Lấy danh sách đơn hàng
  export const getOrders = async (req, res) => {
    await getOrdersMiddleware(req, res);
  };
  
  // Tạo đơn hàng mới
  export const createOrder = async (req, res) => {
    await createOrderMiddleware(req, res);
  };
  
  // Cập nhật trạng thái đơn hàng
  export const updateOrder = async (req, res) => {
    await updateOrderStatusMiddleware(req, res);
  };
  
  export const deleteOrder = async (req, res) => {
    await deleteOrderMiddleware(req, res);
  };