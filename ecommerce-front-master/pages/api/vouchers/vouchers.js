const { Op } = require("sequelize");
const { Voucher } = require("@/lib/sequelize2");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Lấy các voucher còn hạn sử dụng
      const vouchers = await Voucher.findAll({
        where: {
          expires_at: {
            [Op.gte]: new Date(), // So sánh ngày hết hạn với thời gian hiện tại
          },
          deleted: false
        },
        attributes: ["id", "code", "discount_value", "required_points", "expires_at"],
      });

      return res.status(200).json(vouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      return res.status(500).json({ error: "Failed to fetch vouchers" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
