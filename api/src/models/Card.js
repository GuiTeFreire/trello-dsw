import { Schema, model } from 'mongoose';

const CardSchema = new Schema(
    {

        nome: String,
        usuario: String,
        descricao: String,
        quadro: String,
        coluna: String,
        dataInicio: Date,
        dataFim: Date,
}
);

export default model('Card', CardSchema);
