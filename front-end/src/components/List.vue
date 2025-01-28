<template>
  <div class="list">
    <h3 @dblclick="editMode = true">
      <!-- Exibe o título da lista ou o input de edição -->
      <span v-if="!editMode">{{ list.title }}</span>
      <input
        v-else
        v-model="tempTitle"
        @keyup.enter="saveTitle"
        @blur="saveTitle"
      />
    </h3>

    <!-- Exibir os cards da lista -->
    <div class="cards-container">
      <div v-for="card in list.cards" :key="card._id" class="card">
        <p>{{ card.nome }}</p>
        <button @click="deleteCard(card._id)">Excluir Card</button>
      </div>
    </div>

    <!-- Botão para remover a lista -->
    <button @click="removeList">Remover Lista</button>
  </div>
</template>

<script>
import api from '@/services/api'; // Importando a instância configurada do Axios

export default {
  name: 'List',
  props: {
    list: {
      type: Object,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editMode: false,
      tempTitle: this.list.title,
    };
  },
  methods: {
    /**
     * Salva o título da lista no banco de dados via API
     */
    async saveTitle() {
      this.editMode = false;
      const newTitle = this.tempTitle.trim();

      // Se o título mudou, faz a chamada à API
      if (newTitle !== '' && newTitle !== this.list.title) {
        try {
          const response = await api.put(`/api/lists/${this.list._id}`, {
            title: newTitle,
          });
          // Atualiza o título localmente
          this.list.title = response.data.title;
        } catch (error) {
          console.error('Erro ao atualizar título da lista:', error);
        }
      }
    },

    /**
     * Remove a lista via API e avisa o componente pai para retirá-la do array
     */
    async removeList() {
      try {
        const listId = this.list._id;
        const listTitle = this.list.title;

        await api.delete(`/api/lists/${listId}`, {
          data: { boardId: this.boardId, title: listTitle },
        });

        // Emitimos um evento para que o pai possa remover a lista do array `lists`
        this.$emit('listRemoved', listId);
      } catch (error) {
        console.error('Erro ao remover lista:', error);
      }
    },

    /**
     * Remove um card via API e atualiza a lista localmente
     */
    async deleteCard(cardId) {
      try {
        await api.delete(`/api/cards/${cardId}`);
        this.list.cards = this.list.cards.filter(card => card._id !== cardId);
      } catch (error) {
        console.error('Erro ao remover card:', error);
      }
    },
  },
};
</script>

<style scoped>
.list {
  background-color: #f4f5f7;
  border-radius: 3px;
  width: 272px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.list h3 {
  margin: 0 0 8px;
  cursor: pointer;
}

.list input {
  width: 90%;
}

.cards-container {
  display: flex;
  flex-direction: column;
}

.card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9,30,66,.25);
  margin-bottom: 8px;
  padding: 8px;
  cursor: pointer;
}

.card:hover {
  background-color: #f0f0f0;
}
</style>