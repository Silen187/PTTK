import { Order, OrderItem, Product, Customer, sequelize } from "@/lib/sequelize";

export const getDashboardData = async () => {
  const totalRevenue = await Order.sum("totalPrice", {
    where: { status: "completed", deleted: false },
  });

  const orderStatusCounts = await Order.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("status")), "count"],
    ],
    group: ["status"],
  });

  const customerCount = await Customer.count({
    where: { deleted: false },
  });

  const productCount = await Product.count({
    where: { deleted: false },
  });

  const monthlyRevenue = await Order.findAll({
    attributes: [
      [sequelize.fn("MONTH", sequelize.col("created_at")), "month"],
      [sequelize.fn("SUM", sequelize.col("totalPrice")), "revenue"],
    ],
    group: [sequelize.fn("MONTH", sequelize.col("created_at"))],
    order: [[sequelize.fn("MONTH", sequelize.col("created_at")), "ASC"]],
  });

  const topSellingProducts = await OrderItem.findAll({
    attributes: [
      "product_id",
      [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "total_sold"],
      [sequelize.fn("SUM", sequelize.col("OrderItem.price")), "total_revenue"],
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["title"],
      },
    ],
    group: ["OrderItem.product_id"],
    order: [[sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "DESC"]],
    limit: 5,
  });
  

  return {
    totalRevenue,
    orderStatusCounts,
    customerCount,
    productCount,
    monthlyRevenue,
    topSellingProducts,
  };
};
