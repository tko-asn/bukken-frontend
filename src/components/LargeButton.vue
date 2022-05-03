<template>
  <BaseButton
    class="btn-large"
    :background="background"
    :isDisabled="isDisabled"
    :value="btnValue"
    @click="$emit('click')"
    :width="width"
    height="45px"
    borderRadius="3px"
    letterSpacing="0px"
    fontSize="1.1em"
  />
</template>

<script>
import BaseButton from "@/components/BaseButton";
import ItemWidthMixin from "@/mixins/ItemWidthMixin";
import { NORMAL } from "@/utils/colors";

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
      default: NORMAL,
    },
  },
  mixins: [ItemWidthMixin],
};
</script>

<style scoped>
.btn-large {
  margin: 15px 0;
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
}

.btn-large:hover {
  opacity: 0.8;
}

.btn-large:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>