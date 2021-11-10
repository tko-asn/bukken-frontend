<template>
  <div class="block-follower">
    <FollowsList :followsList="followers" />
    <Pagination
      class="block-follower__pagination"
      :total="followTotal.follower"
      :pageNumber="followPage.follower"
      :paginationFunc="pagination"
    />
  </div>
</template>

<script>
import FollowsList from "@/components/FollowsList";
import Pagination from "@/components/Pagination";
import followData from "@/mixins/followData";

export default {
  components: {
    FollowsList,
    Pagination,
  },
  mixins: [followData],
  props: {
    userIdProps: String,
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
.block-follower__pagination {
  padding: 5px 0;
}
</style>