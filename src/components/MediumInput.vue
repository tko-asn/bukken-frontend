<template>
  <BaseInput
    class="input-middle"
    :readonly="readonly"
    :placeholder="placeholder"
    v-model="inputedValue"
    :width="width"
    :maxLength="maxLength"
    height="33px"
    borderWidth="2px"
    borderRadius="4px"
    borderColor="rgb(143, 142, 142)"
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
  margin: 10px 0;
}
</style>