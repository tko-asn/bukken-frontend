<template>
  <div class="container">
    <!-- ログインフォーム -->
    <form @submit.prevent="login" class="form-login">
      <!-- ラベル -->
      <p class="form-login__title">Login</p>

      <!-- フォーム -->
      <!-- ユーザー名 -->
      <input
        class="form-login__input-username"
        type="text"
        placeholder="ユーザー名またはメールアドレス"
        v-model="username"
      />

      <!-- ユーザー名のバリデーションメッセージ -->
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="usernameMessage"
        />
      </div>

      <!-- パスワード -->
      <input
        class="form-login__input-password"
        type="password"
        placeholder="パスワード"
        v-model="password"
      />

      <!-- パスワードのバリデーションメッセージ -->
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="passwordMessage"
        />
      </div>

      <!-- ボタン -->
      <button ref="login_button" class="form-login__btn-login">ログイン</button>
    </form>

    <!-- サインアップフォームのリンク -->
    <div class="block-sign-up">
      <p class="block-sign-up__text">アカウントを持っていない場合</p>
      <router-link class="block-sign-up__link" to="/signup"
        >アカウントを作成</router-link
      >
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
      username: "",
      password: "",
      // バリデーションメッセージ
      usernameMessage: [],
      passwordMessage: [],
    };
  },
  methods: {
    // ログイン
    login() {
      // ボタンの無効化
      const buttonElement = this.$refs.login_button;
      buttonElement.disabled = true;

      // バリデーションメッセージを初期化
      this.usernameMessage = [];
      this.emailMessage = [];
      this.passwordMessage = [];

      // バリデーションの実行
      this.validate();

      // バリデーションメッセージが格納されている場合は終了
      if (
        this.usernameMessage.length ||
        this.emailMessage.length ||
        this.passwordMessage.length
      ) {
        // ボタンを有効化
        buttonElement.disabled = false;
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
        .catch(() => {
          // ボタンの有効化
          buttonElement.disabled = false;
        });
    },
    validate() {
      // ユーザー名のバリデーション（最大1個）

      // 文字数
      if (!this.username) {
        this.usernameMessage.push("ユーザー名を入力してください。");
      }

      // パスワードのバリデーション（最大1個）

      // 文字数
      if (!this.password) {
        this.passwordMessage.push("パスワードを入力してください。");
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 190px 0 0;
}

/* ログインフォーム */
.form-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 510px;
  margin: 0 auto;
  border: 4px solid rgb(143, 141, 141);
  border-radius: 7px;
  background: #fff;
}

/* フォームラベル */
.form-login__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 1.8em;
  letter-spacing: 6px;
}

.form-login__title:after {
  content: "";
  display: block;
  width: 90%;
  height: 4px;
  margin: 10px 0 0;
  background: #0fc;
}

/* 入力欄 */
[class*="input"] {
  width: 85%;
  height: 45px;
  padding: 0 15px;
  border: 1px solid silver;
  border-radius: 5px;
  font-size: 1.2em;
}

.form-login::placeholder {
  color: rgb(170, 167, 167);
  letter-spacing: 2px;
}

/* ボタン */
.form-login__btn-login {
  width: 90%;
  height: 50px;
  margin-bottom: 30px;
  border: none;
  border-radius: 5px;
  background: rgb(16, 211, 65);
  color: #fff;
  letter-spacing: 3px;
}

.form-login__btn-login:hover {
  background: rgb(22, 236, 75);
}

.form-login__btn-login:disabled {
  opacity: 0.4;
}

/* サインアップフォームへのリンク部分 */
.block-sign-up {
  color: gray;
  font-size: 1.2em;
  letter-spacing: 2px;
  text-align: center;
}

.block-sign-up__text {
  margin: 45px 0 10px;
  font-size: 0.8em;
}

.block-sign-up__link {
  color: rgb(52, 189, 161);
  text-decoration: none;
}

/* バリデーションメッセージ */
.item-validation {
  width: 90%;
  padding-bottom: 15px;
}
</style>