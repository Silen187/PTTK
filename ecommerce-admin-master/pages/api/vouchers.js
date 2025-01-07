import {
  getVouchers,
  getVoucherDetails,
  addVoucherToCustomer,
  deleteVoucher,
  createVoucher,
} from "@/controllers/voucherController";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.id) {
        return await getVoucherDetails(req, res);
      }
      return await getVouchers(req, res);
    case "POST":
      return await createVoucher(req, res);
    case "PUT":
      return await addVoucherToCustomer(req, res);
    case "DELETE":
      return await deleteVoucher(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
