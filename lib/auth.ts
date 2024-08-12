import { redirect } from "next/navigation";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import type { DefaultSession, Session } from "next-auth";

import { db } from "~/lib/db";
import { env } from "~/lib/env";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export type AuthSession = Session | null;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google,
    Resend({
      apiKey: env.AUTH_RESEND_KEY,
      from: "no-reply@resend.dev",
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    signIn: async ({ user }) => {
      const session = await db.query.sessions.findFirst({
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
