import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";

export default function VoucherDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [voucher, setVoucher] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [voucherRes, customerRes] = await Promise.all([
          axios.get(`/api/vouchers?id=${id}`),
          axios.get("/api/customers"),
        ]);

        setVoucher(voucherRes.data);
        setCustomers(customerRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleAddVoucher = async () => {
    if (!selectedCustomer) return alert("Vui lòng chọn khách hàng!");

    try {
      await axios.put("/api/vouchers", {
        voucherId: id,
        customerId: selectedCustomer.value,
      });
      alert("Voucher đã được thêm cho khách hàng!");
    } catch (error) {
      alert("Không thể thêm voucher cho khách hàng!");
    }
  };

  if (!voucher) return <Layout>Đang tải...</Layout>;

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Chi tiết Voucher</h1>
      <div className="mb-4">
        <p><strong>Mã:</strong> {voucher.code}</p>
        <p><strong>Giảm giá:</strong> {voucher.discount_value}</p>
        <p><strong>Điểm yêu cầu:</strong> {voucher.required_points}</p>
        <p><strong>Hạn sử dụng:</strong> {new Date(voucher.expires_at).toLocaleString()}</p>
      </div>
      <h2 className="text-xl mb-4">Số lượng khách hàng đang sở hữu: {voucher.customer_vouchers.length}</h2>
      <div className="mb-4">
        <label className="block mb-2">Thêm cho khách hàng</label>
        <Select
          options={customers.map((customer) => ({
            value: customer.id,
            label: customer.name,
          }))}
          onChange={setSelectedCustomer}
        />
        <button onClick={handleAddVoucher} className="btn-primary mt-2">
          Thêm
        </button>
      </div>
    </Layout>
  );
}
