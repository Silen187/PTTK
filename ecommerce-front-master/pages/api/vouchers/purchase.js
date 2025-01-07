const { Customer, Voucher, CustomerVoucher } = require("@/lib/sequelize2");
const { Op } = require("sequelize");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { customerId, voucherId } = req.body;

    if (!customerId || !voucherId) {
      return res.status(400).json({ error: "Missing customerId or voucherId" });
    }

    try {
      // Kiểm tra voucher
      const voucher = await Voucher.findOne({
        where: {
          id: voucherId,
          expires_at: {
            [Op.gte]: new Date(), // Voucher còn hạn sử dụng
          },
        },
      });

      if (!voucher) {
        return res.status(404).json({ error: "Voucher không tồn tại hoặc đã hết hạn sử dụng." });
      }

      // Lấy thông tin khách hàng
      const customer = await Customer.findOne({
        where: { id: customerId },
      });

      if (!customer) {
        return res.status(404).json({ error: "Khách hàng không tồn tại." });
      }

      // Kiểm tra điểm khách hàng
      if (customer.loyalty_points < voucher.required_points) {
        return res
          .status(400)
          .json({ error: "Bạn không có đủ điểm để mua voucher này." });
      }

      // Trừ điểm khách hàng và tạo liên kết giữa khách hàng và voucher
      await customer.update({
        loyalty_points: customer.loyalty_points - voucher.required_points,
      });

      await CustomerVoucher.create({
        customer_id: customerId,
        voucher_id: voucherId,
        status: "unused",
      });

      return res.status(200).json({
        success: true,
        message: "Mua voucher thành công.",
      });
    } catch (error) {
      console.error("Error purchasing voucher:", error);
      return res.status(500).json({ error: "Failed to purchase voucher." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
