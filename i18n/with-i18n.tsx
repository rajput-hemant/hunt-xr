import getLanguageCookie from "~/i18n/get-language-cookie";
import initializeServerI18n from "~/i18n/i18n.server";

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

export function withI18n<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  return async function I18nServerComponentWrapper(params: Params) {
    await initializeServerI18n(getLanguageCookie());

    return <Component {...params} />;
  };
}
