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
        };
    },

    template: `
        <v-dialog v-model="controlador.apresentandoPainelFormulario" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ titulo }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>

                                <v-text-field v-model="board.title" label="Título" required></v-text-field>
                                <v-text-field v-model="board.backgroundColor" label="Cor de Fundo"></v-text-field>
                                <v-text-field v-model="board.textColor" label="Cor do Texto"></v-text-field>
                                <v-checkbox v-model="board.isFavorite" label="Favorito"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="retornaLista">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="salvaBoard">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    `,

    methods: {
        prepara() {
            this.errorMessage = '';
            this.board = { ...this.controlador.itemSelecionado };
            this.titulo = this.board._id === '' ? 'Novo Quadro' : 'Editar Quadro';
        },

        async salvaBoard() {
            const url = this.board._id ? `http://localhost:4331/api/boards/${this.board._id}` : 'http://localhost:4331/api/boards';
            const method = this.board._id ? 'put' : 'post';
            const token = localStorage.getItem('token'); // Obtém o token do localStorage
            
            try {
                const response = await axios({
                    method,
                    url,
                    data: this.board,
                    headers: {
                        Authorization: `Bearer ${token}`, // Passa o token no header
                    },
                });
                this.errorMessage = '';
                this.$emit('boardCreated', response.data._id);
            } catch (error) {
                this.errorMessage = error.response?.data?.error || 'Erro ao salvar o quadro.';
            }
        },

        retornaLista() {
            this.controlador.lista();
        }
    }
});