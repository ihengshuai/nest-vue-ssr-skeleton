import { useConfig, useHttpClient } from "@/common/hooks";
/* 与业务强关联的工具包 */
import { RouteLocationNormalizedLoaded } from "vue-router";
import { createI18n, useI18n } from "vue-i18n";
import { App, computed, getCurrentInstance, nextTick, Ref } from "vue";
import { ISSRContext } from "@hengshuai/ssr-types";
import { WebConfig } from "~/typings/interfaces";

export function isCustomLangRoute(route: RouteLocationNormalizedLoaded) {
  return route.matched.some(item => item.meta?.customLang !== undefined);
}

export function setI18nLanguage(locale: string, app: App): string {
  useHttpClient(app).axiosInstance.defaults.headers["x-locale"] = locale;
  (app.config.globalProperties.$i18n as any).locale.value = locale;
  return locale;
}

export function setI18nLanguageForRoute(locale: string, app: App) {
  const i18n = app.config.globalProperties.$i18n as any;
  if (i18n.locale.value !== locale) {
    nextTick(() => ((app.config.globalProperties.$i18n as any).locale.value = locale));
  }
}

export function setHttpClientLocale(locale: string, app: App): string {
  useHttpClient(app).axiosInstance.defaults.headers["x-locale"] = locale;
  return locale;
}

export async function loadLanguageAsync(locale: string, app: App): Promise<string> {
  const i18n = app.config.globalProperties.$i18n as any;
  return i18n.availableLocales.includes(locale)
    ? Promise.resolve(i18n.locale.value !== locale
      ? setI18nLanguage(locale, app)
      : setHttpClientLocale(locale, app))
    : import(/* webpackChunkName: "[request]-locale" */ `@/i18ns/${locale}.json`).then((msgs) => {
      i18n.setLocaleMessage(locale, msgs.default);
      // setI18nLanguageForRoute(locale, app);
      return setI18nLanguage(locale, app);
    });
}

export function localeFormatter(locale: string) {
  return locale?.toLowerCase().replace(/-/g, "_");
}

