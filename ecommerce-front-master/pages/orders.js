import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const OrdersContainer = styled.div`
  margin-top: 20px;
`;

const OrderBox = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const OrderDetails = styled.div`
  margin-top: 10px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const VoucherDetails = styled.div`
  margin-top: 10px;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background-color: #45a049;
  }
`;

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      axios
        .get(`/api/orders?customerId=${session.user.customer.id}`)
        .then((response) => {
          setOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        });
    }
  }, [session]);

  const handleConfirmReceived = async (orderId) => {
    try {
      const response = await axios.post(`/api/orders/confirm-received`, {
        orderId,
        customerId: session.user.customer.id,
      });

      if (response.data.success) {
        alert("Đơn hàng đã được xác nhận!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "completed" } // Cập nhật trạng thái đơn hàng
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <Center>
        <p>Đang tải danh sách đơn hàng...</p>
      </Center>
    );
  }

  if (!orders.length) {
    return (
      <>
        <Header />
        <Center>
          <p>Bạn chưa có đơn hàng nào.</p>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <OrdersContainer>
          <h2>Danh sách đơn hàng</h2>
          {orders.map((order) => (
            <OrderBox key={order.id}>
              <p>
                <strong>ID Đơn hàng:</strong> {order.id}
              </p>
              <p>
                <strong>Tổng tiền:</strong> ${parseFloat(order.totalPrice).toFixed(2)}
              </p>
              <p>
                <strong>Trạng thái:</strong> {order.status}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {/* Mã giảm giá được sử dụng */}
              {order.vouchers && order.vouchers.length > 0 ? (
                <VoucherDetails>
                  <p>
                    <strong>Mã giảm giá:</strong>{" "}
                    {order.vouchers[0].voucher?.code || "Không có"}
                  </p>
                  <p>
                    <strong>Giảm giá:</strong> -{order.vouchers[0].voucher?.discountValue || 0}$
                  </p>
                </VoucherDetails>
              ) : (
                <p>Không sử dụng mã giảm giá.</p>
              )}

              <OrderDetails>
                <h4>Chi tiết đơn hàng:</h4>
                {order.items.map((item) => (
                  <OrderItem key={item.productId}>
                    <span>{item.product.title}</span>
                    <span>
                      {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </OrderItem>
                ))}
              </OrderDetails>

              {/* Nút xác nhận đã nhận hàng */}
              {order.status === "pending" && (
                <ConfirmButton onClick={() => handleConfirmReceived(order.id)}>
                  Đã nhận hàng
                </ConfirmButton>
              )}
            </OrderBox>
          ))}
        </OrdersContainer>
      </Center>
    </>
  );
}
