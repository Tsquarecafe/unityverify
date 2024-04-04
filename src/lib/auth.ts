import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { credentialValidator } from "./validators/credentials";
import bcrypt from "bcrypt";
import { CustomError } from "./customError";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 72000,
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { email, password } = credentialValidator.parse(credentials);

        const user = await db.user.findFirst({
          where: {
            email,
          },
        });

        if (!user || !user.password)
          throw new CustomError({
            name: "Error in Sign In",
            message: "Either User does not exist or Auth is through google",
            status: 400,
          });

        // Compare user passowrd
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          throw new CustomError({
            name: "Unauthorized",
            message:
              "Incorrect Password entered, Please put in the correct password",
            status: 401,
          });
        }

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update") {
        token = { ...session, token };
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) token.id = user?.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        type: dbUser.type,
        accountBalance: dbUser.accountBalance,
        agentBonus: dbUser.agentBonus,
      };
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.type = token.type;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
