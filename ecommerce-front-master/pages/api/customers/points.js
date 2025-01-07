const { Customer } = require("@/lib/sequelize2");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    try {
      const customer = await Customer.findOne({
        where: { id: customerId },
        attributes: ["loyalty_points"], // Chỉ lấy điểm thưởng
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.status(200).json({ loyalty_points: customer.loyalty_points });
    } catch (error) {
      console.error("Error fetching customer points:", error);
      return res.status(500).json({ error: "Failed to fetch customer points." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
