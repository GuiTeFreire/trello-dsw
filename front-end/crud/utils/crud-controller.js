function criaControladorCards() {
    return {
        painelLista: null, // Painel de listagem de cards
        painelFormulario: null, // Painel de formulário para criar/editar cards
        painelRemocao: null, // Painel de confirmação de remoção de cards

        apresentandoPainelLista: true, // Define se o painel de lista está ativo
        apresentandoPainelFormulario: false, // Define se o painel de formulário está ativo
        apresentandoPainelRemocao: false, // Define se o painel de remoção está ativo

        itemSelecionado: {}, // Card atualmente selecionado para edição ou remoção

        // Atualiza e exibe o painel de lista de cards
        lista: function () {
            this.painelLista.atualizaLista();
            this.apresentandoPainelLista = true;
            this.apresentandoPainelFormulario = false;
            this.apresentandoPainelRemocao = false;
        },

        // Prepara e exibe o formulário para criar um novo card
        insere: function (item) {
            this.itemSelecionado = item;
            this.painelFormulario.prepara();
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = true;
            this.apresentandoPainelRemocao = false;
        },

        // Prepara e exibe o formulário para editar um card existente
        edita: function (item) {
            this.itemSelecionado = item;
            this.painelFormulario.prepara();
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = true;
            this.apresentandoPainelRemocao = false;
        },

        // Prepara e exibe o painel de remoção para confirmar a exclusão do card
        remove: function (item) {
            this.itemSelecionado = item;
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = false;
            this.apresentandoPainelRemocao = true;
        }
    };
}
