import { redirect } from "next/navigation";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Passkey from "next-auth/providers/passkey";
import Resend from "next-auth/providers/resend";

import type { DefaultSession, Session } from "next-auth";

import { db } from "~/lib/db";
import { env } from "~/lib/env";

import { verifyOtp } from "./actions/auth";
import { User } from "./db/schema";
import { VerifyOTPSchema } from "./validations/auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      phoneNumber?: string | undefined;
    };
  }

  interface User {
    phoneNumber?: string | undefined;
  }
}

export type AuthSession = Session | null;
export type AuthUser = Session["user"] & { id: string };

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  experimental: { enableWebAuthn: true },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Google,
    Passkey,
    Resend({
      apiKey: env.AUTH_RESEND_KEY,
      from: env.RESEND_SMTP_FROM,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = VerifyOTPSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { phoneNumber, otp } = validatedFields.data;

          const { data } = await verifyOtp({ phoneNumber, otp });

          if (data) {
            const [user] = await db
              .insert(User)
              .values({ phoneNumber })
              .onConflictDoNothing()
              .returning();

            if (user) {
              return {
                id: user.id,
                phoneNumber: user.phoneNumber!,
              };
            }
          } else {
            return null;
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    signIn: async ({ user }) => {
      const session = await db.query.Session.findFirst({
        where: ({ userId }, { eq }) => eq(userId, user.id!),
      });

      if (session) return "?error=AlreadySignedIn";

      return true;
    },

    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
});

export const checkAuth = async () => {
  const session = await auth();

  if (!session) redirect("/login");
};
