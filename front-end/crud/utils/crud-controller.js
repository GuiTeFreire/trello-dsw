function criaControladorBoards() {
    return {
        painelLista: null, // Painel de listagem de boards
        painelFormulario: null, // Painel de formulário para criar/editar boards
        painelRemocao: null, // Painel de confirmação de remoção de boards

        apresentandoPainelLista: true, // Define se o painel de lista está ativo
        apresentandoPainelFormulario: false, // Define se o painel de formulário está ativo
        apresentandoPainelRemocao: false, // Define se o painel de remoção está ativo

        itemSelecionado: {}, // Board atualmente selecionado para edição ou remoção

        // Atualiza e exibe o painel de lista de boards
        lista: function () {
            this.painelLista.atualizaLista();
            this.apresentandoPainelLista = true;
            this.apresentandoPainelFormulario = false;
            this.apresentandoPainelRemocao = false;
        },

        // Prepara e exibe o formulário para criar um novo board
        insere: function (item) {
            this.itemSelecionado = item;
            this.painelFormulario.prepara();
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = true;
            this.apresentandoPainelRemocao = false;
        },

        // Prepara e exibe o formulário para editar um board existente
        edita: function (item) {
            this.itemSelecionado = item;
            this.painelFormulario.prepara();
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = true;
            this.apresentandoPainelRemocao = false;
        },

        // Prepara e exibe o painel de remoção para confirmar a exclusão do board
        remove: function (item) {
            this.itemSelecionado = item;
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = false;
            this.apresentandoPainelRemocao = true;
        }
    };
}

export default criaControladorBoards;