import parsePhoneNumber from "libphonenumber-js";
import { z } from "zod";

export const EmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type Email = z.infer<typeof EmailSchema>;

export const PhoneNumberSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .transform((value, ctx) => {
      const phoneNumber = parsePhoneNumber(value.toString(), {
        defaultCountry: "US",
      });

      if (!phoneNumber?.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid phone number",
        });
        return z.NEVER;
      }

      return phoneNumber.formatInternational();
    }),
});

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;

export const OTPSchema = z.object({
  otp: z.string().min(6, {
    message: "Please enter a valid OTP",
  }),
});

export type OTP = z.infer<typeof OTPSchema>;

export const VerifyOTPSchema = z.object({
  phoneNumber: PhoneNumberSchema.shape.phoneNumber,
  otp: OTPSchema.shape.otp,
});

export type VerifyOTP = z.infer<typeof VerifyOTPSchema>;
