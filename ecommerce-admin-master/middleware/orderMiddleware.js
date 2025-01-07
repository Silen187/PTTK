// /middleware/orderMiddleware.js
const { Order, OrderItem, Customer, Product } = require("../lib/sequelize2");

// Lấy danh sách đơn hàng
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { deleted: false },
      include: [
        { model: Customer, as: "customer" },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Không thể lấy danh sách đơn hàng" });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (req, res) => {
  const { id } = req.query;

  try {
    const order = await Order.findByPk(id, {
      include: [
        { model: Customer, as: "customer" },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Không thể lấy chi tiết đơn hàng" });
  }
};

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  const { customerId, items } = req.body;

  try {
    const total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      total_price,
      customer_id: customerId,
    });

    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Không thể tạo đơn hàng" });
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrder = async (req, res) => {
  const { id, customerId, items, status } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order || order.deleted) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });
    }

    await order.update({
      customer_id: customerId,
      status,
    });

    await OrderItem.destroy({ where: { order_id: id } });

    for (const item of items) {
      await OrderItem.create({
        order_id: id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: OrderItem, as: "items" },
        { model: Customer, as: "customer" },
      ],
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Không thể cập nhật đơn hàng" });
  }
};

// Xóa đơn hàng
export const deleteOrder = async (req, res) => {
  const { id } = req.query;

  try {
    const order = await Order.findByPk(id);

    if (!order || order.deleted) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });
    }

    await order.update({ deleted: true, status: "cancelled" });

    res.json({ success: true, message: "Đơn hàng đã được xóa thành công!" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Không thể xóa đơn hàng" });
  }
};