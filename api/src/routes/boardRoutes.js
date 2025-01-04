import { Router } from 'express';
import Board from '../models/Board.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = Router();

// Aplicar o middleware de autenticação a todas as rotas de boards
router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const boards = await Board.find({ owner: req.user.id });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar boards' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }
        return res.json(board);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar board' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite } = req.body;
        const owner = req.user.id;  // Diretamente do usuário autenticado
        const newBoard = await Board.create({
            title,
            backgroundColor,
            textColor,
            isFavorite,
            owner,
        });
        return res.status(201).json(newBoard);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar board' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite } = req.body;
        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.id,
            { title, backgroundColor, textColor, isFavorite },
            { new: true }
        );
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
