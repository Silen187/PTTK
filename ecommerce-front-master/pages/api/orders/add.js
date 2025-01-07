import { Order, OrderItem, CustomerVoucher, CartItem } from "@/lib/sequelize2";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { customerId, cartProducts, totalPrice, selectedVoucherId } = req.body;

    try {
      // 1. Tạo đơn hàng
      const order = await Order.create({
        customer_id: customerId,
        total_price: totalPrice,
        status: "pending",
      });
      
      // 2. Thêm sản phẩm vào đơn hàng
      const orderItems = cartProducts.map((product) => ({
        order_id: order.id, // Gán ID của đơn hàng vừa tạo
        product_id: product.productId,
        quantity: product.quantity,
        price: product.product.price,
      }));
      
      // 3. Lưu các sản phẩm vào bảng OrderItem
      await OrderItem.bulkCreate(orderItems);

      // 3. Đánh dấu mã giảm giá đã được sử dụng (nếu có)
      if (selectedVoucherId) {
        await CustomerVoucher.update(
          { status: "used", order_id: order.id },
          { where: { voucher_id: selectedVoucherId, customer_id: customerId } }
        );
      }

      // 4. Xóa các sản phẩm trong giỏ hàng
      const productIds = cartProducts.map((product) => product.productId);
      await CartItem.destroy({
        where: {
          customer_id: customerId,
          product_id: productIds,
        },
      });

      // 5. Phản hồi thành công
      return res.status(200).json({ success: true, orderId: order.id });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ success: false, message: "Failed to place order." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} not allowed.`);
}
