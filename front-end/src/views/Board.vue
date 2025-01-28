<template>
  <div class="board">
    <h1>{{ boardTitle }}</h1>
    <br>

    <!-- Botões para criar nova lista, novo card, excluir o board e compartilhar o board -->
    <div class="buttons-container">
      <v-btn color="primary" @click="openListForm">Criar Lista</v-btn>
      <v-btn color="primary" @click="openCardForm">Criar Card</v-btn>
      <v-btn color="secondary" @click="openEditBoardForm">Editar Board</v-btn>
      <v-btn color="error" @click="deleteBoard">Excluir Board</v-btn>
      <v-btn color="primary" @click="toggleShareForm">Compartilhar Board</v-btn>
    </div>

    <!-- Formulário de compartilhamento de quadro -->
    <share-board v-if="showShareForm" :boardId="boardId" @shared="handleBoardShared" @close="toggleShareForm" />

    <!-- SortableJS: para reordenar as listas -->
    <div ref="listsContainer" class="lists-container">
      <!-- Cada item do array 'lists' será renderizado com o componente List.vue -->
      <transition-group name="fade" tag="div" class="lists-wrapper">
        <template v-for="(list, index) in lists" :key="list._id">
          <List
            :list="list"
            :boardId="board._id"
            @listRemoved="handleListRemoved"
          />
        </template>
      </transition-group>
    </div>

    <!-- Componente de formulário de lista -->
    <formulario-lista
      v-if="showListForm"
      :controlador="controlador"
      :board="board"
      @listCreated="handleListCreated"
      @close="showListForm = false"
    />

    <!-- Componente de formulário de card dentro de um modal -->
    <v-dialog v-model="showCardForm" max-width="600px">
      <formulario-card
        :controlador="controlador"
        :board="board"
        @cardCreated="handleCardCreated"
        @close="showCardForm = false"
      />
    </v-dialog>

    <!-- Modal para formulário de edição do board -->
    <v-dialog v-model="showEditBoardForm" max-width="600px">
      <board-edit-form
        :controlador="controlador"
        :board="board"
        @boardUpdated="handleBoardUpdated"
        @close="showEditBoardForm = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sortable from 'sortablejs';
import List from '@/components/List.vue';
import api from '@/services/api';
import formularioLista from '../../crud/lists/list-form.js';
import formularioCard from '../../crud/cards/cards-form.js';
import criaControlador from '../../crud/utils/crud-controller.js';
import BoardEditForm from '../../crud/boards/board-edit-form.js';
import ShareBoard from '@/components/ShareBoard.vue';

export default {
  name: 'Board',
  components: { List, formularioLista, formularioCard, ShareBoard, BoardEditForm },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const boardId = route.params.id; // Certifique-se de que boardId está sendo obtido corretamente
    const board = ref({});
    const boardTitle = ref('');
    const lists = ref([]);
    const showListForm = ref(false);
    const showCardForm = ref(false);
    const showShareForm = ref(false);
    const controlador = criaControlador();
    const listsContainer = ref(null);
    const showEditBoardForm = ref(false);

    const openEditBoardForm = () => {
      showEditBoardForm.value = true;
    };

    const handleBoardUpdated = (updatedBoard) => {
      board.value = updatedBoard;
      boardTitle.value = updatedBoard.title;
      showEditBoardForm.value = false;
    };

    const loadBoard = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        const boardResponse = await api.get(`/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no header
          },
        });
        board.value = boardResponse.data;
        boardTitle.value = boardResponse.data.title;

        const listsResponse = await api.get(`/api/lists/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no header
          },
        });
        lists.value = listsResponse.data;
      } catch (error) {
        console.error('Erro ao carregar dados do quadro:', error);
      }
    };

    const openListForm = () => {
      console.log('Abrindo formulário de criação de lista'); // Log para depuração
      controlador.painelFormulario = {
        prepara: formularioLista.methods.prepara.bind({
          controlador,
          list: {
            _id: '',
            title: '',
            boardId: boardId, // Certifique-se de que o boardId está sendo atribuído aqui
            position: lists.value.length,
            cards: [],
          },
        }),
      };
      controlador.insere({
        _id: '',
        title: '',
        boardId: boardId, // Certifique-se de que o boardId está sendo atribuído aqui
        position: lists.value.length,
        cards: [],
      });
      showListForm.value = true;
    };

    const openCardForm = () => {
      controlador.painelFormulario = {
        prepara: formularioCard.methods.prepara.bind({
          controlador,
          board: board.value,
          card: {
            _id: '',
            nome: '',
            usuario: '',
            descricao: '',
            quadro: boardId,
            coluna: '',
            dataInicio: '',
            dataFim: '',
          },
        }),
      };
      controlador.insere({
        _id: '',
        nome: '',
        usuario: '',
        descricao: '',
        quadro: boardId,
        coluna: '',
        dataInicio: '',
        dataFim: '',
      });
      showCardForm.value = true;
    };

    const handleListCreated = (listId) => {
      showListForm.value = false;
      loadBoard();
    };

    const handleCardCreated = (cardId) => {
      showCardForm.value = false;
      loadBoard();
    };

    const onDragEnd = async () => {
      for (let i = 0; i < lists.value.length; i++) {
        try {
          const token = localStorage.getItem('token'); // Obtém o token do localStorage
          await api.put(`/api/lists/${lists.value[i]._id}`, {
            position: i,
          }, {
            headers: {
              Authorization: `Bearer ${token}`, // Passa o token no header
            },
          });
        } catch (error) {
          console.error('Erro ao atualizar posição da lista:', error);
        }
      }
    };

    const handleListRemoved = (listId) => {
      lists.value = lists.value.filter(list => list._id !== listId);
    };

    const deleteBoard = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        await api.delete(`/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no header
          },
        });
        router.push('/boards'); // Redireciona para a lista de boards após a exclusão
      } catch (error) {
        console.error('Erro ao excluir o board:', error);
      }
    };

    const toggleShareForm = () => {
      showShareForm.value = !showShareForm.value;
    };

    const handleBoardShared = (sharedData) => {
      console.log('Quadro compartilhado com sucesso:', sharedData);
    };

    watch(showShareForm, (newValue) => {
      console.log('showShareForm atualizado:', newValue); // Log para depuração
    });

    onMounted(() => {
      loadBoard();

      // Inicializar SortableJS
      Sortable.create(listsContainer.value, {
        animation: 200,
        onEnd: onDragEnd,
      });
    });

    return {
      board,
      boardTitle,
      lists,
      openListForm,
      openCardForm,
      showListForm,
      showCardForm,
      showShareForm,
      controlador,
      handleListCreated,
      handleCardCreated,
      listsContainer,
      onDragEnd,
      handleListRemoved,
      deleteBoard,
      toggleShareForm,
      handleBoardShared,
      showEditBoardForm,
      openEditBoardForm,
      handleBoardUpdated,
      boardId, // Certifique-se de que boardId está sendo retornado
    };
  },
};
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.buttons-container {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.lists-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 16px;
}

.lists-wrapper {
  display: flex;
  gap: 16px;
}

.list {
  background-color: #f4f5f7;
  border-radius: 3px;
  width: 272px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9,30,66,.25);
  margin-bottom: 8px;
  padding: 16px; /* Aumentar o padding para tornar o card mais quadrado */
  width: 240px; /* Definir uma largura fixa */
  height: 240px; /* Definir uma altura fixa */
  cursor: pointer;
}

.card:hover {
  background-color: #f0f0f0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>