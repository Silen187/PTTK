const { Customer, User } = require("../lib/sequelize");

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { deleted: false },
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
    const customer = await Customer.findByPk(id);
    if (!customer || customer.deleted) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }
    await customer.update(req.body);
    res.json(customer);
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

    // Kiểm tra xem customer có user liên kết không
    if (customer.user) {
      // Cập nhật user.deleted thành true
      await customer.user.update({ deleted: true });
    }

    await customer.update({ deleted: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Không thể xóa khách hàng" });
  }
};

// Thêm hàm mới để lấy thông tin Customer cùng User liên kết
export const getCustomerWithUser = async (req, res) => {
  try {
    const { id } = req.query;

    const customer = await Customer.findByPk(id, {
      include: [{ model: User, as: "user" }],
    });

    if (!customer) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer with user:", error);
    res.status(500).json({ error: "Không thể lấy thông tin khách hàng" });
  }
};
