<template>
  <div>
    <p>Você está sendo desconectado...</p>
  </div>
</template>

<script>
export default {
  name: 'Logout',
  mounted() {
    this.logout();
  },
  methods: {
    logout() {
      localStorage.removeItem('token'); // Remove o token do localStorage
      this.$router.push('/login'); // Redireciona para a página de login
    }
  }
};
</script>