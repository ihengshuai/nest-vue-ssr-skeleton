const fs = require("fs");
const path = require("path");
const { parseFeRoutes } = require("@hengshuai/ssr-common-utils");

function changeRouteHook() {
  parseFeRoutes();
}

fs.watchFile(path.resolve(__dirname, "../web/route.ts"), changeRouteHook);
fs.watch(path.resolve(__dirname, "../web/routes"), { recursive: true }, changeRouteHook);
