import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { productService } from '../../../api/productService';
import './products.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Error loading products: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setLoading(true);
        await productService.delete(productId);
        await loadProducts(); // Reload the products list after deletion
      } catch (err) {
        setError('Error deleting product: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="title">Danh sách sản phẩm</h1>
        <Link to="/admin/products/create" className="btn-add">
          Thêm sản phẩm
        </Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th className="column">ID</th>
            <th className="column">Tên sản phẩm</th>
            <th className="column">Giá</th>
            <th className="column">Danh mục</th>
            <th className="column">Tồn kho</th>
            <th className="column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="cell">{product.id}</td>
              <td className="cell">{product.name}</td>
              <td className="cell">{product.price.toLocaleString()}đ</td>
              <td className="cell">{product.category}</td>
              <td className="cell">{product.stock}</td>
              <td className="actions">
                <Link to={`/admin/products/edit/${product.id}`} className="btn-edit">
                  Sửa
                </Link>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;