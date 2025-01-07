const { Sequelize, DataTypes } = require("sequelize");

// Tạo kết nối Sequelize
const sequelize = new Sequelize("ecommerce_optimized", "root", "Camtruykich123", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  logging: (sql) => console.log(sql),
});

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối đến MySQL thành công!");
  } catch (error) {
    console.error("Không thể kết nối đến MySQL:", error);
  }
})();

// Model Customer
const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  address: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING(100),
  },
  country: {
    type: DataTypes.STRING(100),
  },
  is_vip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  loyalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "customers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Model User
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM("admin", "customer"),
    defaultValue: "customer",
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Quan hệ giữa User và Customer
User.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasOne(User, { foreignKey: "customer_id", as: "user" });
// Model Category
const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "categories",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Model Product
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
  },
  loyalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "products",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Quan hệ giữa Product và Category
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

// Model ProductInventory
const ProductInventory = sequelize.define("ProductInventory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  change_type: {
    type: DataTypes.ENUM("added", "sold", "returned"),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "product_inventory",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

// Quan hệ giữa ProductInventory và Product
ProductInventory.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductInventory, { foreignKey: "product_id" });

// Model Order
const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "shipped", "completed", "cancelled"),
    defaultValue: "pending",
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "orders",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Quan hệ giữa Order và Customer
Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Order, { foreignKey: "customer_id", as: "orders" });

// Model OrderItem
const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: "order_items",
  timestamps: false,
});

// Quan hệ giữa OrderItem, Order và Product
OrderItem.belongsTo(Order, { as: "Order", foreignKey: "order_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Model Voucher
const Voucher = sequelize.define("Voucher", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  required_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Mặc định voucher không bị xóa
  },
}, {
  tableName: "vouchers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Model CustomerVoucher
const CustomerVoucher = sequelize.define("CustomerVoucher", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM("unused", "used", "expired"),
    defaultValue: "unused",
  },
}, {
  tableName: "customer_vouchers",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Quan hệ giữa CustomerVoucher, Customer, Voucher, và Order
CustomerVoucher.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(CustomerVoucher, { foreignKey: 'customer_id', as: 'customer_vouchers' });

CustomerVoucher.belongsTo(Voucher, { foreignKey: "voucher_id", as: "voucher" });
Voucher.hasMany(CustomerVoucher, { foreignKey: 'voucher_id', as: 'customer_vouchers' });

CustomerVoucher.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Order.hasMany(CustomerVoucher, { foreignKey: "order_id", as: "customer_vouchers" });

// Model CartItem
const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: "cart_items",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

// Quan hệ giữa CartItem, Customer, và Product
CartItem.belongsTo(Customer, { foreignKey: "customer_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });
Customer.hasMany(CartItem, { foreignKey: "customer_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });

// Model VipHistory
const VipHistory = sequelize.define("VipHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  promotion_reason: {
    type: DataTypes.ENUM("Top5_Monthly", "Top3_Category", "Spending_Over_Threshold"),
    allowNull: false,
  },
}, {
  tableName: "vip_history",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

// Quan hệ giữa VipHistory và Customer
VipHistory.belongsTo(Customer, { foreignKey: "customer_id" });
Customer.hasMany(VipHistory, { foreignKey: "customer_id", as: "vip_history" });

// Export các model và kết nối Sequelize
module.exports = {
  sequelize,
  Sequelize,
  Customer,
  User,
  Category,
  Product,
  ProductInventory,
  Order,
  OrderItem,
  Voucher,
  CustomerVoucher,
  CartItem,
  VipHistory,
};
