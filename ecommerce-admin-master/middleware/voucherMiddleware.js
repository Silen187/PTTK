const { Voucher, Customer, CustomerVoucher } = require("../lib/sequelize2");

// Lấy danh sách voucher
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({
      where: { deleted: false }, // Chỉ lấy các voucher chưa bị xóa
    });
    res.json(vouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).json({ error: "Không thể lấy danh sách voucher" });
  }
};

// Xem chi tiết voucher
exports.getVoucherDetails = async (req, res) => {
  const { id } = req.query;
  try {
    const voucher = await Voucher.findOne({
      where: { id, deleted: false }, // Kiểm tra điều kiện chưa bị xóa
      include: {
        model: CustomerVoucher,
        as: "customer_vouchers",
        where: { status: "unused" },
        required: false,
        include: { model: Customer, as: "customer" },
      },
    });

    if (!voucher) return res.status(404).json({ error: "Voucher không tồn tại" });

    res.json(voucher);
  } catch (error) {
    console.error("Error fetching voucher details:", error);
    res.status(500).json({ error: "Không thể lấy thông tin voucher" });
  }
};

// Thêm voucher cho khách hàng
exports.addVoucherToCustomer = async (req, res) => {
  const { voucherId, customerId } = req.body;
  try {
    const voucher = await Voucher.findOne({ where: { id: voucherId, deleted: false } });
    if (!voucher) return res.status(404).json({ error: "Voucher không tồn tại" });

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: "Khách hàng không tồn tại" });

    await CustomerVoucher.create({
      voucher_id: voucherId,
      customer_id: customerId,
      status: "unused",
    });

    res.status(201).json({ message: "Voucher đã được thêm cho khách hàng" });
  } catch (error) {
    console.error("Error adding voucher to customer:", error);
    res.status(500).json({ error: "Không thể thêm voucher cho khách hàng" });
  }
};

// Xóa voucher (soft delete)
exports.deleteVoucher = async (req, res) => {
  const { id } = req.query;
  try {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) return res.status(404).json({ error: "Voucher không tồn tại" });

    // Đánh dấu voucher là đã xóa (soft delete)
    await voucher.update({ deleted: true });

    res.json({ success: true, message: "Voucher đã được xóa (soft delete)" });
  } catch (error) {
    console.error("Error deleting voucher:", error);
    res.status(500).json({ error: "Không thể xóa voucher" });
  }
};

exports.createVoucher = async (req, res) => {
    const { code, discount_value, required_points, expires_at } = req.body;
    console.log(req.body);
  
    try {
      // Kiểm tra trùng mã voucher
      const existingVoucher = await Voucher.findOne({ where: { code } });
      if (existingVoucher) {
        return res.status(400).json({ error: "Mã voucher đã tồn tại!" });
      }
  
      const newVoucher = await Voucher.create({
        code,
        discount_value,
        required_points,
        expires_at,
      });
  
      res.status(201).json(newVoucher);
    } catch (error) {
      console.error("Error creating voucher:", error);
      res.status(500).json({ error: "Không thể tạo voucher" });
    }
  };