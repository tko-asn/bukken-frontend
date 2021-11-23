<template>
  <div class="block-answer-form">
    <TextArea
      elementId="textarea-answer-form"
      placeholder="回答を投稿する"
      height="130px"
      v-model="answerObj.content"
    />
    <ValidationMessage
      class="block-answer-form__validation"
      :messages="validations"
    />
    <div class="block-radio">
      <p class="block-radio__help">質問に対する物件の評価</p>
      <input
        class="block-radio__item"
        type="radio"
        value="1"
        v-model="answerObj.evaluation"
      />良い
      <input
        class="block-radio__item"
        type="radio"
        value="0"
        v-model="answerObj.evaluation"
      />普通
      <input
        class="block-radio__item"
        type="radio"
        value="2"
        v-model="answerObj.evaluation"
      />悪い
    </div>
    <MiddleButton
      btnValue="回答"
      @click="buttonFunc(answerObj)"
      :isDisabled="isDisabled"
      v-if="!isTwoButton"
    />
    <div class="block-answer-form__two-button" v-else>
      <MiddleButton
        btnValue="キャンセル"
        @click="cancelFunc(answerId, false, { cancel: true })"
        btnColor="cancel"
        width="45%"
      />
      <MiddleButton
        btnValue="保存"
        @click="buttonFunc(answerObj, answerId)"
        :isDisabled="isDisabled"
        btnColor="edit"
        width="45%"
      />
    </div>
  </div>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";
import MiddleButton from "@/components/MiddleButton";
import TextArea from "@/components/TextArea";

export default {
  components: {
    ValidationMessage,
    MiddleButton,
    TextArea,
  },
  props: {
    buttonFunc: {
      type: Function,
      default: () => {},
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    validations: {
      type: Array,
      dafault: () => [],
    },
    isTwoButton: {
      type: Boolean,
      default: false,
    },
    cancelFunc: {
      type: Function,
      default: () => {},
    },
    answerId: {
      type: String,
      default: "",
    },
    defaultData: {
      type: Object,
      default: () => ({ content: "", evaluation: 0 }),
    },
  },
  data() {
    return {
      answerObj: {
        content: this.defaultData.content,
        evaluation: this.defaultData.evaluation,
      },
    };
  },
};
</script>

<style scoped>
.block-answer-form {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

.block-answer-form__validation {
  margin: 0;
}

.block-radio {
  font-size: 0.8em;
}

.block-radio__help {
  font-size: 1.1em;
  margin: 10px 0 5px;
}

.block-radio__item + .block-radio__item {
  margin-left: 10px;
}

.block-answer-form__two-button {
  display: flex;
  justify-content: space-around;
}
</style>