"use client";

import React from "react";
import Image from "next/image";

import { Edit } from "lucide-react";
import { toast } from "sonner";

import type { FormEvent } from "react";

import type { AuthUser } from "~/lib/auth";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { SubHeading } from "~/components/ui/subheading";
import { TextField } from "~/components/ui/textfield";
import { Trans } from "~/components/ui/trans";
import { UploadButton } from "~/lib/uploadthing";

export type InfoStepData = Partial<AuthUser>;

export const InfoStep: React.FCC<{
  onSubmit: (data: InfoStepData) => void;
}> = ({ onSubmit }) => {
  const [image, setImage] = React.useState<string | null>(null);

  const handleFormSubmit = React.useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const phoneNumber = data.get("phoneNumber") as string;

      onSubmit({
        name,
        email,
        phoneNumber,
      });
    },
    [onSubmit],
  );

  function editImage() {
    setImage(null);

    // TODO: delete uploaded image
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex w-full flex-1 flex-col space-y-8"
    >
      <div className="flex flex-col space-y-2">
        <Heading type={1}>
          <Trans i18nKey="onboarding:setupAccount.title" />
        </Heading>

        <SubHeading className="text-base">
          <Trans i18nKey="onboarding:setupAccount.description" />
        </SubHeading>
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        {!image ?
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              container: {
                position: "relative",
                width: 128,
                height: 128,
                borderRadius: 100,
                backgroundColor: "#f0f0f0",
                border: "1px solid #d9d9d9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                cursor: "pointer",
                margin: "0 auto",
              },
              button: {
                backgroundColor: "transparent",
                color: "#333",
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              },
              allowedContent: {
                margin: "2.5rem 0 0 0",
              },
            }}
            onClientUploadComplete={([img]) => {
              setImage(img?.url ?? null);
            }}
            onUploadError={(error: Error) => {
              toast.error("Upload failed", {
                description: error.message,
              });
            }}
          />
        : <div className="relative mx-auto size-32 rounded-full border p-1">
            <Image
              src={image}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full object-cover"
            />

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={editImage}
            >
              <Edit className="size-5" />
            </Button>
          </div>
        }

        <TextField>
          <TextField.Label>
            Enter your name
            <TextField.Input
              required
              name="name"
              autoComplete="name"
              placeholder="John Doe"
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            Enter your email
            <TextField.Input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="john@acme.corp"
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            Enter your Phone Number
            <TextField.Input
              required
              type="tel"
              name="phoneNumber"
              autoComplete="tel"
              placeholder="+1 123 456 7890"
            />
          </TextField.Label>
        </TextField>
      </div>

      <Button type="submit">
        <Trans i18nKey="common:continue" />
      </Button>
    </form>
  );
};
