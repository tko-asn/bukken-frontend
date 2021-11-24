<template>
  <div class="container">
    <!-- ゲストユーザーの情報 -->
    <div class="block-guest-data" v-show="$route.name === 'login'">
      <h3 class="block-guest-data__text">ゲストユーザー</h3>
      <p class="block-guest-data__help">
        以下の情報からゲストユーザーとしてログインできます
      </p>
      <p class="block-guest-data__text">ユーザー名：test01</p>
      <p class="block-guest-data__text">
        パスワード：<span class="block-guest-data__password">test01-pass</span>
      </p>
    </div>

    <router-view />

    <AuthFormLink :linkObj="loginLink" v-show="$route.name === 'signUp'" />
    <AuthFormLink :linkObj="signUpLink" v-show="$route.name === 'login'" />
  </div>
</template>

<script>
import AuthFormLink from "@/components/AuthFormLink";

export default {
  components: { AuthFormLink },
  data() {
    return {
      loginLink: {
        name: "login",
        label: "アカウントをお持ちの場合",
        value: "ログイン",
      },
      signUpLink: {
        name: "signUp",
        label: "アカウントを持っていない場合",
        value: "アカウントを作成",
      },
    };
  },
};
</script>

<style scoped>
.container {
  padding: 70px 0 0;
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

.block-guest-data {
  width: 35%;
  margin: 0 auto 20px;
  padding: 5px 10px;
  border: 2px solid gray;
  border-radius: 5px;
  background: #fff;
  text-align: center;
}

.block-guest-data__text {
  margin: 5px;
}

.block-guest-data__password {
  display: inline-block;
}

.block-guest-data__help {
  font-size: 0.8em;
}

@media screen and (max-width: 599px) {
  .container {
    padding-top: 80px;
  }

  .block-guest-data {
    width: 80%;
  }
}
</style>