import Layout from "@/components/Layout";
import React from "react"; // Add this line
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch sản phẩm khi trang load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.category?.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const response = await axios.delete(`/api/products?id=${id}`);
      if (response.status === 200) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
        setFilteredProducts((prev) => prev.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách sản phẩm ({filteredProducts.length})</h1>
      {/* Thanh tìm kiếm và nút thêm sản phẩm */}

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
          href="/products/create"
        >
          Thêm sản phẩm
        </Link>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <table className="basic mt-2">
        <thead className="text-left">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <React.Fragment key={product.id}>
              <tr className="border-b">
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.category?.name || "Không có danh mục"}</td>
                <td>
                  <Link href={`/products/edit/${product.id}`} className="btn-default">
                    Sửa
                  </Link>
                  <button
                    className="btn-red"
                    onClick={() => handleDelete(product.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              {/* Ngăn cách giữa các sản phẩm */}
              <tr>
                <td colSpan="5">
                  <hr className="border-t border-gray-300" />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Hiển thị nếu không tìm thấy sản phẩm */}
      {filteredProducts.length === 0 && (
        <p className="text-center mt-4">Không tìm thấy sản phẩm nào.</p>
      )}
    </Layout>
  );
}
