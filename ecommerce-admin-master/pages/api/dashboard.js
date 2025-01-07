import {
  getRevenueData,
  getCompletedOrders,
  getCustomerSummary,
  getNewCustomers,
  getTopProducts,
  getProductsByCategory,
  getVoucherSummary,
  getActiveCarts,
  getAverageCartValue,
  getOrderStatusDistribution,
  getTopUsedVouchers
} from "@/controllers/dashboardController";

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    switch (action) {
      case "revenue":
        return await getRevenueData(req, res);
      case "completedOrders":
        return await getCompletedOrders(req, res);
      case "customerSummary":
        return await getCustomerSummary(req, res);
      case "newCustomers":
        return await getNewCustomers(req, res);
      case "topProducts":
        return await getTopProducts(req, res);
      case "productsByCategory":
        return await getProductsByCategory(req, res);
      case "voucherSummary":
        return await getVoucherSummary(req, res);
      case "activeCarts":
        return await getActiveCarts(req, res);
      case "averageCartValue":
        return await getAverageCartValue(req, res);
      case "orderStatusDistribution": // Thêm mới
        return await getOrderStatusDistribution(req, res);
      case "topUsedVouchers": // Thêm mới
        return await getTopUsedVouchers(req, res);
      default:
        res.status(400).json({ error: "Invalid action specified." });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred." });
  }
}

