import { isNavigationFailure } from "vue-router";
import type { FetchParams } from "@hengshuai/ssr-types";
import axios from "axios";
import { useConfig } from "@/common/hooks";

export default ({ router, app, error }: FetchParams) => {
  if (__isBrowser__) {
    const config = useConfig(app);
    router.onError(app.config.errorHandler = (err: unknown) => {
      console.log("error: ", err);
      if (!axios.isCancel(err)) {
        const statusCode = isNavigationFailure(err, 1) ? 404 : 500;
        config.env !== "master" && console.error(err);
        error({ statusCode, error: err as Error });
      }
    });
  }
};
