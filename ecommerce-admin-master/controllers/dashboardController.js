import { getDashboardData } from "@/middleware/dashboardMiddleware";

export const fetchDashboardData = async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Unable to fetch dashboard data" });
  }
};
