<template>
  <div class="block-answer-list-content">
    <ContentTitle :title="title" :showMenuFunc="showMenuFunc" />
    <Content :isScroll="true">
      <AnswerList :answerType="answerType" :userIdProps="userIdProps" />
    </Content>
  </div>
</template>

<script>
import ContentTitle from "@/components/ContentTitle";
import Content from "@/components/Content";
import AnswerList from "@/components/AnswerList";

export default {
  components: {
    ContentTitle,
    Content,
    AnswerList,
  },
  props: {
    answerType: String,
    userIdProps: String,
    showMenuFunc: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    title() {
      return this.answerType === "answer" ? "ユーザーの回答" : "いいねした回答";
    },
  },
};
</script>
