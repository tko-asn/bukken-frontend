<template>
  <!-- アカウント閉鎖 -->
  <div class="block-delete-account">
    <p class="block-delete-account__text">アカウントを閉鎖しますか？</p>
    <p class="block-delete-account__text block-delete-account__text--red">
      アカウントを閉鎖すると<span class="block-delete-account__span"
        >二度と復元できなくなります。</span
      >
    </p>
    <p class="block-delete-account__text block-delete-account__text--red">
      投稿はすべて削除されます。
    </p>
    <p class="block-delete-account__text">
      閉鎖する場合は<span class="block-delete-account__span"
        >「完全に削除」と入力して下さい。</span
      >
    </p>
    <MediumInput placeholder="完全に削除" v-model="deleteText" />
    <!-- ボタン -->
    <div class="item-btn">
      <LargeButton
        btnValue="アカウントを閉鎖"
        :isDisabled="isDisabled"
        :background="DELETE"
        width="180px"
        @click="deleteAccount"
      />
    </div>
  </div>
</template>

<script>
import LargeButton from "@/components/LargeButton";
import MediumInput from "@/components/MediumInput";
import getColorsMixin from "@/mixins/getColorsMixin";

export default {
  components: {
    LargeButton,
    MediumInput,
  },
  mixins: [getColorsMixin],
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

@media screen and (max-width: 599px) {
  .block-delete-account {
    text-align: center;
  }

  .block-delete-account__text {
    display: flex;
    flex-wrap: wrap;
  }

  .item-btn {
    justify-content: center;
  }
}
</style>