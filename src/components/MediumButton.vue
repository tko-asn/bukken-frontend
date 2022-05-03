<template>
  <BaseButton
    class="btn-medium"
    :background="background"
    :isDisabled="isDisabled"
    :value="btnValue"
    @click="$emit('click')"
    :width="width"
    height="40px"
    letterSpacing="2px"
  />
</template>

<script>
import BaseButton from "@/components/BaseButton";
import ItemWidthMixin from "@/mixins/ItemWidthMixin";
import { INFO } from "@/utils/colors";

export default {
  components: {
    BaseButton,
  },
  props: {
    btnValue: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: INFO,
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-medium {
  margin: 20px 0;
}
</style>