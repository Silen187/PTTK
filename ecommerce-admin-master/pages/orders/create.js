import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CreateOrder() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch customers and products
    const fetchData = async () => {
      try {
        const [customerRes, productRes] = await Promise.all([
          axios.get("/api/customers"),
          axios.get("/api/products"),
        ]);
        setCustomers(customerRes.data);
        setProducts(productRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Thêm sản phẩm vào danh sách
  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  // Cập nhật thông tin sản phẩm
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Tự động cập nhật giá khi chọn sản phẩm
    if (field === "productId") {
      const selectedProduct = products.find(
        (p) => p.id === parseInt(value)
      );
      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.price;
      }
    }

    setItems(updatedItems);
    calculateTotalOrderPrice(updatedItems);
  };

  // Xóa sản phẩm khỏi danh sách
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotalOrderPrice(updatedItems);
  };

  // Tính tổng tiền đơn hàng
  const calculateTotalOrderPrice = (updatedItems) => {
    const total = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setTotalOrderPrice(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = { customerId, items };
      const response = await axios.post("/api/orders", orderData);

      if (response.status === 201) {
        alert("Đơn hàng đã được tạo thành công!");
        router.push("/orders");
      }
    } catch (error) {
      alert("Không thể tạo đơn hàng!");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Tạo Đơn Hàng Mới</h1>
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
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                Tổng Tiền:{" "}
                <span className="font-bold">
                  {(item.quantity * item.price || 0).toFixed(2)}$
                </span>
              </p>
            </div>
            <button
              type="button"
              className="btn-red"
              onClick={() => handleRemoveItem(index)}
            >
              Xóa Sản Phẩm
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-default mb-4"
          onClick={handleAddItem}
        >
          Thêm Sản Phẩm
        </button>
        <div className="mb-4">
          <p className="text-lg">
            Tổng Tiền Đơn Hàng:{" "}
            <span className="font-bold">{totalOrderPrice?.toFixed(2)}$</span>
          </p>
        </div>
        <button type="submit" className="btn-primary">
          Tạo Đơn Hàng
        </button>
      </form>
    </Layout>
  );
}
