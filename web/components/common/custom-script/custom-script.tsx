import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { attrs, slots }) {
    return () => (<script {...attrs} v-html={slots.default?.()?.[0]?.children} />);
  }
});
