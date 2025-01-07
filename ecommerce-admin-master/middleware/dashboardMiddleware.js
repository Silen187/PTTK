const {
  Order,
  Customer,
  Product,
  Voucher,
  CustomerVoucher,
  OrderItem,
  Category,
  CartItem,
  sequelize,
  Sequelize,
} = require("../lib/sequelize2");

const { Op } = Sequelize;

// Helper function để lấy thời gian bắt đầu
const getStartOfDay = () => new Date(new Date().setHours(0, 0, 0, 0));
const getStartOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const getStartOfYear = () => new Date(new Date().getFullYear(), 0, 1);

// Doanh thu hôm nay, tháng này, năm nay
exports.getRevenueData = async () => {
  const [revenueToday, revenueThisMonth, revenueThisYear] = await Promise.all([
    Order.sum("total_price", {
      where: {
        status: "completed",
        updated_at: { [Op.gte]: getStartOfDay() },
      },
    }),
    Order.sum("total_price", {
      where: {
        status: "completed",
        updated_at: { [Op.gte]: getStartOfMonth() },
      },
    }),
    Order.sum("total_price", {
      where: {
        status: "completed",
        updated_at: { [Op.gte]: getStartOfYear() },
      },
    }),
  ]);

  return { revenueToday, revenueThisMonth, revenueThisYear };
};

// Số đơn hàng hoàn tất theo ngày
exports.getCompletedOrders = async () => {
  const completedOrders = await Order.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("updated_at")), "date"], // Thay created_at bằng updated_at
      [sequelize.fn("COUNT", sequelize.col("id")), "totalOrders"],
    ],
    where: { status: "completed" },
    group: ["date"],
    order: [["date", "ASC"]],
  });
  return completedOrders.map((order) => ({
    date: order.get("date"),
    totalOrders: order.get("totalOrders"),
  }));
};

exports.getOrderStatusDistribution = async () => {
  const orderStatusDistribution = await Order.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "totalOrders"],
    ],
    group: ["status"],
    order: [[sequelize.literal("totalOrders"), "DESC"]],
  });

  return orderStatusDistribution.map((status) => ({
    status: status.get("status"),
    totalOrders: status.get("totalOrders"),
  }));
};



// Tổng số khách hàng và khách hàng VIP
exports.getCustomerSummary = async () => {
  const [totalCustomers, vipCustomers] = await Promise.all([
    Customer.count(),
    Customer.count({ where: { is_vip: true } }),
  ]);

  return { totalCustomers, vipCustomers };
};

// Tỷ lệ khách hàng mới theo tháng và năm
exports.getNewCustomers = async () => {
  const newCustomers = await Customer.findAll({
    attributes: [
      [sequelize.fn("MONTH", sequelize.col("created_at")), "month"],
      [sequelize.fn("YEAR", sequelize.col("created_at")), "year"],
      [sequelize.fn("COUNT", sequelize.col("id")), "totalCustomers"],
    ],
    group: ["month", "year"],
    order: [["year", "ASC"], ["month", "ASC"]],
  });

  return newCustomers.map((customer) => ({
    month: customer.get("month"),
    year: customer.get("year"),
    totalCustomers: customer.get("totalCustomers"),
  }));
};

// Top 5 sản phẩm bán chạy nhất
exports.getTopProducts = async () => {
  const topProducts = await OrderItem.findAll({
    attributes: [
      [sequelize.col("product.title"), "name"],
      [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "totalSold"],
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: [],
      },
      {
        model: Order,
        as: "Order",
        attributes: [],
        where: { status: "completed" }, // Điều kiện chỉ lấy đơn hàng đã hoàn tất
      },
    ],
    group: ["product.id", "product.title"],
    order: [[sequelize.literal("totalSold"), "DESC"]],
    limit: 5,
  });

  return topProducts.map((item) => ({
    name: item.get("name"),
    totalSold: item.get("totalSold"),
  }));
};


// Tổng số sản phẩm đã bán theo danh mục
exports.getProductsByCategory = async () => {
  const productsByCategory = await OrderItem.findAll({
    attributes: [
      [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "totalSold"],
      [sequelize.col("product->category.name"), "categoryName"],
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: [],
        include: [
          {
            model: Category,
            as: "category",
            attributes: [],
          },
        ],
      },
      {
        model: Order,
        as: "Order",
        attributes: [],
        where: { status: "completed" }, // Điều kiện chỉ lấy đơn hàng đã hoàn tất
      },
    ],
    group: ["product->category.id", "product->category.name"],
    order: [[sequelize.literal("totalSold"), "DESC"]],
  });

  return productsByCategory.map((item) => ({
    categoryName: item.get("categoryName"),
    totalSold: item.get("totalSold"),
  }));
};


// Tổng số voucher đã cấp và đã sử dụng
exports.getVoucherSummary = async () => {
  const [totalVouchers, usedVouchers] = await Promise.all([
    CustomerVoucher.count(),
    CustomerVoucher.count({ where: { status: ["used", "expired"] } }),
  ]);

  return {
    totalVouchers,
    usedVouchers,
    unusedVouchers: totalVouchers - usedVouchers,
  };
};

exports.getTopUsedVouchers = async () => {
  const topUsedVouchers = await CustomerVoucher.findAll({
    attributes: [
      [sequelize.col("voucher.code"), "voucherCode"],
      [sequelize.fn("COUNT", sequelize.col("CustomerVoucher.id")), "totalUses"],
    ],
    include: [
      {
        model: Voucher,
        as: "voucher",
        attributes: [],
      },
    ],
    where: { status: "used" },
    group: ["voucher.id", "voucher.code"],
    order: [[sequelize.literal("totalUses"), "DESC"]],
    limit: 5,
  });

  return topUsedVouchers.map((voucher) => ({
    voucherCode: voucher.get("voucherCode"),
    totalUses: voucher.get("totalUses"),
  }));
};


// Số lượng giỏ hàng đang hoạt động theo ngày
exports.getActiveCarts = async () => {
  const activeCarts = await CartItem.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("updated_at")), "date"],
      [sequelize.fn("COUNT", sequelize.col("id")), "totalActiveCarts"],
    ],
    group: ["date"],
    order: [["date", "ASC"]],
  });

  return activeCarts.map((cart) => ({
    date: cart.get("date"),
    totalActiveCarts: cart.get("totalActiveCarts"),
  }));
};

// Giá trị trung bình của giỏ hàng
exports.getAverageCartValue = async () => {
  const averageCartValue = await CartItem.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("CartItem.updated_at")), "date"], // Làm rõ bảng chứa `updated_at`
      [
        sequelize.fn("AVG", sequelize.literal("CartItem.quantity * Product.price")),
        "averageCartValue",
      ],
    ],
    include: [
      {
        model: Product,
        attributes: [],
      },
    ],
    group: ["date"],
    order: [["date", "ASC"]],
  });

  return averageCartValue.map((cart) => ({
    date: cart.get("date"),
    averageCartValue: cart.get("averageCartValue"),
  }));
};

