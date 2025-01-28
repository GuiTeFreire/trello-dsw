<template>
  <v-app>
    <Navbar v-if="showNavbar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

export default {
  components: { Navbar },
  setup() {
    const route = useRoute();
    const showNavbar = computed(() => {
      const publicPages = ['/login', '/create-account', '/forgot-password', '/reset-password'];
      return !publicPages.includes(route.path);
    });

    return { showNavbar };
  }
};
</script>