// /pages/orders/create.js
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";

export default function CreateOrder() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
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

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

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
    calculateTotalPrice(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const calculateTotalPrice = (updatedItems) => {
    const total = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    setTotalPrice(total);
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
          <Select
            options={customers.map((customer) => ({
              value: customer.id,
              label: customer.name,
            }))}
            onChange={(selectedOption) => setCustomerId(selectedOption.value)}
            placeholder="Tìm kiếm khách hàng..."
          />
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
        <button type="button" className="btn-default mb-4" onClick={handleAddItem}>
          Thêm Sản Phẩm
        </button>
        <div className="mb-4">
          <p className="text-lg">
            Tổng Tiền Đơn Hàng: <span className="font-bold">{totalPrice.toFixed(2)}$</span>
          </p>
        </div>
        <button type="submit" className="btn-primary">
          Tạo Đơn Hàng
        </button>
      </form>
    </Layout>
  );
}
