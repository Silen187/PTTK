import { CustomerVoucher, Voucher } from "@/lib/sequelize2";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { customerId } = req.query;

    try {
      // Lấy danh sách mã giảm giá chưa sử dụng
      const vouchers = await CustomerVoucher.findAll({
        where: { customer_id: customerId, status: "unused" },
        include: [
          {
            model: Voucher,
            as: "voucher",
            attributes: ["id", "code", "discount_value", "expires_at"],
          },
        ],
      });

      return res.status(200).json(vouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch vouchers." });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} not allowed.`);
}
