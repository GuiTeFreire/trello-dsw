<template>
  <div class="board" :style="{ backgroundColor: board.backgroundColor, color: board.textColor }">
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

    <!-- Draggable para reordenar as listas -->
    <draggable
      v-model="lists"
      group="lists"
      class="lists-container"
      item-key="_id"
      @end="onDragEnd"
    >
      <template #item="{ element: list }">
        <List
          :list="list"
          :boardId="board._id"
          @listRemoved="handleListRemoved"
          @editCard="openEditCardForm"
        />
      </template>
    </draggable>

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
        v-if="!isEditingCard"
        :controlador="controlador"
        :board="board"
        @cardCreated="handleCardCreated"
        @close="showCardForm = false"
      />
      <formulario-card-editar
        v-else
        :controlador="controlador"
        :board="board"
        :card="selectedCard"
        @cardUpdated="handleCardUpdated"
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
import Draggable from 'vuedraggable';
console.log('Draggable:', Draggable);
import List from '@/components/List.vue';
import api from '@/services/api';
import formularioLista from '../../crud/lists/list-form.js';
import formularioCard from '../../crud/cards/cards-form.js';
import formularioCardEditar from '../../crud/cards/card-edit-form.js';
import criaControlador from '../../crud/utils/crud-controller.js';
import BoardEditForm from '../../crud/boards/board-edit-form.js';
import ShareBoard from '@/components/ShareBoard.vue';

export default {
  name: 'Board',
  components: {Draggable, List, formularioLista, formularioCard, formularioCardEditar, ShareBoard, BoardEditForm },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const boardId = route.params.id;
    const board = ref({});
    const boardTitle = ref('');
    const lists = ref([]);
    const showListForm = ref(false);
    const showCardForm = ref(false);
    const showShareForm = ref(false);
    const controlador = criaControlador();
    const showEditBoardForm = ref(false);
    const isEditingCard = ref(false);
    const selectedCard = ref(null);

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
        const token = localStorage.getItem('token');
        const boardResponse = await api.get(`/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        board.value = boardResponse.data;
        boardTitle.value = boardResponse.data.title;

        const listsResponse = await api.get(`/api/lists/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        lists.value = listsResponse.data;

        // Configurar o painelLista no controlador
        controlador.painelLista = {
          atualizaLista: loadBoard, // Define o método para atualizar a lista
        };

        console.log('Listas carregadas:', lists.value);
      } catch (error) {
        console.error('Erro ao carregar dados do quadro:', error);
      }
    };

    const openListForm = () => {
      controlador.painelFormulario = {
        prepara: formularioLista.methods.prepara.bind({
          controlador,
          list: {
            _id: '',
            title: '',
            boardId: boardId,
            position: lists.value.length,
            cards: [],
          },
        }),
      };

      controlador.insere({
        _id: '',
        title: '',
        boardId: boardId,
        position: lists.value.length,
        cards: [],
      });

      showListForm.value = true; // Certifique-se de que o estado é atualizado corretamente
    };

    const openCardForm = () => {
      isEditingCard.value = false;
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

    const openEditCardForm = (card) => {
      isEditingCard.value = true;
      selectedCard.value = card;
      controlador.painelFormulario = {
        prepara: formularioCardEditar.methods.prepara.bind({
          controlador,
          board: board.value,
          card: { ...card },
        }),
      };
      controlador.edita(card);
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

    const handleCardUpdated = (cardId) => {
      showCardForm.value = false;
      loadBoard();
    };

    const onDragEnd = async () => {
      // Atualizar as posições localmente
      for (let i = 0; i < lists.value.length; i++) {
          lists.value[i].position = i;
      }
  
      console.log('Listas atualizadas:', lists.value); // Log para depuração
  
      try {
          const token = localStorage.getItem('token');
          await api.put('/api/lists/reorder', {
              lists: lists.value,
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          console.log('Posições das listas atualizadas no backend.');
      } catch (error) {
          console.error('Erro ao atualizar posição das listas:', error.response?.data || error);
      }
    };

    const handleListRemoved = (listId) => {
      lists.value = lists.value.filter(list => list._id !== listId);
    };

    const deleteBoard = async () => {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        router.push('/boards');
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
      console.log('showShareForm atualizado:', newValue);
    });

    onMounted(() => {
      loadBoard();
    });

    return {
      board,
      boardTitle,
      lists,
      openListForm,
      openCardForm,
      openEditCardForm,
      showListForm,
      showCardForm,
      showShareForm,
      controlador,
      handleListCreated,
      handleCardCreated,
      handleCardUpdated,
      onDragEnd,
      handleListRemoved,
      deleteBoard,
      toggleShareForm,
      handleBoardShared,
      showEditBoardForm,
      openEditBoardForm,
      handleBoardUpdated,
      boardId,
      isEditingCard,
      selectedCard,
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
  gap: 16px;
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

.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen {
  background-color: #e0e0e0;
}

.sortable-drag {
  opacity: 0.8;
}
</style>