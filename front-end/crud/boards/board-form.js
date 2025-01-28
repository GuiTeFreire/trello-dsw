import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'formulario-board',
  props: ['controlador'],

  data() {
    return {
      titulo: '',
      errorMessage: '',
      board: {
        _id: '',
        title: '',
        backgroundColor: '',
        textColor: '',
        isFavorite: false,
        lists: [],
      },
      colorOptions: [
        { label: 'Azul Claro', value: '#90caf9' },
        { label: 'Azul Escuro', value: '#1565c0' },
        { label: 'Verde Claro', value: '#a5d6a7' },
        { label: 'Verde Escuro', value: '#2e7d32' },
        { label: 'Amarelo', value: '#fff59d' },
        { label: 'Laranja', value: '#ffab91' },
        { label: 'Cinza Claro', value: '#e0e0e0' },
        { label: 'Cinza Escuro', value: '#424242' },
      ],
      textColorOptions: [
        { label: 'Preto', value: '#000000' },
        { label: 'Branco', value: '#ffffff' },
        { label: 'Cinza Escuro', value: '#424242' },
      ],
    };
  },

  template: `
    <v-card>
      <v-card-title>
        <span class="headline">{{ titulo }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-col>

            <!-- Campo para o título -->
            <v-col cols="12">
              <v-text-field
                v-model="board.title"
                label="Título"
                required
              ></v-text-field>
            </v-col>

            <!-- Seleção de cores de fundo -->
            <v-col cols="12" sm="6">
              <v-select
                v-model="board.backgroundColor"
                :items="colorOptions"
                item-title="label"
                item-value="value"
                label="Cor de Fundo"
                required
              ></v-select>
            </v-col>

            <!-- Seleção de cores de texto -->
            <v-col cols="12" sm="6">
              <v-select
                v-model="board.textColor"
                :items="textColorOptions"
                item-title="label"
                item-value="value"
                label="Cor do Texto"
                required
              ></v-select>
            </v-col>

            <!-- Checkbox para Favorito -->
            <v-col cols="12">
              <v-checkbox v-model="board.isFavorite" label="Favorito"></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="$emit('close')">Cancelar</v-btn>
        <v-btn color="green darken-1" text @click="salvaBoard">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  `,

  methods: {
    prepara() {
      this.errorMessage = '';
      this.board = { ...this.controlador.itemSelecionado };
      this.titulo = this.board._id === '' ? 'Novo Quadro' : 'Editar Quadro';
    },

    async salvaBoard() {
      if (!this.board.title) {
        this.errorMessage = 'O título é obrigatório.';
        return;
      }

      const url = this.board._id
        ? `http://localhost:4331/api/boards/${this.board._id}`
        : 'http://localhost:4331/api/boards';
      const method = this.board._id ? 'put' : 'post';
      const token = localStorage.getItem('token');

      try {
        const payload = {
          title: this.board.title,
          backgroundColor: this.board.backgroundColor || '#ffffff',
          textColor: this.board.textColor || '#000000',
          isFavorite: this.board.isFavorite,
        };

        const response = await axios({
          method,
          url,
          data: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.errorMessage = '';
        this.$emit('boardCreated', response.data._id);
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error || 'Erro ao salvar o quadro.';
      }
    },
  },
});
