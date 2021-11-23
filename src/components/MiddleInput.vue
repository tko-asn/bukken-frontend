<template>
  <input
    type="text"
    class="input-middle"
    v-model="inputedValue"
    :readonly="readonly"
    :style="itemWidth"
    :placeholder="placeholder"
    @keydown.enter.prevent
    v-if="!maxLength"
  />
  <input
    type="text"
    class="input-middle"
    v-model="inputedValue"
    :readonly="readonly"
    :style="itemWidth"
    :placeholder="placeholder"
    :maxlength="maxLength"
    @keydown.enter.prevent
    v-else
  />
</template>

<script>
import ItemWidthMixin from "@/mixins/ItemWidthMixin";

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    maxLength: {
      type: Number,
      default: 0,
    },
  },
  mixins: [ItemWidthMixin],
  computed: {
    inputedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style scoped>
.input-middle {
  display: block;
  height: 33px;
  margin: 10px 0;
  border: 2px solid rgb(143, 142, 142);
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 1.1em;
}

.input-middle:read-only {
  background: rgb(216, 214, 214);
}
</style>