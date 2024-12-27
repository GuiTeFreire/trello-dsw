<template>
  <v-app-bar app color="primary" dark dense>
    <v-toolbar-title class="text-h6 font-weight-bold">Trello Clone</v-toolbar-title>
    <v-spacer />
    <v-btn
      v-for="(page, index) in pages"
      :key="index"
      text
      :to="page.path"
      tag="router-link"
      :class="{'btn-hover': activePage === index}"
      @click="setActivePage(index)"
    >
      {{ page.name }}
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        { name: 'Home', path: '/' },
        { name: 'Boards', path: '/boards' },
        { name: 'Profile', path: '/profile' },
      ],
      activePage: 0,
    };
  },
  methods: {
    setActivePage(index) {
      this.activePage = index;
    },
  },
};
</script>

<style scoped>
.btn-hover {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-hover:hover {
  background-color: #1976d2; /* Cor do botão ao passar o mouse */
  color: white;
}

.v-btn {
  margin-right: 20px; /* Espaçamento entre os botões */
}

.v-app-bar {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombras sutis */
  border-bottom: 2px solid rgba(0, 0, 0, 0.1); /* Borda inferior */
}

.v-toolbar-title {
  font-size: 24px;
  font-weight: bold;
}

.v-btn {
  text-transform: none;
}
</style>
