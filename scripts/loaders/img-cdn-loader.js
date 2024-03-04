const loader = function (content) {
  // return process.env.PUBLIC_PATH && process.env.ASSETS_CDN_URL ? content.replace(new RegExp(process.env.PUBLIC_PATH), process.env.ASSETS_CDN_URL.replace(/^https:\/\//, "https://aliyun.oss-cn-shanghai.aliyuncs.com/")) : content;
  return content;
};

module.exports = loader;
