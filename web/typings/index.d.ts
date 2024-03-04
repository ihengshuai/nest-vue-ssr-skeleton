import { IBrowserVersions } from "@/stores/web-info";
import "vue-router";
declare module "*.scss"

declare module "vue-router" {
  interface RouteMeta extends IRouteMetaWithBreadcrumb {
    name?: string;
    activeTab?: string;
    activeTag?: string;
    tab?: string;
    locale?: string;
    unBacktop?: boolean;
    keepAlive?: boolean;
    /**
         * 是否自定义语言
         * @default: false
         */
    customLang?: (route: RouteLocationRaw, browserInfo?: IBrowserVersions) => any;
  }
}
