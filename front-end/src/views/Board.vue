<template>
  <div class="board">
    <h1>{{ boardTitle }}</h1>

    <!-- Botões para criar nova lista e novo card -->
    <div class="buttons-container">
      <button @click="openListForm">Criar Lista</button>
      <button @click="openCardForm">Criar Card</button>
    </div>

    <!-- SortableJS: para reordenar as listas -->
    <div ref="listsContainer" class="lists-container">
      <!-- Cada item do array 'lists' será renderizado com o componente List.vue -->
      <transition-group name="fade" tag="div">
        <template v-for="(list, index) in lists" :key="list._id">
          <List
            :list="list"
            @listRemoved="handleListRemoved"
          />
        </template>
      </transition-group>
    </div>

    <!-- Componente de formulário de lista -->
    <formulario-lista
      v-if="showListForm"
      :controlador="controlador"
      @listCreated="handleListCreated"
    />

    <!-- Componente de formulário de card -->
    <formulario-card
      v-if="showCardForm"
      :controlador="controlador"
      @cardCreated="handleCardCreated"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Sortable from 'sortablejs';
import List from '@/components/List.vue';
import api from '@/services/api';
import formularioLista from '../../crud/lists/list-form.js';
import formularioCard from '../../crud/cards/cards-form.js';
import criaControlador from '../../crud/utils/crud-controller.js';

export default {
  name: 'Board',
  components: { List, formularioLista, formularioCard },
  setup() {
    const route = useRoute();
    const boardId = route.params.id;
    const boardTitle = ref('');
    const lists = ref([]);
    const showListForm = ref(false);
    const showCardForm = ref(false);
    const controlador = criaControlador();
    const listsContainer = ref(null);

    const loadBoard = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        const boardResponse = await api.get(`/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no header
          },
        });
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

    onMounted(() => {
      loadBoard();

      // Inicializar SortableJS
      Sortable.create(listsContainer.value, {
        animation: 200,
        onEnd: onDragEnd,
      });
    });

    return {
      boardTitle,
      lists,
      openListForm,
      openCardForm,
      showListForm,
      showCardForm,
      controlador,
      handleListCreated,
      handleCardCreated,
      listsContainer,
      onDragEnd,
      handleListRemoved,
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
  margin-bottom: 16px;
}

.buttons-container button {
  margin-right: 8px;
}

.lists-container {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>