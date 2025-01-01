// import {mongooseConnect} from "@/lib/mongoose";
// import {Product} from "@/models/Product";

// export default async function handle(req,res) {
//   await mongooseConnect();
//   const ids = req.body.ids;
//   res.json(await Product.find({_id:ids}));
// }

import { sequelize, Product } from "@/lib/sequelize";

export default async function handle(req, res) {
  try {
    // Đảm bảo kết nối cơ sở dữ liệu
    await sequelize.authenticate();

    // Lấy danh sách IDs từ body
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid or missing 'ids' parameter" });
    }

    // Truy vấn danh sách sản phẩm từ MySQL
    const products = await Product.findAll({
      where: {
        id: ids, // Sequelize sẽ tìm các sản phẩm có id trong mảng ids
      },
    });

    // Trả dữ liệu về client
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
