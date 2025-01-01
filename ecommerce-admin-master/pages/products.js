import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/products?id=${id}`);
      if (response.status === 200) {
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách sản phẩm</h1>
      <Link className="btn-primary" href="/products/create">
        Thêm sản phẩm
      </Link>
      <table className="basic mt-2">
        <thead className="text-left">
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá tiền</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td>
                {product.images?.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} width={50} />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{product.title}</td>
              <td>{product.price}$</td>
              <td>{product.category?.name || "Uncategorized"}</td>
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
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
