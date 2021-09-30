<template>
  <div class="container">
    <!-- サインアップフォーム -->
    <form @submit.prevent="signUp" class="form-sign-up">
      <!-- ラベル -->
      <p class="form-sign-up__title">Sign Up</p>

      <!-- ユーザー名 -->
      <input
        class="form-sign-up__input-username"
        type="text"
        placeholder="ユーザー名"
        v-model="username"
      />

      <!-- ユーザー名のバリデーションメッセージ -->
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="usernameMessage"
        />
      </div>

      <!-- メールアドレス -->
      <input
        class="form-sign-up__input-email"
        type="text"
        placeholder="メールアドレス"
        v-model="email"
      />

      <!-- メールアドレスのバリデーションメッセージ -->
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="emailMessage"
        />
      </div>

      <!-- パスワード -->
      <input
        class="form-sign-up__input-password"
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

      <!-- 確認用パスワード -->
      <input
        class="form-sign-up__input-cfm-password"
        type="password"
        placeholder="確認用パスワード"
        v-model="confirmationPassword"
      />

      <!-- 確認用パスワードのバリデーションメッセージ -->
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="cfmMessage"
        />
      </div>

      <!-- ボタン -->
      <button ref="sign_up_button" class="form-sign-up__btn-sign-up">
        新規作成
      </button>
    </form>

    <!-- ログインフォームのリンク -->
    <div class="block-login">
      <p class="block-login__text">アカウントをお持ちの場合</p>
      <router-link class="block-login__link" to="/login">ログイン</router-link>
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
      email: "",
      password: "",
      confirmationPassword: "",
      // バリデーションメッセージ
      usernameMessage: [],
      emailMessage: [],
      passwordMessage: [],
      cfmMessage: [],
    };
  },
  methods: {
    signUp() {
      // 登録ボタンを無効化
      const buttonElement = this.$refs.sign_up_button;
      buttonElement.disabled = true;

      // バリデーションメッセージを初期化
      this.usernameMessage = [];
      this.emailMessage = [];
      this.passwordMessage = [];
      this.cfmMessage = [];

      // バリデーションを実行
      this.validate();

      // バリデーションメッセージが格納されている場合は終了
      if (
        this.usernameMessage.length ||
        this.emailMessage.length ||
        this.passwordMessage.length ||
        this.cfmMessage.length
      ) {
        // ボタンを有効化
        buttonElement.disabled = false;
        return;
      }

      // 登録ユーザーデータ
      const payload = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      this.$store
        .dispatch("auth/signUp", payload)
        .then(() => {
          // ホームページへ
          this.$router.replace("/");
        })
        .catch((err) => {
          // 登録ボタンを有効化
          buttonElement.disabled = false;
          if (err.response.data.message === "Duplicate") {
            err.response.data.fields.forEach((field) => {
              if (field === "username") {
                this.usernameMessage.push(
                  "このユーザー名は既に使われています。"
                );
              } else if (field === "email") {
                this.emailMessage.push(
                  "このメールアドレスは既に使われています。"
                );
              }
            });
          }
        });
    },
    validate() {
      // ユーザー名のバリデーション（最大1個）

      // 文字数
      if (!this.username) {
        this.usernameMessage.push("ユーザー名を入力してください。");
      }

      // メールアドレスのバリデーション（最大1個）

      // メールアドレスの正規表現
      const reg =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;

      // 文字数
      if (!this.email) {
        this.emailMessage.push("メールアドレスを入力してください。");
        // 正規表現
      } else if (!reg.test(this.email)) {
        this.emailMessage.push("メールアドレスを正しく入力してください。");
      }

      // パスワードのバリデーション（最大1個）

      // 文字数
      if (!this.password) {
        this.passwordMessage.push("パスワードを入力してください。");
      } else if (this.password.length < 8) {
        this.passwordMessage.push("パスワードは8文字以上です。");
      }

      // 確認用パスワードのバリデーション（最大1個）

      // 文字数
      if (!this.confirmationPassword) {
        this.cfmMessage.push("確認用パスワードを入力してください。");

        // 確認用パスワードの判定
      } else if (this.confirmationPassword !== this.password) {
        this.cfmMessage.push("確認用パスワードが正しくありません。");
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 180px 0 0;
  animation: fadeIn 0.8s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* サインアップフォーム */
.form-sign-up {
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
.form-sign-up__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 1.8em;
  letter-spacing: 6px;
}

.form-sign-up__title:after {
  content: "";
  display: block;
  width: 90%;
  height: 4px;
  margin-top: 5px;
  background: #0fc;
}

/* 入力欄 */
[class*="input"] {
  width: 85%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid silver;
  border-radius: 5px;
  font-size: 1.1em;
}

.form-sign-up::placeholder {
  color: rgb(170, 167, 167);
  letter-spacing: 3px;
}

/* ボタン */
.form-sign-up__btn-sign-up {
  width: 90%;
  height: 50px;
  margin: 0 0 30px;
  border-width: 0px;
  border-radius: 5px;
  background: rgb(16, 211, 65);
  color: #fff;
  font-size: 1em;
  letter-spacing: 3px;
}

.form-sign-up__btn-sign-up:hover {
  background: rgb(22, 236, 75);
}

.form-sign-up__btn-sign-up:disabled {
  opacity: 0.4;
}

/* ログインフォームへのリンク部分 */
.block-login {
  color: gray;
  font-size: 1.2em;
  letter-spacing: 2px;
  text-align: center;
}

.block-login__text {
  margin: 35px 0 8px;
  font-size: 0.8em;
}

.block-login__link {
  color: rgb(52, 189, 161);
  text-decoration: none;
}

/* バリデーションメッセージ */
.item-validation {
  width: 90%;
  padding-bottom: 10px;
}
</style>
