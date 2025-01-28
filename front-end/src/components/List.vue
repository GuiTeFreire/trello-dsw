<template>
  <div class="list">
    <!-- Título da Lista -->
    <div class="list-header">
      <h3 @dblclick="editListMode = true" v-if="!editListMode" class="list-title">
        {{ list.title }}
      </h3>
      <v-text-field
        v-else
        v-model="tempTitle"
        dense
        outlined
        label="Editar Lista"
        class="edit-title-input"
        @keyup.enter="saveTitle"
        @blur="saveTitle"
      ></v-text-field>

      <!-- Botões de ação -->
      <div class="action-buttons">
        <v-btn class="edit-btn" outlined @click="editListMode = true">
          Editar
        </v-btn>
        <v-btn class="delete-btn" outlined color="red" @click="removeList">
          Excluir
        </v-btn>
      </div>
    </div>

    <!-- Exibição de Cards -->
    <div class="cards-container">
      <div v-for="card in list.cards" :key="card._id" class="card">
        <p>{{ card.nome }}</p>
        <div class="card-buttons">
          <v-btn class="edit-btn" outlined @click="editCard(card)">
            Editar
          </v-btn>
          <v-btn class="delete-btn" outlined color="red" @click="deleteCard(card._id)">
            Excluir
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Botão para adicionar novo card -->
    <v-btn block class="add-card-btn" color="blue" text @click="addNewCard">
      + Adicionar Card
    </v-btn>
  </div>
</template>

<script>
import api from "@/services/api"; // Importando a instância configurada do Axios

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
/* Estilo da lista */
.list {
  background-color: #f4f5f7;
  border-radius: 12px;
  width: 500px;
  padding: 16px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* Cabeçalho da lista */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  cursor: pointer;
}

.edit-title-input {
  flex: 1;
}

/* Botões de ação */
.action-buttons {
  display: flex;
  gap: 8px;
}

.v-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

/* Botões específicos */
.edit-btn {
  color: #1976d2;
  border-color: #1976d2;
}

.delete-btn {
  color: #d32f2f;
  border-color: #d32f2f;
}

/* Container de cards */
.cards-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Estilo dos cards */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Botões dentro dos cards */
.card-buttons {
  display: flex;
  gap: 8px;
}

/* Botão de adicionar card */
.add-card-btn {
  margin-top: 16px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
}
</style>
