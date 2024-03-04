import { useService } from "@/common/hooks";
import { HomeService } from "@/services/home/home.service";
import { defineFetch } from "@hengshuai/ssr-hoc-vue3";

export const homeFetch = defineFetch("homeFetch", async ({ app }) => {
  const res = await useService(HomeService, app).getUserList();

  return res?.items || [];
});
