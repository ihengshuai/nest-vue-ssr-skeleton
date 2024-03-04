import type { Item } from "photoswipe";
declare global {
  interface PhotoSlides extends Item{
    src: string;
    w?: number;
    h?: number;
    id?: number;
    title?: string;
    [prop: string]: any;
  }
}
