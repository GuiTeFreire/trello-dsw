import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Boards from '../views/Boards.vue';
import Board from '../views/Board.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/boards', name: 'Boards', component: Boards },
  { path: '/board/:id', name: 'Board', component: Board },
  { path: '/profile', name: 'Profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
