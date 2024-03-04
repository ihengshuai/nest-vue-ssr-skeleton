import { DEFAULT_ROUTE } from "./route.enum";
import { Route } from "@hengshuai/ssr-types";
import { serverExceptionKey } from "@hengshuai/ssr-hoc-vue3";
import { RouteMeta } from "vue-router";

const webPage = async () => await import(/* webpackChunkName: "default-index" */ "@/views/default/web.vue");
const serverExceptionPage = async () => await import(/* webpackChunkName: "default-view" */ "@/views/default/exception.vue");

export function createDefaultRoutes(children: Array<Route<RouteMeta>>, defaultMeta?: RouteMeta): Array<Route<RouteMeta>> {
  return [
    {
      path: "/:locale?",
      name: DEFAULT_ROUTE.index,
      component: webPage,
      children,
      meta: {
        ...defaultMeta
      }
    },
    {
      path: "/:pathMatch(.*)*",
      name: serverExceptionKey,
      component: serverExceptionPage,
      meta: {
        name: "default-view"
      }
    }
  ];
}
