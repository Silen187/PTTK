import { Product, Category } from "@/lib/sequelize2";

export const handleGet = async (req, res) => {
  try {
    if (req.query?.id) {
      // Lấy thông tin một sản phẩm theo ID
      const product = await Product.findOne({
        where: { id: req.query.id, deleted: false },
        include: [{ model: Category, as: "category" }], // Bao gồm thông tin danh mục
      });

      if (!product) {
        return res.status(404).json({ error: "Sản phẩm không tồn tại" });
      }

      res.json(product);
    } else {
      // Lấy danh sách tất cả sản phẩm (không bị xóa)
      const products = await Product.findAll({
        where: { deleted: false },
        include: [{ model: Category, as: "category" }],
      });
      res.json(products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Không thể lấy danh sách sản phẩm" });
  }
};

export const handlePost = async (req, res) => {
  try {
    // Tạo một sản phẩm mới
    const newProduct = await Product.create(req.body);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Lỗi khi tạo sản phẩm" });
  }
};

export const handlePut = async (req, res) => {
  try {
    const { id } = req.query;

    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);

    if (!product || product.deleted) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    // Cập nhật thông tin sản phẩm
    await product.update(req.body);

    res.json({ success: true, message: "Cập nhật sản phẩm thành công!" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
  }
};

export const handleDelete = async (req, res) => {
  try {
    const { id } = req.query;

    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);

    if (!product || product.deleted) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    // Đánh dấu sản phẩm là đã bị xóa
    await product.update({ deleted: true });

    res.json({ success: true, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
  }
};
