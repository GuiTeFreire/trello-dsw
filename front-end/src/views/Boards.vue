<template>
  <div class="boards">
    <h1>Meus Quadros</h1>

    <!-- Botão para criar novo quadro -->
    <button @click="openBoardForm">Criar novo quadro</button>

    <div class="boards-container">
      <div
        class="board-card"
        v-for="(board, index) in userBoards"
        :key="board._id"
        @click="openBoard(board._id)"
      >
        <h3>{{ board.title }}</h3>
      </div>
    </div>

    <!-- Componente de formulário de quadro -->
    <formulario-board
      v-if="showBoardForm"
      :controlador="controlador"
      @boardCreated="handleBoardCreated"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import formularioBoard from '../../crud/boards/board-form.js'; // Importa o componente de formulário de board
import criaControlador from '../../crud/utils/crud-controller.js'; // Importa o controlador de boards

export default {
  name: 'Boards',
  components: { formularioBoard },
  setup() {
    const userBoards = ref([]);
    const router = useRouter();
    const showBoardForm = ref(false); // Controle de exibição do formulário de board
    const controlador = criaControlador(); // Cria o controlador de boards

    // Carregar lista de quadros do usuário
    const loadUserBoards = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await api.get('/api/boards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        userBoards.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar quadros do usuário', error);
      }
    };

    // Quando clicamos em um card de board, abrimos a view Board.vue daquele board
    const openBoard = (boardId) => {
      router.push({ name: 'Board', params: { id: boardId } });
    };

    // Abre o formulário de criação de quadro
    const openBoardForm = () => {
      console.log('Abrindo formulário de criação de quadro'); // Log para depuração
      controlador.painelFormulario = {
        prepara: formularioBoard.methods.prepara.bind({
          controlador,
          board: {
            _id: '',
            title: '',
            backgroundColor: '',
            textColor: '',
            isFavorite: false,
            lists: [],
          },
        }),
      };
      controlador.insere({
        _id: '',
        title: '',
        backgroundColor: '',
        textColor: '',
        isFavorite: false,
        lists: [],
      });
      showBoardForm.value = true;
    };

    // Lida com a criação do quadro e redireciona para o novo quadro
    const handleBoardCreated = (boardId) => {
      showBoardForm.value = false;
      router.push({ name: 'Board', params: { id: boardId } });
    };

    onMounted(() => {
      loadUserBoards();
    });

    return {
      userBoards,
      openBoard,
      openBoardForm,
      showBoardForm,
      controlador,
      handleBoardCreated,
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