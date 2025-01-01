import { User, Customer } from '@/lib/sequelize'; // Import models

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password, name, phone, address, city, country } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !email || !password || !name || !phone || !address || !city || !country) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  try {
    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    // Tạo thông tin khách hàng trong bảng customers
    const newCustomer = await Customer.create({
      name,
      email, // Truyền email vào đây
      phone,
      address,
      city,
      country,
    });

    // Tạo thông tin người dùng trong bảng users và liên kết với customer_id
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'customer', // Vai trò mặc định là "customer"
      customer_id: newCustomer.id, // Liên kết với ID của khách hàng vừa tạo
    });

    return res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role, // Trả về vai trò của người dùng
      },
      customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        city: newCustomer.city,
        country: newCustomer.country,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
  }
}
