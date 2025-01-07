import Layout from "@/components/Layout";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState({});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [customerSummary, setCustomerSummary] = useState({});
  const [newCustomers, setNewCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [voucherSummary, setVoucherSummary] = useState({});
  const [activeCarts, setActiveCarts] = useState([]);
  const [averageCartValue, setAverageCartValue] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [topUsedVouchers, setTopUsedVouchers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenueRes = await axios.get("/api/dashboard?action=revenue");
        setRevenueData(revenueRes.data);

        const ordersRes = await axios.get("/api/dashboard?action=completedOrders");
        setCompletedOrders(ordersRes.data);

        const customerRes = await axios.get("/api/dashboard?action=customerSummary");
        setCustomerSummary(customerRes.data);

        const newCustomersRes = await axios.get("/api/dashboard?action=newCustomers");
        setNewCustomers(newCustomersRes.data);

        const topProductsRes = await axios.get("/api/dashboard?action=topProducts");
        setTopProducts(topProductsRes.data);

        const productsByCategoryRes = await axios.get("/api/dashboard?action=productsByCategory");
        setProductsByCategory(productsByCategoryRes.data);

        const voucherRes = await axios.get("/api/dashboard?action=voucherSummary");
        setVoucherSummary(voucherRes.data);

        const activeCartsRes = await axios.get("/api/dashboard?action=activeCarts");
        setActiveCarts(activeCartsRes.data);

        const averageCartValueRes = await axios.get("/api/dashboard?action=averageCartValue");
        setAverageCartValue(averageCartValueRes.data);

        const orderStatusRes = await axios.get("/api/dashboard?action=orderStatusDistribution");
        setOrderStatusDistribution(orderStatusRes.data);

        const topVouchersRes = await axios.get("/api/dashboard?action=topUsedVouchers");
        setTopUsedVouchers(topVouchersRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center">Tổng quan</h1>

      {/* Tổng quan */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Doanh thu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-medium mb-2">Doanh thu hôm nay</h3>
            <p className="text-2xl font-bold text-blue-600">
              {revenueData.revenueToday ? `${revenueData.revenueToday}$` : "0$"}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-medium mb-2">Doanh thu tháng này</h3>
            <p className="text-2xl font-bold text-green-600">
              {revenueData.revenueThisMonth ? `${revenueData.revenueThisMonth}$` : "0$"}
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-medium mb-2">Doanh thu năm nay</h3>
            <p className="text-2xl font-bold text-red-600">
              {revenueData.revenueThisYear ? `${revenueData.revenueThisYear}$` : "0$"}
            </p>
          </div>
        </div>
      </section>

      {/* Khách hàng */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Khách hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Tỉ lệ khách hàng Vip</h3>
            <div className="w-full h-64">
              <Pie
                data={{
                  labels: ["Khách hàng VIP", "Khách hàng thường"],
                  datasets: [
                    {
                      data: [
                        customerSummary.vipCustomers || 0,
                        (customerSummary.totalCustomers || 0) - (customerSummary.vipCustomers || 0),
                      ],
                      backgroundColor: ["#36A2EB", "#FF6384"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Tỷ lệ khách hàng mới</h3>
            <div className="w-full h-64">
              <Bar
                data={{
                  labels: newCustomers.map((c) => `${c.month}/${c.year}`),
                  datasets: [
                    {
                      label: "Khách hàng mới",
                      data: newCustomers.map((c) => c.totalCustomers),
                      backgroundColor: "rgba(75, 192, 192, 0.5)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sản phẩm */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Sản phẩm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Top 5 sản phẩm bán chạy</h3>
            <div className="w-full h-64">
              <Bar
                data={{
                  labels: topProducts.map((p) => p.name),
                  datasets: [
                    {
                      label: "Số lượng bán",
                      data: topProducts.map((p) => p.totalSold),
                      backgroundColor: "rgba(54, 162, 235, 0.5)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Sản phẩm bán theo danh mục</h3>
            <div className="w-full h-64">
              <Bar
                data={{
                  labels: productsByCategory.map((c) => c.categoryName),
                  datasets: [
                    {
                      label: "Số lượng bán",
                      data: productsByCategory.map((c) => c.totalSold),
                      backgroundColor: "rgba(255, 206, 86, 0.5)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hoạt động */}
      <section className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Hoạt động</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Lịch sử số lượng giỏ hàng</h3>
            <div className="w-full h-64">
              <Bar
                data={{
                  labels: activeCarts.map((c) => c.date),
                  datasets: [
                    {
                      label: "Số giỏ hàng",
                      data: activeCarts.map((c) => c.totalActiveCarts),
                      backgroundColor: "rgba(153, 102, 255, 0.5)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Giá trị trung bình giỏ hàng</h3>
            <div className="w-full h-64">
              <Line
                data={{
                  labels: averageCartValue.map((c) => c.date),
                  datasets: [
                    {
                      label: "Giá trị trung bình",
                      data: averageCartValue.map((c) => c.averageCartValue),
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Đơn hàng */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Đơn hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Phân loại đơn hàng</h3>
            <div className="w-full h-64">
            <Pie
              data={{
                labels: orderStatusDistribution.map((o) => o.status),
                datasets: [
                  {
                    data: orderStatusDistribution.map((o) => o.totalOrders),
                    backgroundColor: [
                      "#FF6384", // Đỏ
                      "#36A2EB", // Xanh dương
                      "#FFCE56", // Vàng
                      "#4BC0C0", // Xanh ngọc
                      "#9966FF", // Tím
                      "#F7464A", // Hồng đậm
                      "#46BFBD", // Xanh lục
                      "#FDB45C", // Cam
                      "#949FB1", // Xám
                      "#00A651", // Xanh lá đậm
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                },
              }}
            />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Số đơn hàng hoàn tất</h3>
            <div className="w-full h-64">
              <Bar
                data={{
                  labels: completedOrders.map((o) => o.date),
                  datasets: [
                    {
                      label: "Đơn hàng",
                      data: completedOrders.map((o) => o.totalOrders),
                      backgroundColor: "rgba(75, 192, 192, 0.5)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Voucher */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Voucher</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Phân bổ Voucher</h3>
            <div className="w-full h-64">
              <Pie
                data={{
                  labels: ["Đã sử dụng hoặc hết hạn", "Chưa sử dụng"],
                  datasets: [
                    {
                      data: [
                        voucherSummary.usedVouchers || 0,
                        voucherSummary.unusedVouchers || 0,
                      ],
                      backgroundColor: ["#FF6384", "#36A2EB"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl mb-2">Top 5 Voucher được sử dụng</h3>
            <div className="w-full h-64">
            <Bar
              data={{
                labels: topUsedVouchers.map((v) => v.voucherCode), // Mã giảm giá làm trục Y
                datasets: [
                  {
                    label: "Số lần sử dụng",
                    data: topUsedVouchers.map((v) => v.totalUses), // Số lần sử dụng làm trục X
                    backgroundColor: "rgba(255, 99, 132, 0.5)" // Màu đỏ nhạt
                  },
                ],
              }}
              options={{
                indexAxis: "y", // Đặt trục Y làm danh mục
                responsive: true,
                maintainAspectRatio: false,
              }}
            />

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
