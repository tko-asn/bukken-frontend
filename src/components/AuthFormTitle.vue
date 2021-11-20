<template>
  <p class="text-auth-title">{{ title }}</p>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.text-auth-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 15px 0;
  font-size: 1.8em;
  letter-spacing: 6px;
}

.text-auth-title:after {
  content: "";
  display: block;
  width: 90%;
  height: 4px;
  background: #0fc;
}
</style>