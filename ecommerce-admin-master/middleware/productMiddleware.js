import { Product, Category, sequelize } from "@/lib/sequelize";

export const handleGet = async (req, res) => {
    try {
        if (req.query?.id) {
            const product = await Product.findOne({
                where: { id: req.query.id },
                include: [{ model: Category, as: 'category' }]
            });
            if (!product) {
                return res.status(404).json({ error: "Sản phẩm không tồn tại" });
            }
            res.json(product);
        } else {
            const products = await Product.findAll({
                where: { deleted: false },
                include: [{ model: Category, as: 'category' }]
            });
            res.json(products);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Không thể lấy sản phẩm" });
    }
};

export const handlePost = async (req, res) => {
    try {
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
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }
        await product.update(req.body);
        res.json(true);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
    }
};

export const handleDelete = async (req, res) => {
    try {
        const { id } = req.query;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }
        await product.update({ deleted: true });
        res.json(true);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
    }
};