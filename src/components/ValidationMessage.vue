<template>
  <div class="validation">
    <p
      class="message"
      v-for="message in messages"
      :key="message"
    >
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    messages: Array,
  }
};
</script>


<style scoped>
/* バリデーションメッセージ */
.validation {
  width: 88%;
  height: 20px;
  margin: 0 auto 15px;
}

.message {
  margin: 3px 0 0;
  color: rgb(255, 28, 28);
  font-size: 0.84em;
}
</style>