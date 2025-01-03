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
            const response = await api.put(`/lists/${this.list._id}`, {
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
          await api.delete(`/lists/${this.list._id}`);
          // Emitimos um evento para que o pai possa remover a lista do array `lists`
          this.$emit('listRemoved', this.list._id);
        } catch (error) {
          console.error('Erro ao remover lista:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .list {
    width: 250px;
    min-height: 120px;
    background: #f0f0f0;
    padding: 8px;
    border-radius: 4px;
    margin: 0 8px;
  }
  
  .list h3 {
    margin: 0 0 8px;
    cursor: pointer;
  }
  
  .list input {
    width: 90%;
  }
  </style>
  