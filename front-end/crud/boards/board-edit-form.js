import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'BoardEditForm',
  props: {
    controlador: Object, // Controlador opcional para gerenciar o estado
    board: Object,       // Dados do board a serem editados
  },
  data() {
    return {

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
      boardData: { ...this.board }, // Cópia dos dados do board
      errorMessage: '',

    };
  },
  template: `
    <v-card>
      <v-card-title>
        <span class="headline">Editar Board</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>

              <v-text-field
                v-model="boardData.title"
                label="Título"
                required
              ></v-text-field>
              <v-select
                v-model="boardData.backgroundColor"
                :items="colorOptions"
                item-title="label"
                item-value="value"
                label="Cor de Fundo"
                required
              ></v-select>
              <v-select
                v-model="boardData.textColor"
                :items="textColorOptions"
                item-title="label"
                item-value="value"
                label="Cor do Texto"
                required
              ></v-select>
              <v-checkbox
                v-model="boardData.isFavorite"
                label="Favorito"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="$emit('close')">Cancelar</v-btn>
        <v-btn color="primary" @click="saveBoard">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  `,
  methods: {
    async saveBoard() {
        const token = localStorage.getItem('token');
        const url = `http://localhost:4331/api/boards/${this.boardData._id}`;
        try {
            // Requisição para atualizar o quadro
            const response = await axios.put(url, this.boardData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Atualizar o campo isFavorite separadamente
            await axios.put(
                `http://localhost:4331/api/boardPermissionsRoutes/${this.boardData._id}/favorite`,
                { isFavorite: this.boardData.isFavorite },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            this.errorMessage = '';
            this.$emit('boardUpdated', response.data); // Emite o evento com os dados do board atualizado
        } catch (error) {
            this.errorMessage =
                error.response?.data?.error || 'Erro ao salvar o quadro.';
        }
    },
  },
  watch: {
    // Atualiza os dados do formulário quando a prop `board` mudar
    board: {
      immediate: true,
      handler(newBoard) {
        this.boardData = { ...newBoard };
      },
    },
  },
});
