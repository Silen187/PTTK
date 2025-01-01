import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = router.query;

  const [customer, setCustomer] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customers?id=${id}`);
        const data = response.data;

        setCustomer(data);
        setUser(data.user || null); // Nếu không có user, set user = null
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setCountry(data.country || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { name, email, phone, address, city, country };
      const response = await axios.put(`/api/customers?id=${id}`, updatedData);

      if (response.status === 200) {
        alert("Cập nhật thông tin khách hàng thành công!");
        router.push("/customers");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Không thể cập nhật thông tin khách hàng!");
    }
  };

  if (loading) {
    return <Layout>Đang tải thông tin khách hàng...</Layout>;
  }

  if (!customer) {
    return <Layout>Không tìm thấy khách hàng</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Chỉnh sửa thông tin khách hàng</h1>
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
        <div className="mb-4">
          <label className="block mb-2">Tài khoản liên kết</label>
          {user ? (
            <>
              <p className="text-gray-700">Tên tài khoản: {user.username}</p>
              <p className="text-gray-700">Mật khẩu: {user.password}</p>
            </>
            
          ) : (
            <p className="text-red-500">Khách hàng này không đăng ký tài khoản</p>
          )}
        </div>
        <button type="submit" className="btn-primary">
          Cập Nhật Thông Tin
        </button>
      </form>
    </Layout>
  );
}
