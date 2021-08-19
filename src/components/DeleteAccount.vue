<template>
  <!-- アカウント閉鎖 -->
  <section class="delete_account">
    <!-- タイトル -->
    <div class="top_delete_account">
      <h1>アカウントを閉鎖する</h1>
    </div>

    <!-- メッセージ＆フォーム -->
    <div class="middle_delete_account">
      <p>アカウントを閉鎖しますか？</p>
      <p class="warning_text">
        アカウントを閉鎖すると二度と復元できなくなります。
      </p>
      <p class="warning_text">投稿はすべて削除されます。</p>
      <p>閉鎖する場合は「完全に削除」と入力して下さい。</p>
      <input type="text" placeholder="完全に削除" v-model="deleteText" />
    </div>

    <!-- ボタン -->
    <div class="bottom_delete_account">
      <button @click="deleteAccount" :disabled="isDisabled">
        アカウントを閉鎖
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      deleteText: "", // アカウント閉鎖確認用
    };
  },
  computed: {
    isDisabled() { // アカウント閉鎖ボタン
      if (this.deleteText === "完全に削除") {
        return false;
      }
      return true;
    },
  },
  methods: {
    // アカウント削除
    deleteAccount() {
      this.$store.dispatch("auth/delete").then(() => {
        // ホームページへ
        this.$router.replace("/");
      });
    },
  },
};
</script>

<style scoped>
/* トップ部分 */
.top_delete_account {
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 20px;
  background: rgb(52, 52, 80);
  color: #fff;
}

.top_delete_account > h1 {
  font-size: 1.5em;
}

/* 中央部分 */
.middle_delete_account {
  margin-top: 30px;
}

.middle_delete_account > input {
  width: 70%;
  height: 40px;
  margin-top: 10px;
  padding-left: 10px;
  font-size: 1.1em;
}

/* 警告文 */
.warning_text {
  color: red;
  font-size: 0.9em;
}

.warning_text + .warning_text {
  margin-bottom: 50px;
}

/* ボトム部分 */
.bottom_delete_account {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 30px;
  padding-right: 20px;
}

.bottom_delete_account > button {
  padding: 10px;
  border-color: #fff;
  border-radius: 8px;
  background: rgba(247, 18, 10, 0.829);
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
}

.bottom_delete_account > button[disabled] {
  background: rgba(241, 153, 150, 0.829);
}
</style>