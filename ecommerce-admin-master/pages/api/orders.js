import {
  getOrders,
  createOrder,
  updateOrder,
  getOrderDetails,
  deleteOrder,
} from "@/controllers/orderController";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.id) {
        // Lấy chi tiết một đơn hàng nếu có `id`
        return await getOrderDetails(req, res);
      }
      // Lấy danh sách tất cả đơn hàng nếu không có `id`
      return await getOrders(req, res);

    case "POST":
      return await createOrder(req, res); // Tạo đơn hàng mới

    case "PUT":
      return await updateOrder(req, res); // Cập nhật đơn hàng
    
    case "DELETE":
      return await deleteOrder(req, res); // Xóa đơn hàng

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
