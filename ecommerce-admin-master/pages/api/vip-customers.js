import {
  getVipCustomers,
  getVipCustomerDetails,
  updateVipList,
  createVoucherForVip,
  promoteToVip,
  removeVipStatus,
} from "@/controllers/vipController";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.id) {
        return await getVipCustomerDetails(req, res);
      }
      return await getVipCustomers(req, res);
    case "POST":
      const { action } = req.body;
      if (action === "update_vip_list") {
        return await updateVipList(req, res);
      } else if (action === "create_voucher") {
        return await createVoucherForVip(req, res);
      } else if (action === "promote_to_vip") {
        return await promoteToVip(req, res);
      }
      res.status(400).json({ error: "Invalid action" });
      break;
    case "DELETE":
      return await removeVipStatus(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
