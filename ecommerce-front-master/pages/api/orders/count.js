import { Order } from "@/lib/sequelize2";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ message: "Missing customerId parameter." });
    }

    try {
      // Đếm số lượng đơn hàng dựa trên customer_id
      const orderCount = await Order.count({
        where: { customer_id: customerId },
      });

      res.status(200).json({ count: orderCount });
    } catch (error) {
      console.error("Error fetching order count:", error);
      res.status(500).json({ message: "Failed to fetch order count." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
