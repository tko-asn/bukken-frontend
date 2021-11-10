<template>
  <div class="block-title">
    <a
      href=""
      class="block-title__btn"
      v-if="width < 600"
      @click.prevent="showMenuFunc"
    >
      <fa-icon class="block-title__icon" icon="bars" />
    </a>
    <span class="block-title__text">{{ title }}</span>
  </div>
</template>

<script>
import widthMixin from "@/mixins/widthMixin";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    showMenuFunc: {
      type: Function,
      default: () => {},
    },
  },
  mixins: [widthMixin], 
};
</script>

<style scoped>
.block-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: silver;
  font-size: 1em;
  text-align: center;
}

.block-title__icon {
  margin-right: 10px;
  color: gray;
}

.block-title__text {
  font-weight: bold;
}
</style>