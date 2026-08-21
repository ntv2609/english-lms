import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  // FIX LỖI OAUTH: Thêm fallback cứng để mã hóa luôn thành công
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET || "enggo_super_secret_key_123_456_789",
};

export default NextAuth(authOptions);