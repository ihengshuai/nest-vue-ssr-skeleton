const { nestjsPlugin } = require("@hengshuai/ssr-plugin-nestjs");
const { vuePlugin } = require("@hengshuai/ssr-plugin-vue3");

module.exports = {
  serverPlugin: nestjsPlugin(),
  clientPlugin: vuePlugin()
};
