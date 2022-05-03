<template>
  <input
    :type="type"
    :name="name"
    class="input-base"
    v-model="inputedValue"
    :readonly="readonly"
    :style="{
      width,
      height,
      'font-size': fontSize,
      'border-radius': borderRadius,
      'letter-spacing': letterSpacing,
      'border-color': borderColor,
      'border-style': borderStyle,
      'border-width': borderWidth,
    }"
    :maxlength="maxLength ? maxLength : false"
    :placeholder="placeholder"
    @keydown.enter.prevent
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
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: "30px",
    },
    fontSize: {
      type: String,
      default: "1em",
    },
    borderRadius: {
      type: String,
      default: "5px",
    },
    letterSpacing: {
      type: String,
      default: "initial",
    },
    borderColor: {
      type: String,
      default: 'initial',
    },
    borderStyle: {
      type: String,
      default: 'solid',
    },
    borderWidth: {
      type: String,
      default: 'initial',
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
.input-base {
  display: block;
  box-sizing: border-box;
  padding: 0 5px;
}

.input-base:read-only {
  background: rgb(216, 214, 214);
}
</style>