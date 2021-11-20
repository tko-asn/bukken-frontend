<template>
  <input
    class="input-auth"
    :type="type"
    :placeholder="placeholder"
    v-model="inputedValue"
  />
</template>

<script>
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
.input-auth {
  display: block;
  width: 85%;
  height: 30px;
  margin-top: 5px;
  padding: 0 5px;
  border: 1px solid silver;
  border-radius: 5px;
}

@media screen and (max-width: 599px) {
  .input-auth {
    padding: 0 10px;
    font-size: 1em;
    letter-spacing: 1.5px;
  }
}
</style>