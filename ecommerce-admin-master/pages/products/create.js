import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories"); // Endpoint để lấy danh sách danh mục
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title,
        description,
        price,
        loyalty_points: loyaltyPoints,
        category_id: categoryId,
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
          <label className="block mb-2">Điểm tích lũy</label>
          <input
            type="number"
            className="input"
            value={loyaltyPoints}
            onChange={(e) => setLoyaltyPoints(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Danh mục</label>
          <select
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Chọn danh mục --
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
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
