import { fetchDashboardData } from "@/controllers/dashboardController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await fetchDashboardData(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
