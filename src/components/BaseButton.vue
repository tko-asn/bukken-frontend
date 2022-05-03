<template>
  <button
    class="btn-base"
    @click="$emit('click')"
    :style="{
      width,
      height,
      'border-radius': borderRadius,
      'letter-spacing': letterSpacing,
      background,
      'font-size': fontSize,
    }"
    :disabled="isDisabled"
  >
    {{ value }}
  </button>
</template>

<script>
import ItemWidthMixin from "@/mixins/ItemWidthMixin";
import { NORMAL } from "@/utils/colors";

export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "30px",
    },
    borderRadius: {
      type: String,
      default: "5px",
    },
    letterSpacing: {
      type: String,
      default: "3px",
    },
    fontSize: {
      type: String,
      default: "1em",
    },
    background: {
      type: String,
      default: NORMAL,
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-base {
  display: block;
  color: #fff;
  border: none;
  cursor: pointer;
}

.btn-base:hover {
  opacity: 0.8;
}

.btn-base:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>