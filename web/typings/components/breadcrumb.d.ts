import { _RouteLocationBase } from "vue-router";
import { AxiosRequestConfig } from "axios";

declare global {
    type IBreadcrumbTo = string | Partial<_RouteLocationBase>;

    interface IBreadcrumb {
      title?: string;
      translate?: boolean;
      to?: IBreadcrumbTo;
    }

    type IBreadcrumbMeta = string | IBreadcrumb & {
      uri?: string;
    };

    interface IRouteMetaWithBreadcrumb {
      breadcrumb?: Array<IBreadcrumbMeta> | IBreadcrumbMeta;
    }

    interface CreateRequestParams extends Partial<AxiosRequestConfig> {
      [prop: string]: any;
    }

    type Key = string | number;
}
export {};
