import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerWithUser,
} from "@/controllers/customerController";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.id) {
        return await getCustomerWithUser(req, res); // Lấy thông tin Customer + User
      }
      return await getCustomers(req, res); // Lấy danh sách Customer
    case "POST":
      return await createCustomer(req, res); // Tạo mới Customer
    case "PUT":
      return await updateCustomer(req, res); // Cập nhật Customer
    case "DELETE":
      return await deleteCustomer(req, res); // Xóa Customer
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
