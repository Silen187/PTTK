// /pages/api/orders.js
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderDetails,
} from "@/controllers/orderControllers";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.id) {
        return await getOrderDetails(req, res);
      }
      return await getOrders(req, res);

    case "POST":
      return await createOrder(req, res);

    case "PUT":
      return await updateOrder(req, res);

    case "DELETE":
      return await deleteOrder(req, res);

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
