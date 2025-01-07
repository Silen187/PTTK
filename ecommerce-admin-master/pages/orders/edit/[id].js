// /pages/orders/edit/[id].js
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";

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

        setCustomerId(fetchedOrder.customer_id || "");
        setItems(
          fetchedOrder.items?.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })) || []
        );
        setStatus(fetchedOrder.status || "pending");

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index][field] = value;

      if (field === "productId") {
        const selectedProduct = products.find(
          (product) => product.id === parseInt(value)
        );
        if (selectedProduct) {
          updatedItems[index].price = selectedProduct.price;
        }
      }

      return updatedItems;
    });
  };

  const handleRemoveItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
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
    } catch (err) {
      console.error("Error updating order:", err);
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
          <input
            type="text"
            className="input"
            value={customers.find((customer) => customer.id === customerId)?.name || ""}
            disabled
          />
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
              <Select
                options={products.map((product) => ({
                  value: product.id,
                  label: `${product.title} - ${product.price}$`,
                }))}
                value={products
                  .map((product) => ({
                    value: product.id,
                    label: `${product.title} - ${product.price}$`,
                  }))
                  .find((option) => option.value === item.productId) || null}
                onChange={(selectedOption) =>
                  handleItemChange(index, "productId", selectedOption.value)
                }
                placeholder="Tìm kiếm sản phẩm..."
              />
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
