<template>
  <ul class="block-sub-menu">
    <li class="item-sub-menu">
      <router-link to="/" class="item-sub-menu__link">ホーム</router-link>
    </li>
    <template v-if="isLoggedIn">
      <li class="item-sub-menu">
        <router-link to="/post/form" class="item-sub-menu__link"
          >投稿する</router-link
        >
      </li>
      <li class="item-sub-menu">
        <router-link
          :to="{ name: 'userView', params: { id: userId } }"
          class="item-sub-menu__link"
          >マイページ</router-link
        >
      </li>
      <li class="item-sub-menu">
        <router-link
          :to="{ name: 'editProfile', params: { id: userId } }"
          class="item-sub-menu__link"
          >プロフィール編集</router-link
        >
      </li>
      <li class="item-sub-menu">
        <a href="" class="item-sub-menu__link" @click.prevent="logout"
          >ログアウト</a
        >
      </li>
    </template>
    <template v-else>
      <li class="item-sub-menu">
        <router-link to="/login" class="item-sub-menu__link"
          >ログイン</router-link
        >
      </li>
      <li class="item-sub-menu">
        <router-link to="/signup" class="item-sub-menu__link"
          >新規登録</router-link
        >
      </li>
    </template>
  </ul>
</template>

<script>
import authInfoMixin from "@/mixins/authInfoMixin";

export default {
  mixins: [authInfoMixin],
  methods: {
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        if (this.$route.path !== "/") {
          // ホームページへ遷移
          this.$router.push("/");
        }
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: rgb(77, 76, 76);
}

.block-sub-menu {
  position: absolute;
  top: 42px;
  left: -140px;
  width: 170px;
  padding: 0;
  overflow: hidden;
  border: 2px solid rgb(70, 68, 68);
  box-shadow: 0 3px 5px rgb(189, 186, 186);
  border-radius: 4px;
  background: #fff;
}

/* プルダウンのボタン */
.item-sub-menu__link {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 5px 10px;
  font-size: 1.1em;
}

.item-sub-menu__link:hover {
  background: rgb(224, 223, 223);
}
</style>