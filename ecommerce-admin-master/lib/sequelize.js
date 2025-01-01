
const { Sequelize, DataTypes } = require('sequelize');

// Tạo kết nối Sequelize
const sequelize = new Sequelize("ecommerce", "root", "Camtruykich123", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  logging: (sql) => {
    console.log(sql); 
  }
}
);

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối đến MySQL thành công!");
  } catch (error) {
    console.error("Không thể kết nối đến MySQL:", error);
  }
})();

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'customer'),
    defaultValue: 'customer',
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users', // Chỉ định tên bảng
  timestamps: true,   // Bật timestamps nếu cần
  createdAt: 'created_at', // Tên cột timestamps trong database
  updatedAt: 'updated_at', // Tên cột timestamps trong database
});


// Model Customer
const Customer = sequelize.define('Customer', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.TEXT,
  },
  city: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  createdAt: 'created_at', // Tên cột trong database
  updatedAt: 'updated_at', // Tên cột trong database
});

// User có khóa ngoại customer_id tham chiếu đến id của Customer
User.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasOne(User, { foreignKey: 'customer_id', as: 'user' });


// Model Category
const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT,
  },
}, {
  tableName: 'categories', 
  timestamps: true, // Khai báo timestamps ở đây
  createdAt: 'created_at', 
  updatedAt: 'updated_at' 
});

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
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
  categoryId: { // Nếu bạn muốn đổi tên trường này thành category_id
    type: DataTypes.INTEGER,
    // field: 'category_id' // Đổi tên trường thành category_id trong database
  },
  deleted: { // Ánh xạ thành TINYINT(1)
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: 'updated_at'  
});

Product.belongsTo(Category, { foreignKey: "categoryId", as: 'category' });

// Model Order
const Order = sequelize.define(
  "Order",
  {
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Không để trống
    },
    status: {
      type: Sequelize.ENUM("pending", "paid", "shipped", "completed", "cancelled"),
      defaultValue: "pending",
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "orders", // Tên bảng trong cơ sở dữ liệu
    timestamps: true, // Kích hoạt timestamps
    createdAt: "created_at", // Đặt lại tên cột createdAt
    updatedAt: "updated_at", // Đặt lại tên cột updatedAt
  }
);

Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

// Model OrderItem
const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'order_items', // Tên bảng trong cơ sở dữ liệu
  timestamps: false, // Tắt timestamps
});

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Model LoyaltyPoint
const LoyaltyPoint = sequelize.define("LoyaltyPoint", {
  totalPoints: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

LoyaltyPoint.belongsTo(Customer, { foreignKey: "customerId" });

// Model Voucher
const Voucher = sequelize.define("Voucher", {
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  discountValue: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  requiredPoints: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

// Model CustomerVoucher
const CustomerVoucher = sequelize.define("CustomerVoucher", {
  status: {
    type: Sequelize.ENUM("unused", "used", "expired"),
    defaultValue: "unused",
  },
});

CustomerVoucher.belongsTo(Customer, { foreignKey: "customerId" });
CustomerVoucher.belongsTo(Voucher, { foreignKey: "voucherId" });
CustomerVoucher.belongsTo(Order, { foreignKey: "orderId" });

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Tên bảng users
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products', // Tên bảng products
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'cart_items', // Chỉ định tên bảng trong CSDL
  timestamps: true, // Sử dụng cột `createdAt` và `updatedAt`
  createdAt: 'created_at', // Tên cột createdAt trong CSDL
  updatedAt: 'updated_at', // Tên cột updatedAt trong CSDL
});


User.hasMany(CartItem, { foreignKey: 'user_id' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  User,
  Customer,
  Category,
  Product,
  Order,
  OrderItem,
  LoyaltyPoint,
  Voucher,
  CustomerVoucher,
  CartItem
};
