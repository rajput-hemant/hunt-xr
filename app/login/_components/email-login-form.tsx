import React from "react";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { Email } from "~/lib/validations/auth";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Trans } from "~/components/ui/trans";
import { EmailSchema } from "~/lib/validations/auth";

export const EmailLoginForm: React.FC<{
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ disabled, setDisabled }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const form = useForm<Email>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  async function handleSubmit(data: Email) {
    setIsLoading(true);
    setDisabled(true);

    const signInResult = await signIn("resend", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: from ?? "/onboarding",
    });

    setIsLoading(false);
    setDisabled(false);

    if (!signInResult?.ok) {
      return toast.error(t("auth:emailSigninErrorTitle"), {
        description: t("auth:emailSigninErrorDescription"),
      });
    }

    return toast.success(t("auth:emailSigninSuccessTitle"), {
      description: t("auth:emailSigninSuccessDescription"),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground" />
                  <Input
                    {...field}
                    type="email"
                    disabled={isLoading || disabled}
                    autoComplete="email"
                    placeholder="johndoe@example.com"
                    className="px-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button block disabled={disabled} loading={isLoading}>
          <Trans i18nKey="auth:sendLoginLink" />
        </Button>
      </form>
    </Form>
  );
};
