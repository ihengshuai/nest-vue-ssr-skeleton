<template>
  <html :lang="locale" prefix="og: http://ogp.me/ns#">
    <head>
      <meta charSet="utf-8">
      <meta name="language" :content="locale">
      <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <meta name="renderer" content="webkit">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="theme-color" :content="themeColor">
      <meta name="mobile-web-app-capable" content="yes">
      <link rel="apple-touch-icon" href="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/192.png">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-title" content="HSNestSSR">
      <meta name="apple-mobile-web-app-status-bar-style" content="#00c6e6">
      <meta name="apple-touch-startup-image" href="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/192.png">
      <link rel="profile" href="http://gmpg.org/xfn/11">
      <title>{{ title }}</title>
      <meta v-for="item in metaData" :key="item.property || item.name" :name="item.name" :property="item.property" :content="item.content" :value="item.value">
      <link v-if="canonicalUrl" rel="canonical" :href="canonicalUrl">
      <link v-for="item in alternateData" :key="item.lang" rel="alternate" :hreflang="item.lang" :href="item.href" type="text/html">
      <link rel="shortcut icon" href="https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/192.png">
      <custom-script v-for="(item, index) in linkingData" :key="index" type="application/ld+json">
        {{ JSON.stringify(item) }}
      </custom-script>
      <slot name="viteClient" />
      <slot name="customeHeadScript" />
      <slot name="preloadInject" />

      <slot name="cssInject" />
    </head>
    <body :class="routeName">
      <div id="app">
        <slot name="children" />
      </div>
      <slot name="initialData" />
      <slot name="customeFooterScript" />
      <slot name="jsInject" />
    </body>
  </html>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMeta } from "@/stores";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import CustomScript from "@/components/common/custom-script/custom-script";
import { useFetchRoute } from "@hengshuai/ssr-hoc-vue3";

const { metaData, alternateData, title, canonicalUrl, themeColor, linkingData } = useMeta();
const { locale } = useI18n();

const route = useRoute();
const fetchRoute = useFetchRoute();
const routeName = computed(() => fetchRoute?.chunkName || route.name);
</script>

<style lang="scss">
@import "~@/styles/base.scss";
</style>
