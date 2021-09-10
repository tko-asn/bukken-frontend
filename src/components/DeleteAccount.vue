<template>
  <!-- アカウント閉鎖 -->
  <div class="block-delete-account">
    <p class="block-delete-account__text">アカウントを閉鎖しますか？</p>
    <p class="block-delete-account__text block-delete-account__text--red">
      アカウントを閉鎖すると二度と復元できなくなります。
    </p>
    <p class="block-delete-account__text block-delete-account__text--red">
      投稿はすべて削除されます。
    </p>
    <p class="block-delete-account__text">
      閉鎖する場合は「完全に削除」と入力して下さい。
    </p>
    <input
      class="block-delete-account__input"
      type="text"
      placeholder="完全に削除"
      v-model="deleteText"
    />
    <!-- ボタン -->
    <div class="item-btn">
      <button
        class="item-btn__btn"
        @click="deleteAccount"
        :disabled="isDisabled"
      >
        アカウントを閉鎖
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deleteText: "", // アカウント閉鎖確認用
    };
  },
  computed: {
    isDisabled() {
      // アカウント閉鎖ボタン
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
.block-delete-account {
  padding-top: 30px;
}

.block-delete-account__input {
  width: 70%;
  height: 40px;
  margin-top: 10px;
  padding-left: 10px;
  font-size: 1.1em;
}

.block-delete-account__text {
  font-size: 0.9em;
}

/* 警告文 */
.block-delete-account__text--red {
  color: red;
}

.block-delete-account__text--red + .block-delete-account__text--red {
  margin-bottom: 50px;
}

/* ボタン */
.item-btn {
  display: flex;
  justify-content: flex-end;
}

.item-btn__btn {
  margin-top: 30px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: rgba(247, 18, 10, 0.829);
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
}

.item-btn__btn:disabled {
  opacity: 0.6;
}
</style>