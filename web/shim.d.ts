declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module "*.css" {}

declare module "*.svg"
declare module "*.png"
declare module "*.jpg"
declare module "*.jpeg"
declare module "*.gif"
declare module "*.bmp"
declare module "*.tiff"
declare module "wow.js"
declare module "qrcode" {
  export const toDataURL: (txt: string, opts?: any) => Promise<string>;
}
