import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState, useMemo } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import { useSession } from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 700px 400px;
  gap: 20px;
  margin: 40px auto;
  max-width: 1200px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductInfoCell = styled.td`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  text-align: left;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductImageBox = styled.div`
  width: 80px;
  height: 80px;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const QuantityCell = styled.td`
  text-align: center;
  width: 100px;
  button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 14px;
  }
  span {
    display: inline-block;
    width: 30px;
    text-align: center;
  }
`;

const PriceCell = styled.td`
  text-align: right;
  font-weight: 600;
  font-size: 16px;
  width: 100px;
  color: #333;
`;

const TotalPriceWrapper = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  button {
    width: 300px;
    height: 50px;
    padding: 10px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
  }
`;

export default function CartPage() {
  const { data: session } = useSession();
  const { cartProducts, setCartProducts, addProduct, removeProduct } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      if (session) {
        const response = await axios.get(`/api/cart?userId=${session.user.id}`);
        setCartProducts(response.data);
        setProducts(response.data.map((item) => item.product));
        setIsLoading(false);
      }
    }
    fetchCart();
  }, [session]);

  useEffect(() => {
    async function fetchVouchers() {
      if (session) {
        const response = await axios.get(`/api/vouchers?customerId=${session.user.customer.id}`);
        setAvailableVouchers(response.data);
      }
    }
    fetchVouchers();
  }, [session]);

  const productList = useMemo(() => {
    return cartProducts
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        return product
          ? {
              ...product,
              quantity: cartItem.quantity,
            }
          : null;
      })
      .filter(Boolean);
  }, [cartProducts, products]);

  const totalPrice = useMemo(() => {
    return productList.reduce(
      (total, product) =>
        total + parseFloat(product.price) * product.quantity,
      0
    );
  }, [productList]);

  const selectedDiscount = useMemo(() => {
    if (!selectedVoucherId || !availableVouchers) {
      return 0;
    }
    const selectedVoucher = availableVouchers.find(
      (entry) => entry.voucher.id === selectedVoucherId
    );
    return selectedVoucher ? selectedVoucher.voucher.discount_value : 0;
  }, [selectedVoucherId, availableVouchers]);

  const finalPrice = totalPrice - selectedDiscount;

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post("/api/orders/add", {
        customerId: session.user.customer.id,
        cartProducts,
        totalPrice: finalPrice,
        selectedVoucherId,
      });
      if (response.data.success) {
        alert("Đặt hàng thành công! Mã đơn hàng của bạn là: " + response.data.orderId);

        // Reset giỏ hàng sau khi đặt hàng
        setCartProducts([]);
        setSelectedVoucherId(null);

        // Làm mới danh sách mã giảm giá
        const updatedVouchers = await axios.get(`/api/vouchers?customerId=${session.user.customer.id}`);
        setAvailableVouchers(updatedVouchers.data);
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Giỏ hàng</h2>
            {productList.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "60%" }}>Sản phẩm</th>
                    <th style={{ width: "20%", textAlign: "center" }}>Số lượng</th>
                    <th style={{ width: "20%", textAlign: "right" }}>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => (
                    <tr key={product.id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images?.[0]} alt={product.title} />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <QuantityCell>
                        <Button onClick={() => removeProduct(product.id)}>-</Button>
                        <span>{product.quantity}</span>
                        <Button onClick={() => addProduct(product.id)}>+</Button>
                      </QuantityCell>
                      <PriceCell>
                        ${(
                          parseFloat(product.price) * product.quantity
                        ).toFixed(2)}
                      </PriceCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Giỏ hàng trống.</p>
            )}
          </Box>

          <Box>
            <h2>Thông tin đơn hàng</h2>
            {session && session.user ? (
              <>
                <ul>
                  <li>
                    <strong>Người nhận:</strong> {session.user.customer.name || "Không có"}
                  </li>
                  <li>
                    <strong>Số điện thoại:</strong> {session.user.customer.phone || "Không có"}
                  </li>
                  <li>
                    <strong>Địa chỉ:</strong> {session.user.customer.address || "Không có"}
                  </li>
                </ul>

                <div>
                  <h3>Chọn mã giảm giá:</h3>
                  {availableVouchers.length > 0 ? (
                    <ul>
                      {availableVouchers.map((entry) => (
                        <li key={entry.voucher.id}>
                          <label>
                            <input
                              type="radio"
                              name="voucher"
                              value={entry.voucher.id}
                              checked={selectedVoucherId === entry.voucher.id}
                              onChange={() => setSelectedVoucherId(entry.voucher.id)}
                            />
                            <strong>Mã:</strong> {entry.voucher.code} <br />
                            <strong>Giảm:</strong> {entry.voucher.discount_value}$ <br />
                            <strong>Hạn:</strong> {new Date(entry.voucher.expires_at).toLocaleDateString()} <br />
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có mã giảm giá nào.</p>
                  )}
                </div>

                <TotalPriceWrapper>
                  <strong>Tổng tiền:</strong> ${totalPrice.toFixed(2)}
                </TotalPriceWrapper>
                <TotalPriceWrapper>
                  <strong>Giảm giá:</strong> -${selectedDiscount}
                </TotalPriceWrapper>
                <TotalPriceWrapper>
                  <strong>Thành tiền:</strong> ${finalPrice.toFixed(2)}
                </TotalPriceWrapper>
              </>
            ) : (
              <p>Vui lòng đăng nhập để xem thông tin người dùng.</p>
            )}
            <ButtonWrapper>
              <Button
                disabled={productList.length === 0}
                onClick={handlePlaceOrder}
              >
                Đặt hàng
              </Button>
            </ButtonWrapper>
          </Box>
        </ColumnsWrapper>
      </Center>
    </>
  );
}
