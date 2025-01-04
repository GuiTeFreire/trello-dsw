import { Router } from 'express';
const router = Router();
import Board from '../models/Board.js';

/**
 * GET /boards
 * Retorna todos os boards, ou só do usuário logado
 * (isso depende de como você controla a autenticação/permissão)
 */
router.get('/', async (req, res) => {
    try {
        // Se tiver user ID (req.user.id, por ex.) e quiser filtrar:
        // const boards = await Board.find({ owner: req.user.id });
        const boards = await Board.find({});
        return res.json(boards);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar boards' });
    }
});

/**
 * GET /boards/:id
 * Retorna um board específico
 */
router.get('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }
        return res.json(board);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar board' });
    }
});

/**
 * POST /boards
 * Cria um novo board
 */
router.post('/', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite } = req.body;
        // Se tiver user ID:
        // const owner = req.user.id;
        const newBoard = await Board.create({
            title,
            backgroundColor,
            textColor,
            isFavorite,
            // owner,
        });
        return res.status(201).json(newBoard);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar board' });
    }
});

/**
 * PUT /boards/:id
 * Atualiza as informações de um board
 */
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
        return res.status(500).json({ error: 'Erro ao atualizar board' });
    }
});

/**
 * DELETE /boards/:id
 * Remove um board específico
 */
router.delete('/:id', async (req, res) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }
        return res.json({ message: 'Board removido com sucesso' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao remover board' });
    }
});

export default router;
