<template>
  <div class="block-answer-list">
    <transition name="fade" mode="out-in" appear>
      <div class="block-answer-list__spin" v-if="isLoading">
        <vue-loaders name="ball-spin-fade-loader" color="black" scale="1" />
      </div>
      <transition-group
        name="fadeGroup"
        class="block-answer-list__list-answer"
        v-else-if="answers.length"
        key="showAnswers"
      >
        <li
          class="item-answer"
          v-for="answer in answers"
          :key="answer.id"
          @click="detailPage(answer.post.id)"
        >
          <h4 class="item-answer__title-post">{{ postTitle(answer) }}</h4>
          <div class="item-answer__author" @click.stop>
            <router-link
              class="item-answer__link"
              :to="{ name: 'userView', params: { id: answer.user.id } }"
              >{{ answer.user.username }}</router-link
            >の回答
          </div>
          <p class="item-answer__content">{{ answer.content }}</p>
        </li>
        <!-- 空要素 -->
        <li
          class="block-answer-list__no-answer"
          v-show="answers.length % 2"
          key="emptyAnswer"
        ></li>
      </transition-group>
      <p class="block-answer-list__no-text" v-else>回答がありません</p>
    </transition>
    <transition name="fade">
      <Pagination
        :total="total"
        :paginationFunc="getAnswers"
        :pageNumber="page[answerType]"
        v-if="pagination && answers.length && !isLoading"
      />
    </transition>
    <div class="block-answer-list__bottom" v-if="$route.name === 'answerList'">
      <router-link
        class="block-answer-list__link"
        v-show="$route.params.answerType === 'answer'"
        :to="{
          name: 'userAnswer',
          params: { userId, answerType: 'answer' },
        }"
        >ユーザーの回答一覧へ</router-link
      >
      <router-link
        class="block-answer-list__link"
        v-show="$route.params.answerType === 'like'"
        :to="{
          name: 'userAnswer',
          params: { userId, answerType: 'like' },
        }"
        >いいねした回答一覧へ</router-link
      >
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios";
import Pagination from "./Pagination.vue";
import { mapGetters } from "vuex";

export default {
  components: { Pagination },
  props: {
    answerType: String,
    userId: String,
    pagination: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      answers: [],
      total: 0,
      page: {
        answer: 1,
        like: 1,
      },
    };
  },
  async created() {
    this.getAnswers(1);
  },
  computed: {
    ...mapGetters("home", ["isLoading"]),
  },
  methods: {
    async getAnswers(page) {
      let route;
      if (this.answerType === "answer") {
        route = "/answers/user/" + this.userId + "/" + page + "/";
      } else if (this.answerType === "like") {
        route = "/answers/liked/answer/" + this.userId + "/" + page + "/";
      }
      const { data } = await apiClient.get(route);
      this.answers = data.answers;
      this.total = data.total;
      this.page[this.answerType] = page;
    },
    detailPage(postId) {
      this.$router.push({ name: "postDetails", params: { postId } });
    },
    postTitle(answer) {
      return answer.post?.title;
    },
  },
  watch: {
    // ユーザーの回答画面でのメニュー切り替え時
    async answerType(val) {
      this.getAnswers(this.page[val]);
    },
  },
};
</script>

<style scoped>
.block-answer-list__list-answer {
  list-style: none;
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
  flex-wrap: wrap;
}

.block-answer-list__spin {
  margin-top: 20px;
  text-align: center;
}

.item-answer {
  width: 300px;
  min-height: 180px;
  max-height: 200px;
  margin: 10px 10px 0;
  padding: 10px;
  overflow: hidden;
  border: 2px solid rgb(165, 157, 157);
  box-shadow: 0 3px 3px rgb(104, 104, 104);
  border-radius: 5px;
  background: #fff;
  cursor: pointer;
}

.block-answer-list__no-answer {
  width: 320px;
  margin: 10px 12px 0;
}

.item-answer__title-post {
  white-space: nowrap;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-answer__content {
  overflow-wrap: break-word;
}

.item-answer__author {
  cursor: default;
}

.item-answer__link {
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.block-answer-list__no-text {
  width: 100%;
  color: gray;
  text-align: center;
}

.block-answer-list__bottom {
  width: 100%;
  text-align: right;
  font-size: 0.9em;
  margin: 20px 0;
}

.block-answer-list__link {
  color: blue;
}

.fade-enter,
.fade-leave-to,
.fadeGroup-enter,
.fadeGroup-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fadeGroup-enter-active {
  transition: opacity 0.5s;
  animation: slideUp 0.5s;
}

.fade-leave-active,
.fadeGroup-leave-active {
  transition: opacity 0.2s;
}

.fadeGroup-leave-active {
  position: absolute;
}

.fadeGroup-move {
  transition: transform 0.8s;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
  }
  to {
    transform: translateY(0);
  }
}

@media screen and (max-width: 1024px) {
  .item-answer {
    width: 80%;
  }
}
</style>
