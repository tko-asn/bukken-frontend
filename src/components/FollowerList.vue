<template>
  <div class="follower_list">
    <div class="container">
      <!-- フォロワーがいる場合 -->
      <template v-if="followerList.length">
        <!-- ユーザー表示部分 -->
        <div
          class="follower"
          v-for="followerObj in followerList"
          :key="followerObj.id"
        >
          <div class="icon">
            <img :src="followerObj.user.iconURL" />
          </div>
          <div class="username">
            <p>{{ followerObj.user.username }}</p>
          </div>
        </div>
      </template>

      <!-- フォロワーがいない場合 -->
      <template v-else>
        <p class="text_no_follower">フォロワーはいません</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMe: Boolean, // ログインユーザーかどうか
    userId: String,
    follower: Array, // ログインユーザーのフォロワーリスト
  },
  created() {
    if (!this.isMe) {
      // 他のユーザーのフォロワーリストを取得
      this.$store
        .dispatch("follows/getFollower", { followId: this.userId, isMe: false })
        .then((followerList) => {
          this.followerList = followerList; // 他のユーザーのフォロワーデータの場合はdataに保存
        });
    } else {
      // ログインユーザーのフォロワーリストをセット
      this.followerList = this.follower;
    }
  },
  data() {
    return {
      // 他のユーザーのフォロワーデータのリスト
      followerList: [],
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
.follower {
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

.text_no_follower {
  color: gray;
  font-size: 1.2em;
}
</style>