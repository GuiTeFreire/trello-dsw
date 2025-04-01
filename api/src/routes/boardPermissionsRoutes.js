import { Router } from 'express';
import BoardPermissions from '../models/BoardPermissions.js';
import Board from '../models/Board.js';
import authenticateToken from '../middleware/authenticateToken.js';
import User from '../models/User.js';

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
        console.log('1');
        const { email, canEdit } = req.body;
        const board = await Board.findById(req.params.boardId);
        console.log('2');
        // Verificar se o quadro existe
        if (!board) {
            return res.status(404).json({ error: 'Quadro não encontrado.' });
        }
        console.log('3');
        // Verificar se o usuário autenticado é o dono do quadro
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para compartilhar este quadro.' });
        }
        console.log('4');
        // Buscar o usuário pelo email
        console.log(email);
        const user = await User.findOne({ email: email.trim() });
        console.log('c')
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        console.log('5');
        // Criar ou atualizar a permissão
        const permission = await BoardPermissions.findOneAndUpdate(
            { board: req.params.boardId, user: user._id },
            { canEdit },
            { upsert: true, new: true }
        );
        console.log('6');
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar permissão.' });
    }
});

// Atualizar o campo isFavorite para um quadro específico
router.put('/:boardId/favorite', async (req, res) => {
    try {
        const { isFavorite } = req.body;

        console.log('Recebido do frontend:', { boardId: req.params.boardId, userId: req.user.id, isFavorite });

        const permission = await BoardPermissions.findOneAndUpdate(
            { board: req.params.boardId, user: req.user.id },
            { $set: { isFavorite } },
            { new: true, upsert: true }
        );

        if (!permission) {
            console.error('Permissão não encontrada ou não foi possível criar:', req.params.boardId);
            return res.status(404).json({ error: 'Permissão não encontrada ou não foi possível criar.' });
        }

        console.log('Documento atualizado no banco de dados:', permission);

        res.json({ message: 'Favorito atualizado com sucesso.', permission });
    } catch (error) {
        console.error('Erro ao atualizar favorito:', error);
        res.status(500).json({ error: 'Erro ao atualizar favorito.' });
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