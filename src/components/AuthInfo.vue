<template>
  <div class="container-auth-info">
    <!-- メールアドレス -->
    <div class="block-email">
      <label for="email" class="block-email__label">メールアドレス</label>
      <input
        class="block-email__input"
        type="text"
        name="email"
        v-model="userEmail"
      />
    </div>
    <ValidationMessage
      :messages="emailMessages"
      v-show="emailMessages.length"
    />
    <button class="container-auth-info__btn" @click="changeEmail">保存</button>
    <router-link
      :to="{ name: 'changePassword' }"
      class="container-auth-info__link"
      >パスワードの変更</router-link
    >
  </div>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";

export default {
  components: {
    ValidationMessage,
  },
  data() {
    return {
      userEmail: "",
      emailMessages: [],
    };
  },
  created() {
    // vuexからemailを取得
    this.userEmail = this.$store.getters["auth/email"];
  },
  methods: {
    changeEmail() {
      this.emailMessages = [];

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
  padding: 20px;
  background: #fff;
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

/* input要素 */
.block-email__input {
  flex-grow: 3;
  width: 95%;
  height: 20px;
  border: 1px solid silver;
  border-radius: 4px;
}

/* 保存ボタン */
.container-auth-info__btn {
  margin-top: 20px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  background: green;
  color: white;
  cursor: pointer;
}

/* パスワード変更のリンク */
.container-auth-info__link {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 15px 10px 0;
  text-decoration: none;
  font-size: 0.8em;
}
</style>