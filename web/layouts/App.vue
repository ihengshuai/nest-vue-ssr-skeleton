<template>
  <exception v-if="exceptionRef" />
  <template v-else>
    <router-view />
  </template>
</template>

<script lang="ts" setup>
import exception from "@/views/default/exception.vue";
import { useException } from "@hengshuai/ssr-hoc-vue3";
const exceptionRef = useException();
</script>
