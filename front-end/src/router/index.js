import { createRouter, createWebHistory } from 'vue-router';
import Boards from '../views/Boards.vue';
import Board from '../views/Board.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import CreateAccount from '../views/CreateAccount.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import ChangePassword from '../views/ChangePassword.vue';
import Logout from '../views/Logout.vue'; // Importa o componente Logout

const routes = [
  { path: '/', redirect: '/login' }, // Redireciona para a tela de login
  { path: '/boards', name: 'Boards', component: Boards },
  { path: '/board/:id', name: 'Board', component: Board },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/login', name: 'Login', component: Login },
  { path: '/create-account', name: 'CreateAccount', component: CreateAccount },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
  { path: '/logout', name: 'Logout', component: Logout }, // Adiciona a rota para logout
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Verificação de autenticação antes de cada navegação
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/create-account', '/forgot-password', '/reset-password'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;
