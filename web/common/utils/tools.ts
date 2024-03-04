/* 通用工具包 */

import { IDict } from "~/typings/interfaces";
import { isArray, isNull, isNumber, isObject, isString, isUndefined } from "@hengshuai/helper";

interface IThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export function isEmpty(value: any): boolean {
  return isNull(value) || isUndefined(value) || value === "";
}

export function debounce(this: any, func: Function, wait = 0, immediate = false): () => void {
  let timeout: any;
  let params: Array<any>;
  let context: any;
  let timestamp: number;
  let result: any;

  const later = (): void => {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, params);
        if (!timeout) { context = params = null; }
      }
    }
  };

  return (...args: Array<any>): void => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;
    params = args;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) { timeout = setTimeout(later, wait); }
    if (callNow) {
      result = func.apply(context, params);
      context = params = null;
    }

    return result;
  };
}

export function throttle(this: any, func: Function, wait = 0, options: IThrottleOptions = {}): () => void {
  let context: any; let params: Array<any>; let result: any;
  let timeout: any = null;
  let previous = 0;

  const later = (): void => {
    previous = !options.leading ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, params);
    if (!timeout) { context = params = null; }
  };
  return (...args: Array<any>): void => {
    const now: number = Date.now();
    if (!previous && !options.leading) { previous = now; }
    const remaining: number = wait - (now - previous);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;
    params = args;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, params);
      if (!timeout) { context = params = null; }
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export function formatString(str: string, args: Array<any> | any): string {
  let tempStr = str;

  if (arguments.length > 1) {
    if (isObject(args)) {
      for (const key in args) {
        // @ts-expect-error
        if (args[key] !== undefined) {
          const reg = new RegExp("({" + key + "})", "g");
          // @ts-expect-error
          tempStr = tempStr.replace(reg, args[key]);
        }
      }
    }

    if (isArray(args)) {
      for (let i = 0; i < args.length; i++) {
        if (args[i] !== undefined) {
          const reg = new RegExp("({)" + i + "(})", "g");
          tempStr = tempStr.replace(reg, args[i]);
        }
      }
    }
  }
  return tempStr;
}

export function a2Blob(a: string): Blob {
  const bstr = atob(a.replace(/^.*?,/, ""));
  let l = bstr.length;
  const u8arr = new Uint8Array(l);
  while (l--) {
    u8arr[l] = bstr.charCodeAt(l);
  }
  return new Blob([u8arr], { type: a.replace(/^data:|;[\s\S]*$/g, "") });
}

export function qs2obj(qs: string): IDict<any> {
  const res: IDict<any> = {};
  let child: Array<string>;
  qs?.split("&").forEach((item: string) => {
    res[(child = item.split("="))[0]] = child[1] || null;
  });
  return res;
}

export function obj2qs(obj: IDict<any>): string {
  let res = "";
  let val: string;
  obj &&
        Object.keys(obj).forEach((prop: string) => {
          res += "&" + prop;
          (val = obj[prop]) !== null && (res += "=" + val);
        });
  return res.substring(1);
}

export function simpleURL(url: string, searchOpts: any): any {
  let search;
  let hash;

  typeof (searchOpts = searchOpts || {}) === "string" && (searchOpts = qs2obj(searchOpts));

  url = url
    .replace(/#.*$/, function ($0) {
      hash = $0;
      return "";
    })
    .replace(/\?[^#]*/, function ($0) {
      search = $0;
      return "";
    });

  const qsObj: IDict<string> = Object.assign(qs2obj((search || (search = "")).substring(1)), searchOpts);

  Object.keys(qsObj).forEach(item => { if (isEmpty(qsObj[item])) delete qsObj[item]; });

  const qs = obj2qs(qsObj);

  return url + (qs ? "?" : "") + qs + (hash || (hash = ""));
}

export function snakeToCamel(data: Object | Array<any>, whitelist?: Array<string>) {
  if (data) {
    if (isNumber(data)) return data;
    else if (isString(data)) {
      return (data).replace(/_([^_])/g, ($0, $1) => $1.toUpperCase());
    } else {
      const res = isArray(data) ? [] : {};
      for (const key in data) {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        res[!whitelist || !whitelist.includes(key) ? key.replace(/_([^_])/g, ($0, $1) => $1.toUpperCase()) : key] = data[key] && typeof data[key] === "object" && (isArray(data[key]) || isObject(data[key])) ? snakeToCamel(data[key]) : data[key];
      }
      return res;
    }
  }
  return data;
}

export function camelToSnake(data: Object | Array<any>, whitelist?: Array<string>) {
  if (data) {
    if (isString(data)) {
      return (data).replace(/(?=[A-Z])([A-Z])/g, $0 => "_" + $0.toLowerCase());
    } else {
      const res = isArray(data) ? [] : {};
      for (const key in data) {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        res[(!whitelist || !whitelist.includes(key)) && !(/^[A-Z]+$/.test(key)) ? key.replace(/(?=[A-Z])([A-Z])/g, $0 => "_" + $0.toLowerCase()) : key] = (data[key] && typeof data[key] === "object" && (isArray(data[key]) || isObject(data[key]))) ? camelToSnake(data[key]) : data[key];
      }
      return res;
    }
  }
  return data;
}

