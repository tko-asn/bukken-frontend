<template>
  <!-- 内容 -->
  <textarea
    :id="elementId"
    class="textarea"
    :placeholder="placeholder"
    v-model="inputedValue"
  ></textarea>
</template>

<script>
import ItemWidthMixin from "@/mixins/ItemWidthMixin";

export default {
  props: {
    elementId: {
      type: String,
      defualt: "textarea",
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "150px",
    },
  },
  mixins: [ItemWidthMixin],
  mounted() {
    const textarea = document.getElementById(this.elementId);
    textarea.style.width = this.width;
    textarea.style.height = this.height;
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
.textarea {
  display: block;
  margin: 10px 0;
  border: 2px solid rgb(143, 142, 142);
  box-sizing: border-box;
  border-radius: 5px;
  resize: none;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(158, 154, 154, 0.781);
}
</style>