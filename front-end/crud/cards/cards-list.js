Vue.component('lista-cards', {
    props: ['controlador'],

    data: function () {
        return {
            headers: [
                { text: 'ID', align: 'start', sortable: true, value: '_id' },
                { text: 'Nome', align: 'start', sortable: true, value: 'nome' },
                { text: 'Quadro', align: 'start', sortable: true, value: 'quadro' },
                { text: 'Coluna', align: 'start', sortable: true, value: 'coluna' },
                { text: '', value: 'actions', sortable: false },
            ],
            items: [],
            totalItems: 0,
            loading: false,
            options: { itemsPerPage: 10 },
            filtroNome: ''
        };
    },

    template: `
        <div>
            <v-container>
                <v-row>
                    <v-col cols="9">
                        <h2>Cards</h2>
                    </v-col>
                    <v-col cols="3" class="text-right">
                        <v-btn color="primary" dark class="mb-2" @click="novoCard">
                            Novo Card
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>

            <v-container>
                <v-row>
                    <v-col cols="12">
                        <div class="filter-section">
                            <label for="filter-nome">Nome:</label>
                            <input name="filter-nome" v-model="filtroNome" @keyup="atualizaLista"/>
                        </div>

                        <v-data-table
                            :headers="headers"
                            :items="items"
                            :loading="loading"
                            :options.sync="options"
                            :server-items-length="totalItems"
                            class="elevation-1"
                            loading-text="Carregando os dados ... Por favor, aguarde."
                            @update:options="atualizaLista">

                            <template v-slot:item.actions="{ item }">
                                <div class="text-right">
                                    <v-icon class="mr-2" @click="editaCard(item)">mdi-pencil</v-icon>
                                    <v-icon @click="removeCard(item)">mdi-delete</v-icon>
                                </div>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </div>`,

    methods: {
        atualizaLista: function () {
            this.loading = true;

            const sortBy = this.options.sortBy?.[0] || '';
            const sortDesc = this.options.sortDesc?.[0] || '';
            const page = this.options.page || 1;
            const itemsPerPage = this.options.itemsPerPage || 10;
            const queryString = `sortField=${sortBy}&sortDesc=${sortDesc}&page=${page}&itemsPage=${itemsPerPage}&filter=${this.filtroNome}`;

            axios.get(`http://localhost:3000?${queryString}`)
                .then(response => {
                    this.items = response.data;
                    this.totalItems = response.data.length;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        novoCard: function () {
            this.controlador.insere({
                _id: '',
                nome: '',
                usuario: '',
                descricao: '',
                quadro: '',
                coluna: '',
                dataInicio: '',
                dataFim: ''
            });
        },

        editaCard: function (item) {
            this.controlador.edita(item);
        },

        removeCard: function (item) {
            this.controlador.remove(item);
        }
    },

    mounted: function () {
        this.atualizaLista();
    }
});
