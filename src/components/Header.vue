<template>
  <header class="header">
    <div class="header__container">
      <!-- ロゴイメージ -->
      <div class="item-logo">
        <router-link class="item-logo__logo" to="/">
          <img class="item-logo__img" :src="logo" alt="logo" />
        </router-link>
      </div>

      <!-- ナビゲーションメニュー -->
      <nav class="block-nav">
        <ul class="block-nav__list">
          <li class="item-list item-list--sp_search">
            <slot />
          </li>
          <!-- ログイン済み -->
          <template v-if="isLoggedIn">
            <li class="item-list item-list--pc" @mouseleave="pullUp">
              <a
                href=""
                class="item-list__link-account"
                @click.prevent
                @mouseover="pullDown"
                >アカウント</a
              >

              <!-- プルダウンメニュー -->
              <ul
                ref="pull_down_block"
                class="item-list__list"
                @mouseleave="pullUp"
              >
                <li class="item-child-list">
                  <router-link
                    :to="{ name: 'userView', params: { id: userId } }"
                    class="item-child-list__link"
                    >マイページ</router-link
                  >
                </li>
                <li class="item-child-list">
                  <router-link
                    :to="{ name: 'editProfile', params: { id: userId } }"
                    class="item-child-list__link"
                    >プロフィール編集</router-link
                  >
                </li>
                <li class="item-child-list">
                  <a
                    href=""
                    class="item-child-list__link"
                    @click.prevent="logout"
                    >ログアウト</a
                  >
                </li>
              </ul>
            </li>

            <!-- 投稿ボタン -->
            <li class="item-list item-list--pc">
              <router-link class="item-list__btn-post" to="/post/form"
                >投稿する
              </router-link>
            </li>
          </template>

          <!-- 未ログイン -->
          <template v-else>
            <li class="item-list item-list--pc">
              <router-link class="item-list__btn-auth" to="/signup">
                新規登録
              </router-link>
            </li>
            <li class="item-list item-list--pc">
              <router-link class="item-list__btn-auth" to="/login">
                ログイン
              </router-link>
            </li>
          </template>

          <!-- メニューアイコン -->
          <li class="item-list item-list--tablet_sp">
            <a
              href=""
              class="item-list__link-menu"
              @click.prevent="toggleSideMenu"
            >
              <fa-icon icon="bars" />
            </a>
            <transition name="slide">
              <SubMenu v-if="$route.name != 'home' && showSideMenu" />
            </transition>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import SubMenu from "@/components/SubMenu";
import authInfoMixin from "@/mixins/authInfoMixin";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    SubMenu,
  },
  data() {
    return {
      logo: require("@/assets/BUKKEN_logo.png"),
    };
  },
  computed: {
    ...mapGetters("posts", ["showSideMenu"]),
  },
  mixins: [authInfoMixin],
  methods: {
    ...mapMutations("posts", ["toggleSideMenu", "hideSideMenu"]),
    // プルダウンメニュー展開
    pullDown() {
      this.$refs.pull_down_block.style.display = "block";
    },
    // プルダウンメニュー縮小
    pullUp(event) {
      if (!event.toElement.closest(".item-list__list")) {
        this.$refs.pull_down_block.style.display = "none";
      }
    },
    // ログアウト
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        if (this.$route.path !== "/") {
          // ホームページへ遷移
          this.$router.push("/");
        }
      });
    },
  },
  watch: {
    // SP・タブレット状態でページ遷移時にサイドバーを隠す
    $route() {
      this.hideSideMenu();
    },
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  color: #fff;
  text-decoration: none;
}

a:hover {
  color: #b3aaaa;
}

ul {
  list-style: none;
}

/* ヘッダー全体 */
.header {
  position: fixed;
  z-index: 100;
  width: 100%;
  box-shadow: 0 2px 3px rgb(75, 74, 74);
  background: #000;
  top: 0;
  left: 0;
}

.header__container {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 0 auto;
  padding: 0 60px;
}

/* ロゴ */
.item-logo__logo {
  display: block;
}

/* ヘッダーナビ */
.block-nav {
  /* 右詰め */
  margin: 0 0 0 auto;
}

.block-nav__list {
  display: flex;
  align-items: center;
  margin: 0 -15px;
}

/* プルダウンメニュー */
.item-list {
  position: relative;
  padding: 0 15px;
}

.item-list__list {
  z-index: 50;
  position: absolute;
  left: 12px;
  display: none;
  width: 150px;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgb(82, 81, 81);
  border-radius: 4px;
  background: white;
}

/* プルダウンのボタン */
.item-child-list__link {
  display: block;
  padding: 5px 10px;
  color: rgb(54, 53, 53);
}

.item-child-list__link:hover {
  background: rgb(238, 235, 235);
  color: rgb(54, 53, 53);
}

/* 投稿ボタン */
.item-list__btn-post {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 20px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgb(92, 88, 121);
  background: slateblue;
}

.item-list__btn-post:hover {
  background: rgb(127, 115, 207);
  color: #fff;
}

.item-list__btn-post:active {
  position: relative;
  box-shadow: none;
  background: rgb(81, 76, 119);
  color: #b3aaaa;
  top: 2px;
}

.item-list--tablet_sp {
  display: none;
}

.slide-enter-active {
  animation: slide 0.2s;
}

.slide-leave-active {
  animation: slide 0.2s reverse;
}

@keyframes slide {
  from {
    opacity: 0;
    transform: translateX(300px);
  }
  to {
    transform: translateX(0);
  }
}

@media screen and (max-width: 1024px) {
  .header__container {
    padding: 0 30px;
  }

  .item-list--tablet_sp {
    display: block;
  }

  .item-list--pc {
    display: none;
  }
}

@media screen and (max-width: 599px) {
  .item-logo__img {
    width: 80px;
    margin-right: 5px;
  }

  .header__container {
    justify-content: space-around;
    margin: 0;
    padding: 0;
  }

  .block-nav {
    width: 80%;
    margin: 0;
  }

  .block-nav__list {
    justify-content: flex-end;
    padding-left: 0;
  }

  .item-list--sp_search {
    width: 80%;
    padding-right: 0;
  }
}
</style>