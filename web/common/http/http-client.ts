import https from "https";
import qs from "qs";
import axios, { AxiosRequestConfig, Method, AxiosInstance } from "axios";
import { isEmpty, isUndefined } from "@hengshuai/helper";
import { IHttpRequest } from ".";
import { formatString } from "@/common/utils/tools";
import { v4 as uuidv4 } from "uuid";
import { WebConfig } from "~/typings/interfaces";

export class HttpClient {
  private _axiosInstance: AxiosInstance;
  protected readonly id: string;
  protected readonly config: WebConfig;

  public options: IHttpRequest = {
    serializeType: "json",
    timeout: null,
    withCredentials: true,
    headers: null,
    retryCount: 0,
    retryInterval: 1000,
    avoidErrorMessage: false,
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: true
    }
  };

  public get axiosInstance(): AxiosInstance & { defaults: AxiosRequestConfig } {
    if (!this._axiosInstance) {
      this._axiosInstance = axios.create({
        ...(process.env.isSecured
          ? {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false
            })
          }
          : undefined)
      });
    }
    return this._axiosInstance as AxiosInstance & { defaults: AxiosRequestConfig };
  }

  constructor(id: string, config: WebConfig) {
    this.id = id;
    this.config = config;

    this.options.timeout = config.ajaxTimeout;
    this.options.headers = {
      ...config.ajaxCustomHeader
    };
  }

  public async get<T>(url: string, request: IHttpRequest): Promise<T> {
    return this.request<T>("get", url, request);
  }

  public async post<T>(url: string, request: IHttpRequest): Promise<T> {
    return this.request<T>("post", url, request);
  }

  public async put<T>(url: string, request: IHttpRequest): Promise<T> {
    return this.request<T>("put", url, request);
  }

  public async patch<T>(url: string, request: IHttpRequest): Promise<T> {
    return this.request<T>("patch", url, request);
  }

  public async delete<T>(url: string, request: IHttpRequest): Promise<T> {
    return this.request<T>("delete", url, request);
  }

  public async request<T>(method: Method, url: string, request: IHttpRequest): Promise<T> {
    if (!request) request = {};
    request.url = request.url || url;
    return this.send(this.getAxiosRequest(method, request));
  }

  private getAxiosRequest(method: Method, request: IHttpRequest): AxiosRequestConfig {
    request.data = request.data || {};

    // 构造url(将url中需要传入参数的地方替换掉)
    const requestUrl = isUndefined(request.urlPath)
      ? request.url
      : formatString(request.url, request.urlPath);

    // 构造url(支持请求中自定义headers)
    const requestHeader = isUndefined(request.headers)
      ? this.options.headers
      : { ...this.options.headers, ...request.headers };

    // 设置超时时间。
    const requestTimeout = isUndefined(request.timeout) ? this.options.timeout : request.timeout;

    // 不同源请求是否携带凭证。
    const withCredentials = isUndefined(request.withCredentials)
      ? this.options.withCredentials
      : request.withCredentials;

    const config: IHttpRequest = { ...request };
    config.url = requestUrl;
    config.method = method;
    config.headers = { ...this.axiosInstance.defaults.headers, ...requestHeader };
    config.timeout = requestTimeout;
    config.withCredentials = withCredentials;

    switch (method) {
      case "get":
        config.params = Object.assign(request.data, config.params);
        break;
      default:
        if (request.headers?.["Content-Type"]) {
          config.data = request.data;
        } else {
          const serializeType = request.serializeType
            ? request.serializeType
            : this.options.serializeType;

          if (serializeType === "form") {
            config.headers["Content-Type"] = "application/x-www-form-urlencoded";
            config.data = qs.stringify(request.data, { arrayFormat: "indices" });
          } else if (serializeType === "form-data") {
            config.headers["Content-Type"] = "multipart/form-data";

            const formData = new FormData();

            const requestData = Object.assign(request.data);

            for (const name in requestData) {
              if (!isEmpty(requestData[name], false)) {
                formData.append(name, request.data[name]);
              }
            }

            const requestFiles = request.files;

            for (const name in requestFiles) {
              if (requestFiles[name]) {
                formData.append(name, requestFiles[name]);
              }
            }

            config.data = formData;
          } else {
            config.headers["Content-Type"] = "application/json";
            config.data = request.data;
          }
        }

        break;
    }

    // 初始化重试次数
    if (!request.retryCount) {
      request.retryCount = this.options.retryCount;
    }

    // 初始化重试间隔
    if (!request.retryInterval) {
      request.retryInterval = this.options.retryInterval;
    }

    request.requestId = uuidv4();

    // 特意保存原始请求参数
    (config as any).$request = request;

    return config;
  }

  private async send<T>(axiosRequest: AxiosRequestConfig): Promise<T> {
    return await new Promise<any>((resolve, reject) => {
      this.axiosInstance(axiosRequest)
        .then(resolve)
        .catch((error) => {
          // 特意保存原始请求参数
          const request: IHttpRequest = (axiosRequest as any).$request;

          if (request.retryCount && request.retryCount > 0) {
            // 自动重试处理
            setTimeout(() => {
              request.retryCount--;

              this.send(axiosRequest).then(resolve).catch(reject);
            }, request.retryInterval);
          } else {
            reject(error);
          }
        });
    });
  }
}
