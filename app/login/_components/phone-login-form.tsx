import "~/node_modules/flag-icons/css/flag-icons.min.css";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { useForm } from "react-hook-form";

import type { CountryCode } from "libphonenumber-js";

import type { OTPLogin, PhoneNumberLogin } from "~/lib/validations/auth";

import Button from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import If from "~/components/ui/if";
import { Input } from "~/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { OTPLoginSchema, PhoneNumberLoginSchema } from "~/lib/validations/auth";

export const PhoneLoginForm: React.FC<{
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ disabled, setDisabled: _ }) => {
  const [isLoading, _setIsLoading] = React.useState(false);
  const [isOTPSent, setIsOTPSent] = React.useState(false);

  const phoneform = useForm<PhoneNumberLogin>({
    resolver: zodResolver(PhoneNumberLoginSchema),
    defaultValues: {
      countryCode: "US",
      phoneNumber: "",
    },
  });

  const otpform = useForm<OTPLogin>({
    resolver: zodResolver(OTPLoginSchema),
    defaultValues: { otp: "" },
  });

  const getCountryCode = getCountryCallingCode(
    phoneform.watch().countryCode as CountryCode,
  );

  function handlePhoneSubmit(data: PhoneNumberLogin) {
    console.log(data);

    setIsOTPSent(true);
  }

  function handleOTPSubmit(data: OTPLogin) {
    console.log(data);
  }

  return (
    <If
      condition={isOTPSent}
      fallback={
        <Form {...phoneform}>
          <form
            onSubmit={phoneform.handleSubmit(handlePhoneSubmit)}
            className="space-y-2"
          >
            <div className="flex w-full items-center gap-2">
              <FormField
                name="countryCode"
                control={phoneform.control}
                render={({ field }) => (
                  <FormItem className="mb-auto">
                    <FormControl>
                      <Select defaultValue="US" onValueChange={field.onChange}>
                        <SelectTrigger
                          disabled={disabled || isLoading}
                          className="w-24 space-x-2"
                        >
                          <SelectValue>
                            <span
                              className={cn(
                                "fi mr-2",
                                `fi-${field.value.toLowerCase()}`,
                              )}
                            />
                            {field.value}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            {getCountries().map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="phoneNumber"
                control={phoneform.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative">
                        <p className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                          +{getCountryCode}
                        </p>
                        <Input
                          {...field}
                          disabled={disabled || isLoading}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="123 456 7890"
                          className={cn(
                            "px-8",
                            getCountryCode.length === 2 && "pl-10",
                            getCountryCode.length === 3 && "pl-12",
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-[-85px]" />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={disabled} loading={isLoading} className="w-full">
              Send OTP
            </Button>
          </form>
        </Form>
      }
    >
      <Form {...otpform}>
        <form
          onSubmit={otpform.handleSubmit(handleOTPSubmit)}
          className="space-y-2"
        >
          <FormField
            control={otpform.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex items-center justify-around">
                <p className="mt-2 text-lg font-medium">Enter OTP:</p>
                <FormControl>
                  <InputOTP
                    {...field}
                    disabled={disabled || isLoading}
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    autoComplete="one-time-code"
                    className="w-"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={disabled} loading={isLoading} className="w-full">
            Verify OTP
          </Button>
        </form>
      </Form>
    </If>
  );
};
