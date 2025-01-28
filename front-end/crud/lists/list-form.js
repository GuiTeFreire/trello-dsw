import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
    name: 'formulario-lista',
    props: ['controlador'],

    data() {
        return {
            titulo: '',
            errorMessage: '',
            list: {
                _id: '',
                title: '',
                boardId: '',
                position: 0,
                cards: [],
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

                                <v-text-field v-model="list.title" label="Título" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="retornaLista">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="salvaLista">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    `,

    methods: {
    prepara(boardId) {
        this.errorMessage = '';
        this.titulo = this.list._id === '' ? 'Nova Lista' : 'Editar Lista';
    },

    retornaParametroURL() {
        const url = window.location.href;
        const parts = url.split('/');
        return parts[parts.length - 1];
      },

    async salvaLista() {
        const url = this.list._id ? `http://localhost:4331/api/lists/${this.list._id}` : 'http://localhost:4331/api/lists';
        const method = this.list._id ? 'put' : 'post';
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        const boardId = this.retornaParametroURL();
        this.list.boardId = boardId;
        console.log(this.list);

        try {
            const response = await axios({
                method,
                url,
                data: this.list,
                headers: {
                    Authorization: `Bearer ${token}`, // Passa o token no header
                },
            });

            this.errorMessage = '';
            this.$emit('listCreated', response.data._id);
        } catch (error) {
            this.errorMessage = error.response?.data?.error || 'Erro ao salvar a lista.';
        }
    },

    retornaLista() {
        this.controlador.lista();
    }
}
});