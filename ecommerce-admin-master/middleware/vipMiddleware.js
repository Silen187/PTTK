const {
  Customer,
  VipHistory,
  Order,
  OrderItem,
  Product,
  Category,
  Voucher,
  CustomerVoucher,
} = require("../lib/sequelize2");
const sequelize = require("sequelize");

// Lấy danh sách khách hàng VIP
exports.getVipCustomers = async (req, res) => {
  try {
    const vipCustomers = await Customer.findAll({
      where: { is_vip: true },
      include: {
        model: VipHistory,
        as: "vip_history",
        attributes: ["promotion_reason", "created_at"],
      },
    });
    res.json(vipCustomers);
  } catch (error) {
    console.error("Error fetching VIP customers:", error);
    res.status(500).json({ error: "Không thể lấy danh sách khách hàng VIP" });
  }
};

// Xem chi tiết khách hàng VIP
exports.getVipCustomerDetails = async (req, res) => {
  const { id } = req.query;

  try {
    const customer = await Customer.findByPk(id, {
      include: {
        model: VipHistory,
        as: "vip_history",
        attributes: ["promotion_reason", "created_at"],
      },
    });

    if (!customer || !customer.is_vip) {
      return res.status(404).json({ error: "Khách hàng VIP không tồn tại" });
    }

    let extraDetails = {};

    const lastPromotion = customer.vip_history[0];
    if (lastPromotion) {
      const reason = lastPromotion.promotion_reason;

      if (reason === "Top5_Monthly") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const orders = await Order.findAll({
          where: {
            customer_id: id,
            created_at: { [sequelize.Op.gte]: monthAgo },
            status: "completed",
          },
          attributes: [[sequelize.fn("SUM", sequelize.col("total_price")), "totalSpent"]],
        });

        extraDetails = {
          totalOrders: orders.length,
          totalSpent: orders[0]?.dataValues.totalSpent || 0,
        };
      } else if (reason === "Top3_Category") {
        const categories = await OrderItem.findAll({
          include: [
            {
              model: Product,
              as: "product",
              attributes: [], // Không lấy thuộc tính từ Product
              include: {
                model: Category,
                as: "category",
                attributes: ["id", "name"], // Chỉ lấy ID và tên danh mục
              },
            },
            {
              model: Order, // Alias phải khớp với định nghĩa trong mô hình
              as: "Order", // Sử dụng đúng alias đã định nghĩa
              attributes: [], // Không lấy thuộc tính từ Order
              where: {
                status: "completed", // Chỉ lấy các đơn đã hoàn thành
                customer_id: id, // Điều kiện customer_id
              },
            },
          ],
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("OrderItem.product_id")), "totalProducts"], // Tổng số lượng sản phẩm
            [sequelize.col("product->category.id"), "categoryId"], // ID danh mục
            [sequelize.col("product->category.name"), "categoryName"], // Tên danh mục
          ],
          group: ["product->category.id", "product->category.name"], // Nhóm theo ID và tên danh mục
          where: {
            "$product.category_id$": { [sequelize.Op.not]: null }, // Lọc sản phẩm có danh mục
          },
        });        
        
        extraDetails = { categories };
      } else if (reason === "Spending_Over_Threshold") {
        const threshold = 100000;
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const totalSpent = await Order.sum("total_price", {
          where: {
            customer_id: id,
            created_at: { [sequelize.Op.gte]: monthAgo },
            status: "completed",
          },
        });

        extraDetails = { totalSpent, threshold };
      }
    }

    res.json({ customer, extraDetails });
  } catch (error) {
    console.error("Error fetching VIP customer details:", error);
    res.status(500).json({ error: "Không thể lấy thông tin khách hàng VIP" });
  }
};



