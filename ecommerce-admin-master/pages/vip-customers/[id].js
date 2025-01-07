import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function VipCustomerDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [customer, setCustomer] = useState(null);
  const [extraDetails, setExtraDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`/api/vip-customers?id=${id}`);
        setCustomer(response.data.customer);
        setExtraDetails(response.data.extraDetails);
        console.log(response.data.extraDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return <Layout>Đang tải chi tiết khách hàng VIP...</Layout>;
  }

  if (!customer) {
    return <Layout>Không tìm thấy khách hàng VIP</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Chi tiết khách hàng VIP</h1>
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-bold mb-2">Thông tin cơ bản</h2>
        <p>
          <strong>Tên:</strong> {customer.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Điện thoại:</strong> {customer.phone || "Không có thông tin"}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {customer.address || "Không có thông tin"}
        </p>
        <p>
          <strong>Thành phố:</strong> {customer.city || "Không có thông tin"}
        </p>
        <p>
          <strong>Quốc gia:</strong> {customer.country || "Không có thông tin"}
        </p>
        <p>
          <strong>Điểm Loyalty:</strong> {customer.loyalty_points}
        </p>
        <p>
          <strong>Lý do lên VIP:</strong>{" "}
          {customer.vip_history[0]?.promotion_reason || "Không rõ"}
        </p>
      </div>

      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-bold mb-2">Thông tin bổ sung</h2>
        {customer.vip_history[0]?.promotion_reason === "Top5_Monthly" && (
          <>
            <p>
              <strong>Số đơn hoàn thành trong tháng:</strong>{" "}
              {extraDetails.totalOrders || 0}
            </p>
            <p>
              <strong>Tổng chi tiêu:</strong>{" "}
              {extraDetails.totalSpent?.toLocaleString("vi-VN")}$
            </p>
          </>
        )}
        {customer.vip_history[0]?.promotion_reason === "Top3_Category" && (
          <div>
            <strong>Số lượng mua trong mỗi danh mục:</strong>
            <ul className="list-disc pl-6">
              {extraDetails.categories?.map((category, index) => (
                <li key={index}>
                  {category["categoryName"]} -{" "}
                  {category.totalProducts} sản phẩm
                </li>
              )) || <p>Không có dữ liệu</p>}
            </ul>
          </div>
        )}
        {customer.vip_history[0]?.promotion_reason ===
          "Spending_Over_Threshold" && (
          <>
            <p>
              <strong>Tổng chi tiêu trong tháng:</strong>{" "}
              {extraDetails.totalSpent?.toLocaleString("vi-VN")}$
            </p>
            <p>
              <strong>Ngưỡng yêu cầu:</strong>{" "}
              {extraDetails.threshold?.toLocaleString("vi-VN")}$
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => router.back()}
        className="btn-default mt-4"
      >
        Quay lại
      </button>
    </Layout>
  );
}
