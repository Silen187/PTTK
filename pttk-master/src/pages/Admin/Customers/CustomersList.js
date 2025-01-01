import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { customerService } from '../../../api/customerService';
import './CustomersList.css';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (err) {
      setError('Error loading customers: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        setLoading(true);
        await customerService.delete(id);
        await loadCustomers();
      } catch (err) {
        setError('Error deleting customer: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1 className="title">Danh sách khách hàng</h1>
        <Link to="/admin/customers/create" className="btn-add">
          Thêm khách hàng
        </Link>
      </div>

      {customers.length === 0 ? (
        <p>Không có khách hàng nào</p>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th className="column">ID</th>
              <th className="column">Tên</th>
              <th className="column">Email</th>
              <th className="column">Số điện thoại</th>
              <th className="column">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="cell">{customer.id}</td>
                <td className="cell">{customer.name}</td>
                <td className="cell">{customer.email}</td>
                <td className="cell">{customer.phone}</td>
                <td className="actions">
                  <Link
                    to={`/admin/customers/edit/${customer.id}`}
                    className="btn-edit"
                  >
                    Sửa
                  </Link>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomersList;
