import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { attrs }) {
    return () => (<link {...attrs} />);
  }
});
