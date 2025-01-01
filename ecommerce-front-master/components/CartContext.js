// import {createContext, useEffect, useState} from "react";

// export const CartContext = createContext({});

// export function CartContextProvider({children}) {
//   const ls = typeof window !== "undefined" ? window.localStorage : null;
//   const [cartProducts,setCartProducts] = useState([]);
//   useEffect(() => {
//     if (cartProducts?.length > 0) {
//       ls?.setItem('cart', JSON.stringify(cartProducts));
//     }
//   }, [cartProducts]);
//   useEffect(() => {
//     if (ls && ls.getItem('cart')) {
//       setCartProducts(JSON.parse(ls.getItem('cart')));
//     }
//   }, []);
//   function addProduct(productId) {
//     setCartProducts(prev => [...prev,productId]);
//   }
//   function removeProduct(productId) {
//     setCartProducts(prev => {
//       const pos = prev.indexOf(productId);
//       if (pos !== -1) {
//         return prev.filter((value,index) => index !== pos);
//       }
//       return prev;
//     });
//   }
//   function clearCart() {
//     setCartProducts([]);
//   }
//   return (
//     <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart}}>
//       {children}
//     </CartContext.Provider>
//   );
// }

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const { data: session } = useSession(); // Lấy thông tin người dùng từ session
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  // State quản lý giỏ hàng
  const [cartProducts, setCartProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Lấy giỏ hàng từ backend khi người dùng đăng nhập
  useEffect(() => {
    async function fetchCart() {
      if (session?.user?.id) {
        try {
          console.log("Fetching cart for userID:", session.user.id);
          const response = await axios.get(`/api/cart?userId=${session.user.id}`);
          setCartProducts(response.data || []); // Đồng bộ giỏ hàng từ backend
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching cart from database:", error);
        }
      } else {
        setCartProducts([]); // Reset giỏ hàng nếu người dùng đăng xuất
        setIsLoggedIn(false);
      }
    }

    fetchCart();
  }, [session]);

  // Đồng bộ giỏ hàng với localStorage
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts));
    } else {
      ls?.removeItem("cart"); // Xóa giỏ hàng trong localStorage nếu trống
    }
  }, [cartProducts]);

  // Hàm thêm sản phẩm vào giỏ hàng
  async function addProduct(productId) {
    if (isLoggedIn && session?.user?.id) {
      try {
        const response = await axios.post("/api/cart/add", {
          userId: session.user.id,
          productId,
          quantity: 1,
        });

        if (response.data.success) {
          const { productId, quantity } = response.data;
          // Cập nhật giỏ hàng
          setCartProducts((prev) => {
            const existingItem = prev.find((item) => item.productId === productId);
            if (existingItem) {
              // Cập nhật số lượng nếu sản phẩm đã tồn tại
              return prev.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: quantity }
                  : item
              );
            } else {
              // Thêm sản phẩm mới nếu chưa tồn tại
              return [...prev, { productId, quantity }];
            }
          });
        }        
        
      } catch (error) {
        console.error("Error adding product to backend cart:", error);
      }
    } else {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
    }
  }
  

  // Hàm xóa sản phẩm khỏi giỏ hàng
  async function removeProduct(productId) {
    if (isLoggedIn && session?.user?.id) {
      try {
        const response = await axios.post("/api/cart/remove", { userId: session.user.id, productId });
  
        if (response.data.success) {
          const { cartItem } = response.data;
          // Nếu số lượng = 0, xóa sản phẩm khỏi giỏ hàng
          if (cartItem.quantity === 0) {
            setCartProducts((prev) => prev.filter((item) => item.productId !== productId));
          } else {
            // Cập nhật số lượng sản phẩm
            setCartProducts((prev) =>
              prev.map((item) =>
                item.productId === productId ? { ...item, quantity: cartItem.quantity } : item
              )
            );
          }
        } else {
          console.error("Error: ", response.data.message);
        }
      } catch (error) {
        console.error("Error removing product from backend cart:", error);
      }
    } else {
      // Nếu không đăng nhập, xử lý giỏ hàng cục bộ
      setCartProducts((prev) => prev.filter((item) => item.product_id !== productId));
    }
  }

  // Hàm xóa toàn bộ giỏ hàng
  async function clearCart() {
    if (isLoggedIn && session?.user?.id) {
      try {
        await axios.post("/api/cart/clear", { userId: session.user.id });
        setCartProducts([]);
      } catch (error) {
        console.error("Error clearing backend cart:", error);
      }
    } else {
      setCartProducts([]);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        clearCart,
        setIsLoggedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


