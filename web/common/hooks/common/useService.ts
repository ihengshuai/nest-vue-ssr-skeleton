import { WebConfig } from "~/typings/interfaces/config.interface";
import { useConfig } from "@/common/hooks";
import { HttpClient } from "@/common/http";
import type BaseService from "@/services/base.service";
import type { ServiceStorage } from "@hengshuai/helper";
import { App, inject } from "vue";
import { serviceStorageKey } from "@/common/utils/symbol";
import { useHttpClient } from "./useHttpClient";

export function useService<T extends BaseService>(Service: new (httpClient: HttpClient, config: WebConfig) => T, app?: App): T {
  const serviceProvider: ServiceStorage = app ? app._context.provides[serviceStorageKey] : inject(serviceStorageKey);
  const httpClient = useHttpClient(app);
  const config = useConfig(app);

  if (!serviceProvider) {
    throw new Error("Should use Service Provider. Did you forget to install Service Provider?");
  }

  if (!serviceProvider.has(Service)) {
    serviceProvider.register(Service, new Service(httpClient, config));
  }

  return serviceProvider.resolve<T>(Service);
};
