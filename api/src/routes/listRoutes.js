import { Router } from 'express';
const router = Router();
import List from '../models/List.js';
import Board from '../models/Board.js';
import Card from '../models/Card.js';

// 1) Criar lista
router.post('/', async (req, res) => {
    try {
        const { title, boardId, position, cards } = req.body;
        const list = await List.create({ title, boardId, position, cards });

        // Adicionar a lista ao campo lists do board correspondente
        await Board.findByIdAndUpdate(boardId, { $push: { lists: list._id } });

        return res.status(201).json(list);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao criar lista' });
    }
});

// 2) Listar listas de um quadro
router.get('/board/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await List.find({ boardId }).sort({ position: 1 }).populate('cards');
        return res.status(200).json(lists);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao listar listas' });
    }
});

// 3) Atualizar uma lista
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, position, cards } = req.body;
        const updated = await List.findByIdAndUpdate(
            id,
            { title, position, cards },
            { new: true }
        ).populate('cards');
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar lista' });
    }
});

// 4) Remover uma lista
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Remover os cards associados à lista
        await Card.deleteMany({ _id: { $in: list.cards } });

        // Remover a lista do campo lists do board correspondente
        await Board.findByIdAndUpdate(list.boardId, { $pull: { lists: list._id } });

        await list.deleteOne();
        return res.status(200).json({ message: 'Lista removida com sucesso' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao remover lista' });
    }
});

export default router;