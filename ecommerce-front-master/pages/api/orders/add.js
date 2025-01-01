const { Order, OrderItem, Product, CartItem } = require("@/lib/sequelize");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, customerId, cartProducts, totalPrice } = req.body;

    if (!customerId || !cartProducts || !totalPrice) {
      return res.status(400).json({ error: "Thiếu thông tin cần thiết để tạo đơn hàng." });
    }

    try {
      // Tạo đơn hàng
      const newOrder = await Order.create({
        customer_id: customerId,
        totalPrice,
        status: "pending",
      });

      // Thêm các sản phẩm vào chi tiết đơn hàng
      const orderItems = await Promise.all(
        cartProducts.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          if (!product) {
            throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại.`);
          }
          return OrderItem.create({
            order_id: newOrder.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: product.price,
          });
        })
      );

      // Xóa các sản phẩm trong giỏ hàng của người dùng
      await CartItem.destroy({ where: { user_id: userId } });

      res.status(200).json({ success: true, orderId: newOrder.id });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Không thể tạo đơn hàng." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
