const { Order, OrderItem, Product } = require("@/lib/sequelize");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    try {
      const orders = await Order.findAll({
        where: { customer_id: customerId },
        include: [
          {
            model: OrderItem,
            as: "items", // Sử dụng alias đã định nghĩa
            include: [
              {
                model: Product, // Bao gồm thông tin sản phẩm
                attributes: ["id", "title", "price"],
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]], // Sắp xếp theo ngày tạo giảm dần
      });
      const formattedOrders = orders.map((order) => ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.created_at,
        items: order.items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product: {
            id: item.Product.id,
            title: item.Product.title,
            price: item.Product.price,
            images: item.Product.images,
          },
        })),
      }));

      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
