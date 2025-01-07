import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "@/controllers/inventoryController";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getInventory(req, res); // Lấy danh sách bản ghi nhập kho
    case "POST":
      return await createInventory(req, res); // Thêm bản ghi nhập kho
    case "PUT":
      return await updateInventory(req, res); // Cập nhật bản ghi nhập kho
    case "DELETE":
      return await deleteInventory(req, res); // Xóa bản ghi nhập kho
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
