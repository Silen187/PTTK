

// pages/index.js
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/lib/sequelize2";
import NewProducts from "@/components/NewProducts";

export default function HomePage({ featuredProduct, newProducts }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = 1; 

  try {
    const featuredProduct = await Product.findByPk(featuredProductId);

    const newProducts = await Product.findAll({
      order: [["id", "ASC"]],
      limit: 10,
    });

    return {
      props: {
        featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
        newProducts: JSON.parse(JSON.stringify(newProducts)),
      },
    };
  } catch (error) {
    console.error("Error fetching data from MySQL:", error);
    return {
      props: {
        featuredProduct: null,
        newProducts: [],
      },
    };
  }
}


