import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const VoucherContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const VoucherBox = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default function VouchersPage() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const { data: session } = useSession();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy danh sách voucher còn hạn sử dụng
    axios
      .get("/api/vouchers/vouchers")
      .then((response) => {
        setVouchers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vouchers:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    async function fetchLoyaltyPoints() {
      if (session?.user?.customer?.id) {
        try {
          const response = await axios.get(`/api/customers/points?customerId=${session.user.customer.id}`);
          setLoyaltyPoints(response.data.loyalty_points);
        } catch (error) {
          console.error("Error fetching loyalty points:", error);
        }
      }
    }
    fetchLoyaltyPoints();
  }, [session]);

  const handlePurchase = async (voucherId) => {
    if (!session) {
      alert("Bạn cần đăng nhập để mua voucher.");
      return;
    }

    try {
      const response = await axios.post("/api/vouchers/purchase", {
        customerId: session.user.customer.id,
        voucherId,
      });

      if (response.data.success) {
        alert("Mua voucher thành công!");
      } else {
        alert(response.data.error || "Không thể mua voucher.");
      }
    } catch (error) {
      console.error("Error purchasing voucher:", error);
      alert("Đã xảy ra lỗi khi mua voucher.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Center>
          <p>Đang tải danh sách voucher...</p>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <h2>Danh sách Voucher</h2>
        <VoucherContainer>
          {vouchers.map((voucher) => (
            <VoucherBox key={voucher.id}>
              <p>
                <strong>Mã:</strong> {voucher.code}
              </p>
              <p>
                <strong>Giảm giá:</strong> ${voucher.discount_value}
              </p>
              <p>
                <strong>Điểm cần thiết:</strong> {voucher.required_points}
              </p>
              <p>
                <strong>Hạn sử dụng:</strong>{" "}
                {new Date(voucher.expires_at).toLocaleDateString()}
              </p>
              <Button
                onClick={() => handlePurchase(voucher.id)}
                disabled={
                    loyaltyPoints < voucher.required_points
                }
              >
                Mua Voucher
              </Button>
            </VoucherBox>
          ))}
        </VoucherContainer>
      </Center>
    </>
  );
}
