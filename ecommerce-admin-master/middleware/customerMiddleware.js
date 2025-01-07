import { Customer, User, VipHistory, CustomerVoucher, Voucher, Order } from "@/lib/sequelize2";

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { deleted: false },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "role"],
        },
      ],
    });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Không thể lấy danh sách khách hàng" });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Không thể thêm khách hàng" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, email, phone, address, city, country, password } = req.body;

    // Fetch the customer and include the associated user
    const customer = await Customer.findByPk(id, {
      include: [{ model: User, as: "user" }],
    });

    if (!customer || customer.deleted) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }

    // Update the customer information
    await customer.update({ name, email, phone, address, city, country });

    // If there is a user associated with the customer and a password is provided, update the user's password
    if (customer.user && password) {
      await customer.user.update({ password });
    }

    res.json({ success: true, message: "Cập nhật thông tin thành công", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Không thể cập nhật khách hàng" });
  }
};


export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.query;
    const customer = await Customer.findByPk(id, {
      include: [{ model: User, as: "user" }],
    });
    if (!customer || customer.deleted) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }

    if (customer.user) {
      await customer.user.update({ deleted: true });
    }
    await customer.update({ deleted: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Không thể xóa khách hàng" });
  }
};

export const getCustomerWithUser = async (req, res) => {
  try {
    const { id } = req.query;

    const customer = await Customer.findByPk(id, {
      include: [
        { model: User, as: "user" },
        {
          model: VipHistory,
          as: "vip_history",
          attributes: ["id", "promotion_reason", "created_at"],
          order: [["created_at", "DESC"]],
        },
        {
          model: CustomerVoucher,
          as: "customer_vouchers",
          include: [
            {
              model: Voucher,
              as: "voucher",
              attributes: ["id", "code", "discount_value", "expires_at"],
            },
            {
              model: Order,
              as: "order",
              attributes: ["id", "status", "total_price", "created_at"], // Thông tin cơ bản của đơn hàng
            },
          ],
          attributes: ["id", "status"],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }

    // Phân loại voucher
    const vouchers = {
      unused: [],
      used: [],
      expired: [],
    };

    customer.customer_vouchers.forEach((cv) => {
      const now = new Date();
      const voucherStatus =
        cv.status === "unused" && new Date(cv.voucher.expires_at) < now
          ? "expired"
          : cv.status;

      vouchers[voucherStatus].push({
        id: cv.id,
        status: cv.status,
        voucher: cv.voucher,
        order: cv.order ? { id: cv.order.id, total_price: cv.order.total_price } : null,
      });
    });

    const result = {
      ...customer.toJSON(),
      vouchers,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching customer with user:", error);
    res.status(500).json({ error: "Không thể lấy thông tin khách hàng" });
  }
};

