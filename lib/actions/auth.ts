"use server";

import { and, eq, lt } from "drizzle-orm";
import twilio from "twilio";

import type { PhoneNumber } from "../validations/auth";

import { db } from "../db";
import { VerificationTokens } from "../db/schema";
import { env } from "../env";
import { getErrorMessage } from "../utils";

export async function sendVerificationCode({ phoneNumber }: PhoneNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000);

  const [dbVerificationToken] = await db
    .insert(VerificationTokens)
    .values({
      identifier: phoneNumber,
      token: otp.toString(),
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })
    .returning();

  if (!dbVerificationToken) {
    return {
      error: "Failed to create verification token",
    };
  }

  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

  try {
    const message = await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return {
      data: message.sid,
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

type OTP = PhoneNumber & { otp: string };

export async function verifyOtp({ phoneNumber, otp }: OTP) {
  const dbVerificationToken = await db.query.VerificationTokens.findFirst({
    where: ({ identifier, token, expires }, { eq, gt, and }) =>
      and(eq(identifier, phoneNumber), eq(token, otp), gt(expires, new Date())),
  });

  if (!dbVerificationToken) {
    return {
      error: "Invalid verification code",
    };
  }

  const [deletedVerificationToken] = await db
    .delete(VerificationTokens)
    .where(
      and(
        eq(VerificationTokens.identifier, phoneNumber),
        lt(VerificationTokens.expires, new Date()),
      ),
    )
    .returning();

  if (!deletedVerificationToken) {
    console.error("Failed to delete verification token");
  }

  return {
    data: {
      phoneNumber,
    },
  };
}
