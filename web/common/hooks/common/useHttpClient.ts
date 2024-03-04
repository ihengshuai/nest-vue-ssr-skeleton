import { HttpClient } from "@/common/http";
import { App, inject } from "vue";
import { httpClientKey } from "@/common/utils/symbol";

export function useHttpClient(app?: App): HttpClient {
  const httpClient = app ? app._context.provides[httpClientKey] : inject(httpClientKey);
  if (!httpClient) {
    throw new Error("Should use HTTP Client. Did you forget to install HTTP Client?");
  }
  return httpClient;
};
