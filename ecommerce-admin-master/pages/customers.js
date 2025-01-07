import Layout from "@/components/Layout";
import React from "react"; // Add this line
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
        setFilteredCustomers(response.data);
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
        setFilteredCustomers((prev) => prev.filter((customer) => customer.id !== id));
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    // Chỉ lọc nếu có từ khóa tìm kiếm
    if (term.trim() === "") {
      setFilteredCustomers(customers); // Hiển thị toàn bộ danh sách nếu không có từ khóa
      return;
    }
  
    setFilteredCustomers(
      customers.filter((customer) =>
        [
          customer.name.toLowerCase(),
          customer.id.toString(),
          customer.email.toLowerCase(),
          customer.phone?.toLowerCase() || "",
        ].some((field) => field.includes(term))
      )
    );
  };
  

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách khách hàng ({filteredCustomers.length})</h1>
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={handleSearch}
          className="input flex-1 h-12 px-4 border border-gray-300 rounded"
        />
        <Link
          className="btn-primary h-12 flex items-center justify-center px-6 text-white bg-blue-500 rounded hover:bg-blue-600"
          href="/customers/create"
        >
          Thêm khách hàng
        </Link>
      </div>

      <table className="basic mt-2">
        <thead className="text-left">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
        {filteredCustomers.map((customer) => (
          <React.Fragment key={customer.id}>
            <tr className="border-b">
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <Link
                  href={`/customers/edit/${customer.id}`}
                  className="btn-default"
                >
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
            <tr>
              <td colSpan="5">
                <hr className="border-t border-gray-300" />
              </td>
            </tr>
          </React.Fragment>
        ))}

        </tbody>
      </table>
    </Layout>
  );
}
