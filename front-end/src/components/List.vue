<template>
  <div class="list">
    <!-- Título da Lista -->
    <div class="list-header">
      <h3 @dblclick="editListMode = true" v-if="!editListMode">{{ list.title }}</h3>
      <v-text-field
        v-else
        v-model="tempTitle"
        dense
        outlined
        label="Editar Lista"
        @keyup.enter="saveTitle"
        @blur="saveTitle"
      ></v-text-field>

      <!-- Botão de editar lista -->
      <v-btn icon @click="editListMode = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <!-- Botão de remover lista -->
      <v-btn icon color="red" @click="removeList">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <!-- Exibição de Cards -->
    <div class="cards-container">
      <div v-for="card in list.cards" :key="card._id" class="card">
        <p>{{ card.nome }}</p>
        <!-- Botão de editar card -->
        <v-btn icon @click="editCard(card)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <!-- Botão de excluir card -->
        <v-btn icon color="red" @click="deleteCard(card._id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Botão para adicionar novo card -->
    <v-btn block color="blue" text @click="addNewCard">+ Adicionar Card</v-btn>
  </div>
</template>

<script>
import api from "@/services/api"; // Importando a instância configurada do Axios
import 'material-design-icons-iconfont/dist/material-design-icons.css';

export default {
  name: "List",
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
      editListMode: false, // Controla o modo de edição da lista
      tempTitle: this.list.title, // Armazena o título temporariamente durante edição
    };
  },
  methods: {
    /**
     * Salva o título da lista após edição
     */
    async saveTitle() {
      const newTitle = this.tempTitle.trim();
      if (newTitle === "" || newTitle === this.list.title) {
        this.editListMode = false;
        return;
      }

      try {
        const response = await api.put(`/api/lists/${this.list._id}`, {
          title: newTitle,
        });
        this.list.title = response.data.title;
        this.editListMode = false;
      } catch (error) {
        console.error("Erro ao atualizar título da lista:", error);
      }
    },

    /**
     * Remove a lista do board
     */
    async removeList() {
      try {
        await api.delete(`/api/lists/${this.list._id}`);
        this.$emit("listRemoved", this.list._id);
      } catch (error) {
        console.error("Erro ao remover lista:", error);
      }
    },

    /**
     * Remove um card específico
     */
    async deleteCard(cardId) {
      try {
        await api.delete(`/api/cards/${cardId}`);
        this.list.cards = this.list.cards.filter((card) => card._id !== cardId);
      } catch (error) {
        console.error("Erro ao remover card:", error);
      }
    },

    /**
     * Adiciona um novo card (exemplo simplificado)
     */
    addNewCard() {
      const newCard = {
        _id: Date.now().toString(),
        nome: "Novo Card",
      };
      this.list.cards.push(newCard);
    },

    /**
     * Edita um card (exemplo: abrir modal de edição)
     */
    editCard(card) {
      console.log("Editar card:", card);
      // Lógica para abrir um modal ou uma nova tela para editar o card
    },
  },
};
</script>

<style scoped>
.list {
  background-color: #f4f5f7;
  border-radius: 8px;
  width: 300px;
  padding: 16px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cards-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.card p {
  margin: 0;
}

.v-btn {
  min-width: 32px;
}
</style>
