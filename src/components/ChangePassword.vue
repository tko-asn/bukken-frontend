<template>
  <div class="container-change-password">
    <!-- パスワード変更フォーム -->
    <div class="block-input">
      <label class="block-input__label" for="current_password"
        >現在のパスワード</label
      >
      <input
        class="block-input__input"
        type="password"
        name="current_password"
        v-model="currentPassword"
      />
    </div>
    <ValidationMessage
      class="container-change-password__validation"
      :messages="currentPasswdMessage"
      v-show="currentPasswdMessage.length"
    />
    <div class="block-input">
      <label class="block-input__label" for="new_password"
        >新しいパスワード</label
      >
      <input
        class="block-input__input"
        type="password"
        name="new_password"
        v-model="newPassword"
      />
    </div>
    <ValidationMessage
      class="container-change-password__validation"
      :messages="newPasswdMessage"
      v-show="newPasswdMessage.length"
    />
    <div class="block-input">
      <label class="block-input__label" for="current_password"
        >確認用パスワード</label
      >
      <input
        class="block-input__input"
        type="password"
        name="current_password"
        v-model="cfmPassword"
      />
    </div>
    <ValidationMessage
      class="container-change-password__validation"
      :messages="cfmPasswdMessage"
      v-show="cfmPasswdMessage.length"
    />

    <!-- ボタン -->
    <button class="container-change-password__btn" @click="changePassword">
      保存
    </button>
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
      currentPassword: "",
      newPassword: "",
      cfmPassword: "",
      // バリデーションメッセージ
      currentPasswdMessage: [],
      newPasswdMessage: [],
      cfmPasswdMessage: [],
    };
  },
  methods: {
    changePassword() {
      // バリデーションメッセージの初期化
      this.currentPasswdMessage = [];
      this.newPasswdMessage = [];
      this.cfmPasswdMessage = [];

      // バリデーション
      this.validate();

      if (
        this.currentPasswdMessage.length ||
        this.newPasswdMessage.length ||
        this.cfmPasswdMessage.length
      ) {
        return;
      }

      // データはオブジェクトで送信
      this.$store
        .dispatch("auth/editAuthInfo", {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        })
        .then(() => {
          this.$router.push({
            // マイページへ
            name: "userView",
            params: { id: this.$store.getters["auth/userId"] },
          });
        })
        .catch((err) => {
          // 現在のパスワードが違う場合
          if (err.response.data.message === "Invalid current password") {
            this.currentPasswdMessage.push(
              "現在のパスワードが正しくありません。"
            );
          }
        });
    },
    // 各入力欄バリデーション
    validate() {
      // 入力されてない場合
      if (!this.currentPassword) {
        this.currentPasswdMessage.push("現在のパスワードを入力してください。");

        // 8文字未満の場合
      } else if (this.currentPassword.length < 8) {
        this.currentPasswdMessage.push("現在のパスワードが正しくありません。");
      }

      // 入力されてない場合
      if (!this.newPassword) {
        this.newPasswdMessage.push("新しいパスワードを入力してください。");

        // 8文字未満の場合
      } else if (this.newPassword.length < 8) {
        this.newPasswdMessage.push(
          "新しいパスワードを正しく入力してください。"
        );
      }

      // 入力されてない場合
      if (!this.cfmPassword) {
        this.cfmPasswdMessage.push("確認用パスワードを入力してください。");

        // 新しいパスワードと一致しない場合
      } else if (this.newPassword !== this.cfmPassword) {
        this.cfmPasswdMessage.push("確認用パスワードが正しくありません。");
      }
    },
  },
};
</script>

<style scoped>
/* コンテナ */
.container-change-password {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
}

/* ラベル要素 */
.block-input__label {
  margin-right: 20px;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 1px;
}

/* 各入力部分 */
.block-input {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
}

.block-input__input {
  flex-grow: 3;
  height: 25px;
}

/* ボタン */
.container-change-password__btn {
  margin-top: 20px;
  padding: 5px 10px;
  border: none;
  background: green;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}

@media screen and (max-width: 599px) {
  .block-input {
    flex-direction: column;
    align-items: flex-start;
  }

  .block-input__input {
    width: 100%;
    height: 20px;
    border: 1px solid gray;
  }
}
</style>