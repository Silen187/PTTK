import Layout from "@/components/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

    try {
      const response = await axios.delete(`/api/customers?id=${id}`);
      if (response.status === 200) {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách khách hàng</h1>
      <Link className="btn-primary" href="/customers/create">
        Thêm khách hàng
      </Link>
      <table className="basic mt-2">
        <thead className="text-left">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <Link href={`/customers/edit/${customer.id}`} className="btn-default">
                  Sửa
                </Link>
                <button
                  className="btn-red"
                  onClick={() => handleDelete(customer.id)}
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
