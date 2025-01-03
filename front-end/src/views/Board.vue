<template>
  <div class="board">
    <!-- Exemplo: Nome ou título do quadro -->
    <h1>{{ boardTitle }}</h1>

    <!-- Botão para criar nova lista -->
    <button @click="createList">Criar Lista</button>

    <!-- DRAGGABLE: para reordenar as listas -->
    <draggable
      v-model="lists"
      class="lists-container"
      @end="onDragEnd"
      :options="{ animation: 200 }"
    >
      <!-- Cada item do array 'lists' será renderizado com o componente List.vue -->
      <transition-group name="fade" tag="div">
        <List
          v-for="(list, index) in lists"
          :key="list._id"
          :list="list"
          @listRemoved="handleListRemoved"
        />
      </transition-group>
    </draggable>
  </div>
</template>

<script>
/**
 * Board.vue (singular):
 *  1. Captura 'boardId' via Vue Router
 *  2. Carrega listas do back-end
 *  3. Permite criar, editar e remover listas
 *  4. Usa vue-draggable para reorganizar listas
 */

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';
import List from '@/components/List.vue';       // componente filho
import api from '@/services/api';              // instância axios

export default {
  name: 'Board',
  components: { draggable, List },
  setup() {
    // PEGA O boardId DA ROTA
    const route = useRoute();
    const boardId = route.params.id; // Ex.: /board/:id
    
    // DADOS
    const boardTitle = ref(''); // Título do quadro
    const lists = ref([]);

    /**
     * Carrega o quadro e suas listas
     * Ajuste conforme suas rotas de back-end:
     *   - GET /boards/:boardId -> dados do quadro (incluindo seu título)
     *   - GET /lists/board/:boardId -> as listas desse quadro
     */
    const loadBoard = async () => {
      try {
        // Carrega dados do quadro (ex.: título)
        const boardResponse = await api.get(`/boards/${boardId}`);
        boardTitle.value = boardResponse.data.title;

        // Carrega listas relacionadas a esse quadro
        const listsResponse = await api.get(`/lists/board/${boardId}`);
        lists.value = listsResponse.data;        
      } catch (error) {
        console.error('Erro ao carregar dados do quadro:', error);
      }
    };

    /**
     * Cria uma nova lista associada ao quadro
     */
    const createList = async () => {
      try {
        const newList = {
          title: 'Nova Lista',
          boardId: boardId,
        };
        const response = await api.post('/lists', newList);
        lists.value.push(response.data);
      } catch (error) {
        console.error('Erro ao criar lista:', error);
      }
    };

    /**
     * Dispara quando o usuário termina de arrastar e soltar uma lista
     * Precisamos atualizar a "position" de cada lista no back-end
     */
    const onDragEnd = async () => {
      for (let i = 0; i < lists.value.length; i++) {
        try {
          await api.put(`/lists/${lists.value[i]._id}`, {
            position: i,
          });
        } catch (error) {
          console.error('Erro ao atualizar posição da lista:', error);
        }
      }
    };

    /**
     * Quando o componente List.vue emite 'listRemoved',
     * removemos a lista do array local
     */
    const handleListRemoved = (listId) => {
      lists.value = lists.value.filter(list => list._id !== listId);
    };

    // Ao montar o componente, carregamos os dados
    onMounted(() => {
      loadBoard();
    });

    // Retorna as variáveis e funções para uso no template
    return {
      boardTitle,
      lists,
      createList,
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

.board button {
  margin-bottom: 16px;
}

/* Container das listas lado a lado */
.lists-container {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

/* Transição suave para adicionar/remover listas */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
