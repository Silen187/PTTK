// import Header from "@/components/Header";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import {mongooseConnect} from "@/lib/mongoose";
// import {Product} from "@/models/Product";
// import ProductsGrid from "@/components/ProductsGrid";
// import Title from "@/components/Title";

// export default function ProductsPage({products}) {
//   return (
//     <>
//       <Header />
//       <Center>
//         <Title>All products</Title>
//         <ProductsGrid products={products} />
//       </Center>
//     </>
//   );
// }

// export async function getServerSideProps() {
//   await mongooseConnect();
//   const products = await Product.find({}, null, {sort:{'_id':-1}});
//   return {
//     props:{
//       products: JSON.parse(JSON.stringify(products)),
//     }
//   };
// }



import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { Product } from "@/lib/sequelize";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";

export default function ProductsPage({ products }) {
  return (
    <>
      <Center>
        <Header />
        <Title>Tất cả sản phẩm</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  try {
    // Truy vấn tất cả sản phẩm, sắp xếp theo ID giảm dần
    const products = await Product.findAll({
      order: [["id", "DESC"]],
    });

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    console.error("Error fetching products from MySQL:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}
