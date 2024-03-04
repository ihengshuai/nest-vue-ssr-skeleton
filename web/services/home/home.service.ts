import { CancelToken } from "axios";
import { Token } from "@/common/decorators";
import BaseService from "@/services/base.service";

/**
 * 定义游戏服务层
 */
export class HomeService extends BaseService {
  /**
     * 获取用户列表
     */
  @Token() async getUserList(query?: any, cancelToken?: CancelToken): Promise<any> {
    return this.$http.get<any>(this.urls.userList, {
      params: query,
      cancelToken
    });
  }

  async getMockData(cancelToken?: CancelToken): Promise<any> {
    return this.$http.get("/mock/user", {
      baseURL: "http://localhost:10000",
      cancelToken,
      captureError: false
    });
  }
}
