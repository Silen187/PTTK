import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,     // Địa chỉ MySQL (thường là localhost hoặc IP)
  user: process.env.MYSQL_USER,     // Tên người dùng MySQL
  password: process.env.MYSQL_PASSWORD, // Mật khẩu
  database: process.env.MYSQL_DATABASE, // Tên cơ sở dữ liệu
  waitForConnections: true,
  connectionLimit: 10,              // Giới hạn số kết nối
});

export default pool;
