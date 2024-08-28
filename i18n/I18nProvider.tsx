"use client";

import type { i18n } from "i18next";

import { getCookie, isBrowser } from "~/lib/utils";

let client: i18n;

function I18nProvider({
  lang,
  children,
}: React.PropsWithChildren<{
  lang?: string;
}>) {
  if (!client) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw withI18nClient(lang);
  }

  return children;
}

export default I18nProvider;

async function withI18nClient(lang?: string) {
  if (isBrowser()) {
    client = await loadClientI18n(lang);
  } else {
    const { default: initialize18n } = await import("~/i18n/i18n.server");

    client = await initialize18n(lang);
  }
}

async function loadClientI18n(lang: Maybe<string>) {
  const language = lang ?? getCookie("lang");
  const { default: initialize18n } = await import("~/i18n/i18n.client");

  return initialize18n(language);
}
