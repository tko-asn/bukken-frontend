<template>
  <!-- 自己紹介 -->
  <div class="item-self-intro">
    <p class="item-self-intro__text" v-if="selfIntroduction">{{ selfIntroduction }}</p>
    <p class="item-self-intro__text item-self-intro__text--no_text" v-else>
      自己紹介は<span>ありません</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    selfIntroduction: String,
  },
};
</script>

<style scoped>
/* 自己紹介 */
.item-self-intro {
  padding: 10px 50px;
  overflow-wrap: break-word;
  background: #fff;
}

.item-self-intro__text {
  white-space: pre-wrap;
}

.item-self-intro__text--no_text {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: gray;
}

@media screen and (max-width: 1024px) {
  .item-self-intro {
    padding: 10px;
  }
}
</style>