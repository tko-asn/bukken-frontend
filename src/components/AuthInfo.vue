<template>
  <div class="block-auth-info">
    <ContentTitle title="認証情報" :showMenuFunc="showMenuFunc" />
    <Content>
      <div class="container-auth-info">
        <!-- メールアドレス -->
        <div class="block-email">
          <label for="email" class="block-email__label">メールアドレス</label>
          <SmallInput name="email" v-model="userEmail" />
        </div>
        <div class="item-validation">
          <ValidationMessage
            :messages="emailMessages"
            v-show="emailMessages.length"
          />
        </div>
        <SmallButton
          class="container-auth-info__btn"
          btnValue="保存"
          @click="changeEmail"
          :isDisabled="isDisabled"
        />
        <router-link
          :to="{ name: 'changePassword' }"
          class="container-auth-info__link"
          >パスワードの変更</router-link
        >
      </div>
    </Content>
  </div>
</template>

<script>
import ContentTitle from "@/components/ContentTitle";
import Content from "@/components/Content";
import ValidationMessage from "@/components/ValidationMessage";
import SmallInput from "@/components/SmallInput";
import SmallButton from "@/components/SmallButton";

export default {
  props: {
    showMenuFunc: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    ContentTitle,
    Content,
    ValidationMessage,
    SmallInput,
    SmallButton,
  },
  data() {
    return {
      userEmail: "",
      emailMessages: [],
      isDisabled: false,
    };
  },
  created() {
    // vuexからemailを取得
    this.userEmail = this.$store.getters["auth/email"];
  },
  methods: {
    changeEmail() {
      this.isDisabled = true;
      this.emailMessages = [];

      if (!this.userEmail) {
        this.emailMessages.push("メールアドレスを入力してください。");
        this.isDisabled = false;
        return;
      }

      // データはオブジェクトで送信
      this.$store
        .dispatch("auth/editAuthInfo", { email: this.userEmail })
        .then(() => {
          this.$router.replace({
            name: "userView",
            params: { id: this.$store.getters["auth/userId"] },
          }); // マイページへ
        })
        .catch((err) => {
          this.isDisabled = false;
          if (err.response.data.message === "Duplicate") {
            err.response.data.fields.forEach((field) => {
              if (field === "email") {
                this.emailMessages.push(
                  "このメールアドレスは既に使われています。"
                );
              }
            });
          }
        });
    },
  },
};
</script>

<style scoped>
/* コンテナ */
.container-auth-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 20px 0 10px;
}

/* フォーム部分 */
.block-email {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* ラベル要素 */
.block-email__label {
  align-self: flex-start;
  font-weight: bold;
  letter-spacing: 1px;
}

/* パスワード変更のリンク */
.container-auth-info__link {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 0 10px;
  text-decoration: none;
  font-size: 0.8em;
}

.item-validation {
  width: 100%;
  font-size: 0.9em;
}

.container-auth-info__btn {
  margin-top: 20px;
}
</style>