const { Order, OrderItem, Product, CustomerVoucher, Voucher } = require("@/lib/sequelize2");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    try {
      const orders = await Order.findAll({
        where: { customer_id: customerId },
        include: [
          {
            model: OrderItem,
            as: "items", // Alias đã định nghĩa
            include: [
              {
                model: Product, // Bao gồm thông tin sản phẩm
                attributes: ["id", "title", "price", "images"],
              },
            ],
          },
          {
            model: CustomerVoucher,
            as: "customer_vouchers", // Bao gồm thông tin mã giảm giá
            include: [
              {
                model: Voucher, // Bao gồm chi tiết của mã giảm giá
                as: "voucher",
                attributes: ["id", "code", "discount_value", "expires_at"],
              },
            ],
            attributes: ["id", "status"], // Các trường cần thiết từ CustomerVoucher
          },
        ],
        order: [["created_at", "DESC"]], // Sắp xếp theo ngày tạo giảm dần
      });

      const formattedOrders = orders.map((order) => ({
        id: order.id,
        totalPrice: order.total_price,
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
        vouchers: order.customer_vouchers.map((cv) => ({
          id: cv.id,
          status: cv.status,
          voucher: cv.voucher
            ? {
                id: cv.voucher.id,
                code: cv.voucher.code,
                discountValue: cv.voucher.discount_value,
                expiresAt: cv.voucher.expires_at,
              }
            : null,
        })), // Xử lý tất cả mã giảm giá được liên kết với đơn hàng
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
