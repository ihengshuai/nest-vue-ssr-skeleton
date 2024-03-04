import axios from "axios";
import TokenProvider from "@/common/utils/token-provider";

export function Token() {
  return __isBrowser__ ? function (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor): void {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
      return method.call(this, ...args, TokenProvider.instance.register(target.constructor, propertyName, axios.CancelToken.source()).token);
    };
  } : function () { /*  */ };
}
