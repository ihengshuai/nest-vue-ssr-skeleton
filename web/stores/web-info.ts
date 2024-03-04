import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export interface IBrowserVersions {
  trident: boolean;
  presto: boolean;
  webKit: boolean;
  gecko: boolean;
  mobile: boolean;
  pc: boolean;
  ios: boolean;
  android: boolean;
  qooapp: boolean;
  qooappVersionCode: number;
  qooappLocale: string;
  ratio: number;
  protocol: string;
}

export const useWebInfo = defineStore("webInfo", () => {
  const title = ref("");
  const description = ref("");
  const themeColor = ref("");
  const openAppBrand = ref(0);
  const canDownloadApp = ref(false);
  const canPregisterApp = ref(false);
  // const countryCode = ref<string>(null);
  const showFixedAd = ref(true);
  const showFooter = ref(true);
  const pageId = ref(Math.random());
  const pagePersisted = ref(false);
  const domainMapping = ref<IDomainConfig>(null);

  const browserVersions = reactive<IBrowserVersions>({
    trident: false,
    presto: false,
    webKit: false,
    gecko: false,
    mobile: false,
    pc: false,
    ios: false,
    android: false,
    qooapp: false,
    qooappLocale: null,
    qooappVersionCode: 0,
    ratio: 0,
    protocol: null
  });

  const setOpenAppBrand = (status: number) => (openAppBrand.value = status);
  const setShowFixedAd = (status: boolean) => (showFixedAd.value = status);
  const setShowFooter = (status: boolean) => (showFooter.value = status);
  const setPagePersisted = (status: boolean) => (pagePersisted.value = status);
  const updatePageId = () => (pageId.value = Math.random());
  const setDomainMapping = (payload: IDomainConfig) => {
    domainMapping.value = payload;
  };

  return {
    title,
    description,
    themeColor,
    openAppBrand,
    canDownloadApp,
    canPregisterApp,
    browserVersions,
    // countryCode,
    showFixedAd,
    pageId,
    pagePersisted,
    domainMapping,
    showFooter,

    setShowFooter,
    setShowFixedAd,
    setOpenAppBrand,
    updatePageId,
    setPagePersisted,
    setDomainMapping
  };
});
