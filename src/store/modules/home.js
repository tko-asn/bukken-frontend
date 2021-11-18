const state = {
  showSideMenu: false, // SP・タブレット状態でのメニューの表示切り替え
};

const getters = {
  showSideMenu: state => state.showSideMenu,
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
};

export default {
  strict: process.env.NODE_ENV !== "production",
  namespaced: true,
  state,
  getters,
  mutations,
};
