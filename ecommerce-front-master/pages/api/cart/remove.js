import { CartItem } from "@/lib/sequelize";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { productId, userId } = req.body;

    try {
      const cartItem = await CartItem.findOne({
        where: { product_id: productId, user_id: userId },
      });

      if (cartItem) {
        if (cartItem.quantity > 1) {
          // Giảm số lượng
          const updatedCartItem = await cartItem.update({ quantity: cartItem.quantity - 1 });
          res.status(200).json({ success: true, cartItem: updatedCartItem });
        } else {
          // Xóa sản phẩm khỏi giỏ hàng
          await cartItem.destroy();
          res.status(200).json({ success: true, cartItem: { product_id: productId, quantity: 0 } });
        }
      } else {
        // Sản phẩm không tồn tại trong giỏ hàng
        res.status(404).json({ success: false, message: "Product not found in cart" });
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ success: false, error: "Failed to remove product from cart" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
