import { CartItem } from "@/lib/sequelize";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { productId, userId, quantity } = req.body;

    try {

      const [cartItem, created] = await CartItem.findOrCreate({
        where: { product_id: productId, user_id: userId },
        defaults: { quantity }, // Giá trị mặc định nếu tạo mới
      });
      if (!created) {
        // Nếu mục đã tồn tại, cộng thêm số lượng
        await cartItem.update({ quantity: cartItem.quantity + quantity });
      }
      
      // Phản hồi JSON với số lượng đã cập nhật
      res.status(200).json({
        success: true,
        productId: cartItem.product_id,
        quantity: cartItem.quantity, // Số lượng sau khi cập nhật
      });
      
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ success: false, error: "Failed to add product to cart" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}

