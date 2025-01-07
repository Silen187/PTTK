import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get("/api/vouchers");
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa voucher này không?")) return;
    try {
      await axios.delete(`/api/vouchers?id=${id}`);
      setVouchers(vouchers.filter((voucher) => voucher.id !== id));
      alert("Voucher đã được xóa thành công!");
    } catch (error) {
      alert("Không thể xóa voucher!");
    }
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Danh sách Voucher ({filteredVouchers.length})</h1>
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm mã voucher..."
          className="input flex-1 h-12 px-4 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/vouchers/create" className="btn-primary h-12 flex items-center justify-center px-6 text-white bg-blue-500 rounded hover:bg-blue-600">
          Tạo Voucher Mới
        </Link>
      </div>
      <table className="basic mt-2 w-full border-collapse">
        <thead className ="text-left">
          <tr className="border-b">
            <th>ID</th>
            <th>Mã</th>
            <th>Giảm giá</th>
            <th>Điểm yêu cầu</th>
            <th>Hạn sử dụng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.map((voucher) => (
            <tr key={voucher.id} className="border-b">
              <td>{voucher.id}</td>
              <td>{voucher.code}</td>
              <td>{voucher.discount_value}</td>
              <td>{voucher.required_points}</td>
              <td>{new Date(voucher.expires_at).toLocaleDateString()}</td>
              <td>
                <Link href={`/vouchers/${voucher.id}`} className="btn-default">
                  Xem
                </Link>
                <button
                  className="btn-red ml-2"
                  onClick={() => handleDelete(voucher.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
