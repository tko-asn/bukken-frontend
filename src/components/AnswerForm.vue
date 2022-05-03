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
    <MediumButton
      btnValue="回答"
      @click="buttonFunc(answerObj)"
      :isDisabled="isDisabled"
      :background="NORMAL"
      v-if="!isTwoButton"
    />
    <div class="block-answer-form__two-button" v-else>
      <MediumButton
        btnValue="キャンセル"
        @click="cancelFunc(answerId, false, { cancel: true })"
        :background="CANCEL"
        width="45%"
      />
      <MediumButton
        btnValue="保存"
        @click="buttonFunc(answerObj, answerId)"
        :isDisabled="isDisabled"
        :background="AUTH"
        width="45%"
      />
    </div>
  </div>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";
import MediumButton from "@/components/MediumButton";
import TextArea from "@/components/TextArea";
import getColorsMixin from "@/mixins/getColorsMixin";

export default {
  components: {
    ValidationMessage,
    MediumButton,
    TextArea,
  },
  mixins: [getColorsMixin],
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