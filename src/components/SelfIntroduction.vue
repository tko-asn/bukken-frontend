<template>
  <!-- 自己紹介 -->
  <div class="item-self-intro">
    <ContentTitle title="プロフィール" :showMenuFunc="showMenuFunc" />
    <Content :isScroll="true">
      <p class="item-self-intro__text" v-if="selfIntroduction">
        {{ selfIntroduction }}
      </p>
      <p class="item-self-intro__text item-self-intro__text--no_text" v-else>
        自己紹介は<span>ありません</span>
      </p>
    </Content>
  </div>
</template>

<script>
import ContentTitle from "@/components/ContentTitle";
import Content from "@/components/Content";

export default {
  components: {
    ContentTitle,
    Content,
  },
  props: {
    selfIntroduction: String,
    showMenuFunc: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.item-self-intro__text {
  margin: 10px 0;
  padding: 10px 5px;
}

.item-self-intro__text--no_text {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  color: gray;
}
</style>