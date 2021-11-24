<template>
  <button
    :class="['btn-large', btnColor]"
    :disabled="isDisabled"
    :style="itemWidth"
    @click="$emit('click')"
  >
    {{ btnValue }}
  </button>
</template>

<script>
import ItemWidthMixin from "@/mixins/ItemWidthMixin";

export default {
  props: {
    btnValue: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    btnColor: {
      type: String,
      default: "normal",
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-large {
  display: block;
  height: 45px;
  margin: 15px 0;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
}

.btn-large:hover {
  opacity: 0.8;
}

.btn-large:disabled {
  opacity: 0.6;
  cursor: default;
}

.normal {
  background: rgb(126, 79, 170);
}

.delete {
  background: rgba(247, 18, 10, 0.9);
}
</style>