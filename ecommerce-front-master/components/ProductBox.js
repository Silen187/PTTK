// import styled from "styled-components";
// import Button from "@/components/Button";
// import CartIcon from "@/components/icons/CartIcon";
// import Link from "next/link";
// import {useContext} from "react";
// import {CartContext} from "@/components/CartContext";

// const ProductWrapper = styled.div`
  
// `;

// const WhiteBox = styled(Link)`
//   background-color: #fff;
//   padding: 20px;
//   height: 120px;
//   text-align: center;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 10px;
//   img{
//     max-width: 100%;
//     max-height: 80px;
//   }
// `;

// const Title = styled(Link)`
//   font-weight: normal;
//   font-size:.9rem;
//   color:inherit;
//   text-decoration:none;
//   margin:0;
// `;

// const ProductInfoBox = styled.div`
//   margin-top: 5px;
// `;

// const PriceRow = styled.div`
//   display: block;
//   @media screen and (min-width: 768px) {
//     display: flex;
//     gap: 5px;
//   }
//   align-items: center;
//   justify-content:space-between;
//   margin-top:2px;
// `;

// const Price = styled.div`
//   font-size: 1rem;
//   font-weight:400;
//   text-align: right;
//   @media screen and (min-width: 768px) {
//     font-size: 1.2rem;
//     font-weight:600;
//     text-align: left;
//   }
// `;

// export default function ProductBox({id,title,description,price,images}) {
//   const {addProduct} = useContext(CartContext);
//   const url = '/product/'+id;
//   return (
//     <ProductWrapper>
//       <WhiteBox href={url}>
//         <div>
//           <img src={images?.[0]} alt=""/>
//         </div>
//       </WhiteBox>
//       <ProductInfoBox>
//         <Title href={url}>{title}</Title>
//         <PriceRow>
//           <Price>
//             ${price}
//           </Price>
//           <Button block onClick={() => addProduct(id)} primary outline>
//             Thêm vào giỏ
//           </Button>
//         </PriceRow>
//       </ProductInfoBox>
//     </ProductWrapper>
//   );
// }

import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";

const ProductWrapper = styled.div`
  
`;

// const WhiteBox = styled(Link)`
//   background-color: #fff;
//   text-align: center;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;


// const ImageContainer = styled.div`
//   width: 150px; 
//   height: 150px; 
//   overflow: hidden; 
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   /* Áp dụng object-fit: fill cho thẻ img bên trong ImageContainer */
//   img {
//     object-fit: fill;
//     width: 100%; /* Đảm bảo ảnh lấp đầy container */
//     height: 100%; /* Đảm bảo ảnh lấp đầy container */
//   }
// `;


const WhiteBox = styled(Link)`
  background-color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  width: 150px; /* Đặt chiều rộng cố định */
  height: 150px; /* Đặt chiều cao cố định */
  overflow: hidden; /* Ẩn phần ảnh tràn ra ngoài container */
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%; /* Ảnh sẽ bao phủ toàn bộ chiều rộng của container */
    height: 100%; /* Ảnh sẽ bao phủ toàn bộ chiều cao của container */
    object-fit: cover; /* Giữ tỷ lệ khung hình và cắt ảnh nếu cần */
  }
`;




const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Thêm dấu "..." khi chữ bị tràn */
  margin: 10px 0; /* Thêm khoảng cách trên dưới tiêu đề */
  max-width: 180px; /* Giới hạn chiều rộng của tiêu đề */
  display: block; /* Bắt buộc để thuộc tính ellipsis hoạt động */
`;


const ProductInfoBox = styled.div`
  
`;

const PriceRow = styled.div`
  display: flex; 
  flex-direction: column; /* Xếp chồng các phần tử theo chiều dọc */
  align-items: left; 
  gap: 5px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
`;

export default function ProductBox({id, title, description, price, images, loyalty_points}) {
  const {addProduct} = useContext(CartContext);
  const url = '/product/' + id;

  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <ImageContainer>
          <img src={images?.[0]} alt={title} />
        </ImageContainer>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow> 
          <Price>
            ${price}
          </Price>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>+{loyalty_points} điểm</span>
          <Button block onClick={() => addProduct(id)} primary outline>
            Thêm vào giỏ
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
