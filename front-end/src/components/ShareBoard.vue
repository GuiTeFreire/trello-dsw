<template>
  <div class="share-board">
    <v-card>
      <v-card-title>
        <span class="headline">Compartilhar Quadro</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
              <v-text-field v-model="email" label="Email do Usuário" required></v-text-field>
              <v-checkbox v-model="canEdit" label="Pode Editar"></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="shareBoard">Compartilhar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ShareBoard',
  props: {
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      email: '',
      canEdit: false,
      errorMessage: '',
    };
  },
  methods: {
    async shareBoard() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://localhost:4331/api/boardsPermissions/${this.boardId}`,
          { email: this.email, canEdit: this.canEdit },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.$emit('shared', response.data);
        this.closeDialog();
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Erro ao compartilhar o quadro.';
      }
    },
    closeDialog() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.share-board {
  margin-top: 20px;
}
</style>