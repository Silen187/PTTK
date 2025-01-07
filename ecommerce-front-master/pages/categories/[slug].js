// pages/category/[slug].js

import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import ProductsGrid from "@/components/ProductsGrid";
import { Product, Category } from "@/lib/sequelize2";

export default function CategoryPage({ products, categoryName }) {
  return (
    <>
      <Center>
        <Header />
        <Title>{categoryName}</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const category = await Category.findOne({ where: { name: slug } });
  const products = await Product.findAll({ where: { category_id: category.id } });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categoryName: slug,
    },
  };
}