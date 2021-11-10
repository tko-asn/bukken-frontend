export default {
  data() {
    return {
      width: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
};