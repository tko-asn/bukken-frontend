<template>
  <button
    :class="['btn-small', btnColor]"
    :disabled="isDisabled"
    @click="$emit('click')"
    :style="itemWidth"
  >
    {{ btnValue }}
  </button>
</template>

<script>
import ItemWidthMixin from "@/mixins/ItemWidthMixin";

export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    btnValue: {
      type: String,
      default: "",
    },
    btnColor: {
      type: String,
      default: "auth",
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-small {
  display: block;
  height: 30px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  color: #fff;
  letter-spacing: 3px;
  cursor: pointer;
}

.btn-small:hover {
  opacity: 0.8;
}

.btn-small:disabled {
  opacity: 0.4;
  cursor: default;
}

.auth {
  background: rgb(16, 211, 65);
}

.info {
  background: rgb(19, 126, 214);
}

.cancel {
  background: rgb(167, 165, 165);
}

.delete {
  background: rgb(231, 39, 39);
}
</style>