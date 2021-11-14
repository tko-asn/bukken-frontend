<template>
  <div :class="{ 'block-content': true, 'block-content--scroll': isScroll }">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    isScroll: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.block-content {
  max-height: 280px;
  overflow-wrap: break-word;
}

.block-content--scroll {
  overflow-y: scroll;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(158, 154, 154, 0.781);
}
</style>

