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
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 3fr 4fr; /* 2 cột khi trên màn hình lớn */
  }
  gap: 40px;
  margin-top: 40px;
`;

const TotalPriceWrapper = styled.div`
  text-align: center; /* Căn giữa văn bản */
  font-size: 1.2rem; /* Tăng kích thước chữ nếu cần */
  margin-top: 10px; /* Thêm khoảng cách trên nếu cần */
  color: #333; /* Màu chữ */
`;

const ButtonWrapper = styled.div`
  text-align: center; /* Căn giữa nội dung bên trong */
  margin-top: 20px; /* Khoảng cách phía trên */
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
  background-color: #f9f9f9;
  text-align: left;
  width: 250px; /* Đặt chiều rộng cố định */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

export default function CartPage() {
  const { data: session } = useSession(); // Lấy thông tin đăng nhập từ session
  const { cartProducts, setCartProducts, addProduct, removeProduct } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy giỏ hàng từ backend khi người dùng đăng nhập
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

  // Tạo danh sách sản phẩm dựa trên `cartProducts` và `products`
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
      .filter(Boolean); // Loại bỏ giá trị null
  }, [cartProducts, products]);

  // Tính tổng giá trị giỏ hàng
  const totalPrice = useMemo(() => {
    return productList.reduce(
      (total, product) =>
        total + parseFloat(product.price) * product.quantity,
      0
    );
  }, [productList]);

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post("/api/orders/add", {
        userId: session.user.id,
        customerId: session.user.customer.id,
        cartProducts,
        totalPrice,
      });

      if (response.data.success) {
        alert("Đặt hàng thành công! Mã đơn hàng của bạn là: " + response.data.orderId);
        setCartProducts([]); // Làm trống giỏ hàng sau khi đặt hàng
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
          {/* Cột hiển thị giỏ hàng */}
          <Box>
            <h2>Giỏ hàng</h2>
            {productList.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
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
                      <td>
                        <Button onClick={() => removeProduct(product.id)}>-</Button>
                        <span>{product.quantity}</span>
                        <Button onClick={() => addProduct(product.id)}>+</Button>
                      </td>
                      <td>${(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Giỏ hàng trống.</p>
            )}
          </Box>

          {/* Cột hiển thị thông tin đơn hàng */}
          <Box>
            
            <TotalPriceWrapper>
              <h2>Thông tin đơn hàng</h2>
            </TotalPriceWrapper>
            {/* Hiển thị thông tin người dùng */}
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
                  <li>
                    <strong>Thành phố:</strong> {session.user.customer.city || "Không có"}
                  </li>
                  <li>
                    <strong>Quốc gia:</strong> {session.user.customer.country || "Không có"}
                  </li>
                  <li>
                    <strong>Vai trò:</strong>{" "}
                    {session.user.role === "customer"
                      ? "Khách hàng"
                      : "Quản trị viên"}
                  </li>
                </ul>
                <TotalPriceWrapper>
                  <strong>Tổng tiền:</strong> ${totalPrice.toFixed(2)}
                </TotalPriceWrapper>
              </>
            ) : (
              <p>Vui lòng đăng nhập để xem thông tin người dùng.</p>
            )}

            <ButtonWrapper>
              <Button
                style={{ width: "60%" }}
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


// import Header from "@/components/Header";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import Button from "@/components/Button";
// import { useContext, useEffect, useState } from "react";
// import { useMemo } from "react";
// import { CartContext } from "@/components/CartContext";
// import axios from "axios";
// import Table from "@/components/Table";
// import { useSession } from "next-auth/react";

// const ColumnsWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   @media screen and (min-width: 768px) {
//     grid-template-columns: 1.2fr 0.8fr;
//   }
//   gap: 40px;
//   margin-top: 40px;
// `;

// const Box = styled.div`
//   background-color: #fff;
//   border-radius: 10px;
//   padding: 30px;
// `;

// // const ProductInfoCell = styled.td`
// //   padding: 10px 0;
  
// // `;

// const ProductInfoCell = styled.td`
//   padding: 10px 0;
//   background-color: #f9f9f9; /* Màu nền */
//   text-align: left; /* Căn nội dung bên trái */
//   width: 200px; /* Đặt chiều rộng cố định */
//   word-wrap: break-word; /* Nếu text dài, sẽ xuống dòng */
//   overflow: hidden; /* Ẩn phần nội dung bị tràn */
//   text-overflow: ellipsis; /* Hiển thị "..." nếu nội dung quá dài */
//   white-space: nowrap; /* Ngăn nội dung bị xuống dòng */
// `;

// const ProductImageBox = styled.div`
//   width: 70px;
//   height: 100px;
//   padding: 2px;
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 10px;
//   img {
//     max-width: 60px;
//     max-height: 60px;
//   }
//   @media screen and (min-width: 768px) {
//     padding: 10px;
//     width: 100px;
//     height: 100px;
//     img {
//       max-width: 80px;
//       max-height: 80px;
//     }
//   }
// `;

// export default function CartPage() {
//   const { data: session } = useSession();
//   const { cartProducts, setCartProducts, addProduct, removeProduct } = useContext(CartContext);
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCart() {
//       if (session) {
//         const response = await axios.get(`/api/cart?userId=${session.user.id}`);
//         setCartProducts(response.data);
//         setProducts(response.data.map((item) => item.product));
//         setIsLoading(false);
//       }
//     }
//     fetchCart();
//   }, [session]);

//   const productList = useMemo(() => {
//     return cartProducts
//       .map((cartItem) => {
//         const product = products.find((p) => p.id === cartItem.productId);
//         return product ? { ...product, quantity: cartItem.quantity } : null;
//       })
//       .filter(Boolean); // Loại bỏ giá trị null
//   }, [cartProducts, products]);

//   return (
//     <>
//       <Header />
//       <Center>
//         <ColumnsWrapper>
//           <Box>
//             <h2>Giỏ hàng</h2>
//             {productList.length > 0 ? (
//               <Table>
//                 <thead>
//                   <tr>
//                     <th>Sản phẩm</th>
//                     <th>Số lượng</th>
//                     <th>Giá</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {productList.map((product) => (
//                     product && (
//                       <tr key={product.id}>
//                         <ProductInfoCell>
//                           <ProductImageBox>
//                             <img src={product.images?.[0]} alt="" />
//                           </ProductImageBox>
//                           {product.title}
//                         </ProductInfoCell>
//                         <td>
//                           <Button onClick={() => removeProduct(product.id)}>-</Button>
//                           <span>{product.quantity}</span>
//                           <Button onClick={() => addProduct(product.id)}>+</Button>
//                         </td>
//                         <td>${(parseFloat(product.price) * product.quantity).toFixed(2)}</td>
//                       </tr>
//                     )
//                   ))}
//                 </tbody>
//               </Table>
//             ) : (
//               <p>Giỏ hàng trống.</p>
//             )}
//           </Box>
//         </ColumnsWrapper>
//       </Center>
//     </>
//   );
// }
