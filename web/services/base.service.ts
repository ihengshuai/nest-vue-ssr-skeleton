import { HttpClient } from "@/common/http";
import { urls } from "@/apis";
import { WebConfig } from "~/typings/interfaces";

export default class BaseService {
  protected $http: HttpClient;
  protected config: WebConfig;

  constructor(http: HttpClient, config: WebConfig) {
    this.$http = http;
    this.config = config;
  }

  /**
     * 获取所有数据接口地址。
     */
  protected get urls(): ReturnType<typeof urls> {
    return urls(this.config);
  }
}
