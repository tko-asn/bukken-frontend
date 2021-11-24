<template>
  <!-- サインアップフォーム -->
  <form @submit.prevent="signUp" class="form-sign-up">
    <!-- タイトル -->
    <AuthFormTitle title="Sign Up" />
    <div class="form-sign-up__items">
      <!-- ユーザー名 -->
      <SmallInput placeholder="ユーザー名" v-model="username" />
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="usernameMessage"
        />
      </div>

      <!-- メールアドレス -->
      <SmallInput placeholder="メールアドレス" v-model="email" />
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="emailMessage"
        />
      </div>

      <!-- パスワード -->
      <SmallInput type="password" placeholder="パスワード" v-model="password" />
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="passwordMessage"
        />
      </div>

      <!-- 確認用パスワード -->
      <SmallInput
        type="password"
        placeholder="確認用パスワード"
        v-model="confirmationPassword"
      />
      <div class="item-validation">
        <ValidationMessage
          class="item-validation__validation"
          :messages="cfmMessage"
        />
      </div>

      <!-- ボタン -->
      <SmallButton
        btnValue="新規登録"
        @click="signUp"
        :isDisabled="isDisabled"
      />
    </div>
  </form>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";
import AuthFormTitle from "@/components/AuthFormTitle";
import SmallInput from "@/components/SmallInput";
import SmallButton from "@/components/SmallButton";

export default {
  components: {
    ValidationMessage,
    AuthFormTitle,
    SmallInput,
    SmallButton,
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
      isDisabled: false,
    };
  },
  methods: {
    signUp() {
      // 登録ボタンを無効化
      this.isDisabled = true;

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
        this.isDisabled = false;
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
          this.isDisabled = false;
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
.form-sign-up {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 430px;
  margin: 65px auto 0;
  padding-bottom: 10px;
  border: 2px solid rgb(143, 141, 141);
  border-radius: 7px;
  background: #fff;
}

.item-validation {
  font-size: 0.8em;
}

.form-sign-up__items {
  width: 85%;
}
</style>