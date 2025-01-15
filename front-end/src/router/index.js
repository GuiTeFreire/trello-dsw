import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Boards from '../views/Boards.vue';
import Board from '../views/Board.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import CreateAccount from '../views/CreateAccount.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import ChangePassword from '../views/ChangePassword.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/boards', name: 'Boards', component: Boards },
  { path: '/board/:id', name: 'Board', component: Board },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/login', name: 'Login', component: Login }, // Adicionada a rota para login
  { path: '/create-account', name: 'CreateAccount', component: CreateAccount },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword},


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
