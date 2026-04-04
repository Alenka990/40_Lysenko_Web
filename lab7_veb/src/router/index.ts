import { createRouter, createWebHistory } from 'vue-router';
import PostsView from '../views/PostsView.vue';
import UsersView from '../views/UsersView.vue';
import FactsView from '../views/FactsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/posts' },
    { path: '/posts', component: PostsView },
    { path: '/users', component: UsersView },
    { path: '/facts', component: FactsView },
  ],
});

export default router;
