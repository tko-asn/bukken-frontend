const state = {
  showSideMenu: false, // SP・タブレット状態でのメニューの表示切り替え
  isLoading: true,
};

const getters = {
  showSideMenu: state => state.showSideMenu,
  isLoading: state => state.isLoading,
};

const mutations = {
  // SP・タブレット状態でのサイドメニューの表示・非表示
  toggleSideMenu(state) {
    state.showSideMenu = !state.showSideMenu;
  },
  // SP・タブレット状態のでのサイドメニューの非表示
  hideSideMenu(state) {
    state.showSideMenu = false;
  },
  setIsLoading(state, boolean) {
    state.isLoading = boolean;
  },
};

export default {
  strict: process.env.NODE_ENV !== "production",
  namespaced: true,
  state,
  getters,
  mutations,
};
