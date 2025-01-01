import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../../api/orderService';
import './order.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll();
      const orders = response.data;
      const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status.toLowerCase() === statusFilter);
      setOrders(filteredOrders);
    } catch (err) {
      setError('Error loading orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]); // Add statusFilter as dependency

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="title">Quản lý đơn hàng</h1>
        <div className="filters">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th className="column">Mã đơn</th>
            <th className="column">Khách hàng</th>
            <th className="column">Ngày đặt</th>
            <th className="column">Tổng tiền</th>
            <th className="column">Trạng thái</th>
            <th className="column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="cell">#{order.id}</td>
              <td className="cell">{order.customerName}</td>
              <td className="cell">{order.orderDate}</td>
              <td className="cell">{order.total.toLocaleString()}đ</td>
              <td className="cell">
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td className="cell">
                <Link to={`/admin/orders/${order.id}`} className="btn-view">
                  Xem chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;