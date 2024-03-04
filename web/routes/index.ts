import { createRouter as create, createWebHistory, createMemoryHistory } from "vue-router";
import type { VueRouterOptions, CustomCreateVueRouter } from "@hengshuai/ssr-plugin-vue3";
import type { FetchParamsBase } from "@hengshuai/ssr-types";
import { configKey } from "@/common/utils/symbol";
import { getConfig } from "@/config";

export { default as Layout } from "@/layouts/index.vue";
export { default as App } from "@/layouts/App.vue";

export async function createRouter(options: VueRouterOptions, { ctx, app }: FetchParamsBase): Promise<CustomCreateVueRouter> {
  const base = options?.base ?? "/";
  const host = __isBrowser__ ? window.location.host : ctx.request.hostname;

  console.log(host);

  const config = getConfig();
  app.provide(configKey, config);

  const scheme = "apps";

  let routes = (await import(/* webpackChunkName: "[request]-router" */ `@/routes/${scheme}`)).default;
  routes = typeof routes === "function" ? routes(config) : routes;

  const router = create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    routes
  });

  return {
    router,
    routes,
    scheme
  };
}
