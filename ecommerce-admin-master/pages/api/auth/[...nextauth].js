import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sequelize, User } from "@/lib/sequelize";

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
        const user = await User.findOne({ where: { username } });

        if (!user || password !== user.password) {
          console.error("Tên đăng nhập hoặc mật khẩu không đúng");
          return null;
        }

        // Kiểm tra vai trò
        if (user.role !== "admin") {
          console.error("Bạn không có quyền");
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
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
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
