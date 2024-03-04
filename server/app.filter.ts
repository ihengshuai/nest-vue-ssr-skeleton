import { ISSRContext, ISSRError, ISSRException } from "@hengshuai/ssr-types";
import { Readable } from "stream";
import { render } from "@hengshuai/ssr-core-vue3";
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { isNavigationFailure } from "vue-router";
import { AxiosError } from "axios";

@Catch()
export class TryExceptionFilter implements ExceptionFilter {
  async catch(exception: Error | AxiosError | ISSRError, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let statusCode = exception instanceof HttpException ? exception.getStatus() : (exception as ISSRError)._exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    statusCode = isNavigationFailure(exception, 1) ? 404 : /* (exception as AxiosError)?.response?.data?.code ||  */statusCode;

    let exceptionBody: ISSRException = {
      statusCode,
      message: exception.message,
      error: exception
    };

    response.status(statusCode);

    try {
      const stream = await render<Readable>({ request, response } as ISSRContext, { stream: true, exception: exceptionBody });
      if (stream) {
        stream.pipe(response, { end: false });
        stream.on("end", () => {
          response.end();
        });
      } else {
        response.end();
      }
    } catch (e) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionBody = {
        statusCode,
        message: e.message,
        error: e
      };
      console.error(exceptionBody);
      response.status(statusCode).json(exceptionBody);
      response.end();
    } finally {
      // 打印错误日志
      let headers: any = request.headers;
      try {
        headers = JSON.stringify(request.headers);
      } catch (e) {
        //
      }
      console.error("https://" + request.hostname + request.url + "\n", headers, "\n", exceptionBody);
    }
  }
}
