import type { WebConfig } from "~/typings/interfaces";
import { App, inject } from "vue";
import { configKey } from "@/common/utils/symbol";

export function useConfig(app?: App): WebConfig {
  const config = app ? app._context.provides[configKey] : inject(configKey);
  if (!config) {
    throw new Error("Should use Config data. Did you forget to install Config data?");
  }
  return config;
};
