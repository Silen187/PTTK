import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useEffect, useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { useSession } from "next-auth/react";

const StyledHeader = styled.header`
  background-color: #222;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
  white-space: nowrap;
  margin-right: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center; /* Căn giữa nội dung theo chiều ngang */
  align-items: center; /* Căn giữa nội dung theo chiều dọc */
  padding: 20px;
  position: relative;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 15px;
  white-space: nowrap;

  @media screen and (max-width: 768px) {
    display: ${(props) => (props.mobileNavActive ? "block" : "none")};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #222;
    padding: 20px;
    gap: 20px;
  }
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  padding: 10px 15px;
  font-size: 0.9rem;

  &:hover {
    color: #fff;
  }

  @media screen and (max-width: 768px) {
    display: block;
    padding: 10px;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover .dropdown-menu {
    display: block;
  }
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #333;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 200px;

  & > li > a {
    display: block;
    padding: 10px 20px;
    color: #aaa;
    text-decoration: none;

    &:hover {
      background-color: #444;
      color: #fff;
    }
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const Spacer = styled.div`
  height: 70px;
`;

const categories = [
  { id: 1, name: "Current" },
  { id: 2, name: "Appear" },
  { id: 3, name: "Hand" },
  { id: 4, name: "Realize" },
  { id: 5, name: "Hold" },
  { id: 6, name: "Guy" },
  { id: 7, name: "Century" },
  { id: 8, name: "Republican" },
  { id: 9, name: "Small" },
  { id: 10, name: "Manager" },
  { id: 11, name: "Administration" },
  { id: 12, name: "Half" },
  { id: 13, name: "Home" },
  { id: 14, name: "Break" },
  { id: 15, name: "Try" },
  { id: 16, name: "Central" },
  { id: 17, name: "Discussion" },
  { id: 18, name: "Artist" },
  { id: 19, name: "Factor" },
  { id: 20, name: "Wait" },
];


export default function Header() {
  const { data: session } = useSession();
  const [orderCount, setOrderCount] = useState(0);
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);

  useEffect(() => {
    if (session) {
      // Gọi API để lấy số lượng đơn hàng
      fetch(`/api/orders/count?customerId=${session.user?.customer?.id}`)
        .then((response) => response.json())
        .then((data) => {
          setOrderCount(data.count || 0);
        })
        .catch((error) => {
          console.error("Error fetching order count:", error);
        });
    }
  }, [session]);

  return (
    <>
      <StyledHeader>
        <Center>
          <Wrapper>
            <Logo href={"/"}>Vic</Logo>
            <StyledNav mobileNavActive={mobileNavActive}>
              <NavLink href={"/"}>Trang chủ</NavLink>
              <NavLink href={"/products"}>Tất cả sản phẩm</NavLink>
              <DropdownContainer>
                <NavLink href={"#"} onClick={(e) => e.preventDefault()}>
                  Danh mục sản phẩm
                </NavLink>
                <DropdownMenu className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link href={`/categories/${category.name}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </DropdownMenu>
              </DropdownContainer>
              <NavLink href={"/vouchers"}>Cửa hàng Voucher</NavLink>
              <NavLink href={"/account"}>Tài khoản</NavLink>
              <NavLink href={"/cart"}>
                Giỏ hàng ({cartProducts.reduce((sum, item) => sum + item.quantity, 0)})
              </NavLink>
              <NavLink href="/orders">Đơn hàng ({orderCount})</NavLink>
            </StyledNav>
            <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
              <BarsIcon />
            </NavButton>
          </Wrapper>
        </Center>
      </StyledHeader>
      <Spacer />
    </>
  );
}



// import Link from "next/link";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import { useContext, useState } from "react";
// import { CartContext } from "@/components/CartContext";
// import BarsIcon from "@/components/icons/Bars";

// const StyledHeader = styled.header`
//   background-color: #222;
// `;
// const Logo = styled(Link)`
//   color: #fff;
//   text-decoration: none;
//   position: relative;
//   z-index: 3;
// `;
// const Wrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 20px 0;
// `;
// const StyledNav = styled.nav`
//   ${(props) =>
//     props.mobileNavActive
//       ? `display: block;`
//       : `display: none;`}
//   gap: 15px;
//   position: fixed;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   padding: 70px 20px 20px;
//   background-color: #222;
//   @media screen and (min-width: 768px) {
//     display: flex;
//     position: static;
//     padding: 0;
//   }
// `;
// const NavLink = styled(Link)`
//   display: block;
//   color: #aaa;
//   text-decoration: none;
//   padding: 10px 0;
//   cursor: pointer;

//   &:hover {
//     color: #fff; /* Thay đổi màu khi hover */
//   }

//   @media screen and (min-width: 768px) {
//     padding: 0;
//   }
// `;
// const DropdownContainer = styled.div`
//   position: relative;
//   display: inline-block;

//   &:hover .dropdown-menu {
//     display: block;
//   }
// `;
// const DropdownMenu = styled.ul`
//   display: none; /* Ẩn mặc định */
//   position: absolute;
//   top: 100%;
//   left: 0;
//   background-color: #333;
//   box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
//   z-index: 1;
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   min-width: 200px;
//   border-radius: 4px;

//   & > li > a {
//     display: block;
//     padding: 10px 20px;
//     color: #aaa;
//     text-decoration: none;

//     &:hover {
//       background-color: #444;
//       color: #fff;
//     }
//   }
// `;
// const NavButton = styled.button`
//   background-color: transparent;
//   width: 30px;
//   height: 30px;
//   border: 0;
//   color: white;
//   cursor: pointer;
//   position: relative;
//   z-index: 3;
//   @media screen and (min-width: 768px) {
//     display: none;
//   }
// `;

// const categories = [
//   { id: 1, name: "Electronics" },
//   { id: 2, name: "Books" },
//   { id: 3, name: "Clothing" },
//   { id: 4, name: "Home & Garden" },
//   { id: 5, name: "Beauty & Personal Care" },
//   { id: 6, name: "Sports & Outdoors" },
// ];

// export default function Header() {
//   const { cartProducts } = useContext(CartContext);
//   const [mobileNavActive, setMobileNavActive] = useState(false);

//   return (
//     <StyledHeader>
//       <Center>
//         <Wrapper>
//           <Logo href={"/"}>N8-MiniMarKet</Logo>
//           <StyledNav mobileNavActive={mobileNavActive}>
//             <NavLink href={"/"}>Trang chủ</NavLink>
//             <NavLink href={"/products"}>Tất cả sản phẩm</NavLink>
//             <DropdownContainer>
//               <NavLink href={"#"} onClick={(e) => e.preventDefault()}>
//                 Danh mục sản phẩm
//               </NavLink>
//               <DropdownMenu className="dropdown-menu">
//                 {categories.map((category) => (
//                   <li key={category.id}>
//                     <Link href={`/categories/${category.name}`}>
//                       {category.name}
//                     </Link>
//                   </li>
//                 ))}
//               </DropdownMenu>
//             </DropdownContainer>
//             <NavLink href={"/account"}>Tài khoản</NavLink>
//             <NavLink href={"/cart"}>
//               Giỏ hàng ({cartProducts.reduce((sum, item) => sum + item.quantity, 0)})
//             </NavLink>
//           </StyledNav>
//           <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
//             <BarsIcon />
//           </NavButton>
//         </Wrapper>
//       </Center>
//     </StyledHeader>
//   );
// }
