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
        return await getCustomerWithUser(req, res);
      }
      return await getCustomers(req, res);
    case "POST":
      return await createCustomer(req, res);
    case "PUT":
      return await updateCustomer(req, res);
    case "DELETE":
      return await deleteCustomer(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
