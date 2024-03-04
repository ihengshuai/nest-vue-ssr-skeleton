<template>
  <ul class="user-list">
    <li v-for="item in data" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useFetchData } from "@hengshuai/ssr-hoc-vue3";
import { homeFetch } from "./index.fetch";

const { data } = useFetchData(homeFetch);
</script>

<style lang="scss" scoped>
.user-list {
  list-style: initial;
  margin: initial;
  padding: initial;
}
</style>
