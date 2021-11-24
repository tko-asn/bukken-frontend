<template>
  <button
    :class="['btn-middle', btnColor]"
    @click="$emit('click')"
    :style="itemWidth"
    :disabled="isDisabled"
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
    btnColor: {
      type: String,
      default: "normal",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-middle {
  display: block;
  height: 40px;
  margin: 20px 0;
  border: none;
  border-radius: 5px;
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
}

.normal {
  background: rgb(172, 21, 192);
}

.cancel {
  background: rgb(167, 165, 165);
}

.delete {
  background: rgb(231, 39, 39);
}

.edit {
  background: rgb(27, 235, 27);
}

.btn-middle:hover {
  opacity: 0.8;
}

.btn-middle:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>