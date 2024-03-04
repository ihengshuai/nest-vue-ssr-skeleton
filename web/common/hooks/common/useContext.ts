import { ExpressContext, ISSRContext } from "@hengshuai/ssr-types";
import { getCurrentInstance } from "vue";

export function useContext(): ISSRContext<ExpressContext> {
  return !__isBrowser__ && getCurrentInstance().appContext.app._props.ctx as ISSRContext<ExpressContext>;
}
