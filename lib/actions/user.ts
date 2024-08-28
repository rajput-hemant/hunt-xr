"use server";

import { eq } from "drizzle-orm";

import type { AuthUser } from "../auth";

import { auth } from "../auth";
import { db } from "../db";
import { User } from "../db/schema";
import { getErrorMessage } from "../utils";

export async function updateUser(user: Partial<AuthUser>) {
  const session = await auth();

  if (!session) {
    return {
      error: "User not authenticated",
    };
  }

  try {
    const [updatedUser] = await db
      .update(User)
      .set(user)
      .where(eq(User.id, session.user.id))
      .returning();

    if (updatedUser) {
      return {
        data: updatedUser,
      };
    } else {
      return {
        error: "User not found",
      };
    }
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
