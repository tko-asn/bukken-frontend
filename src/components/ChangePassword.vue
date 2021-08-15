<template>
  <div class="change_password">
    <div class="container">
      <!-- パスワード変更フォーム -->
      <div class="input_current_password">
        <label class="ttl" for="current_password">現在のパスワード</label>
        <input type="password" name="current_password" v-model="currentPassword" />
      </div>
      <ValidationMessage
        :messages="currentPasswdMessage"
        v-show="currentPasswdMessage.length"
      />
      <div class="input_new_password">
        <label class="ttl" for="new_password">新しいパスワード</label>
        <input type="password" name="new_password" v-model="newPassword" />
      </div>
      <ValidationMessage
        :messages="newPasswdMessage"
        v-show="newPasswdMessage.length"
      />
      <div class="input_cfm_password">
        <label class="ttl" for="current_password">確認用パスワード</label>
        <input type="password" name="current_password" v-model="cfmPassword" />
      </div>
      <ValidationMessage
        class="validation"
        :messages="cfmPasswdMessage"
        v-show="cfmPasswdMessage.length"
      />

      <!-- ボタン -->
      <button class="btn_change_password" @click="changePassword">保存</button>
    </div>
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
        .catch(err => {
          // 現在のパスワードが違う場合
          if (err.response.data.message === 'Invalid current password') {
            this.currentPasswdMessage.push('現在のパスワードが正しくありません。');
          }
        })
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
/* ページ全体 */
.change_password {
  height: 100%;
  padding: 20px;
  background: #fff;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

/* ラベル要素 */
.ttl {
  margin-right: 20px;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 1px;
}

/* 各入力部分 */
[class*="input"] {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

[class*="input"] > input {
  flex-grow: 3;
  height: 25px;
}

/* バリデーションメッセージ */
.validation {
  margin: 0;
}

/* ボタン */
.btn_change_password {
  margin-top: 20px;
  padding: 5px 10px;
  border-color: #fff;
  background: green;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}
</style>