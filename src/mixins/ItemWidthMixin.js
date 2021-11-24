export default {
  props: {
    width: {
      type: String,
      default: "100%",
    },
  },
  computed: {
    itemWidth() {
      return `width: ${this.width};`;
    },
  },
};
