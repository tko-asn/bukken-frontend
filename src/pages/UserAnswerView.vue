<template>
  <div class="container">
    <!-- メニュー -->
    <transition name="slide">
      <aside class="side-menu" v-show="showSideMenu || width >= 600">
        <nav class="side-menu__nav">
          <ul class="list">
            <li class="list__item">
              <router-link
                class="list__link"
                :to="{ name: 'userView', params: { id: userId } }"
              >
                <div class="item-icon">
                  <img class="item-icon__img" :src="userData.icon_url" />
                </div>
                <p class="list__username">{{ userData.username }}</p>
              </router-link>
            </li>
            <li class="list__item" v-for="menu in sideMenu" :key="menu.name">
              <a
                href=""
                :class="{
                  list__link: true,
                  'list__link--active': menu.type === type,
                }"
                @click.prevent="switchAnswerType(menu.type)"
                >{{ menu.name }}</a
              >
            </li>
          </ul>
        </nav>
        <div class="side-menu__footer"></div>
      </aside>
    </transition>
    <!-- 回答一覧 -->
    <AnswerList
      class="container__answer-list"
      :userId="userId"
      :answerType="type"
      :pagination="true"
    />
  </div>
</template>

<script>
import AnswerList from "@/components/AnswerList";
import apiClient from "@/axios";
import { mapGetters } from "vuex";

export default {
  props: {
    answerType: String,
    userId: String,
  },
  components: { AnswerList },
  data() {
    return {
      sideMenu: [
        { name: "ユーザーの回答", type: "answer" },
        { name: "いいねした回答", type: "like" },
      ],
      type: this.answerType,
      userData: {},
      width: window.innerWidth,
    };
  },
  async created() {
    const { data } = await apiClient.get("/users/" + this.userId + "/");
    this.userData = data;
    this.$store.commit("home/setIsLoading", false);
  },
  mounted() {
    // 画面幅の変更を感知
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
  computed: {
    ...mapGetters("home", ["showSideMenu"]),
  },
  methods: {
    switchAnswerType(type) {
      this.type = type;
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("home/setIsLoading", true);
    next();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.side-menu {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 210px;
  width: 20%;
  margin-top: 50px;
  overflow-y: scroll;
  background: rgb(4, 121, 4);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list__link {
  display: flex;
  align-items: center;
  height: 45px;
  padding-left: 30px;
  color: #fff;
  text-decoration: none;
  letter-spacing: 2px;
  border-bottom: 1px solid gray;
}

.list__link--active {
  background: rgb(4, 182, 4);
}

.list__link:hover {
  background: rgb(4, 182, 4);
}

.item-icon,
.item-icon__img {
  width: 30px;
  height: 30px;
}

.item-icon {
  margin-right: 20px;
  background: gray;
}

.item-icon__img {
  object-fit: cover;
}

.list__username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-menu__footer {
  height: 100px;
  margin-top: auto;
}

.container__answer-list {
  margin: 50px auto 0;
  padding: 0 50px;
  overflow-y: scroll;
}

/* スクロールバー */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(146, 145, 146, 0.795);
}

@keyframes slide {
  from {
    opacity: 0;
    transform: translateX(-300px);
  }
  to {
    transform: translateX(0);
  }
}

.slide-enter-active {
  animation: slide 0.3s ease-in;
}

.slide-leave-active {
  animation: slide 0.3s ease-in reverse;
}

@media screen and (max-width: 599px) {
  .side-menu {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 2;
  }

  .container__answer-list {
    padding: 0 10px;
  }
}
</style>