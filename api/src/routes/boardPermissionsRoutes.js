import { Router } from 'express';
import BoardPermissions from '../models/BoardPermissions.js';
import Board from '../models/Board.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = Router();

// Middleware de autenticação
router.use(authenticateToken);

// Listar permissões de um quadro
router.get('/:boardId', async (req, res) => {
    try {
        const permissions = await BoardPermissions.find({ board: req.params.boardId });
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar permissões.' });
    }
});

// Adicionar uma permissão
router.post('/:boardId', async (req, res) => {
    try {
        const { userId, canEdit } = req.body;
        const board = await Board.findById(req.params.boardId);

        // Verificar se o quadro existe
        if (!board) {
            return res.status(404).json({ error: 'Quadro não encontrado.' });
        }

        // Verificar se o usuário autenticado é o dono do quadro
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para compartilhar este quadro.' });
        }

        // Criar ou atualizar a permissão
        const permission = await BoardPermissions.findOneAndUpdate(
            { board: req.params.boardId, user: userId },
            { canEdit },
            { upsert: true, new: true }
        );
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar permissão.' });
    }
});

// Remover uma permissão
router.delete('/:boardId/:userId', async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);

        // Verificar se o quadro existe
        if (!board) {
            return res.status(404).json({ error: 'Quadro não encontrado.' });
        }

        // Verificar se o usuário autenticado é o dono do quadro
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para remover esta permissão.' });
        }

        // Remover a permissão
        const permission = await BoardPermissions.findOneAndDelete({
            board: req.params.boardId,
            user: req.params.userId,
        });

        if (!permission) {
            return res.status(404).json({ error: 'Permissão não encontrada.' });
        }

        res.json({ message: 'Permissão removida com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover permissão.' });
    }
});

export default router;