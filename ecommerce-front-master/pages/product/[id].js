import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import { sequelize, Product } from "@/lib/sequelize2";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>(+{product.loyalty_points} điểm)</span>
              </div>
              
              <div>
                <Button primary onClick={() => addProduct(product.id)}>
                  <CartIcon /> Thêm vào giỏ
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}


export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    // Kết nối cơ sở dữ liệu
    await sequelize.authenticate();

    // Truy vấn sản phẩm từ MySQL
    const product = await Product.findByPk(id);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)), // Chuyển dữ liệu sản phẩm sang JSON
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    return {
      notFound: true,
    };
  }
}
