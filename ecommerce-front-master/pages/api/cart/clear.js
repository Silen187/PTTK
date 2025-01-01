import { CartItem } from "@/lib/sequelize";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    try {
      await CartItem.destroy({ where: { user_id: userId } });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
