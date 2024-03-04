declare global {
  enum HTTP_CODE_STATUS {
    OK = 200,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
  }
    type HTTP_CODE = HTTP_CODE_STATUS.OK | HTTP_CODE_STATUS.Unauthorized | HTTP_CODE_STATUS.Forbidden | HTTP_CODE_STATUS.NotFound;

    interface AxiosResponseData<T = any> {
      code: number;
      data: T;
      ext: unknown;
      message: string;
    }
}

export {};
