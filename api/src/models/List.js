import { Schema, model } from 'mongoose';

const ListSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board', // Se estiver associando com a coleção de 'Board'
        required: true,
    },
    position: {
        type: Number,
        default: 0,  // Para ordenar as listas
    },
}, { timestamps: true });

export default model('List', ListSchema);
