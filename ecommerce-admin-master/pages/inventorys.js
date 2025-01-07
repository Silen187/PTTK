import Layout from "@/components/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data); // Ban đầu, hiển thị tất cả sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.id.toString().includes(term)
      )
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách sản phẩm ({filteredProducts.length})</h1>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearch}
          className="input mr-4 flex-grow"
        />
      </div>
      <table className="basic mt-4">
        <thead className="text-left">
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <>
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>
                  <Link
                    href={`/inventory/${product.id}`}
                    className="btn-primary"
                  >
                    Xem lịch sử
                  </Link>
                </td>
              </tr>
              {index < filteredProducts.length - 1 && ( // Thêm vách ngăn giữa các hàng, trừ hàng cuối cùng
                <tr>
                  <td colSpan="3">
                    <hr className="border-t border-gray-300 my-2" />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
