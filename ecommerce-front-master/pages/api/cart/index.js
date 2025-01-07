import { CartItem, Product, User } from "@/lib/sequelize2";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query; // Lấy userId từ query
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter." });
    }

    try {
      // Lấy customer_id từ bảng users dựa vào userId
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["customer_id"], // Lấy customer_id
      });

      if (!user || !user.customer_id) {
        return res.status(404).json({ message: "User or customer not found." });
      }

      const customerId = user.customer_id;

      // Lấy giỏ hàng từ cơ sở dữ liệu dựa trên customer_id
      const cartItems = await CartItem.findAll({
        where: { customer_id: customerId },
        include: [
          {
            model: Product,
            attributes: ["id", "title", "price", "images"], // Lấy thông tin sản phẩm liên quan
          },
        ],
      });

      if (!cartItems || cartItems.length === 0) {
        // Nếu không có sản phẩm nào trong giỏ hàng
        return res.status(200).json([]); // Trả về mảng rỗng
      }

      // Định dạng dữ liệu trả về
      const formattedCart = cartItems.map((item) => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity || 0, // Đảm bảo quantity luôn có giá trị
        product: item.Product, // Thông tin sản phẩm
      }));

      res.status(200).json(formattedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart data." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
