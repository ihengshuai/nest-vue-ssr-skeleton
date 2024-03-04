import { defineStore } from "pinia";
import { ISSRContext } from "@hengshuai/ssr-types";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { AxiosRequestConfig } from "axios";
import { App } from "vue";
import { getServerHost, localePrettier } from "@/common/utils/extends";
import { WebConfig } from "~/typings/interfaces";

interface IMeta {
  name?: string;
  property?: string;
  content?: string;
  value?: string;
}

interface IAlternate {
  lang: string;
  href: string;
}

type ITwitterCardType = "summary_large_image" | "summary";

interface IMetaState {
  themeColor?: string;
  metaData?: Array<IMeta>;
  alternateData?: Array<IAlternate>;
  title?: string;
  canonicalUrl?: string;
  headers?: Record<string, string>;
  saPagePayload?: Record<string, any>;
  linkingData?: Array<Record<string, any>>;
  preSources?: {
    images?: Record<string, [number, number][]>;
  };
  config: WebConfig;
}

interface IMetaPayload {
  title?: string;
  twitterCardType?: ITwitterCardType;
  twitterTitle?: string;
  description?: string;
  image?: string;
  themeColor?: string;
  locales?: Array<string>;
  ctx?: ISSRContext;
  route?: RouteLocationNormalizedLoaded;
}

interface IMetaAction {
  setConfig: (config: WebConfig) => void;
  setMeta: (meta: IMetaPayload) => void;
  setHeaders: (config: AxiosRequestConfig, headers: Record<string, string>) => void;
  removeHeader: (config: AxiosRequestConfig, name: string) => void;
  setSaPagePayload: (payload: Record<string, any>) => void;
  setLinkingData: (linkingData: Array<Record<string, any>>) => void;
  addLinkingData: (linkingData: Record<string, any>) => void;
  setBreadcrumbLinkingData: (breadcrumb: Array<IBreadcrumb>, app: App, router: Router, t: Function) => void;
  setPreImageSource: (key: string, size: [number, number]) => void;
}

interface IMetaQuery {
  nameKey: string;
  valueKey: string;
  value: string;
  name?: string;
}

type META_QUERY = Record<string, IMetaQuery>;

const metaQuery: META_QUERY = {
  description: {
    nameKey: "name",
    valueKey: "content",
    value: null
  },
  "og:type": {
    nameKey: "property",
    valueKey: "content",
    value: null
  },
  "og:title": {
    nameKey: "property",
    valueKey: "content",
    value: null
  },
  "og:url": {
    nameKey: "property",
    valueKey: "content",
    value: null
  },
  "og:description": {
    nameKey: "property",
    valueKey: "content",
    value: null
  },
  "og:site_name": {
    nameKey: "property",
    valueKey: "content",
    value: null
  },
  "og:image": {
    nameKey: "property",
    valueKey: "content",
    value: null
  },
  "twitter:card": {
    nameKey: "name",
    valueKey: "content",
    value: null
  },
  "twitter:domain": {
    nameKey: "name",
    valueKey: "value",
    value: null
  },
  "twitter:title": {
    nameKey: "name",
    valueKey: "value",
    value: null
  },
  "twitter:description": {
    nameKey: "name",
    valueKey: "value",
    value: null
  },
  "twitter:image": {
    nameKey: "name",
    valueKey: "value",
    value: null
  },
  "twitter:url": {
    nameKey: "name",
    valueKey: "value",
    value: null
  }
};

function copyMetaQuery() {
  return Object.entries(metaQuery).reduce<META_QUERY>((metaQuery, [key, value]) => {
    metaQuery[key] = { ...value };
    return metaQuery;
  }, {});
}

function setMetaBySelector(tag: string, selector: string, metaData: IMetaQuery) {
  let el = document.head.querySelector(selector);
  if (metaData.value) {
    if (el) {
      el.setAttribute(metaData.valueKey, metaData.value);
    } else {
      el = document.createElement(tag);
      el.setAttribute(metaData.nameKey, metaData.name);
      el.setAttribute(metaData.valueKey, metaData.value);
      document.head.appendChild(el);
    }
  } else {
    el && document.head.removeChild(el);
  }
}

function setLinkingDataSelector(content: string) {
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.innerHTML = content;
  document.head.appendChild(script);
}

