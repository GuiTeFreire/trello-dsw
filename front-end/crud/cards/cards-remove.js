Vue.component('deleta-card', {
    props: ['controlador'],
    
    data: function () {
        return {
            headers: [
                { text: 'Campo', align: 'start', sortable: true, value: 'campo' },
                { text: 'Valor', align: 'start', sortable: true, value: 'valor' },
            ],
        };
    },
    
    template: `
        <div>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <h2>Remover Card</h2>
                    </v-col>
                    <v-col cols="6" class="text-right">
                        <v-btn color="error" class="mb-2" @click="removeCard">
                            Remover
                        </v-btn>
                        <v-btn color="outlined" class="mb-2" @click="retornaLista">
                            Retornar à lista
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>

            <v-container>
                <v-row>
                    <v-col cols="12">
                        <p class="view-label">ID:</p>
                        <p class="view-data">{{ controlador.itemSelecionado._id }}</p>

                        <p class="view-label">Nome:</p>
                        <p class="view-data">{{ controlador.itemSelecionado.nome }}</p>

                        <p class="view-label">Usuário:</p>
                        <p class="view-data">{{ controlador.itemSelecionado.usuario }}</p>

                        <p class="view-label">Descrição:</p>
                        <p class="view-data">{{ controlador.itemSelecionado.descricao }}</p>

                        <p class="view-label">Quadro:</p>
                        <p class="view-data">{{ controlador.itemSelecionado.quadro }}</p>

                        <p class="view-label">Coluna:</p>
                        <p class="view-data">{{ controlador.itemSelecionado.coluna }}</p>

                        <p class="view-label">Datas:</p>
                        <p class="view-data">
                            Início: {{ controlador.itemSelecionado.dataInicio || 'N/A' }}<br>
                            Fim: {{ controlador.itemSelecionado.dataFim || 'N/A' }}
                        </p>
                    </v-col>
                </v-row>
            </v-container>
        </div>`,

    methods: {
        removeCard: function () {
            axios.delete(`http://localhost:4331/api/cards${this.controlador.itemSelecionado._id}`)
                .then(response => {
                    this.controlador.lista();
                })
                .catch(error => {
                    console.error("Erro ao remover o card:", error);
                });
        },

        retornaLista: function () {
            this.controlador.lista();
        }
    }
});
