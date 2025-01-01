import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";

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
  console.log(orders[0]);
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
            </OrderBox>
          ))}
        </OrdersContainer>
      </Center>
    </>
  );
}