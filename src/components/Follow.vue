<template>
  <div class="block-follow">
    <FollowsList :followsList="followees" />
    <Pagination
      class="block-follow__pagination"
      :total="followTotal.followee"
      :pageNumber="followPage.followee"
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
.block-follow__pagination {
  padding: 5px 0;
}
</style>