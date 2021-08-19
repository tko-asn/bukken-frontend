<template>
  <div class="follows_list">
    <div class="container">
      <!-- 表示するユーザーがいる場合 -->
      <template v-if="followsList.length">
        <!-- ユーザー表示部分 -->

        <!-- フォロワーを表示する場合 -->
        <template v-if="$route.name === 'followerList'">
          <div
            class="follows_user"
            v-for="followsObj in followsList"
            :key="followsObj.id"
          >
            <div class="icon">
              <img :src="followsObj.user.iconURL" />
            </div>
            <div class="username">
              <p>{{ followsObj.user.username }}</p>
            </div>
          </div>
        </template>

        <!-- フォローしているユーザーを表示する場合 -->
        <template v-else>
          <div
          class="follows_user"
          v-for="followsObj in followsList"
          :key="followsObj.id"
        >
          <div class="icon">
            <img :src="followsObj.follow.iconURL" />
          </div>
          <div class="username">
            <p>{{ followsObj.follow.username }}</p>
          </div>
        </div>
        </template>
      </template>

      <!-- 表示するユーザーがいない場合 -->
      <template v-else>
        <p class="text_no_follows_obj">{{ noFollows }}</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    followsList: Array,
  },
  computed: {
    // 表示するユーザーがいない場合のメッセージ
    noFollows() {
      // フォローしているユーザーを表示するページの場合
      if (this.$route.name === 'followList') {
        return 'フォローしているユーザーはいません';
      }
      // フォロワーを表示するページの場合
      return 'フォロワーはいません';
    }
  }
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
.follows_user {
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

/* 表示するユーザーがいないときのメッセージ */
.text_no_follows_obj {
  color: gray;
  font-size: 1.2em;
}
</style>