import { Product, ProductInventory } from "@/lib/sequelize2";

// Lấy danh sách bản ghi nhập kho theo sản phẩm
export const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.query;

    const inventoryRecords = await ProductInventory.findAll({
      where: { product_id: productId },
      order: [["created_at", "DESC"]],
    });

    res.json(inventoryRecords);
  } catch (error) {
    console.error("Error fetching inventory records:", error);
    res.status(500).json({ error: "Không thể lấy danh sách nhập kho" });
  }
};

// Thêm bản ghi nhập kho
export const createInventoryRecord = async (req, res) => {
  try {
    const { product_id, change_type, quantity } = req.body;

    const newRecord = await ProductInventory.create({
      product_id,
      change_type,
      quantity,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating inventory record:", error);
    res.status(500).json({ error: "Không thể tạo bản ghi nhập kho" });
  }
};

// Sửa bản ghi nhập kho
export const updateInventoryRecord = async (req, res) => {
  try {
    const { id } = req.query;
    const { change_type, quantity } = req.body;

    const record = await ProductInventory.findByPk(id);

    if (!record) {
      return res.status(404).json({ error: "Bản ghi nhập kho không tồn tại" });
    }

    await record.update({ change_type, quantity });
    res.json(record);
  } catch (error) {
    console.error("Error updating inventory record:", error);
    res.status(500).json({ error: "Không thể cập nhật bản ghi nhập kho" });
  }
};

// Xóa bản ghi nhập kho
export const deleteInventoryRecord = async (req, res) => {
  try {
    const { id } = req.query;

    const record = await ProductInventory.findByPk(id);

    if (!record) {
      return res.status(404).json({ error: "Bản ghi nhập kho không tồn tại" });
    }

    await record.destroy();
    res.json({ success: true, message: "Xóa bản ghi nhập kho thành công!" });
  } catch (error) {
    console.error("Error deleting inventory record:", error);
    res.status(500).json({ error: "Không thể xóa bản ghi nhập kho" });
  }
};
