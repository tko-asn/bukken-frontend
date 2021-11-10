<template>
  <div class="block-follower">
    <ContentTitle title="フォロワー" :showMenuFunc="showMenuFunc" />
    <Content :isScroll="true">
      <div class="container-follower">
        <FollowsList :followsList="followers" />
        <Pagination
          class="container-follower__pagination"
          :total="followTotal.follower"
          :pageNumber="followPage.follower"
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
    this.getFollowers(1, this.userIdProps);
  },
  methods: {
    pagination(page) {
      this.getFollowers(page, this.userIdProps);
    },
  },
};
</script>

<style scoped>
.container-follower__pagination {
  padding: 5px 0;
}
</style>