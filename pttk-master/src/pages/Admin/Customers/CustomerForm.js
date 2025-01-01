import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { customerService } from "../../../api/customerService";
import './CustomersList.css';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Move loadCustomer inside useEffect to avoid dependency issues
  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await customerService.getById(id);
        setFormData(response.data);
      } catch (err) {
        setError('Error loading customer: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]); // Now id is the only dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (id) {
        await customerService.update(id, formData);
      } else {
        await customerService.create(formData);
      }
      
      navigate("/admin/customers");
    } catch (err) {
      setError('Error saving customer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{id ? "Sửa Thông Tin Khách Hàng" : "Thêm Khách Hàng"}</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : (id ? "Cập Nhật" : "Thêm Mới")}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
