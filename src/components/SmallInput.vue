<template>
  <BaseInput
    class="input-small"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    v-model="inputedValue"
    borderWidth="0.5px"
    borderColor="silver"
    :width="width"
  />
</template>

<script>
import BaseInput from "@/components/BaseInput";
import ItemWidthMixin from "@/mixins/ItemWidthMixin";

export default {
  components: {
    BaseInput,
  },
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
  margin-top: 5px;
}

@media screen and (max-width: 599px) {
  .input-small {
    padding: 0 10px;
  }
}
</style>