// Cập nhật danh sách VIP
exports.updateVipList = async (req, res) => {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    // Xóa trạng thái VIP của tất cả khách hàng
    await Customer.update({ is_vip: false }, { where: {} });

    // Xóa tất cả các bản ghi trong VipHistory
    await VipHistory.destroy({ where: {} });


    const top5Spenders = await Customer.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "address",
        "city",
        "country",
        "is_vip",
        "loyalty_points",
        "deleted",
        "created_at",
        "updated_at",
        [
          sequelize.literal(`(
            SELECT SUM(o.total_price)
            FROM orders AS o
            WHERE o.customer_id = Customer.id
              AND o.created_at >= '2024-12-07 17:00:00'
              AND o.status = 'completed'
          )`),
          "totalSpent",
        ],
      ],
      order: [[sequelize.literal("totalSpent"), "DESC"]],
      limit: 5,
    });    

    const categories = await Category.findAll({
      attributes: ["id", "name"], // Lấy ID và tên danh mục
    });
    
    
    const results = await Promise.all(
      categories.map(async (category) => {
        const top3CustomersForCategory = await OrderItem.findAll({
          include: [
            {
              model: Product,
              as: "product",
              include: {
                model: Category,
                as: "category",
                attributes: ["id", "name"],
                where: { id: category.id },
              },
              attributes: [],
            },
            {
              model: Order,
              as: "Order",
              attributes: ["customer_id"],
              where: {
                created_at: { [sequelize.Op.gte]: "2024-12-08 21:02:50" },
                status: "completed",
              },
            },
          ],
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("OrderItem.product_id")), "totalProducts"],
            [sequelize.col("order.customer_id"), "customer_id"],
            [sequelize.col("product.category.id"), "category_id"],
          ],
          group: ["order.customer_id", "product.category.id"],
          order: [[sequelize.literal("totalProducts"), "DESC"]],
          limit: 3,
        });
    
        return {
          category: category.name,
          topCustomers: top3CustomersForCategory,
        };
      })
    );    
    
    const spendingThreshold = 100000;
    const spendingOverThreshold = await Customer.findAll({
      include: {
        model: Order,
        as: "orders",
        attributes: [[sequelize.fn("SUM", sequelize.col("total_price")), "totalSpent"]],
        where: {
          created_at: { [sequelize.Op.gte]: monthAgo },
          status: "completed",
        },
      },
      group: ["Customer.id"],
      having: sequelize.where(
        sequelize.fn("SUM", sequelize.col("orders.total_price")),
        ">=",
        spendingThreshold
      ),
    });

    const promotetoVip = async (customer, reason) => {
      await customer.update({ is_vip: true });
      await VipHistory.create({
        customer_id: customer.id,
        promotion_reason: reason,
      });
    };

    for (const spender of top5Spenders) {
      await promotetoVip(spender, "Top5_Monthly");
    }

    for (const category of results) {
      for (const customerInfo of category.topCustomers) {
        const customer = await Customer.findByPk(customerInfo.dataValues.customer_id);
        if (customer) {
          await promotetoVip(customer, "Top3_Category");
        }
      }
    }

    for (const spender of spendingOverThreshold) {
      await promotetoVip(spender, "Spending_Over_Threshold");
    }

    res.json({ message: "Danh sách VIP đã được cập nhật" });
  } catch (error) {
    console.error("Error updating VIP list:", error);
    res.status(500).json({ error: "Không thể cập nhật danh sách VIP" });
  }
};

// Tạo voucher đồng loạt cho VIP
exports.createVoucherForVip = async (req, res) => {
  const { code, discount_value, required_points, expires_at } = req.body;

  try {
    const vipCustomers = await Customer.findAll({ where: { is_vip: true } });

    const voucher = await Voucher.create({
      code,
      discount_value,
      required_points,
      expires_at,
    });

    for (const customer of vipCustomers) {
      await CustomerVoucher.create({
        customer_id: customer.id,
        voucher_id: voucher.id,
        status: "unused",
      });
    }

    res.json({ message: "Voucher đã được tạo và phân phối cho khách hàng VIP" });
  } catch (error) {
    console.error("Error creating voucher for VIPs:", error);
    res.status(500).json({ error: "Không thể tạo voucher cho khách hàng VIP" });
  }
};

// Thăng cấp khách hàng thành VIP
exports.promoteToVip = async (req, res) => {
  const { customerId, promotionReason } = req.body;

  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) return res.status(404).json({ error: "Khách hàng không tồn tại" });
    if (customer.is_vip) return res.status(400).json({ error: "Khách hàng đã là VIP" });

    await customer.update({ is_vip: true });

    await VipHistory.create({
      customer_id: customerId,
      promotion_reason: promotionReason,
    });

    res.status(201).json({ message: "Khách hàng đã được thăng hạng VIP" });
  } catch (error) {
    console.error("Error promoting customer to VIP:", error);
    res.status(500).json({ error: "Không thể thăng hạng khách hàng thành VIP" });
  }
};

exports.removeVipStatus = async (req, res) => {
  const { customerId } = req.body;
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer || !customer.is_vip) {
      return res.status(404).json({ error: "Khách hàng không tồn tại hoặc không phải là VIP" });
    }

    await customer.update({ is_vip: false });

    await VipHistory.destroy({
      where: { customer_id: customerId },
    });

    res.status(200).json({ message: "Trạng thái VIP của khách hàng đã được xóa" });
  } catch (error) {
    console.error("Error removing VIP status:", error);
    res.status(500).json({ error: "Không thể xóa trạng thái VIP" });
  }
};
