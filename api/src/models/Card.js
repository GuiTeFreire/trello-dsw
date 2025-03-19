import { Schema, model } from 'mongoose';

const CardSchema = new Schema(
    {
        nome: String,
        usuario: String,
        descricao: String,
        quadro: String,
        coluna: String,
    },
    { timestamps: true } // Adiciona os campos `createdAt` e `updatedAt`
);

export default model('Card', CardSchema);
