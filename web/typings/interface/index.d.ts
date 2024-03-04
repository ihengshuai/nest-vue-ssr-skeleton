
declare global {
  interface Pagination {
    next: string; // 如果支持返回下一頁地址,這裡返回 string
    page: string; // 頁碼,1開始 integer
    size: number; // 每頁記錄數 integer
    total: number; // 總記錄數,性能考慮,可能部分
  }
  interface OldPagination {
    next: string; // 如果支持返回下一頁地址,這裡返回 string
    nextPage: number; // 頁碼,1開始 integer
    pageSize: number; // 每頁記錄數 integer
    total: number; // 總記錄數,性能考慮,可能部分
  }

  // 投訴
  interface IComplaintQuery {
    tag: string;
    arg1: number;
    arg2: number;
    content1?: string;
  }

  /**
     * 通用列表分页。
     */
  interface IPager {
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
}

export {};
