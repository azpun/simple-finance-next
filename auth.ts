import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      // ini adalah nama provider
      name: "Credentials",
      // ini adalah bagian credentials yang akan ditampilkan pada halaman login
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      // ini adalah bagian callback yang akan dijalankan saat user melakukan login
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error("Email atau password salah");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) {
          throw new Error("Email atau Password salah");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullname,
        };
      },
    }),
  ],

  // ini adalah opsi untuk mengatur session pada next-auth
  session: {
    strategy: "jwt",
  },

  // ini adalah opsi untuk mengatur callback pada next-auth untuk mengambil data user
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },

    // ini adalah opsi untuk mengatur callback pada next-auth untuk mengambil data session
    async session({ session, token }) {
      if (token) {
        session.userId = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
});

export { handlers as GET, handlers as POST };
