import { WebConfig } from "~/typings/interfaces";

export default (config: WebConfig) => {
  const apiDomain = config.apiDomain;

  return {
    // ----------------- 用户相关 START ---------------
    // 获取用户列表
    userList: `${apiDomain}/github-page-mock/list.json`
    // ----------------- 用户相关 END -----------------
  };
};
