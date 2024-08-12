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
