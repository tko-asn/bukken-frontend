<template>
  <ul class="container-follows-list">
    <!-- リストを表示する場合 -->
    <template v-if="followsList.length">
      <li
        class="container-follows-list__item"
        v-for="followsObj in followsList"
        :key="followsObj.id"
      >
        <router-link
          class="block-follows"
          :to="{
            name: 'userView',
            params: { id: followsObj[userProperty].id },
          }"
        >
          <div class="item-icon">
            <img
              class="item-icon__img"
              :src="followsObj[userProperty].iconURL"
            />
          </div>
          <p class="block-follows__username">
            {{ followsObj[userProperty].username }}
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
    userProperty() {
      // フォロワーを表示する場合
      if (this.$route.name === "followList") {
        return "follow";
      }
      // フォローしているユーザーを表示する場合
      return "user";
    },
  },
};
</script>

<style scoped>
/* ページ全体 */
.container-follows-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ユーザー表示部分 */
.block-follows {
  display: flex;
  align-items: center;
  height: 100px;
  box-shadow: 0 1px 2px gray;
  text-decoration: none;
}

/* アイコン */
.item-icon {
  width: 100px;
  height: 100px;
  background: silver;
}

.item-icon__img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

/* ユーザー名 */
.block-follows__username {
  margin-left: 30px;
  overflow: hidden;
  color: rgb(83, 81, 81);
  font-size: 1.5em;
  letter-spacing: 2px;
}

/* 表示するユーザーがいないときのメッセージ */
.container-follows-list__text-no-follow {
  color: gray;
  font-size: 1.2em;
}
</style>