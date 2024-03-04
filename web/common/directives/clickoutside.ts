export default {
  created(el: HTMLElement, binding: any) {
    function documentHandler(e: Event) {
      if (el.contains(e.target as HTMLElement)) {
        return false;
      }

      binding.value?.(e);
    }
    (el as any).__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener("click", (el as any).__vueClickOutside__);
    delete (el as any).__vueClickOutside__;
  }
};
