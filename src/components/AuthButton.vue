<template>
  <button class="button-auth" :disabled="isDisabled" @click="authFunc">
    {{ btnValue }}
  </button>
</template>

<script>
export default {
  props: {
    authFunc: {
      type: Function,
      default: () => {},
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    btnValue: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.button-auth {
  display: block;
  width: 90%;
  height: 30px;
  margin: 10px 0 20px;
  border: none;
  border-radius: 5px;
  background: rgb(16, 211, 65);
  color: #fff;
  letter-spacing: 3px;
  cursor: pointer;
}

.button-auth:hover {
  background: rgb(22, 236, 75);
}

.button-auth:disabled {
  opacity: 0.4;
}
</style>