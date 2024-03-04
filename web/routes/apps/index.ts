import { APP_ROUTE } from "./route.enum";
import { createDefaultRoutes } from "@/routes/default";

const appIndexPage = async () => await import(/* webpackChunkName: "app-index" */ "@/views/apps/index.vue");
const appIndexFetch = async () => await import(/* webpackChunkName: "app-index" */ "@/views/apps/index.fetch");

export default () => {
  return createDefaultRoutes([
    {
      name: APP_ROUTE.index,
      path: "",
      component: appIndexPage,
      fetch: appIndexFetch
    }
  ]);
};
