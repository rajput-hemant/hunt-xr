import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the keys of the given object
 * @param obj The object to get the keys of
 * @returns The keys of the given object
 */
export function getTypedKeys<T extends object>(obj: T) {
  return Object.keys(obj) as UnionToTuple<keyof T>;
}

export function getErrorMessage(error: unknown): string {
  let message = "";

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "An unknown error occurred";
  }

  return message;
}

export function isBrowser() {
  return typeof window !== "undefined";
}

export function getCookie(name: string) {
  const cookieDict = document.cookie
    .split(";")
    .map((x) => x.split("="))
    .reduce(
      (accum, current) => {
        accum[current[0]!.trim()] = current[1]!;
        return accum;
      },
      {} as Record<string, string>,
    );

  return cookieDict[name];
}

export function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    expires?: Date;
    sameSite?: "strict" | "lax" | "none";
    httpOnly?: boolean;
  } = {
    path: "/",
    sameSite: "lax",
    expires: undefined,
    httpOnly: false,
  },
) {
  let cookieText = `${name}=${value};`;

  if (options.path) {
    cookieText += ` Path=${options.path};`;
  }

  if (options.expires) {
    cookieText += ` Expires=${options.expires.toUTCString()};`;
  }

  if (options.sameSite) {
    cookieText += ` SameSite=${options.sameSite};`;
  }

  if (options.httpOnly) {
    cookieText += ` HttpOnly;`;
  }

  document.cookie = cookieText;
}
