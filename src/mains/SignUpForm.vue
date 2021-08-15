<template>
  <div class="area_sign_up_form">
    <div class="container">
      <!-- サインアップフォーム -->
      <form @submit.prevent="signUp" class="sign_up_form">
        <!-- ラベル -->
        <div class="head_sign_up_form">
          <p class="ttl">Sign Up</p>
        </div>

        <!-- フォーム -->
        <div class="body_sign_up_form">
          <!-- ユーザー名 -->
          <input
            class="input_username"
            type="text"
            placeholder="ユーザー名"
            v-model="username"
          />
          
          <!-- ユーザー名のバリデーションメッセージ -->
          <ValidationMessage :messages="usernameMessage" />

          <!-- メールアドレス -->
          <input
            class="input_email"
            type="text"
            placeholder="メールアドレス"
            v-model="email"
          />

          <!-- メールアドレスのバリデーションメッセージ -->
          <ValidationMessage :messages="emailMessage" />

          <!-- パスワード -->
          <input
            class="input_password"
            type="password"
            placeholder="パスワード"
            v-model="password"
          />

          <!-- パスワードのバリデーションメッセージ -->
          <ValidationMessage :messages="passwordMessage" />

          <!-- 確認用パスワード -->
          <input
            class="input_confirmation"
            type="password"
            placeholder="確認用パスワード"
            v-model="confirmationPassword"
          />

          <!-- 確認用パスワードのバリデーションメッセージ -->
          <ValidationMessage :messages="cpMessage" />

          <!-- ボタン -->
          <button ref="sign_up_button" class="btn_sign_up">新規作成</button>
        </div>
      </form>

      <!-- ログインフォームのリンク -->
      <div class="link_login">
        <p>アカウントをお持ちの場合</p>
        <router-link to="/login">ログイン</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ValidationMessage from '@/components/ValidationMessage';

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
      cpMessage: [], 
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
      this.cpMessage = [];

      // バリデーションを実行
      this.validate();

      // バリデーションメッセージが格納されている場合は終了
      if (
        this.usernameMessage.length || 
        this.emailMessage.length || 
        this.passwordMessage.length || 
        this.cpMessage.length
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
        .catch(() => {
          // 登録ボタンを有効化
          buttonElement.disabled = false;
        });
    },
    validate() {
      // ユーザー名のバリデーション（最大1個）

      // 文字数
      if (!this.username) {
        this.usernameMessage.push("ユーザー名を入力して下さい。");
      }

      // メールアドレスのバリデーション（最大1個）

      // メールアドレスの正規表現
      const reg =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;

      // 文字数
      if (!this.email) {
        this.emailMessage.push("メールアドレスを入力して下さい。");
        // 正規表現
      } else if (!reg.test(this.email)) {
        this.emailMessage.push(
          "メールアドレスを正しく入力して下さい。"
        );
      }

      // パスワードのバリデーション（最大1個）

      // 文字数
      if (!this.password) {
        this.passwordMessage.push("パスワードを入力して下さい。");
      } else if (this.password.length < 8) {
        this.passwordMessage.push("パスワードは8文字以上です。");
      }

      // 確認用パスワードのバリデーション（最大1個）

      // 文字数
      if (!this.confirmationPassword) {
        this.cpMessage.push("確認用パスワードを入力して下さい。");

        // 確認用パスワードの判定
      } else if (this.confirmationPassword !== this.password) {
        this.cpMessage.push('確認用パスワードが正しくありません。');
      }
    },
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  color: rgb(52, 189, 161);
  text-decoration: none;
}

.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 120px 0 0;
}

/* サインアップフォーム */
.sign_up_form {
  max-width: 510px;
  height: 540px;
  margin: 0 auto;
  border-radius: 7px;
  background: #fff;
}

/* フォームラベル */
.head_sign_up_form {
  display: flex;
  justify-content: center;
  margin: 0 0 5px;
  text-align: center;
}

.head_sign_up_form .ttl {
  position: relative;
  width: 100%;
  font-size: 1.8em;
  letter-spacing: 6px;
}

.head_sign_up_form .ttl:after {
  content: "";
  display: block;
  width: 90%;
  height: 4px;
  margin: 10px auto 0;
  background: #0fc;
}

/* 入力欄 */
.body_sign_up_form {
  display: flex;
  flex-direction: column;
}

[class*="input"] {
  width: 85%;
  height: 45px;
  margin: 0 auto;
  padding-left: 15px;
  border: 1px solid silver;
  border-radius: 5px;
  font-size: 1.1em;
}

.body_sign_up_form > ::placeholder {
  color: rgb(170, 167, 167);
  letter-spacing: 3px;
}

/* ボタン */
.btn_sign_up {
  width: 87%;
  height: 50px;
  margin: 5px auto;
  border-width: 0px;
  border-radius: 5px;
  background: rgb(16, 211, 65);
  color: #fff;
  font-size: 1em;
  letter-spacing: 3px;
}

.btn_sign_up:hover {
  background: rgb(22, 236, 75);
}

/* ログインフォームへのリンク部分 */
.link_login {
  margin: 35px 0 0;
  color: gray;
  font-size: 1.2em;
  letter-spacing: 2px;
  text-align: center;
}

.link_login > p {
  margin: 0 0 8px;
  font-size: 0.8em;
}
</style>
