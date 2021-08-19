<template>
  <div class="follow_list">
    <div class="container">
      <template v-if="followList.length">
        <!-- ユーザー表示部分 -->
        <div
          class="follow_user"
          v-for="followObj in followList"
          :key="followObj.id"
        >
          <div class="icon">
            <img :src="followObj.follow.iconURL" />
          </div>
          <div class="username">
            <p>{{ followObj.follow.username }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text_no_follow">フォローしているユーザーがいません</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMe: Boolean, // ログインユーザーかどうか
    userId: String,
    follow: Array, // ログインユーザーのフォローリスト
  },
  created() {
    if (!this.isMe) {
      // 他のユーザーのフォローリストを取得
      this.$store
        .dispatch("follows/getFollow", { userId: this.userId, isMe: false })
        .then((followList) => {
          if (!this.isMe) {
            this.followList = followList; // 他のユーザーのフォローデータの場合はdataに保存
          }
        });
    } else {
      // ログインユーザーのフォローリストをセット
      this.followList = this.follow;
    }
  },
  data() {
    return {
      // 他のユーザーのフォローデータのリスト
      followList: [],
    };
  },
};
</script>

<style scoped>
/* ページ全体 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ユーザー表示部分 */
.follow_user {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  box-shadow: 0 2px 6px rgb(51, 48, 48);
  background: #fff;
}

/* アイコン */
.icon {
  width: 100px;
  height: 100px;
  background: silver;
}

.icon > img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

/* ユーザー名 */
.username {
  margin-left: 30px;
  overflow: hidden;
  font-size: 1.5em;
  letter-spacing: 2px;
}

.text_no_follow {
  color: gray;
  font-size: 1.2em;
}
</style>