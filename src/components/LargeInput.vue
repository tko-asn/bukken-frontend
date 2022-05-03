<template>
  <BaseInput
    class="input-large"
    :placeholder="placeholder"
    v-model="inputedValue"
    borderColor="rgb(143, 142, 142)"
    borderWidth="2px"
    height="40px"
    fontSize="1.1em"
    letterSpacing="3px"
  />
</template>

<script>
import BaseInput from "@/components/BaseInput";

export default {
  components: {
    BaseInput,
  },
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
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
.input-large {
  margin: 10px 0;
}
</style>