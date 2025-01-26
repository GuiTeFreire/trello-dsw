Vue.component('formulario-card', {
    props: ['controlador'],

    data: function () {
        return {
            titulo: '',
            errorMessage: '',
            card: {
                _id: '',
                nome: '',
                usuario: '',
                descricao: '',
                quadro: '',
                coluna: '',
                dataInicio: '',
                dataFim: ''
            },
            quadros: ['Quadro 1', 'Quadro 2', 'Quadro 3'], // Exemplos de quadros
            colunas: ['To Do', 'In Progress', 'Done'] // Exemplos de colunas
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
                        <v-btn color="primary" class="mb-2" @click="salvaCard">
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

                        <label class="form-label" for="nome">Nome:</label>
                        <input class="form-input" name="nome" v-model="card.nome" />

                        <label class="form-label" for="usuario">Usuário:</label>
                        <input class="form-input" name="usuario" v-model="card.usuario" />

                        <label class="form-label" for="descricao">Descrição:</label>
                        <textarea class="form-input" name="descricao" rows="3" v-model="card.descricao"></textarea>

                        <label class="form-label" for="quadro">Quadro:</label>
                        <select class="form-input" name="quadro" v-model="card.quadro">
                            <option v-for="quadro in quadros" :key="quadro" :value="quadro">
                                {{ quadro }}
                            </option>
                        </select>

                        <label class="form-label" for="coluna">Coluna:</label>
                        <select class="form-input" name="coluna" v-model="card.coluna">
                            <option v-for="coluna in colunas" :key="coluna" :value="coluna">
                                {{ coluna }}
                            </option>
                        </select>

                        <label class="form-label" for="dataInicio">Data de Início:</label>
                        <input type="date" class="form-input" name="dataInicio" v-model="card.dataInicio" />

                        <label class="form-label" for="dataFim">Data de Fim:</label>
                        <input type="date" class="form-input" name="dataFim" v-model="card.dataFim" />
                    </v-col>
                </v-row>
            </v-container>
        </div>`,

    methods: {
        prepara: function () {
            this.errorMessage = '';
            this.card = { ...this.controlador.itemSelecionado };
            this.titulo = this.card._id === '' ? 'Novo Card' : 'Editar Card';
        },

        salvaCard: function () {
            const url = `http://localhost:4331/api/cards${this.card._id ? '' : ''}`;
            axios.post(url, this.card)
                .then(response => {
                    this.errorMessage = '';
                    this.controlador.lista();
                })
                .catch(error => {
                    this.errorMessage = error.response?.data?.error || 'Erro ao salvar o card.';
                });
        },

        retornaLista: function () {
            this.controlador.lista();
        }
    }
});
