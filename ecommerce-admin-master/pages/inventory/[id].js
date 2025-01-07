import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function InventoryDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecord, setNewRecord] = useState({
    change_type: "added",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);

  // Lấy thông tin sản phẩm
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products?id=${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Lấy danh sách lịch sử nhập kho
  useEffect(() => {
    if (!id) return;

    const fetchInventoryRecords = async () => {
      try {
        const response = await axios.get(`/api/inventorys?productId=${id}`);
        setInventoryRecords(response.data);
        setFilteredRecords(response.data); // Ban đầu hiển thị toàn bộ bản ghi
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory records:", error);
        setLoading(false);
      }
    };

    fetchInventoryRecords();
  }, [id]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredRecords(
      inventoryRecords.filter(
        (record) =>
          record.change_type.toLowerCase().includes(term) ||
          record.id.toString().includes(term) ||
          record.quantity.toString().includes(term)
      )
    );
  };

  // Xử lý thêm bản ghi nhập kho
  const handleAddRecord = async (e) => {
    e.preventDefault();

    if (!newRecord.quantity || isNaN(newRecord.quantity)) {
      alert("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    try {
      const data = { product_id: id, ...newRecord };
      await axios.post("/api/inventorys", data);
      alert("Thêm bản ghi nhập kho thành công!");
      setNewRecord({ change_type: "added", quantity: "" });
      router.reload(); // Reload page
    } catch (error) {
      console.error("Error adding inventory record:", error);
      alert("Không thể thêm bản ghi nhập kho!");
    }
  };

  // Xử lý xóa bản ghi nhập kho
  const handleDeleteRecord = async (recordId) => {
    if (!confirm("Bạn có chắc muốn xóa bản ghi này?")) return;

    try {
      await axios.delete(`/api/inventorys?id=${recordId}`);
      alert("Xóa bản ghi thành công!");
      router.reload(); // Reload page
    } catch (error) {
      console.error("Error deleting inventory record:", error);
      alert("Không thể xóa bản ghi!");
    }
  };

  if (loading) {
    return <Layout>Đang tải thông tin...</Layout>;
  }

  if (!product) {
    return <Layout>Không tìm thấy sản phẩm</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Lịch sử nhập kho: {product.title}</h1>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm lịch sử..."
          value={searchTerm}
          onChange={handleSearch}
          className="input w-full"
        />
      </div>

      {/* Danh sách lịch sử nhập kho */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Lịch sử</h2>
        {filteredRecords.length > 0 ? (
          <table className="basic mt-2 w-full">
            <thead className="text-left">
              <tr>
                <th>ID</th>
                <th>Loại thay đổi</th>
                <th>Số lượng</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <>
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>
                      {record.change_type === "added"
                        ? "Thêm"
                        : record.change_type === "sold"
                        ? "Đã bán"
                        : "Trả lại"}
                    </td>
                    <td>{record.quantity}</td>
                    <td>{new Date(record.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn-red"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                  {index < filteredRecords.length - 1 && (
                    <tr>
                      <td colSpan="5">
                        <hr className="border-t border-gray-300 my-2" />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có bản ghi nào.</p>
        )}
      </div>

      {/* Form thêm bản ghi nhập kho */}
      <div>
        <h2 className="text-xl mb-4">Thêm bản ghi nhập kho</h2>
        <form onSubmit={handleAddRecord}>
          <div className="mb-4">
            <label className="block mb-2">Loại thay đổi</label>
            <select
              className="input"
              value={newRecord.change_type}
              onChange={(e) =>
                setNewRecord((prev) => ({ ...prev, change_type: e.target.value }))
              }
              required
            >
              <option value="added">Thêm</option>
              <option value="sold">Đã bán</option>
              <option value="returned">Trả lại</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Số lượng</label>
            <input
              type="number"
              className="input"
              value={newRecord.quantity}
              onChange={(e) =>
                setNewRecord((prev) => ({ ...prev, quantity: e.target.value }))
              }
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Thêm bản ghi
          </button>
        </form>
      </div>
    </Layout>
  );
}
