import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const router = useRouter();
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Home & Garden" },
    { id: 5, name: "Beauty & Personal Care" },
    { id: 6, name: "Sports & Outdoors" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title,
        description,
        price,
        categoryId,
        images: images.length > 0 ? images : null,
      };
      const response = await axios.post("/api/products", data); // Gọi API thêm sản phẩm
      if (response.status === 201) {
        alert("Sản phẩm đã được thêm!");
        router.push("/products");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Tên sản phẩm</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Mô tả</label>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Giá</label>
          <input
            type="number"
            className="input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
            <label className="block mb-2">Danh mục</label>
            <select
                className="input"
                value={categoryId}
                onChange={(e) => {
                // Tìm ID của danh mục dựa trên tên đã chọn
                const selectedCategory = categories.find(
                    (category) => category.name === e.target.value
                );
                setCategoryId(selectedCategory?.id || ""); // Lưu lại ID vào state
                }}
                required
            >
                <option value="" disabled>
                -- Chọn danh mục --
                </option>
                {categories.map((category) => (
                <option key={category.id} value={category.name}>
                    {category.name}
                </option>
                ))}
            </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Hình ảnh (URL, cách nhau bởi dấu phẩy)</label>
          <input
            type="text"
            className="input"
            value={images}
            onChange={(e) => setImages(e.target.value.split(","))}
          />
        </div>
        <button type="submit" className="btn-primary">
          Thêm sản phẩm
        </button>
      </form>
    </Layout>
  );
}
