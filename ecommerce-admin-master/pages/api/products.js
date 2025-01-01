import {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/controllers/productController";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getProduct(req, res);
    case "POST":
      return await createProduct(req, res);
    case "PUT":
      return await updateProduct(req, res);
    case "DELETE":
      return await deleteProduct(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
