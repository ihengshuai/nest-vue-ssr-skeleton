import { Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { Readable } from "stream";
import { render } from "@hengshuai/ssr-core-vue3";
import { v4 as uuidv4 } from "uuid";

export class AppController {
  @Get(["*"])
  async handler(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.locals.id = uuidv4();

    const ctx = { request: req, response: res };
    const stream = await render<Readable>(ctx, { stream: true });
    if (stream) {
      stream.pipe(res);
      stream.on("end", () => {
        res.end();
      });
    } else {
      res.end();
    }
  }
}
