<template>
  <div class="block-validations">
    <p
      class="block-validations__text-message"
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
.block-validations {
  padding-bottom: 5px;
}

.block-validations__text-message {
  margin: 3px 0 0;
  color: rgb(255, 28, 28);
  font-size: 0.84em;
}
</style>