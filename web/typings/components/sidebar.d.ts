import { _RouteLocationBase } from "vue-router";
declare global {
  interface ISideBarModel {
    value?: string;
    label?: string;
    icon?: string;
    to?: string | _RouteLocationBase;
    openTarget?: "_self" | "_blank";
    suffix?: string;
    children?: Array<ISideBarModel>;
    isOpen?: boolean;
    validate?: () => boolean;
    active?: boolean;
  }
}
