<template>
  <input
    class="input-small"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :style="itemWidth"
    @keydown.enter.prevent
    v-model="inputedValue"
  />
</template>

<script>
import ItemWidthMixin from "@/mixins/ItemWidthMixin";

export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
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
.input-small {
  display: block;
  height: 30px;
  margin-top: 5px;
  padding: 0 5px;
  border: 1px solid silver;
  box-sizing: border-box;
  border-radius: 5px;
}

@media screen and (max-width: 599px) {
  .input-small {
    padding: 0 10px;
    font-size: 1em;
    letter-spacing: 1.5px;
  }
}
</style>