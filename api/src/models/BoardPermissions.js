import { Schema, model } from 'mongoose';

const BoardPermissionsSchema = new Schema(
    {
        board: {
            type: Schema.Types.ObjectId,
            ref: 'Board',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        canEdit: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

BoardPermissionsSchema.index({ board: 1, user: 1 }, { unique: true });

export default model('BoardPermissions', BoardPermissionsSchema);