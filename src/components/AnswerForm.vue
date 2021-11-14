<template>
  <div class="block-answer-form">
    <textarea
      class="block-answer-form__textarea"
      placeholder="回答を投稿する"
      v-model="answerObj.content"
    ></textarea>
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
    <button
      class="block-answer-form__btn"
      @click="buttonFunc(answerObj)"
      :disabled="isDisabled"
      v-if="!isTwoButton"
    >
      回答
    </button>
    <div class="block-answer-form__two-button" v-else>
      <button
        class="block-answer-form__btn block-answer-form__btn--cancel"
        @click="cancelFunc(answerId, false, { cancel: true })"
      >
        キャンセル
      </button>
      <button
        class="block-answer-form__btn"
        @click="buttonFunc(answerObj, answerId)"
        :disabled="isDisabled.editAnswer"
      >
        保存
      </button>
    </div>
  </div>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";

export default {
  components: {
    ValidationMessage,
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

.block-answer-form__textarea {
  height: 130px;
  padding: 10px;
  border-color: silver;
  border-radius: 3px;
  font-size: 1.1em;
  letter-spacing: 2px;
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

.block-answer-form__btn {
  height: 40px;
  margin: 20px 0;
  border: none;
  border-radius: 5px;
  background: rgb(172, 21, 192);
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
}

.block-answer-form__two-button {
  display: flex;
  justify-content: flex-end;
}

.block-answer-form__btn--cancel {
  background: rgb(167, 165, 165);
  margin-right: 5px;
}
</style>