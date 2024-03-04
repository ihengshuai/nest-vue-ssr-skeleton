import { IWindow } from "@hengshuai/ssr-types";

declare global {
  interface Window {
    __USE_SSR__?: IWindow["__USE_SSR__"];
    __USE_VITE__?: boolean;
    __INITIAL_DATA__?: IWindow["__INITIAL_DATA__"];
    __CONFIG__?: any;
    // 预约iframe
    closeRegisterDialog: (...args: any) => any;
    updatePregisterStatus: (...args: any) => any;
    adsbygoogle: any;
    Android: any;
    android: any;
    updateQuizId: Function;
    updateUser: Function;
    dataLayer: any;
    gtag: any;
    $: any;
    modelHide: any;
  }
  // eslint-disable-next-line
    const __isBrowser__: Boolean
  const ga: any;
  const sa: any;
  const gtag: any;
  const dataLayer: any;
  let adsbygoogle: any;
}
