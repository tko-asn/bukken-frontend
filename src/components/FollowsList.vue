<template>
  <ul class="container-follows-list">
    <!-- リストを表示する場合 -->
    <template v-if="followsList.length">
      <li
        class="container-follows-list__item"
        v-for="user in followsList"
        :key="user.id"
      >
        <router-link
          class="block-follows"
          :to="{
            name: 'userView',
            params: { id: user.id },
          }"
        >
          <div class="item-icon">
            <img class="item-icon__img" :src="user.icon_url" />
          </div>
          <p class="block-follows__username">
            {{ user.username }}
          </p>
        </router-link>
      </li>
    </template>

    <!-- 表示するユーザーがいない場合 -->
    <template v-else>
      <p class="container-follows-list__text-no-follow">{{ noFollows }}</p>
    </template>
  </ul>
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
      if (this.$route.name === "followList") {
        return "フォローしているユーザーはいません";
      }
      // フォロワーを表示するページの場合
      return "フォロワーはいません";
    },
  },
};
</script>

<style scoped>
/* ページ全体 */
.container-follows-list {
  list-style: none;
  margin: 0;
  padding: 0 0 5px;
  border-bottom: 1px solid silver;
}

/* ユーザー表示部分 */
.block-follows {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  background: #fff;
  text-decoration: none;
}

.block-follows:hover {
  filter: brightness(80%);
}

/* アイコン */
.item-icon,
.item-icon__img {
  width: 40px;
  height: 40px;
}

.item-icon {
  background: silver;
}

.item-icon__img {
  object-fit: cover;
}

/* ユーザー名 */
.block-follows__username {
  margin-left: 30px;
  overflow: hidden;
  color: rgb(83, 81, 81);
  letter-spacing: 2px;
}

/* 表示するユーザーがいないときのメッセージ */
.container-follows-list__text-no-follow {
  color: gray;
  text-align: center;
}
</style>