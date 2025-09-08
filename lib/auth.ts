import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.is_active) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.loginTime = Date.now();
      }

      // Check if session has expired (1 week = 604800000 ms)
      if (token.loginTime && Date.now() - token.loginTime > 604800000) {
        return null; // This will force logout
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = String(token.sub);
        session.user.role = token.role as string;
        session.user.loginTime = token.loginTime;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  events: {
    async signOut() {
      // Custom logout logic can be added here if needed
    },
  },
};
