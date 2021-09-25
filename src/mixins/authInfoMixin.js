import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters("auth", [
      "isLoggedIn",
      "userId",
      "username",
      "selfIntroduction",
      "iconURL",
    ]),
  }
};