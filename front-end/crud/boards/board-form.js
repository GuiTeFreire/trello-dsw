Vue.component('formularioBoard', {
    props: ['controlador'],

    data: function () {
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
        <div>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <h2>{{ titulo }}</h2>
                    </v-col>
                    <v-col cols="6" class="text-right">
                        <v-btn color="primary" class="mb-2" @click="salvaBoard">
                            Salvar
                        </v-btn>
                        <v-btn color="outlined" class="mb-2" @click="retornaLista">
                            Voltar à lista
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>

            <v-container>
                <v-row>
                    <v-col cols="12">
                        <p class="error" v-show="errorMessage != ''">{{ errorMessage }}</p>

                        <label class="form-label" for="title">Título:</label>
                        <input class="form-input" name="title" v-model="board.title" />

                        <label class="form-label" for="backgroundColor">Cor de Fundo:</label>
                        <input class="form-input" name="backgroundColor" v-model="board.backgroundColor" />

                        <label class="form-label" for="textColor">Cor do Texto:</label>
                        <input class="form-input" name="textColor" v-model="board.textColor" />

                        <label class="form-label" for="isFavorite">Favorito:</label>
                        <input type="checkbox" class="form-input" name="isFavorite" v-model="board.isFavorite" />
                    </v-col>
                </v-row>
            </v-container>
        </div>`,

    methods: {
        prepara: function () {
            this.errorMessage = '';
            this.board = { ...this.controlador.itemSelecionado };
            this.titulo = this.board._id === '' ? 'Novo Quadro' : 'Editar Quadro';
        },

        salvaBoard: function () {
            const url = this.board._id ? `http://localhost:4331/api/boards/${this.board._id}` : 'http://localhost:4331/api/boards';
            const method = this.board._id ? 'put' : 'post';
            axios[method](url, this.board)
                .then(response => {
                    this.errorMessage = '';
                    this.$emit('boardCreated', response.data._id);
                })
                .catch(error => {
                    this.errorMessage = error.response?.data?.error || 'Erro ao salvar o quadro.';
                });
        },

        retornaLista: function () {
            this.controlador.lista();
        }
    }
});