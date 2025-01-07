const dashboardMiddleware = require("../middleware/dashboardMiddleware");

// Doanh thu
exports.getRevenueData = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getRevenueData();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Unable to fetch revenue data." });
  }
};

// Số đơn hàng hoàn tất
exports.getCompletedOrders = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getCompletedOrders();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ error: "Unable to fetch completed orders." });
  }
};

// Tổng số khách hàng và khách hàng VIP
exports.getCustomerSummary = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getCustomerSummary();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching customer summary:", error);
    res.status(500).json({ error: "Unable to fetch customer summary." });
  }
};

// Tỷ lệ khách hàng mới theo thời gian
exports.getNewCustomers = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getNewCustomers();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching new customers:", error);
    res.status(500).json({ error: "Unable to fetch new customers." });
  }
};

// Top 5 sản phẩm bán chạy nhất
exports.getTopProducts = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getTopProducts();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Unable to fetch top products." });
  }
};

// Tổng số sản phẩm đã bán theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getProductsByCategory();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Unable to fetch products by category." });
  }
};

// Tổng số voucher đã cấp và đã sử dụng
exports.getVoucherSummary = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getVoucherSummary();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching voucher summary:", error);
    res.status(500).json({ error: "Unable to fetch voucher summary." });
  }
};

// Số lượng giỏ hàng đang hoạt động
exports.getActiveCarts = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getActiveCarts();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching active carts:", error);
    res.status(500).json({ error: "Unable to fetch active carts." });
  }
};

// Giá trị trung bình của giỏ hàng
exports.getAverageCartValue = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getAverageCartValue();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching average cart value:", error);
    res.status(500).json({ error: "Unable to fetch average cart value." });
  }
};

exports.getOrderStatusDistribution = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getOrderStatusDistribution();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching order status distribution:", error);
    res.status(500).json({ error: "Unable to fetch order status distribution." });
  }
};

exports.getTopUsedVouchers = async (req, res) => {
  try {
    const data = await dashboardMiddleware.getTopUsedVouchers();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching top used vouchers:", error);
    res.status(500).json({ error: "Unable to fetch top used vouchers." });
  }
};

