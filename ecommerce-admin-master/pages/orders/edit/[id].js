import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditOrder() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [orderRes, customerRes, productRes] = await Promise.all([
          axios.get(`/api/orders?id=${id}`),
          axios.get("/api/customers"),
          axios.get("/api/products"),
        ]);

        const fetchedOrder = orderRes.data;

        setOrder(fetchedOrder);
        setCustomers(customerRes.data);
        setProducts(productRes.data);

        // Populate form fields
        setCustomerId(fetchedOrder.customer_id);
        setItems(
          fetchedOrder.items.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }))
        );
        setStatus(fetchedOrder.status);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "productId") {
      const selectedProduct = products.find(
        (product) => product.id === parseInt(value)
      );
      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.price;
      }
    }

    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedOrder = { id, customerId, items, status };
      const response = await axios.put(`/api/orders`, updatedOrder);

      if (response.status === 200) {
        alert("Cập nhật đơn hàng thành công!");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Không thể cập nhật đơn hàng!");
    }
  };

  if (loading) {
    return <Layout>Đang tải thông tin đơn hàng...</Layout>;
  }

  if (!order) {
    return <Layout>Không tìm thấy đơn hàng</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Sửa Đơn Hàng #{order.id}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Khách Hàng</label>
          <select
            className="input"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Chọn Khách Hàng --
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Trạng Thái</label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Chờ xử lý</option>
            <option value="paid">Đã thanh toán</option>
            <option value="shipped">Đã vận chuyển</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <h2 className="text-xl mb-4">Sản Phẩm</h2>
        {items.map((item, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <div className="mb-2">
              <label className="block mb-2">Sản Phẩm</label>
              <select
                className="input"
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", e.target.value)
                }
                required
              >
                <option value="" disabled>
                  -- Chọn Sản Phẩm --
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title} - {product.price}$
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-2">Số Lượng</label>
              <input
                type="number"
                className="input"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", parseInt(e.target.value))
                }
                min="1"
                required
              />
            </div>
            <p className="text-gray-600 text-sm">
              Tổng giá: {(item.quantity * item.price || 0).toFixed(2)}$
            </p>
            <button
              type="button"
              className="btn-red"
              onClick={() => handleRemoveItem(index)}
            >
              Xóa Sản Phẩm
            </button>
          </div>
        ))}
        <button type="submit" className="btn-primary">
          Cập Nhật Đơn Hàng
        </button>
      </form>
    </Layout>
  );
}
