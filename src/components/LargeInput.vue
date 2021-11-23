<template>
  <input
    class="input-large"
    type="text"
    :placeholder="placeholder"
    v-model="inputedValue"
    @keydown.enter.prevent
  />
</template>

<script>
export default {
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
  display: block;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  border: 2px solid rgb(143, 142, 142);
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 1.2em;
  letter-spacing: 3px;
}
</style>