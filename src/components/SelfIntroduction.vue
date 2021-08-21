<template>
  <!-- 自己紹介 -->
  <div>
    <div class="self_introduction" v-if="selfIntroduction">
      <p>{{ selfIntroduction }}</p>
    </div>
    <p class="no_self_introduction" v-else>自己紹介はありません</p>
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
.self_introduction {
  padding: 10px 50px;
  overflow-wrap: break-word;
  background: #fff;
  font-size: 1.1em;
}

.no_self_introduction {
  text-align: center;
}
</style>