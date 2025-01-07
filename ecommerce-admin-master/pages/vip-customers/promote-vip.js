import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useRouter } from "next/router";

export default function PromoteToVip() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [promotionReason, setPromotionReason] = useState("");
  const router = useRouter();

  const fetchCustomers = async (inputValue) => {
    try {
      const response = await axios.get("/api/customers", {
        params: { search: inputValue },
      });
      return response.data.map((customer) => ({
        value: customer.id,
        label: `${customer.name} (${customer.email})`,
      }));
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || !promotionReason) {
      alert("Vui lòng chọn khách hàng và lý do thăng hạng!");
      return;
    }

    try {
      await axios.post("/api/vip-customers", {
        action: "promote_to_vip",
        customerId: selectedCustomer.value,
        promotionReason,
      });
      alert("Khách hàng đã được thăng hạng VIP!");
      router.push("/vip-customers");
    } catch (error) {
      console.error("Error promoting customer to VIP:", error);
      alert("Không thể thăng hạng khách hàng thành VIP!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Thăng hạng VIP cho Khách hàng</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Chọn Khách hàng</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={fetchCustomers}
            onChange={setSelectedCustomer}
            placeholder="Tìm kiếm khách hàng..."
          />
        </div>
        <div>
          <label className="block mb-2">Lý do thăng hạng</label>
          <select
            value={promotionReason}
            onChange={(e) => setPromotionReason(e.target.value)}
            className="input"
            required
          >
            <option value="" disabled>
              -- Chọn lý do --
            </option>
            <option value="Top5_Monthly">Top 5 khách hàng tháng</option>
            <option value="Top3_Category">Top 3 sản phẩm theo danh mục</option>
            <option value="Spending_Over_Threshold">Chi tiêu vượt ngưỡng</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Thăng hạng VIP
        </button>
      </form>
    </Layout>
  );
}
