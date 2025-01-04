import { Router } from 'express';
const router = Router();
import List from '../models/List.js';

// 1) Criar lista
router.post('/', async (req, res) => {
    try {
        
        const { title, boardId, position } = req.body;
        console.log("chegou aqui", title)
        const list = await List.create({ title, boardId, position });
        return res.status(201).json(list);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao criar lista' });
    }
});

// 2) Listar listas de um quadro
router.get('/board/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await List.find({ boardId }).sort({ position: 1 });
        return res.status(200).json(lists);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao listar listas' });
    }
});

// 3) Atualizar uma lista
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, position } = req.body;
        const updated = await List.findByIdAndUpdate(
            id,
            { title, position },
            { new: true }
        );
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar lista' });
    }
});

// 4) Remover uma lista
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await List.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Lista removida com sucesso' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao remover lista' });
    }
});

export default router;
