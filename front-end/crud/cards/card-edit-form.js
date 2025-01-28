import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'formulario-card-editar',
  props: ['controlador', 'board', 'card'],

  data() {
    return {
      titulo: 'Editar Card',
      errorMessage: '',
      cardData: { ...this.card },
      colunas: this.board.lists.map(list => ({ id: list._id, title: list.title })) // Preenche a lista de colunas com os IDs e títulos das listas do board
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

              <v-text-field v-model="cardData.nome" label="Nome" required></v-text-field>
              <v-textarea v-model="cardData.descricao" label="Descrição" rows="3"></v-textarea>
              <v-select
                v-model="cardData.coluna"
                :items="colunas"
                item-text="title"
                item-value="id"
                label="Coluna"
                required
              ></v-select>
              <v-text-field v-model="cardData.dataInicio" label="Data de Início" type="date"></v-text-field>
              <v-text-field v-model="cardData.dataFim" label="Data de Fim" type="date"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="retornaLista">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="salvaCard">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  `,

  methods: {
    prepara() {
      this.errorMessage = '';
      this.cardData = { ...this.card };
      this.titulo = this.cardData._id === '' ? 'Novo Card' : 'Editar Card';
    },

    async salvaCard() {
      const url = `http://localhost:4331/api/cards/${this.cardData._id}`;
      const token = localStorage.getItem('token'); // Obtém o token do localStorage
      
      try {
        const response = await axios.put(url, this.cardData, {
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no header
          },
        });
        this.errorMessage = '';
        this.$emit('cardUpdated', response.data.card._id);
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Erro ao salvar o card.';
      }
    },

    retornaLista() {
      this.controlador.lista();
    },
  }
});