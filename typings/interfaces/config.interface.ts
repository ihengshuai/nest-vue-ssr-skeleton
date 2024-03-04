import { IDict } from "~/typings/interfaces";

export interface IWebConfig {
  /**
     * 分支环境：master，testing，beta
     */
  env: string;

  /**
     * 网站 域名，通常是 .ihengshuai.com
     */
  domain: string;

  /**
     * 开发时候域名中的扩展字符串，通常是 nest-vue-ssr.ihengshuai.com
     */
  domainDevExtends: string;

  /**
     * 接口地址
     */
  apiDomain: string;

  /**
     * 请求超时
     */
  ajaxTimeout: number;

  /**
     * 自定义头信息
     */
  ajaxCustomHeader: IDict;

  /**
     * 网站默认语言
     */
  defaultLanguage: string;

  /**
     * 网站支持语言
     */
  languages: Array<string>;

  /**
     * 游戏站支持语言
     */
  appLanguages: Array<string>;

  /**
     * 繁中标识集合
     */
  zhHant: Array<string>;

  /**
     * 现有PC的语言集，mobile跳转PC需要进行兼容处理
     */
  compatibleLocales: Array<string>;

  /**
     * 现有PC的游戏详情的语言集，mobile跳转PC需要进行兼容处理
     */
  compatibleAppLocales: Array<string>;

  /**
     * 现有PC的默认语言。
     */
  compatibleDefaultLocale: string;

  /**
     * 域名白名单，用于兼容旧版Web的多语言，旧版不带语言标识默认是zh，新版的则是en，需要做下兼容处理，列在白名单中的域名不进行处理。
     */
  whiteList: Array<string>;

  /**
     * 静态资源的路径
     */
  publicPath: string;
}

export type WebConfig = {
  [Key in keyof IWebConfig as `_${Key & string}`]?: IWebConfig[Key];
} & IWebConfig;
