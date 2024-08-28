import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import type { FileRouter } from "uploadthing/next";

import { auth } from "~/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await auth();

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!session) throw new UploadThingError("Unauthorized");

      return { user: session.user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.user.name, file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
