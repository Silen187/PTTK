import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User, Customer } from "@/lib/sequelize2";

export const authOptions = {
  secret: "18072003", // Để demo, không bảo mật cao
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Tên đăng nhập", type: "text" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        // Tìm người dùng theo username
        const user = await User.findOne({
          where: { username, deleted: false }, // Chỉ lấy người dùng chưa bị xóa
          include: [
            {
              model: Customer,
              as: "customer",
              attributes: ["id", "name", "email", "loyalty_points", "is_vip"],
            },
          ],
        });

        if (!user || password !== user.password) {
          console.error("Tên đăng nhập hoặc mật khẩu không đúng");
          return null;
        }

        // Trả về thông tin người dùng nếu xác thực thành công
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          customer: user.customer,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.customer = user.customer; // Thêm thông tin customer
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          customer: token.customer, // Thêm thông tin customer vào session
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  session: {
    strategy: "jwt", // Sử dụng JSON Web Tokens cho session
  },
};

export default NextAuth(authOptions);
