import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../../api/orderService';
import './order.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(id);
      setOrder(response.data);
    } catch (err) {
      setError('Error loading order: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await orderService.updateStatus(id, newStatus);
      await loadOrder(); // Reload order after status update
    } catch (err) {
      setError('Error updating status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-details-container">
      <h2 className="title">Chi tiết đơn hàng #{order.id}</h2>
      
      <div className="order-info">
        <div className="info-section">
          <h3>Thông tin khách hàng</h3>
          <p><strong>Tên:</strong> {order.customerName}</p>
          <p><strong>Số điện thoại:</strong> {order.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
        </div>
        
        <div className="info-section">
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Ngày đặt:</strong> {order.orderDate}</p>
          <p>
            <strong>Trạng thái:</strong>
            <select 
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={loading}
            >
              <option value="PENDING">Chờ xử lý</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </p>
        </div>
      </div>

      <div className="order-items">
        <h3>Sản phẩm</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.price.toLocaleString()}đ</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toLocaleString()}đ</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Tổng cộng</strong></td>
              <td><strong>{order.total.toLocaleString()}đ</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;