<template>
  <FollowsList :followsList="followerList" />
</template>

<script>
import FollowsList from '@/components/FollowsList';

export default {
  components: {
    FollowsList,
  },
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