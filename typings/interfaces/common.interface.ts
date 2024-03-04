import { AxiosRequestConfig } from "axios";

export interface IDict<T = string> {
  [key: string]: T;
}

export interface IDictNum<T = string> {
  [key: number]: T;
}

export interface IQuery {
  page: number;
  size: number;
}

/**
 * 通用列表分页。
 */
export interface IPager {
  /**
     * 下一页地址链接，不一定会返回
     */
  next?: string;

  /**
     * 页码
     */
  page: number;

  /**
     * 每页记录数
     */
  size: number;

  /**
     * 总记录数，性能考虑，可能部分查询不会返回该值
     */
  total: number;
}

export type Extend<T, U> = T & U;

export interface CreateRequestParams extends Partial<AxiosRequestConfig> {
  [prop: string]: any;
}
