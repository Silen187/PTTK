import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Home & Garden" },
    { id: 5, name: "Beauty & Personal Care" },
    { id: 6, name: "Sports & Outdoors" },
  ];

  // Lấy thông tin sản phẩm hiện tại
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products?id=${id}`);
        const data = response.data;

        setProduct(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setPrice(data.price);
        setCategoryId(data.categoryId || "");
        setImages(data.images || []);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Xử lý cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        title,
        description,
        price,
        categoryId,
        images,
      };
      const response = await axios.put(`/api/products?id=${id}`, updatedData);
      if (response.status === 200) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/products");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Đã xảy ra lỗi khi cập nhật sản phẩm!");
    }
  };

  if (!product) {
    return <Layout>Đang tải thông tin sản phẩm...</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Chỉnh sửa sản phẩm</h1>
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
            value={images.join(",")}
            onChange={(e) => setImages(e.target.value.split(","))}
          />
        </div>
        <button type="submit" className="btn-primary">
          Cập nhật sản phẩm
        </button>
      </form>
    </Layout>
  );
}
