import type { FetchParams } from "@hengshuai/ssr-types";
import { ServiceStorage } from "@hengshuai/helper";
import { serviceStorageKey } from "@/common/utils/symbol";
import { useWebInfo } from "@/stores";
import { storeToRefs } from "pinia";

const mobileRE =
    /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;

const tabletRE = /android|ipad|playbook|silk/i;

export function isMobileFn(opts?: any) {
  if (!opts) opts = {};
  let ua = opts.ua;
  if (!ua && typeof navigator !== "undefined") ua = navigator.userAgent;
  if (ua?.headers && typeof ua.headers["user-agent"] === "string") {
    ua = ua.headers["user-agent"];
  }
  if (typeof ua !== "string") return false;

  let result = mobileRE.test(ua) || (!!opts.tablet && tabletRE.test(ua));

  if (
    !result &&
        opts.tablet &&
        opts.featureDetect &&
        navigator &&
        navigator.maxTouchPoints > 1 &&
        ua.includes("Macintosh") &&
        ua.includes("Safari")
  ) {
    result = true;
  }

  return result;
}

// 获取屏幕缩放比例
function getRatio() {
  var ratio = 0;
  var screen = window.screen as any;
  var ua = navigator.userAgent.toLowerCase();

  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  } else if (~ua.indexOf("msie")) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }

  return ratio;
}

export default async ({ app, store, ctx }: FetchParams) => {
  // 注册服务层实例。
  app.provide(serviceStorageKey, ServiceStorage.instance);

  // 设置Web相关信息。
  const webInfoStore = useWebInfo(store);
  const { browserVersions } = storeToRefs(webInfoStore);

  const ua = __isBrowser__ ? window.navigator.userAgent : ctx.request.headers["user-agent"];

  if (ua) {
    browserVersions.value.qooapp = ua.includes("QooApp");
    browserVersions.value.android = ua.includes("Android") || ua.includes("Adr");
    browserVersions.value.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    browserVersions.value.trident = ua.includes("Trident");
    browserVersions.value.presto = ua.includes("Presto");
    browserVersions.value.webKit = ua.includes("AppleWebKit");
    browserVersions.value.gecko = ua.includes("Gecko") && !ua.includes("KHTML");
  } else {
    browserVersions.value.qooapp = false;
    browserVersions.value.android = false;
    browserVersions.value.ios = false;
    browserVersions.value.trident = false;
    browserVersions.value.presto = false;
    browserVersions.value.webKit = false;
    browserVersions.value.gecko = false;
  }

  browserVersions.value.mobile = isMobileFn();
  browserVersions.value.pc = !browserVersions.value.mobile;

  if (__isBrowser__) {
    browserVersions.value.ratio = getRatio();

    window.addEventListener("pageshow", (e) => {
      // 来检测页面是否被缓存，并在页面被缓存或者被后退时触发
      (e.persisted || (window.performance && window.performance.navigation.type === 2)) && webInfoStore.setPagePersisted(true);
    }, false);
  }
};
