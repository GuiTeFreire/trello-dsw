import { Schema, model } from 'mongoose';

const BoardSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        // Se quiser relacionar com usuário:
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Você pode incluir mais campos, como cor de fundo, cor de texto, etc.
        backgroundColor: { type: String, default: '#ffffff' },
        textColor: { type: String, default: '#000000' },
        // Caso tenha favoritos:
        isFavorite: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model('Board', BoardSchema);
