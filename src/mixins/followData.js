import apiClient from "@/axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      followees: [],
      followers: [],
      followTotal: {
        followee: 1,
        follower: 1,
      },
      followPage: {
        followee: 1,
        follower: 1,
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
  },
  methods: {
    async getFollowees(page, userId = "") {
      if (userId || this.isLoggedIn) {
        const id = userId || this.userId;
        const { data } = await apiClient.get(
          `/users/follow/${id}/${page}/`
        );
        this.followees = data.users;
        this.followTotal.followee = data.total;
        this.followPage.followee = page;
      }
    },
    async getFollowers(page, userId = "") {
      if (userId || this.isLoggedIn) {
        const id = userId || this.userId;
        const { data } = await apiClient.get(
          `/users/follower/${id}/${page}/`
        );
        this.followers = data.users;
        this.followTotal.follower = data.total;
        this.followPage.follower = page;
      }
    },
  },
};
