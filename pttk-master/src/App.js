import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomersList from "./pages/Admin/Customers/CustomersList";
import CustomerForm from "./pages/Admin/Customers/CustomerForm";
import ProductsList from "./pages/Admin/Products/ProductsList";
import ProductForm from "./pages/Admin/Products/ProductForm";
import OrdersList from "./pages/Admin/Orders/OrdersList";
import OrderDetails from "./pages/Admin/Orders/OrderDetails";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg p-4">
          <div className="container mx-auto flex gap-4">
            <Link to="/admin" className="text-xl font-bold">
              Dashboard
            </Link>
            <Link to="/admin/customers" className="text-xl font-bold">
              Quản lý khách hàng
            </Link>
            <Link to="/admin/products" className="text-xl font-bold">
              Quản lý sản phẩm
            </Link>
            <Link to="/admin/orders" className="text-xl font-bold">
              Quản lý đơn hàng
            </Link>
          </div>
        </nav>
        
        <main className="container mx-auto mt-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/customers" element={<CustomersList />} />
            <Route path="/admin/customers/create" element={<CustomerForm />} />
            <Route path="/admin/customers/edit/:id" element={<CustomerForm />} />
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/products/create" element={<ProductForm />} />
            <Route path="/admin/products/edit/:id" element={<ProductForm />} />
            <Route path="/admin/orders" element={<OrdersList />} />
            <Route path="/admin/orders/:id" element={<OrderDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;