export function random(start: number, end: number) {
  if (!end) {
    end = start;
    start = 0;
  }
  return Math.round(Math.random() * (end - start) + start);
}

export function generateUUID(): string {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function getCookie(k: string, cookie?: string): string {
  const regex = new RegExp("(^| )" + k + "=([^;]*)(;|$)");
  if (__isBrowser__ && !cookie) {
    cookie = document.cookie;
  }
  let match;
  if ((match = cookie?.match(regex))) {
    return decodeURI(match[2]);
  }
  return null;
}

export function setCookie(k: string, v: string, mins: number) {
  var d = new Date();
  d.setTime(d.getTime() + (mins * 60000));
  var exp = "expires=" + d.toUTCString();
  var host = window.location.host;
  document.cookie = k + "=" + v + ";" + exp + ";domain=" + host.substring(host.lastIndexOf(".", host.lastIndexOf(".") - 1)) + ";path=/";
}

export function isIos() {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

export function parseLineStr(content: string) {
  return content.replace(/\n/g, "<br />").replace(/<(?!br)/gim, "&lt;");
}

export function stripTags(content: string) {
  return content?.replace(/(<([^>]+)>)/gi, "");
}

export function getCdnUrl(url: string) {
  let newUrl: string;

  if (/(amazonaws.com\/|cloudfront.net\/|qoo-app.com\/|i0.wp.com\/)/.test(url)) {
    const cdnUrls = [
      "//storage.qoo-img.com/",
      "//storage.qoo-img.com/",
      "//storage.qoo-img.com/",
      "//dv944luy9yzpr.cloudfront.net/",
      "//jpapps.qoo-app.com/",
      "//jpapps.qoo-app.com/",
      "o.qoo-img.com/"
    ];
    [
      "//qooapp-normal.s3.amazonaws.com/",
      "//s3-ap-southeast-1.amazonaws.com/qooapp-normal/",
      "//qooapp-normal.s3.ap-southeast-1.amazonaws.com/",
      "//qooapp-comic-89e27917c632d9.s3.ap-southeast-1.amazonaws.com/",
      "//download.qoo-app.com/",
      "//d1anogg4n9l28n.cloudfront.net/",
      "i0.wp.com/"
    ].forEach((item, index) => {
      newUrl = url.replace(item, cdnUrls[index]);
      url = newUrl;
    });
  }

  url = newUrl || url;
  url = url?.replace(/^http(:.*)/, "https$1");

  return url;
}

export function parseImgUrl(url: string, width = 0, height = 0) {
  url = getCdnUrl(url);
  let _url = url?.replace(/\?.*/, "").replace(/=.*/, "");

  const qooappRegex = /^(https?:)?\/\/(([^/]+)\.qoo-(app|static|img)\.com)\/(.+)/;
  const ggphtRegex = /^(https?:)?\/\/(([^/]+)\.(ggpht|googleusercontent)\.com)\/(.+)/;

  let match: RegExpMatchArray;

  if ((match = _url?.match(qooappRegex))) {
    _url = ("https://o.qoo-img.com/" + match[2] + "/" + match[5]).replace("o.qoo-img.com/o.qoo-img.com/", "o.qoo-img.com/");
  } else if ((match = _url?.match(ggphtRegex))) {
    _url = "https://o.qoo-img.com/ggpht/" + match[5];
  } else {
    return url;
  }

  if (_url) {
    if (width && height) {
      url = _url + "?resize=" + width + "," + height;
    } else if (width) {
      url = _url + "?w=" + width;
    } else if (height) {
      url = _url + "?h=" + height;
    } else {
      url = _url;
    }
  }

  return url;
}

export function truncate(str: string, startIndex: number, endIndex: number) {
  if (str) {
    if (/[\uDC00-\uDFFF]/.test(str.charAt(startIndex))) startIndex--;
    if (/[\uD800-\uDBFF]/.test(str.charAt(endIndex - 1))) endIndex++;
    return str.substring(startIndex, endIndex);
  }
}

export function loadImage(src: string, callback: (img: HTMLImageElement) => void) {
  const img = new Image();
  img.onload = function () {
    callback(img);
  };
  img.src = src;
}

// 返回透明图片
export const TRANSPARENT_IMG = (() => {
  const _img = "data:image/gif;base64,R0lGODlhAQABAHAAACH5BAUAAAAALAAAAAABAAEAAAICRAEAOw==";

  try {
    return URL.createObjectURL(a2Blob(_img));
  } catch (e) {
    /**
         * 如果 createObjectURL 有报错（浏览器不支持 blob URL.createObjectURL 等），
         * 则直接使用 base64 字符串，
         * base64 应该比 objectUrl 性能差些
         */
    return _img;
  }
})();
