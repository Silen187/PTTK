

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User, Customer, VipHistory, CustomerVoucher, Voucher } from '@/lib/sequelize2'; // Import models

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Tên đăng nhập", type: "text", placeholder: "Tên đăng nhập" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        if (!username || !password) {
          throw new Error("Vui lòng nhập đầy đủ thông tin đăng nhập.");
        }

        try {
          // Tìm người dùng và thông tin khách hàng
          const user = await User.findOne({
            where: { username },
            include: [
              {
                model: Customer,
                as: 'customer',
                attributes: [
                  'id', 'name', 'email', 'phone', 'address', 'city', 'country',
                  'is_vip', 'loyalty_points', 'deleted',
                ],
                include: [
                  {
                    model: VipHistory,
                    as: 'vip_history',
                    attributes: ['id', 'promotion_reason', 'created_at'],
                  },
                  {
                    model: CustomerVoucher,
                    as: 'customer_vouchers', // Alias phải khớp với định nghĩa
                    attributes: ['id', 'status', 'created_at'],
                    required: false, // Đảm bảo kết quả trả về ngay cả khi không có voucher nào thỏa mãn
                    where: { status: 'unused' }, // Chỉ lấy voucher chưa sử dụng
                    include: [
                      {
                        model: Voucher,
                        as: 'voucher', // Alias phải khớp với định nghĩa
                        attributes: ['id', 'code', 'discount_value', 'expires_at'],
                      },
                    ],
                  },
                ],
              },
            ],
          });

          if (!user) {
            throw new Error("Tên đăng nhập không tồn tại.");
          }

          // So sánh mật khẩu trực tiếp (chỉ dành cho demo)
          if (password !== user.password) {
            throw new Error("Sai mật khẩu.");
          }

          if (user.deleted) {
            throw new Error("Tài khoản của bạn đã bị vô hiệu.");
          }
          // Trả về thông tin người dùng nếu xác thực thành công
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            customer: user.customer,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error('Lỗi đăng nhập:', error);
          throw new Error(error.message || "Đăng nhập thất bại.");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Lưu thông tin người dùng trong token
      }
      return token;
    },
  },
  secret: '18072003', // Khóa bảo mật cho JWT
  session: {
    strategy: 'jwt', // Sử dụng JWT cho phiên đăng nhập
    maxAge: 60*60, // 30 ngày
  },
  jwt: {
    secret: '18072003', // Khóa bảo mật cho JWT
  },
  pages: {
    signIn: '/account', // Trang đăng nhập
  },
});