export function localePrettier(locale: string) {
  return locale?.replace(/"/g, "").replace(/[_-]([^_-]+)/g, ($0, $1) => "-" + $1.toUpperCase());
}

export async function createVueI18n(locale: string | RouteLocationNormalizedLoaded, app: App) {
  const lang = localeFormatter(typeof locale === "string" ? locale : locale.params.locale as string);
  const config = useConfig(app);
  useHttpClient(app).axiosInstance.defaults.headers["x-locale"] = lang;

  if (typeof locale !== "string") {
    locale = appDetailLocalHandler(config, locale);
  }

  const preloadLocales = [locale];
  locale !== config.defaultLanguage && preloadLocales.push(config.defaultLanguage);

  const messages = await Promise.all(preloadLocales.map(async locale => (await import(/* webpackChunkName: "[request]-locale" */ `@/i18ns/${locale as string}.json`)).default));

  const i18n = createI18n({
    // 默认配置
    locale,
    messages: messages.reduce((messages, message, index) => {
      messages[preloadLocales[index]] = message;
      return messages;
    }, {}),
    globalInjection: true,
    // 模式锁定，传统模式SSR有bug
    legacy: false
  });

  app.use(i18n);
  app.config.globalProperties.$i18n = i18n.global as any;
}

export function appDetailLocalHandlerCore(config: WebConfig, locale: string) {
  locale = localeFormatter(locale);
  locale = /^zh/.test(locale) ? config.zhHant.includes(locale) ? "zh" : "zh_cn" : locale;

  if (locale !== config.defaultLanguage) {
    if (locale !== "zh_cn") {
      locale = locale.substring(0, 2);
    }

    if (locale !== config.defaultLanguage && !config.appLanguages.includes(locale)) {
      locale = config.defaultLanguage;
    }
  }

  return locale;
}

export function appDetailLocalHandler(config: WebConfig, route: RouteLocationNormalizedLoaded) {
  const locale = route.params.locale as string;

  if (locale) {
    return appDetailLocalHandlerCore(config, locale);
  } else {
    return config.defaultLanguage;
  }
}

export function getLocaleCore(config: WebConfig, locale: string): string {
  return config.languages.includes(locale) ? locale === config.defaultLanguage ? undefined : locale : undefined;
}

export function getLocale(): string {
  const { locale } = useI18n();
  const config = useConfig();
  return getLocaleCore(config, locale.value);
}

// 预约参数特殊处理
export function getSubscribeLocale(): any {
  const { locale } = useI18n();
  const config = useConfig();
  return computed(() => config.languages.includes(locale.value) ? locale.value === config.defaultLanguage ? undefined : locale.value : undefined);
}

export function getServerLocale(app: App): string {
  const { locale } = app.config.globalProperties.$i18n;
  const config = useConfig(app);
  return getServerLocaleCore(config, (locale as unknown as Ref<string>).value);
}

export function getServerLocaleCore(config: WebConfig, locale: string): string {
  return config.languages.includes(locale) ? locale === config.defaultLanguage ? undefined : locale : undefined;
}

export function getHost(): string {
  return __isBrowser__ ? window.location.host : (getCurrentInstance().appContext.app._props.ctx as ISSRContext).request.hostname;
}

export function getServerHost(app: App): string {
  return __isBrowser__ ? window.location.host : (app._props.ctx as ISSRContext).request.hostname;
}

export function parseHost(config: WebConfig, host: string, isWhiteList?: boolean, keepHost = false, customHost?: string, customLocale?: string): string {
  const _host = keepHost ? undefined : "https://" + (customHost || getHost());

  let locale = typeof customLocale === "string" ? customLocale : getLocale();
  if (typeof isWhiteList === "boolean" ? !isWhiteList : !config.whiteList.includes(host)) {
    if (!locale) {
      locale = "en";
    } else if (locale === "zh") {
      locale = "";
    } else {
      locale = "en";
    }
  } else {
    locale = locale === config.defaultLanguage ? "" : locale;
  }

  return (keepHost ? host : (host === _host ? "" : host)) + (locale ? "/" + locale : "");
}

export function parseLink(config: WebConfig, url: string): string {
  return url?.replace(/^(https?:\/\/(?:[^/]*\.)?qoo-app\.com)(.*)/, ($0, $1, $2) => parseHost(config, $1) + $2);
}

export function parseServerHost(host: string, app: App, appendRoot?: boolean): string {
  const config = useConfig(app);
  const _host = "https://" + getServerHost(app);
  const locale = getServerLocale(app) || config.defaultLanguage;
  return parseHost(config, host, undefined, true, _host, locale);
}

export function splitDot(str: string): Array<string> {
  if (!str) return [];
  return str.split(",").filter(item => item.length);
};

/**
 * 用戶主頁的路徑
 */
export function userPagerLink(config: WebConfig, userId: string) {
  if (!userId) return;
  return parseHost(config, config.userDomain) + "/" + userId;
}

export function isQooappLink(link: string): boolean {
  return /^(https?:\/\/([^/]*\.)?qoo-app\.com|\/)/.test(link);
}

export function openLinkTarget(link: string): string {
  return isQooappLink(link) ? "_self" : "_blank";
}

export function highText(str: string, key: string, isRecommend?: boolean, color: string = "#00c6e6"): string {
  if (!key?.length || !str || isRecommend) return str;
  let rs = "";
  while (str.length) {
    const start = str.toLowerCase().indexOf(key.toLowerCase());
    if (start > -1) {
      const end = start + key.length;
      rs += str.substring(0, start);
      rs += `<span style='color:${color}'>${str.substring(start, end)}</span>`;
      str = str.substring(end);
    } else {
      rs += str;
      str = "";
    }
  }
  return rs;
};
