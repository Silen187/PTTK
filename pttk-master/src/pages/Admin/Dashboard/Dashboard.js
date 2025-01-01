import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../../api/dashboardService';
import './dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentOrders(),
          dashboardService.getTopProducts()
        ]);

        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
        setTopProducts(productsRes.data);
      } catch (err) {
        setError('Error loading dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Tổng quan</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tổng đơn hàng</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Doanh thu</h3>
          <p className="stat-value">{stats.totalRevenue.toLocaleString()}đ</p>
        </div>
        <div className="stat-card">
          <h3>Khách hàng</h3>
          <p className="stat-value">{stats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>Sản phẩm</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="recent-orders">
          <h2>Đơn hàng gần đây</h2>
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.total.toLocaleString()}đ</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/orders" className="view-all">Xem tất cả</Link>
        </div>

        <div className="top-products">
          <h2>Sản phẩm bán chạy</h2>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={product.id} className="product-item">
                <span className="product-rank">#{index + 1}</span>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>Đã bán: {product.sold}</p>
                  <p>Doanh thu: {product.revenue.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;