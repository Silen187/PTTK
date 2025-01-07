import { Category } from "@/lib/sequelize2";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Lấy tất cả danh mục chưa bị xóa (deleted = false)
      const categories = await Category.findAll({
        attributes: ["id", "name", "description"], // Chỉ lấy các trường cần thiết
      });

      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Không thể lấy danh sách danh mục" });
    }
  } else {
    // Nếu phương thức không phải GET, trả về lỗi
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
