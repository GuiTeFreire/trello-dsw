import { Router } from 'express';
import Board from '../models/Board.js';
import authenticateToken from '../middleware/authenticateToken.js';
import BoardPermissions from '../models/BoardPermissions.js';

const router = Router();

// Aplicar o middleware de autenticação a todas as rotas de boards
router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const boards = await Board.find().populate('lists');
        res.json(boards);
    } catch (error) {
        console.error("Erro ao buscar os boards:", error);
        res.status(500).json({ error: 'Erro ao buscar boards' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate('lists');

        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado.' });
        }

        // Verificar se o usuário tem permissão para acessar o quadro
        if (board.owner.toString() !== req.user.id) {
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission) {
                return res.status(403).json({ error: 'Acesso negado.' });
            }
        }

        res.json(board);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar board.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite, lists } = req.body;
        const owner = req.user.id; // Usuário autenticado como dono do quadro

        // Criar o quadro
        const newBoard = await Board.create({
            title,
            backgroundColor,
            textColor,
            isFavorite,
            owner,
            lists,
        });

        // Criar a permissão para o dono do quadro
        await BoardPermissions.create({
            board: newBoard._id,
            user: owner,
            canEdit: true, // O dono sempre pode editar
        });

        return res.status(201).json(newBoard);
    } catch (error) {
        console.error('Erro ao criar board:', error);
        res.status(500).json({ error: 'Erro ao criar board' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite, lists } = req.body;
        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.id,
            { title, backgroundColor, textColor, isFavorite, lists },
            { new: true }
        ).populate('lists');
        if (!updatedBoard) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }
        return res.json(updatedBoard);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar board' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }
        return res.json({ message: 'Board removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover board' });
    }
});

export default router;