import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg font-semibold text-gray-500">Đang tải...</p>
        </div>
      </Layout>
    );
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d88484", "#84d8d8"];

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Trực quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Tổng doanh thu</h2>
          <p className="text-3xl font-bold text-gray-800">${parseFloat(data.totalRevenue).toFixed(2)}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Số lượng khách hàng</h2>
          <p className="text-3xl font-bold text-gray-800">{data.customerCount}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Số mặt hàng hiện có</h2>
          <p className="text-3xl font-bold text-gray-800">{data.productCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">
        {/* Order Status */}
        <div className="col-span-12 md:col-span-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 mb-4">Tình trạng đơn hàng</h2>
          <PieChart width={350} height={250}>
            <Pie
              data={data.orderStatusCounts}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.orderStatusCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        {/* Monthly Revenue */}
        <div className="col-span-12 md:col-span-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 mb-4">Doanh thu theo tháng</h2>
          <BarChart width={400} height={250} data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Top Selling Products */}
        <div className="col-span-12 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 mb-4">Top 5 bán chạy</h2>
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total Sold</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topSellingProducts.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.product.title}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{product.total_sold}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ${parseFloat(product.total_revenue).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
