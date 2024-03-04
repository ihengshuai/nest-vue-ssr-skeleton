import type { FetchParams } from "@hengshuai/ssr-types";
import { createVueI18n } from "@/common/utils/extends";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { serverExceptionKey } from "@hengshuai/ssr-hoc-vue3";
import { useConfig } from "@/common/hooks";

export default async ({ route, app, error, ctx }: FetchParams) => {
  const config = useConfig(app);

  // 获取语言列表；
  let locale: string | RouteLocationNormalizedLoaded;

  if (route.name === serverExceptionKey) {
    const path = (ctx ? ctx.request.path : route.path);
    locale = path.toLowerCase().match(/\/(zh(?:-(?:hk|tw))?|es(?:-[a-z0-9]+)?)(?:\/|$)/)?.[1]?.slice(0, 2) || config.defaultLanguage;
  } else if (route.params.locale) {
    locale = (route.params.locale as string).toLowerCase();
  } else {
    locale = route.meta.locale || config.defaultLanguage;
  }

  if (!config.languages.includes(locale as string)) {
    error({ statusCode: 404 });
    locale = config.defaultLanguage;
  }
  if (locale) await createVueI18n(locale, app);
};
