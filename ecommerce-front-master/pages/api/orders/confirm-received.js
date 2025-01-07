import { Order, OrderItem, Product, Customer } from "@/lib/sequelize2";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { orderId, customerId } = req.body;

    try {
      // Tìm đơn hàng
      const order = await Order.findOne({
        where: { id: orderId, customer_id: customerId },
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: ["quantity"],
            include: [
              {
                model: Product,
                attributes: ["id", "loyalty_points"],
              },
            ],
          },
        ],
      });


      if (!order) {
        return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại." });
      }

      if (order.status === "completed") {
        return res
          .status(400)
          .json({ success: false, message: "Đơn hàng đã hoàn thành." });
      }

      // Tính tổng điểm loyalty
      const totalLoyaltyPoints = order.items.reduce(
        (total, item) => total + item.quantity * (item.Product.loyalty_points || 0),
        0
      );

      // Cộng điểm vào tài khoản khách hàng
      await Customer.increment("loyalty_points", {
        by: totalLoyaltyPoints,
        where: { id: customerId },
      });

      // Cập nhật trạng thái đơn hàng
      order.status = "completed";
      await order.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error confirming order:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi xác nhận đơn hàng." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
