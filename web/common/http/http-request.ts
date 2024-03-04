import { AxiosRequestConfig } from "axios";

interface IHttpRequest extends AxiosRequestConfig {
  serializeType?: "form" | "json" | "form-data";
  retryCount?: number;
  retryInterval?: number;
  urlPath?: any;
  files?: any;
  avoidErrorMessage?: any;
  requestId?: string;
  /**
     * 是否全局错误捕获
     * @default true
     */
  captureError?: boolean;
  /**
     * 显性控制需添加x-locale等头部
     * @default false
     */
  needHeaders?: boolean;
}

export default IHttpRequest;
