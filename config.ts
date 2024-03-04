import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import CompressionWebpackPlugin from "compression-webpack-plugin";
import webpack from "webpack";
import glob from "glob";
import { type CustomSSRUserConfig } from "@hengshuai/ssr-plugin-vue3";
import { ISSRContext } from "@hengshuai/ssr-types";

const productionGzipExtensions = ["js", "css"];

const isDev = process.env.NODE_ENV === "development";

// 运行时环境变量
const envConfig = dotenv.config({
  path: isDev ? ".env" : "./config/.env"
});
const createProcessEnv = (envs: any = process.env) => Object.entries(envs).reduce((res, [key, value]) => {
  res["process.env." + key] = value;
  return res;
}, {});
const createClientConfig = (envs: any = envConfig?.parsed) => {
  return envs ? `window.__CONFIG__=${JSON.stringify(envs)};` : "";
};

const domainEnv = process.argv[3] || process.env.DOMAIN_ENV || "master";

// 构建时环境变量
const DOMAIN_ENV = domainEnv.toUpperCase();
const buildEnvFile = path.resolve(__dirname, "../.env.build");
if (!isDev && fs.existsSync(buildEnvFile)) {
  const buildEnv = dotenv.parse(fs.readFileSync(buildEnvFile));
  const regex = new RegExp("^" + DOMAIN_ENV + "_");
  Object.entries(buildEnv).forEach(([key, value]) => {
    if (regex.test(key)) {
      process.env[key.replace(regex, "")] = value;
    }
  });
}

const dllFiles = [
  { key: "vueDll", filename: "vue.dll.js", manifest: "vue-manifest.json" },
  { key: "vueVendorDll", filename: "vueVendor.dll.js", manifest: "vueVendor-manifest.json" },
  { key: "hengshuaiDll", filename: "hengshuai.dll.js", manifest: "hengshuai-manifest.json" }
];
function getFilenameRegex(filename) {
  const extname = path.extname(filename);
  const splitIndex = filename.indexOf(extname);
  return new RegExp(~splitIndex ? escapeFilename(filename.substring(0, splitIndex)) + ".*" + escapeFilename(extname) + "$" : filename);
}
function escapeFilename(filename) {
  return filename.replace(".", "\\.", "g");
}
const realDllFilenames = glob.sync(path.resolve(__dirname, "../public/lib/vendor/**/*.js")).map((item) => path.basename(item));
const dllFilenameQuery = dllFiles.reduce((res, item) => {
  const regex = getFilenameRegex(item.filename);
  const realFilename = realDllFilenames.find(_filename => regex.test(_filename));
  realFilename && (res[item.filename] = realFilename);
  return res;
}, {});

const publicPath = !isDev && process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "";

const userConfig: CustomSSRUserConfig = {
  chainClientConfig: (chain) => {
    if (!isDev) {
      dllFiles.forEach(item => {
        chain.plugin(item.key).use(
          // @ts-expect-error
          webpack.DllReferencePlugin,
          [{
            context: process.cwd(),
            manifest: require("../public/lib/vendor/" + item.manifest)
          }]
        );
      });
      chain.plugin("gzip").use(CompressionWebpackPlugin, [{
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        minRatio: 0.8
      }]);
    }
  },
  extraJsOrder: !isDev ? () => ["vendor-swiper.js"] : undefined,
  publicPath,
  define: {
    // 此处使用了 webpack define 插件，只作用于 web 目录下，nestjs 程序无法使用。
    base: {
      ...createProcessEnv({
        isProd: domainEnv === "master" || domainEnv === "beta",
        isDev
      })
    }
  },
  babelOptions: {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }]
    ]
  },
  locale: {
    enable: true
  },
  serverPort: process.env.PORT ? Number(process.env.PORT) : 3000,
  customeHeadScript: [
    {
      content: createClientConfig()
    }
  ],
  customVendors: !isDev ? dllFiles.map(item => publicPath + "/lib/vendor/" + dllFilenameQuery[item.filename]) : undefined,
  extendsExtraOrder(ctx: ISSRContext, extraOrder: Array<string>) {
    let locale = ctx.request.path.toLowerCase().match(/\/(zh(?:-(?:hk|tw|[^/]+))?|es(?:-[a-z0-9]+)?)(?:\/|$)/)?.[1] || "en";
    locale = locale === "zh-cn" ? "zh_cn" : locale.slice(0, 2);
    locale !== "en" && extraOrder.push("en-json-locale");
    extraOrder.push(`${locale}-json-locale`);
    return extraOrder;
  }
};

export { userConfig };
