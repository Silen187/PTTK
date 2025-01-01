import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User, Customer } from '@/lib/sequelize'; // Import models

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
                attributes: ['id', 'name', 'email', 'phone', 'address', 'city', 'country'],
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

          // Trả về thông tin đầy đủ
          return {
            id: user.id,
            name: user.username,
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
      // Gắn thông tin người dùng vào session
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
  secret: '18072003',
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
  },
  jwt: {
    secret: '18072003',
  },
  pages: {
    signIn: '/account', // Trang đăng nhập
  },
});
