<template>
  <!-- ログインフォーム -->
  <form @submit.prevent="login" class="form-login">
    <!-- タイトル -->
    <AuthFormTitle title="Login" />

    <!-- ログインのバリデーションメッセージ -->
    <div class="item-validation" v-show="loginMessage.length">
      <ValidationMessage
        class="item-validaton__validation"
        :messages="loginMessage"
      />
    </div>

    <!-- ユーザー名 -->
    <AuthInput
      placeholder="ユーザー名またはメールアドレス"
      v-model="username"
    />
    <div class="item-validation">
      <ValidationMessage
        class="item-validation__validation"
        :messages="usernameMessage"
      />
    </div>

    <!-- パスワード -->
    <AuthInput placeholder="パスワード" v-model="password" type="password" />
    <div class="item-validation">
      <ValidationMessage
        class="item-validation__validation"
        :messages="passwordMessage"
      />
    </div>

    <!-- ボタン -->
    <AuthButton
      btnValue="ログイン"
      :authFunc="login"
      :isDisabled="isDisabled"
    />
  </form>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";
import AuthFormTitle from "@/components/AuthFormTitle";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";

export default {
  components: {
    ValidationMessage,
    AuthFormTitle,
    AuthInput,
    AuthButton,
  },
  data() {
    return {
      username: "",
      password: "",
      // バリデーションメッセージ
      usernameMessage: [],
      passwordMessage: [],
      loginMessage: [],
      isDisabled: false,
    };
  },
  methods: {
    // ログイン
    login() {
      // ボタンの無効化
      this.isDisabled = true;

      // バリデーションメッセージを初期化
      this.usernameMessage = [];
      this.passwordMessage = [];
      this.loginMessage = [];

      // バリデーションの実行
      this.validate();

      // バリデーションメッセージが格納されている場合は終了
      if (this.usernameMessage.length || this.passwordMessage.length) {
        // ボタンを有効化
        this.isDisabled = false;
        return;
      }

      // ログイン情報
      const payload = {
        username: this.username,
        password: this.password,
      };

      this.$store
        .dispatch("auth/login", payload)
        .then(() => {
          // 遷移先のパス
          let nextPage = "/";

          // クエリパラメータが設定されている場合
          if (this.$route.query.next) {
            nextPage = this.$route.query.next;
          }

          // ホームページへ
          this.$router.replace(nextPage);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.loginMessage.push("認証情報が間違っています。");
          }
          // ボタンの有効化
          this.isDisabled = false;
        });
    },
    validate() {
      // ユーザー名のバリデーション

      // 文字数
      if (!this.username) {
        this.usernameMessage.push("ユーザー名を入力してください。");
      }

      // パスワードのバリデーション

      // 文字数
      if (!this.password) {
        this.passwordMessage.push("パスワードを入力してください。");
      }
    },
  },
};
</script>

<style scoped>
.form-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  border: 2px solid rgb(143, 141, 141);
  border-radius: 7px;
  background: #fff;
}

.item-validation {
  width: 85%;
  font-size: 0.8em;
}
</style>