export const useMeta = defineStore<string, IMetaState, {}, IMetaAction>("meta", {
  state: () => {
    return {
      metaData: null,
      alternateData: null,
      title: null,
      canonicalUrl: null,
      themeColor: null,
      headers: null,
      saPagePayload: null,
      linkingData: null,
      preSources: null,
      config: null
    };
  },
  actions: {
    setConfig(config) {
      this.config = config;
    },
    setMeta(payload) {
      let _metaQuery: Record<string, IMetaQuery> = null;

      this.metaData = null;
      this.alternateData = null;
      this.title = null;
      this.canonicalUrl = null;
      this.themeColor = null;

      if (payload) {
        const { title, twitterTitle, description, image, themeColor, locales, ctx, route } = payload;
        let host: string;
        let url: string;
        let defaleLocalePath: string;
        let alternateData: Array<IAlternate>;

        // 处理 canonical 链接；
        if (((!__isBrowser__ && ctx) || __isBrowser__) && route) {
          const pathname = defaleLocalePath = route.path;
          host = __isBrowser__ ? window.location.host : ctx.request.hostname;

          url = this.canonicalUrl = "https://" + host + pathname;

          if (route.params.locale) {
            defaleLocalePath = pathname.replace("/" + route.params.locale, "");
          }
        }

        // 处理多语言
        if (host && defaleLocalePath) {
          alternateData = [];
          alternateData.push({
            lang: "x-default",
            href: "https://" + host + defaleLocalePath
          });

          (locales || this.config.languages)?.forEach(lang => {
            lang = localePrettier(lang);
            alternateData.push({
              lang,
              href: "https://" + host + "/" + lang + defaleLocalePath
            });
          });

          this.alternateData = alternateData;
        }

        // 处理主题颜色
        this.themeColor = themeColor || "#00c6e6";

        // 处理标题
        if (title) {
          this.title = title;
        }

        // 处理meta数据
        if (title || description || image || url) {
          _metaQuery = copyMetaQuery();

          if (title) {
            _metaQuery["og:title"].value = title;
          }

          if (twitterTitle || title) {
            _metaQuery["twitter:title"].value = twitterTitle || title;
          }

          if (description) {
            _metaQuery["description"].value = description;
            _metaQuery["og:description"].value = description;
            _metaQuery["twitter:description"].value = description;
          }

          if (url) {
            _metaQuery["og:url"].value = url;
            _metaQuery["twitter:url"].value = url;
          }

          if (image) {
            _metaQuery["og:image"].value = image;
            _metaQuery["twitter:image"].value = image;
          } else {
            _metaQuery["og:image"].value = "https://o.qoo-img.com/statics.qoo-app.com/cdn/img/QooApp_512.v-0d0fd2.png";
            _metaQuery["twitter:image"].value = "https://o.qoo-img.com/statics.qoo-app.com/cdn/img/QooApp_512.v-0d0fd2.png";
          }

          // 组装og信息
          _metaQuery["og:type"].value = "website";
          _metaQuery["og:site_name"].value = "QooApp";

          // 组装twitter信息
          _metaQuery["twitter:card"].value = payload?.twitterCardType || "summary_large_image";
          _metaQuery["twitter:domain"].value = "www.qoo-app.com";

          this.metaData = Object.entries(_metaQuery).map(([key, value]) => ({
            [value.nameKey]: key,
            [value.valueKey]: value.value
          }));
        }
      }

      if (__isBrowser__) {
        document.title = this.title || "";

        // 操作主题颜色
        setMetaBySelector("meta", "meta[name=theme-color]", {
          nameKey: "name",
          valueKey: "content",
          name: "theme-color",
          value: this.themeColor
        });

        // 操作canonical链接
        setMetaBySelector("link", "link[rel=canonical]", {
          nameKey: "rel",
          valueKey: "href",
          name: "canonical",
          value: this.canonicalUrl
        });

        if (_metaQuery) {
          Object.entries(_metaQuery).forEach(([key, value]) => {
            setMetaBySelector("meta", `meta[${value.nameKey}='${key}']`, {
              nameKey: value.nameKey,
              valueKey: value.valueKey,
              name: key,
              value: value.value
            });
          });
        } else {
          Object.entries(metaQuery).forEach(([key, value]) => {
            const el = document.head.querySelector(`meta[${value.nameKey}='${key}']`);
            el && document.head.removeChild(el);
          });
        }
      }
    },
    setHeaders(config, headers) {
      if (headers) {
        this.headers = {
          ...this.headers,
          ...headers
        };

        Object.entries(headers).forEach(([key, value]) => {
          if (value) {
            config.headers[key] = value;
          }
        });
      }
    },
    removeHeader(config, name) {
      if (this.headers) {
        delete this.headers[name];
      }

      delete config.headers[name];
    },
    setSaPagePayload(payload) {
      this.saPagePayload = payload || null;
    },
    setLinkingData(linkingData) {
      this.linkingData = linkingData || null;

      if (__isBrowser__) {
        if (this.linkingData) {
          this.linkingData.forEach((item) => {
            setLinkingDataSelector(JSON.stringify(item));
          });
        } else {
          Array.from(document.head.querySelectorAll("script[type='application/ld+json']")).forEach(dom => {
            dom.parentNode.removeChild(dom);
          });
        }
      }
    },
    addLinkingData(linkingDatum) {
      if (this.linkingData?.constructor !== Array) {
        this.linkingData = [];
      }

      this.linkingData.push(linkingDatum);
      __isBrowser__ && setLinkingDataSelector(JSON.stringify(linkingDatum));
    },
    setBreadcrumbLinkingData(breadcrumb, app, router, t) {
      if (breadcrumb) {
        this.addLinkingData({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumb.map((item, index) => {
            const title = (typeof item.translate === "boolean" ? item.translate : true) ? t(item.title) : item.title;

            let to = item.to;
            if (typeof item.to !== "string") {
              to = "https://" + getServerHost(app) + router.resolve(item.to).fullPath;
            }

            return {
              "@type": "ListItem",
              position: index + 1,
              name: title,
              item: to
            };
          })
        });
      }
    },
    setPreImageSource(key, size) {
      this.preSources = this.preSources || {};
      this.preSources.images = this.preSources.images || {};

      const item = this.preSources.images[key] = this.preSources.images[key] || [];
      if (item.length) {
        !item.find(([x, y]) => size[0] === x && size[1] === y) && item.push(size);
      } else {
        item.push(size);
      }
    }
  }
});
