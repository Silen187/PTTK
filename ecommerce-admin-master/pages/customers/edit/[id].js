import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = router.query;

  const [customer, setCustomer] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [isVip, setIsVip] = useState(false);
  const [vipHistory, setVipHistory] = useState([]);
  const [vouchers, setVouchers] = useState({ unused: [], used: [], expired: [] });
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customers?id=${id}`);
        const data = response.data;
        console.log(data);
        setCustomer(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setCountry(data.country || "");
        setLoyaltyPoints(data.loyalty_points || 0);
        setIsVip(data.is_vip || false);
        setVipHistory(data.vip_history || []);

        const unusedVouchers = data.vouchers.unused;
        const usedVouchers = data.vouchers.used;
        const expiredVouchers = data.vouchers.expired;

        setVouchers({ unused: unusedVouchers, used: usedVouchers, expired: expiredVouchers });
        setUser(data.user || null);
        setPassword(data.user?.password || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const togglePasswordEdit = () => {
    setIsPasswordEditable((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { name, email, phone, address, city, country };
  
      // Include password in the request only if it is editable, has been changed, and the user exists
      if (isPasswordEditable && password && user) {
        updatedData.password = password; // Add password to the payload
      }
  
      // Update customer info, including optional password
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
          <label className="block mb-2">Điểm Tích Lũy</label>
          <p>{loyaltyPoints}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Trạng Thái VIP</label>
          <p>{isVip ? "VIP" : "Không"}</p>
          {isVip && (
            <div className="mt-2">
              <h4>Lịch sử VIP:</h4>
              <ul>
                {vipHistory.map((entry) => (
                  <li key={entry.id}>
                    Lý do: {entry.promotion_reason} (Thời gian: {new Date(entry.created_at).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Voucher</label>
          <div>
            <h4>Chưa sử dụng:</h4>
            <ul>
              {vouchers.unused.map((voucher) => (
                <li key={voucher.id}>
                  Mã: {voucher.voucher.code}, Giá trị: {voucher.voucher.discount_value}, Hạn: {new Date(voucher.voucher.expires_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Đã sử dụng:</h4>
            <ul>
              {vouchers.used.map((voucher) => (
                <li key={voucher.id}>
                  Mã: {voucher.voucher.code}, Giá trị: {voucher.voucher.discount_value}, Sử dụng cho đơn hàng #{voucher.order?.id}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Hết hạn:</h4>
            <ul>
              {vouchers.expired.map((voucher) => (
                <li key={voucher.id}>
                  Mã: {voucher.voucher.code}, Giá trị: {voucher.voucher.discount_value}, Hạn: {new Date(voucher.voucher.expires_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {user ? (
          <div className="mb-4">
            <label className="block mb-2">Tài khoản liên kết</label>
            <p>
              <strong>Tên tài khoản:</strong> {user.username}
            </p>
            <p>
              <strong>Mật khẩu:</strong>
            </p>
            <div className="mt-2 flex items-center gap-2">
              
              <input
                type="text"
                className="input"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isPasswordEditable}
              />
              <button
                type="button"
                onClick={togglePasswordEdit}
                className={`btn ${isPasswordEditable ? "btn-red" : "btn-primary"}`}
              >
                {isPasswordEditable ? "Hủy" : "Thay đổi mật khẩu"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-red-500">Khách hàng này không đăng ký tài khoản</p>
          </div>
        )}
        <button type="submit" className="btn-primary">
          Cập Nhật Thông Tin
        </button>
      </form>
    </Layout>
  );
}
