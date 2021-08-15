<template>
  <div class="auth_info">
    <div class="container">
      <!-- メールアドレス -->
      <div class="input_email">
        <label for="email" class="ttl">メールアドレス</label>
        <input type="text" name="email" v-model="userEmail" />
      </div>
      <button class="btn_edit_email" @click="changeEmail">保存</button>
      <div class="change_password">
        <router-link :to="{ name: 'changePassword' }"
          >パスワードの変更</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userEmail: "",
    };
  },
  created() {
    // vuexからemailを取得
    this.userEmail = this.$store.getters["auth/email"];
  },
  methods: {
    changeEmail() {
      // データはオブジェクトで送信
      this.$store
        .dispatch("auth/editAuthInfo", { email: this.userEmail })
        .then(() => {
          this.$router.replace({
            name: "userView",
            params: { id: this.$store.getters["auth/userId"] },
          }); // マイページへ
        });
    },
  },
};
</script>

<style scoped>
/* ページ全体 */
.auth_info {
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

/* フォーム部分 */
.input_email {
  display: flex;
  align-items: center;
  width: 100%;
}

/* ラベル要素 */
.ttl {
  margin-right: 20px;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 1px;
}

/* input要素 */
.input_email > input {
  flex-grow: 3;
  height: 30px;
}

/* 保存ボタン */
.btn_edit_email {
  margin-top: 20px;
  padding: 5px 10px;
  border-color: #fff;
  background: green;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}

/* パスワード変更のリンク */
.change_password {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin-top: 15px;
}

a {
  margin-right: 10px;
  letter-spacing: 1px;
  text-decoration: none;
}
</style>