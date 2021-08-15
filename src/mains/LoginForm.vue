<template>
  <div class="area_login_form">
    <div class="container">
      <!-- ログインフォーム -->
      <form @submit.prevent="login" class="login_form">
        <!-- ラベル -->
        <div class="head_login_form">
          <p class="ttl">Login</p>
        </div>

        <!-- フォーム -->
        <div class="body_login_form">
          <!-- ユーザー名 -->
          <input
            class="input_username"
            type="text"
            placeholder="ユーザー名またはメールアドレス"
            v-model="username"
          />

          <!-- ユーザー名のバリデーションメッセージ -->
          <ValidationMessage :messages="usernameMessage" />

          <!-- パスワード -->
          <input
            class="input_password"
            type="password"
            placeholder="パスワード"
            v-model="password"
          />

          <!-- パスワードのバリデーションメッセージ -->
          <ValidationMessage :messages="passwordMessage" />

          <!-- ボタン -->
          <button ref="login_button" class="btn_login">ログイン</button>
        </div>
      </form>

      <!-- サインアップフォームのリンク -->
      <div class="link_sign_up">
        <p>アカウントを持っていない場合</p>
        <router-link to="/signup">アカウントを作成</router-link>
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

      this.$store.dispatch("auth/login", payload)
      .then(() => {
        // 遷移先のパス
        let nextPage = '/';

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
        this.usernameMessage.push("ユーザー名を入力して下さい。");
      }

      // パスワードのバリデーション（最大1個）

      // 文字数
      if (!this.password) {
        this.passwordMessage.push("パスワードを入力して下さい。");
      }
    }
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
  padding: 190px 0 0;
}

/* ログインフォーム */
.login_form {
  max-width: 510px;
  height: 400px;
  margin: 0 auto;
  border-radius: 7px;
  background: #fff;
}

/* フォームラベル */
.head_login_form {
  display: flex;
  justify-content: center;
  margin: 0 0 20px;
  text-align: center;
}

.head_login_form .ttl {
  position: relative;
  width: 100%;
  font-size: 1.8em;
  letter-spacing: 6px;
}

.head_login_form .ttl:after {
  content: "";
  display: block;
  width: 90%;
  height: 4px;
  margin: 10px auto 0;
  background: #0fc;
}

/* 入力欄 */
.body_login_form {
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
  font-size: 1.2em;
}

.body_login_form > ::placeholder {
  color: rgb(170, 167, 167);
  letter-spacing: 2px;
}

/* ボタン */
.btn_login {
  width: 87%;
  height: 50px;
  margin: 0 auto 10px;
  border-width: 0px;
  border-radius: 5px;
  background: rgb(16, 211, 65);
  color: #fff;
  font-size: 1em;
  letter-spacing: 3px;
}

.btn_login:hover {
  background: rgb(22, 236, 75);
}

/* サインアップフォームへのリンク部分 */
.link_sign_up {
  margin: 45px 0 0;
  color: gray;
  font-size: 1.2em;
  letter-spacing: 2px;
  text-align: center;
}

.link_sign_up > p {
  margin: 0 0 10px;
  font-size: 0.8em;
}
</style>