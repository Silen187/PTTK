import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      return;
    }
    try {
      const response = await axios.delete(`/api/orders?id=${id}`);
      if (response.status === 200) {
        alert("Đơn hàng đã được xóa thành công!");
        setOrders(orders.filter((order) => order.id !== id));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Không thể xóa đơn hàng!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách đơn hàng</h1>
      <Link className="btn-primary" href="/orders/create">
        Tạo đơn mới
      </Link>
      <table className="basic mt-2">
        <thead className="text-left">
          <tr>
            <th>ID</th>
            <th>Khách Hàng</th>
            <th>Tổng Giá</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td>{order.id}</td>
              <td>{order.customer?.name || "Không xác định"}</td>
              <td>{order.totalPrice}$</td>
              <td>{order.status}</td>
              <td>
                <Link href={`/orders/edit/${order.id}`} className="btn-default">
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="btn-red ml-2"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
