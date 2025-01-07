import Layout from "@/components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateVoucher() {
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [requiredPoints, setRequiredPoints] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const voucherData = {
        code,
        discount_value: discountValue,
        required_points: requiredPoints,
        expires_at: expiresAt,
      };
      const response = await axios.post("/api/vouchers", voucherData);

      if (response.status === 201) {
        alert("Voucher đã được tạo thành công!");
        router.push("/vouchers");
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Không thể tạo voucher!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Tạo Voucher Mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Mã Voucher</label>
          <input
            type="text"
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Giá trị giảm giá</label>
          <input
            type="number"
            className="input"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Điểm yêu cầu</label>
          <input
            type="number"
            className="input"
            value={requiredPoints}
            onChange={(e) => setRequiredPoints(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Hạn sử dụng</label>
          <input
            type="datetime-local"
            className="input"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Tạo Voucher
        </button>
      </form>
    </Layout>
  );
}
