function criaControlador() {
    return {
        painelLista: null,
        painelFormulario: null,
        painelRemocao: null,

        apresentandoPainelLista: true,
        apresentandoPainelFormulario: false,
        apresentandoPainelRemocao: false,

        itemSelecionado: {},

        lista: function () {
            if (this.painelLista && typeof this.painelLista.atualizaLista === 'function') {
                this.painelLista.atualizaLista();
            } else {
                console.error('painelLista ou atualizaLista não está definido');
            }
            this.apresentandoPainelLista = true;
            this.apresentandoPainelFormulario = false;
            this.apresentandoPainelRemocao = false;
        },

        insere: function (item) {
            this.itemSelecionado = item;
            if (this.painelFormulario && typeof this.painelFormulario.prepara === 'function') {
                this.painelFormulario.prepara();
            } else {
                console.error('painelFormulario ou prepara não está definido');
            }
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = true;
            this.apresentandoPainelRemocao = false;
        },

        edita: function (item) {
            this.itemSelecionado = item;
            if (this.painelFormulario && typeof this.painelFormulario.prepara === 'function') {
                this.painelFormulario.prepara();
            } else {
                console.error('painelFormulario ou prepara não está definido');
            }
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = true;
            this.apresentandoPainelRemocao = false;
        },

        remove: function (item) {
            this.itemSelecionado = item;
            this.apresentandoPainelLista = false;
            this.apresentandoPainelFormulario = false;
            this.apresentandoPainelRemocao = true;
        }
    };
}

export default criaControlador;