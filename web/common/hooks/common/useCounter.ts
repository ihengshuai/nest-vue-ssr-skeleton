import { onBeforeUnmount, ref } from "vue";

export function useCounter(startCount: number, done?: Function) {
  const count = ref(startCount);
  let timer: any;

  if (__isBrowser__) {
    timer = setInterval(() => {
      if ((--count.value) === 0) {
        done?.();
        clearInterval(timer);
      }
    }, 1000);
  }

  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  return { count, timer };
};
