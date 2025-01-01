import Layout from "@/components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = { name, email, phone, address, city, country };
      const response = await axios.post("/api/customers", newCustomer);
      if (response.status === 201) {
        alert("Khách hàng đã được thêm thành công!");
        router.push("/customers");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Đã xảy ra lỗi khi thêm khách hàng!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Thêm Khách Hàng Mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Tên</label>
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Điện Thoại</label>
          <input
            type="text"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Địa Chỉ</label>
          <textarea
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Thành Phố</label>
          <input
            type="text"
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Quốc Gia</label>
          <input
            type="text"
            className="input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          Thêm Khách Hàng
        </button>
      </form>
    </Layout>
  );
}
