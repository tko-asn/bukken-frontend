import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

const Home = () => import(
  /* webpackChankName: 'Home' */ './mains/Home'
);
const LoginForm = () => import(
  /* webpackChankName: 'LoginForm' */ './mains/LoginForm'
);
const SignUpForm = () => import(
  /* webpackChankName: 'SignUpForm' */ './mains/SignUpForm'
);
const UserView = () => import(
  /* webpackChankName: 'UserView' */ './mains/UserView'
);
const EditProfileForm = () => import(
  /* webpackChankName: 'EditProfileForm' */ './mains/EditProfileForm'
);
const PostDetails = () => import(
  /* webpackChankName: 'PostDetails' */ './mains/PostDetails'
);
const UserPosts = () => import(
  /* webpackChankName: 'UserPosts' */ './mains/UserPosts'
);
const PostForm = () => import(
  /* webpackChankName: 'PostForm' */ './components/PostForm'
);
const PostList = () => import(
  /* webpackChankName: 'PostList' */ './components/PostList'
);
const SelfIntroduction = () => import(
  /* webpackChankName: 'SelfIntroduction' */ './components/SelfIntroduction'
);
const AuthInfo = () => import(
  /* webpackChankName: 'AuthInfo' */ './components/AuthInfo'
);
const ChangePassword = () => import(
  /* webpackChankName: 'ChangePassword' */ './components/ChangePassword'
);
const Follow = () => import(
  /* webpackChankName: 'Follow' */ './components/Follow'
);
const Follower = () => import(
  /* webpackChankName: 'Follower' */ './components/Follower'
);

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        { path: '', component: PostList, name: 'home' },
        {
          path: 'post/form',
          component: PostForm,
          name: 'postForm',
          meta: { requiredAuth: true }
        }
      ]
    },
    { path: '/login', component: LoginForm, name: 'login' },
    { path: '/signup', component: SignUpForm, name: 'signUp' },
    {
      path: '/user/:id',
      component: UserView,
      props: true,
      children: [
        { path: '', component: SelfIntroduction, name: 'userView' },
        {
          path: 'auth/info',
          component: AuthInfo,
          name: 'authInfo',
          meta: { requiredAuth: true, myPageOnly: true },
        },
        {
          path: 'change/password',
          component: ChangePassword,
          name: 'changePassword',
          meta: { requiredAuth: true, myPageOnly: true }
        },
        { path: 'follow/list', component: Follow, name: 'followList' },
        { path: 'follower/list', component: Follower, name: 'followerList' },
      ]
    },
    {
      path: '/profile/edit',
      component: EditProfileForm,
      name: 'editProfile',
      meta: { requiredAuth: true }
    },
    {
      path: '/post/:postId',
      component: PostDetails,
      name: 'postDetails',
      props: true,
    },
    {
      path: '/user/:userId/posts/list',
      component: UserPosts,
      name: 'userPosts',
      props: true,
    },
    { path: '*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  // ログイン状態
  const isLoggedIn = store.getters['auth/isLoggedIn'];

  // トークン
  const token = localStorage.getItem('token');

  // ログイン状態であればどのページへも遷移可能
  if (isLoggedIn) {
    next();

    // 認証が必要ないページの場合
  } else if (!to.matched.some(record => record.meta.requiredAuth)) {

    //トークンが存在する場合
    if (token) {
      // トークンの検証
      store.dispatch('auth/verify').then(() => {
        next();
      }).catch(() => {
        // トークンを削除
        store.dispatch('auth/logout');
        // 検証に失敗しても遷移可能
        next();
      });

      // トークンが存在しない場合
    } else {
      next();
    }

    // 認証が必要なページでトークンがある場合
  } else if (token) {
    // トークン検証に成功したら遷移
    store.dispatch('auth/verify').then(() => {
      next();
    })
      .catch(() => {
        // トークンを削除
        store.dispatch('auth/logout');
        // トークンの検証に失敗したらログインページへ
        forceUserToLogin(to, from, next);
      });

    // 認証が必要なページでトークンがない場合
  } else {
    forceUserToLogin(to, from, next);
  }
});

// ログインページへ移動させる関数
const forceUserToLogin = (to, from, next) => {
  next({
    path: '/login',
    query: { next: to.path }
  });
};

export default router;