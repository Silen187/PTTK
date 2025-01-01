import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";

const StyledHeader = styled.header`
  background-color: #222;
  position: fixed; /* Cố định header */
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
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const StyledNav = styled.nav`
  display: flex; /* Sắp xếp ngang */
  align-items: center;
  gap: 15px; /* Khoảng cách giữa các tab */
  white-space: nowrap; /* Không cho phép xuống dòng */
  // overflow-x: auto; /* Thêm thanh cuộn ngang nếu cần */
  
  @media screen and (max-width: 768px) {
    display: ${(props) => (props.mobileNavActive ? "block" : "none")};
    position: fixed;
    top: 70px; /* Dưới header cố định */
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
  padding: 10px 15px; /* Khoảng cách bên trong tab */
  font-size: 0.9rem; /* Điều chỉnh kích thước chữ */
  white-space: nowrap; /* Không cho phép xuống dòng */
  &:hover {
    color: #fff; /* Thay đổi màu khi hover */
  }

  @media screen and (max-width: 768px) {
    display: block; /* Hiển thị dọc trên mobile */
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
  height: 70px; /* Chiều cao của header để tránh nội dung bị che */
`;

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" },
  { id: 4, name: "Home & Garden" },
  { id: 5, name: "Beauty & Personal Care" },
  { id: 6, name: "Sports & Outdoors" },
];

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);

  return (
    <>
      <StyledHeader>
        <Center>
          <Wrapper>
            <Logo href={"/"}>N8-MiniMarket</Logo>
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
              <NavLink href={"/account"}>Tài khoản</NavLink>
              <NavLink href={"/cart"}>
                Giỏ hàng (
                {cartProducts.reduce((sum, item) => sum + item.quantity, 0)})
              </NavLink>
              <NavLink href="/orders">Đơn hàng</NavLink>
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
