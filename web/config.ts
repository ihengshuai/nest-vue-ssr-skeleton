import type { WebConfig } from "~/typings/interfaces";

function getConfig(): WebConfig {
  const isBrowser = typeof window !== "undefined";
  const CONFIG = isBrowser ? window.__CONFIG__ : process.env;
  if (isBrowser && process.env.NODE_ENV === "production") delete window.__CONFIG__;

  return {
    env: CONFIG.DOMAIN_ENV,
    domain: CONFIG.DOMAIN,
    apiDomain: isBrowser ? CONFIG.FRONT_API_DOMAIN : CONFIG.BACK_API_DOMAIN,
    domainDevExtends: CONFIG.DOMAIN_DEV_EXTENDS,
    ajaxTimeout: 30000,
    ajaxCustomHeader: {},
    defaultLanguage: "en",
    languages: ["zh", "en", "es"],
    appLanguages: ["zh", "en", "es", "zh_cn", "ja", "ko"],
    zhHant: ["zh_tw", "zh_hk", "zh_mo"],
    compatibleLocales: ["zh", "en", "ko"],
    compatibleAppLocales: ["zh", "en", "ko", "es", "fr", "id", "ja", "pt", "th", "vi"],
    compatibleDefaultLocale: "zh",
    whiteList: [CONFIG.APPS_DOMAIN, CONFIG.EVENTS_MOBILE_DOMAIN],
    publicPath: process.env.NODE_ENV !== "development" && CONFIG.PUBLIC_PATH ? CONFIG.PUBLIC_PATH : ""
  };
}

export { getConfig };
