<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="display-1">Meus Quadros</h1>
                <v-btn color="primary" dark large class="mb-5" @click="openBoardForm">
                    Criar novo quadro
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="(board, index) in userBoards"
                   :key="board._id"
                   cols="12" sm="6" md="4" lg="3">
                <v-card class="ma-3 elevation-5"
                        @click="openBoard(board._id)">
                    <v-card-title class="headline">{{ board.title }}</v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="showBoardForm" max-width="600px">
            <formulario-board :controlador="controlador"
                              @boardCreated="handleBoardCreated"
                              @close="showBoardForm = false" />
        </v-dialog>
    </v-container>
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
    .headline {
        font-size: 1.25rem; /* Ajusta o tamanho da fonte para os títulos dos cards */
        font-weight: bold; /* Torna o título do card mais destacado */
    }

    .display-1 {
        font-size: 2.5rem; /* Aumenta o tamanho da fonte para o título principal */
        font-weight: bold; /* Aumenta a espessura da fonte para maior destaque */
        margin-bottom: 20px; /* Adiciona espaço abaixo do título para separação visual */
    }
</style>