import { Schema, model } from 'mongoose';

const ListSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    position: {
        type: Number,
        default: 0,  
    },
    cards: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Card',
            },
        ],
    },
}, { timestamps: true });

export default model('List', ListSchema);
