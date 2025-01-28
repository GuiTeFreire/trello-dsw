import { Schema, model } from 'mongoose';

const BoardSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        backgroundColor: { type: String, default: '#ffffff' },
        textColor: { type: String, default: '#000000' },
        isFavorite: { type: Boolean, default: false },
        lists: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'List',
                },
            ],
        },
    },
    { timestamps: true }
);

export default model('Board', BoardSchema);