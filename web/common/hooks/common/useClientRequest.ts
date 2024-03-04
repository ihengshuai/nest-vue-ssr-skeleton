import axios from "axios";
import { ref, watch } from "vue";

interface IUseRequestConfig {
  watch?: any;
  catchError?: boolean;
  bindData?: boolean;
  immediate?: boolean;
}

export function useClientRequest<T>(request?: Function | IUseRequestConfig, config?: IUseRequestConfig) {
  const data = ref<T>();
  const error = ref<Error>();
  const pending = ref(false);

  let taskCount = 0;

  const refresh: Function = __isBrowser__ ? async () => {
    if (request) {
      taskCount++;
      pending.value = true;

      try {
        const _data = await (request as Function)();
        if (config.bindData) {
          data.value = _data;
        }
      } catch (e) {
        if (!axios.isCancel(e)) {
          if (config.catchError) {
            console.error(e);
          } else {
            error.value = e as Error;
            throw e;
          }
        }
      } finally {
        taskCount--;

        if (!taskCount) {
          pending.value = false;
        }
      }
    }
  } : function () {};

  const setRequest: Function = (_request: Function) => {
    if (typeof request === "undefined") {
      throw new Error("Missing required parameter: \"_request\"");
    }

    request = _request;
    refresh();
  };

  if (typeof request !== "function") {
    config = request;
    request = null;
    request = request as Function;
  }

  config = {
    catchError: true,
    bindData: true,
    immediate: true,
    ...config
  };

  request && config.immediate && refresh();

  __isBrowser__ && config.watch && watch(config.watch, () => refresh());

  return {
    refresh,
    data,
    pending,
    error,
    setRequest
  };
}
