import { Router } from 'express';
const router = Router();
import List from '../models/List.js';
import Board from '../models/Board.js';
import Card from '../models/Card.js';
import authenticateToken from '../middleware/authenticateToken.js';
import BoardPermissions from '../models/BoardPermissions.js';

// 1) Criar lista
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, boardId, cards } = req.body;

        // Verificar se o quadro existe
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Quadro não encontrado.' });
        }

        // Verificar se o usuário é o dono ou tem permissão de edição
        if (board.owner.toString() !== req.user.id) {
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission || !permission.canEdit) {
                return res.status(403).json({ error: 'Você não tem permissão para criar listas neste quadro.' });
            }
        }

        const listCount = await List.countDocuments({ boardId });
        const position = listCount;

        const list = await List.create({ title, boardId, position, cards });

        await Board.findByIdAndUpdate(boardId, { $push: { lists: list._id } });

        return res.status(201).json(list);
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        return res.status(400).json({ error: 'Erro ao criar lista.' });
    }
});

// 5) Reordenar listas
router.put('/reorder', async (req, res) => {
    try {
        const { lists } = req.body;

        // Atualizar a posição de cada lista
        for (const list of lists) {
            await List.findByIdAndUpdate(list._id, { position: list.position });
        }

        return res.status(200).json({ message: 'Listas reordenadas com sucesso' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao reordenar listas' });
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
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        console.log('Usuário autenticado:', req.user);

        const { id } = req.params;
        const { title, position, cards } = req.body;

        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        const board = await Board.findById(list.boardId);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }

        if (board.owner.toString() !== req.user.id) {
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission || !permission.canEdit) {
                return res.status(403).json({ error: 'Você não tem permissão para editar esta lista.' });
            }
        }

        const updated = await List.findByIdAndUpdate(
            id,
            { title, position, cards },
            { new: true }
        ).populate('cards');

        if (!updated) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        return res.status(200).json(updated);
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
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
    }  }
);

// router.post('/fix-positions/:boardId', async (req, res) => {
//     try {
//         const { boardId } = req.params;

//         // Obter todas as listas do quadro, ordenadas por `createdAt`
//         const lists = await List.find({ boardId }).sort({ createdAt: 1 });

//         // Atualizar as posições com base na ordem
//         for (let i = 0; i < lists.length; i++) {
//             await List.findByIdAndUpdate(lists[i]._id, { position: i });
//         }

//         return res.status(200).json({ message: 'Posições corrigidas com sucesso' });
//     } catch (error) {
//         return res.status(400).json({ error: 'Erro ao corrigir posições das listas' });
//     }
// });

export default router;