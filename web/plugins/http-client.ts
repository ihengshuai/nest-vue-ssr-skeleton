import { HttpClient, IHttpRequest } from "@/common/http";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { snakeToCamel } from "@/common/utils/tools";
// import type { FetchParams } from "@hengshuai/ssr-types";
import { httpClientKey } from "@/common/utils/symbol";
import { useMeta } from "@/stores";
import toast from "@/components/common/toast/toast";
import { isEmptyObject } from "@hengshuai/helper";
import { useConfig } from "@/common/hooks";

export default ({ ctx, app, error, store }: any) => {
  // 注册 Http Client 实例。
  const id = ctx?.response.locals.id;
  const webConfig = useConfig(app);
  const httpClient = new HttpClient(id, webConfig);

  app.provide(httpClientKey, httpClient);

  httpClient.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    if (!__isBrowser__ && !process.env.isProd) {
      console.time(`${(config as any).$request.requestId}: ${config.url}`);
      console.log(`${new Date().toISOString()}`, JSON.stringify(config));
    }

    if (config.method === "get" || isEmptyObject(config.data)) {
      delete config.data;
    }

    return config;
  });

  httpClient.axiosInstance.interceptors.response.use((data: AxiosResponse) => {
    if (!__isBrowser__ && !process.env.isProd) {
      console.log(`Response: ${data.status} ${data.config.method.toUpperCase()} ${data.config.url}`, JSON.stringify(data.data));
      console.timeEnd(`${(data.config as any).$request.requestId}: ${data.config.url}`);
    }

    const { data: content } = data;
    let errorMessage = "";

    if (content) {
      if (content.code === 200) {
        return content;
      } else {
        errorMessage = content.message;
      }
    }

    const err = new Error(errorMessage) as AxiosError;
    err.response = data;
    err.isAxiosError = false;

    throw err;
  }, async (err: AxiosError) => {
    if ((err.response?.data as Error)?.message) {
      err.message = (err.response.data as Error).message;
    }
    return Promise.reject(err);
  });

  httpClient.axiosInstance.interceptors.response.use(({ data }) => snakeToCamel(data) as any, async (e: AxiosError) => {
    // timeout
    if (e.response?.status === 504 || e.code === "ETIMEDOUT") {
      if (__isBrowser__) {
        toast.info({ content: "timeout" });
        return Promise.reject(e);
      }
    }

    // 统一处理错误响应，并且渲染错误页面。
    if (!axios.isCancel(e) && e.code !== "ECONNABORTED") {
      if (e.response) {
        const { status, data } = e.response as AxiosResponse<{ code: number }>;
        let errorCode: number = null;
        if (status !== 200) {
          errorCode = status;
        } else if (data && data.code !== 200) {
          errorCode = data.code;
        }

        const { captureError } = ((e?.config || e.response.config) as any)?.$request as IHttpRequest || {};

        const errorMessage = e.message || " ";

        if (captureError !== false) {
          if (__isBrowser__) {
            toast.info({
              content: errorCode + " " + errorMessage
            });
          } else {
            errorCode && error({
              message: errorMessage,
              statusCode: errorCode
            });
          }
        }
      }
    }
    return Promise.reject(e);
  });

  const metaStore = useMeta(store);
  metaStore.setConfig(webConfig);
};
