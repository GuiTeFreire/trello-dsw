<template>
  <div class="boards">
    <h1>Meus Quadros</h1>

    <div class="boards-container">
      <div
        class="board-card"
        v-for="(board, index) in userBoards"
        :key="board._id"
        @click="openBoard(board._id)"
      >
        <h3>{{ board.title }}</h3>
        <p>Alguma descrição</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

export default {
  name: 'Boards',
  setup() {
    const userBoards = ref([]);

    // Carregar lista de quadros do usuário
    const loadUserBoards = async () => {
      try {
        // Exemplo de rota: GET /boards
        const response = await api.get('/api/boards');
        userBoards.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar quadros do usuário', error);
      }
    };

    // Quando clicamos em um card de board, abrimos a view Board.vue daquele board
    const openBoard = (boardId) => {
      // Se estiver usando Vue Router, podemos usar:
      // this.$router.push ou useRouter() na Composition API
      window.location.href = `/board/${boardId}`; 
      // Ou, com Composition API + vue-router:
      // router.push({ name: 'Board', params: { id: boardId } });
    };

    onMounted(() => {
      loadUserBoards();
    });

    return {
      userBoards,
      openBoard,
    };
  },
};
</script>

<style scoped>
.boards {
  padding: 16px;
}

.boards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.board-card {
  width: 200px;
  height: 120px;
  background-color: #ddd;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;
}
.board-card:hover {
  background-color: #ccc;
}
</style>
