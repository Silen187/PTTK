import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function VipCustomers() {
  const [vipCustomers, setVipCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVipCustomers = async () => {
      try {
        const response = await axios.get("/api/vip-customers");
        setVipCustomers(response.data);
        setFilteredCustomers(response.data);
      } catch (error) {
        console.error("Error fetching VIP customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVipCustomers();
  }, []);

  useEffect(() => {
    const results = vipCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(results);
  }, [searchTerm, vipCustomers]);

  const handleRemoveVip = async (customerId) => {
    if (!confirm("Bạn có chắc muốn xóa trạng thái VIP của khách hàng này?")) return;
    try {
      await axios.delete("/api/vip-customers", { data: { customerId } });
      setVipCustomers(vipCustomers.filter((customer) => customer.id !== customerId));
      alert("Đã xóa trạng thái VIP của khách hàng!");
    } catch (error) {
      console.error("Error removing VIP status:", error);
      alert("Không thể xóa trạng thái VIP của khách hàng!");
    }
  };

  const handleUpdateVipList = async () => {
    if (!confirm("Bạn có chắc muốn cập nhật danh sách VIP?")) return;
    try {
      await axios.post("/api/vip-customers", { action: "update_vip_list" });
      alert("Danh sách VIP đã được cập nhật!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating VIP list:", error);
      alert("Không thể cập nhật danh sách VIP!");
    }
  };

  const navigateToCreateVoucher = () => {
    router.push("/vip-customers/create-voucher");
  };

  const navigateToPromoteVip = () => {
    router.push("/vip-customers/promote-vip");
  };

  if (loading) {
    return <Layout>Đang tải danh sách khách hàng VIP...</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách khách hàng VIP ({filteredCustomers.length})</h1>
      <div className="mb-4 flex justify-between">
        <button onClick={handleUpdateVipList} className="btn-primary">
          Cập nhật danh sách VIP
        </button>
        <button onClick={navigateToCreateVoucher} className="btn-primary">
          Tạo voucher cho VIP
        </button>
        <button onClick={navigateToPromoteVip} className="btn-primary">
          Thăng hạng VIP
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng VIP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full"
        />
      </div>

      <table className="basic mt-2 w-full border-collapse">
        <thead className="text-left">
          <tr className="border-b">
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điểm Loyalty</th>
            <th>Lý do lên VIP</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.loyalty_points}</td>
              <td>
                {customer.vip_history?.[0]?.promotion_reason || "Không rõ"}
              </td>
              <td>
                <button
                  onClick={() => router.push(`/vip-customers/${customer.id}`)}
                  className="btn-default"
                >
                  Xem
                </button>
                <button
                  onClick={() => handleRemoveVip(customer.id)}
                  className="btn-red ml-2"
                >
                  Xóa VIP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
