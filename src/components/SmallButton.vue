<template>
  <BaseButton
    class="btn-small"
    :background="background"
    :isDisabled="isDisabled"
    :value="btnValue"
    @click="$emit('click')"
    :width="width"
  />
</template>

<script>
import BaseButton from "@/components/BaseButton";
import ItemWidthMixin from "@/mixins/ItemWidthMixin";
import { AUTH } from "@/utils/colors";

export default {
  components: {
    BaseButton,
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    btnValue: {
      type: String,
      default: "",
    },
    background: {
      type: String,
      default: AUTH,
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-small {
  margin: 10px 0;
}
</style>