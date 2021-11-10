<template>
  <div class="block-follow">
    <ContentTitle title="フォロー" :showMenuFunc="showMenuFunc" />
    <Content :isScroll="true">
      <div class="container-follow">
        <FollowsList :followsList="followees" />
        <Pagination
          class="container-follow__pagination"
          :total="followTotal.followee"
          :pageNumber="followPage.followee"
          :paginationFunc="pagination"
        />
      </div>
    </Content>
  </div>
</template>

<script>
import FollowsList from "@/components/FollowsList";
import Pagination from "@/components/Pagination";
import ContentTitle from "@/components/ContentTitle";
import Content from "@/components/Content";
import followData from "@/mixins/followData";

export default {
  components: {
    FollowsList,
    Pagination,
    ContentTitle,
    Content,
  },
  mixins: [followData],
  props: {
    userIdProps: String,
    showMenuFunc: {
      type: Function,
      default: () => {},
    },
  },
  created() {
    this.getFollowees(1, this.userIdProps);
  },
  methods: {
    pagination(page) {
      this.getFollowees(page, this.userIdProps);
    },
  },
};
</script>

<style scoped>
.container-follow__pagination {
  padding: 5px 0;
}
</style>