<template>
  <FollowsList :followsList="followList" />
</template>

<script>
import FollowsList from "@/components/FollowsList";

export default {
  components: {
    FollowsList,
  },
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