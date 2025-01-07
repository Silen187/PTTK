import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreateVoucherForVip() {
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [requiredPoints, setRequiredPoints] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || !discountValue || !requiredPoints || !expiresAt) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post("/api/vip-customers", {
        action: "create_voucher",
        code,
        discount_value: discountValue,
        required_points: requiredPoints,
        expires_at: expiresAt,
      });
      alert("Voucher đã được tạo và phân phối cho khách hàng VIP!");
      router.push("/vip-customers");
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Không thể tạo voucher!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Tạo Voucher cho Khách hàng VIP</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Mã Voucher</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input"
            placeholder="Nhập mã voucher"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Giá trị giảm giá</label>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="input"
            placeholder="Nhập giá trị giảm giá"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Điểm yêu cầu</label>
          <input
            type="number"
            value={requiredPoints}
            onChange={(e) => setRequiredPoints(e.target.value)}
            className="input"
            placeholder="Nhập điểm yêu cầu"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Hạn sử dụng</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="input"
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
