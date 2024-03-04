import type { FetchParams } from "@hengshuai/ssr-types";
import { useMeta, useWebInfo } from "@/stores";

export default ({ router, store }: FetchParams) => {
  router.beforeEach((to, from, next) => {
    useWebInfo().updatePageId();

    const pathChanged = from.path !== to.path;
    const queryChanged = JSON.stringify(to.query) !== JSON.stringify(from.query);

    if (!pathChanged && !queryChanged) return next();

    // 清空meta数据。
    const meta = useMeta(store);
    meta.setSaPagePayload(null);
    meta.setLinkingData(null);

    next();
  });
};
