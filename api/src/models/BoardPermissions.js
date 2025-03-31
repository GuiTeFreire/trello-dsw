import mongoose from 'mongoose';

const BoardPermissionsSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    canEdit: {
        type: Boolean,
        default: false,
    },
    isFavorite: {
        type: Boolean,
        default: false, // Cada usuário pode definir se o quadro é favorito
    },
}, { timestamps: true });

BoardPermissionsSchema.index({ board: 1, user: 1 }, { unique: true });

export default mongoose.model('BoardPermissions', BoardPermissionsSchema);