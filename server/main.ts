import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { initialSSRDevProxy, loadConfig, getCwd } from "@hengshuai/ssr-common-utils";
import * as compression from "compression";
import * as expressStaticGzip from "express-static-gzip";
import { type Response, type Request } from "express";
import { MainAppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(MainAppModule, {
    logger: ["error", "warn", "debug"]
    // ...(config.__isHttps__
    //     ? {
    //         httpsOptions: {
    //             key: readFileSync(config.SSL_CERTIFICATE_KEY!),
    //             cert: readFileSync(config.SSL_CERTIFICATE!)
    //         }
    //     }
    //     : {})
  });

  app.enableCors((req: Request, cb) =>
    cb(null, {
      origin: req.headers.origin,
      methods: ["PUT, POST, GET, DELETE, OPTIONS"],
      allowedHeaders: ["x-locale", "authorization", "Content-Type"],
      credentials: true
    })
  );

  process.env.NODE_ENV === "production" && app.use(compression({
    filter: (req, res) => {
      if (/\.(gz|woff2|robots\.txt?)$/.test(req.path)) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));
  await initialSSRDevProxy(app, {
    express: true
  });

  const staticSetHeaders = {
    setHeaders: (res: Response, path: string) => {
      res.set("Access-Control-Allow-Origin", res.req.headers.origin || res.req.headers.referer);
    }
  };

  if (process.env.NODE_ENV === "production") {
    app.use(expressStaticGzip(join(getCwd(), "./build"), { serveStatic: staticSetHeaders, index: false }));
    app.use(expressStaticGzip(join(getCwd(), "./build/client"), { serveStatic: staticSetHeaders, index: false }));
    app.use(expressStaticGzip(join(getCwd(), "./public"), { serveStatic: staticSetHeaders, index: false }));
  } else {
    app.useStaticAssets(join(getCwd(), "./build"), staticSetHeaders);
    app.useStaticAssets(join(getCwd(), "./build/client"), staticSetHeaders);
    app.useStaticAssets(join(getCwd(), "./public"), staticSetHeaders);
  }

  const { serverPort } = loadConfig();
  await app.listen(serverPort);
}

bootstrap().catch(err => {
  console.log(err);
  process.exit(1);
});
