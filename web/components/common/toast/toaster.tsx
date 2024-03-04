import { computed, createVNode, defineComponent, onMounted, ref, render as vueRender, TransitionGroup, onUnmounted, watch } from "vue";
import "./toast.scss";

let seed = 0;
const now = Date.now();

function getUuid() {
  const id = seed;
  seed += 1;
  return `rcToast_${now}_${id}`;
}

const getTransitionGroupProps = (transitionName: string) => {
  return {
    name: transitionName,
    appear: true,
    appearActiveClass: `${transitionName}`,
    appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
    enterFromClass: `${transitionName}-appear ${transitionName}-enter ${transitionName}-appear-prepare ${transitionName}-enter-prepare`,
    enterActiveClass: `${transitionName}`,
    enterToClass: `${transitionName}-enter ${transitionName}-appear ${transitionName}-appear-active ${transitionName}-enter-active`,
    leaveActiveClass: `${transitionName} ${transitionName}-leave`,
    leaveToClass: `${transitionName}-leave-active`
  };
};

const Toast = defineComponent({
  name: "Toast",
  inheritAttrs: false,
  props: ["duration", "toastKey", "onClose"],
  setup(props, { attrs, slots }) {
    let closeTimer: any;
    const duration = computed<any>(() => (props.duration === undefined ? 2 : props.duration));
    const startCloseTimer = () => {
      if (duration.value) {
        closeTimer = setTimeout(() => {
          close();
        }, duration.value * 1000);
      }
    };
    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const close = (e?: MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      clearCloseTimer();
      const { onClose, toastKey } = props;
      if (onClose) {
        onClose(toastKey);
      }
    };

    const restartCloseTimer = () => {
      clearCloseTimer();
      startCloseTimer();
    };

    onMounted(() => {
      startCloseTimer();
    });

    onUnmounted(() => {
      clearCloseTimer();
    });

    watch(duration, (preDuration, newDuration) => {
      if (preDuration !== newDuration) {
        restartCloseTimer();
      }
    }, { flush: "post" });

    return () => {
      return (
        <div class="qoo-toast" onMouseenter={clearCloseTimer} onMouseleave={startCloseTimer}>
          <div class="qoo-toast__content">{slots.default?.()}</div>
        </div>
      );
    };
  }
});

const Toaster = defineComponent({
  name: "Toaster",
  inheritAttrs: false,
  props: [],
  setup(props, { attrs, expose, slots }) {
    const toasts = ref<any>([]);
    const transitionProps = computed(() => getTransitionGroupProps("move-up"));

    const add = (originToast: any) => {
      const key = originToast.key || getUuid();
      const toast: any = {
        ...originToast,
        key
      };
      const toastIndex = toasts.value.map((v: any) => v.toast.key).indexOf(key);
      const updatedToasts = toasts.value.concat();

      if (toastIndex !== -1) {
        updatedToasts.splice(toastIndex, 1, { toast });
      } else {
        updatedToasts.push({ toast });
      }
      toasts.value = updatedToasts;
    };

    const remove = (removeKey: Key) => {
      toasts.value = toasts.value.filter(({ toast: { key } }: any) => key !== removeKey);
    };

    expose({
      add,
      remove,
      toasts
    });

    return () => {
      const toastNodes = toasts.value.map(({ toast }: any) => {
        const { key, content } = toast;
        const toastProps = {
          key,
          toastKey: key,
          onClose: (toastKey: Key) => {
            remove(toastKey);
            toast.onClose?.();
          }
        };
        return (
          <Toast {...toastProps}>
            {content}
          </Toast>
        );
      });
      return (
        <div class="qoo-toaster">
          <TransitionGroup tag="div" {...transitionProps.value}>
            {toastNodes}
          </TransitionGroup>
        </div>
      );
    };
  }
});

Toaster.newInstance = function newToasterInstance(callback: any) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const Wrapper = defineComponent({
    name: "ToasterWrapper",
    setup(_props, { attrs }) {
      const toastRef = ref();
      onMounted(() => {
        callback({
          toast(toastProps: any) {
            toastRef.value?.add(toastProps);
          },
          removeToast(key: Key) {
            toastRef.value?.remove(key);
          },
          destroy() {
            vueRender(null, div);
            if (div.parentNode) {
              div.parentNode.removeChild(div);
            }
          },
          component: toastRef
        });
      });
      return () => {
        return (
          <Toaster ref={toastRef} {...attrs} />
        );
      };
    }
  });

  const vm = createVNode(Wrapper);
  vueRender(vm, div);
};

export default Toaster;
