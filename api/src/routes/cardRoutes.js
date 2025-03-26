import { Router } from 'express';
import Card from '../models/Card.js';
import List from '../models/List.js';
import authenticateToken from '../middleware/authenticateToken.js';
import Board from '../models/Board.js';
import BoardPermissions from '../models/BoardPermissions.js';

const router = Router();

// Rotas iniciais
router.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        console.error("Erro ao buscar os cards:", err);
        res.status(500).json({ error: "Erro ao buscar os cards." });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: "Card não encontrado." });
        }
        res.json(card);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar o card." });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { nome, descricao, quadro, coluna, dataInicio, dataFim } = req.body;

        console.log('Iniciando criação do card...');
        console.log('Dados recebidos:', req.body);

        // Verificar se o quadro existe
        const board = await Board.findById(quadro);
        if (!board) {
            console.error('Quadro não encontrado.');
            return res.status(404).json({ error: 'Quadro não encontrado.' });
        }

        // Verificar se o usuário é o dono ou tem permissão de edição
        if (board.owner.toString() !== req.user.id) {
            console.log('Usuário não é o dono do quadro. Verificando permissões...');
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission || !permission.canEdit) {
                console.error('Usuário não tem permissão para criar cards.');
                return res.status(403).json({ error: 'Você não tem permissão para criar cards neste quadro.' });
            }
        }

        console.log('Usuário autorizado. Criando card...');
        const card = new Card({ nome, descricao, quadro, coluna, dataInicio, dataFim });
        await card.save();

        console.log('Card criado com sucesso. Atualizando lista...');
        // Adicionar o card à lista correspondente
        await List.findByIdAndUpdate(coluna, { $push: { cards: card._id } });

        res.status(201).json({ message: 'Card criado com sucesso.', card });
    } catch (err) {
        console.error('Erro ao criar o card:', err);
        res.status(500).json({ error: 'Erro ao criar o card.' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { nome, descricao, coluna, dataInicio, dataFim } = req.body;

        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card não encontrado.' });
        }

        const board = await Board.findById(card.quadro);
        if (!board) {
            return res.status(404).json({ error: 'Quadro não encontrado.' });
        }

        // Verificar se o usuário é o dono ou tem permissão de edição
        if (board.owner.toString() !== req.user.id) {
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission || !permission.canEdit) {
                return res.status(403).json({ error: 'Você não tem permissão para editar este card.' });
            }
        }

        // Verificar se a lista foi alterada
        if (card.coluna.toString() !== coluna) {
            // Remover o card da lista antiga
            await List.findByIdAndUpdate(card.coluna, { $pull: { cards: card._id } });

            // Adicionar o card à nova lista
            await List.findByIdAndUpdate(coluna, { $push: { cards: card._id } });
        }

        // Atualizar o card
        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            { nome, descricao, coluna, dataInicio, dataFim },
            { new: true }
        );

        res.json({ message: 'Card atualizado com sucesso.', card: updatedCard });
    } catch (err) {
        console.error('Erro ao atualizar o card:', err);
        res.status(500).json({ error: 'Erro ao atualizar o card.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: "Card não encontrado." });
        }
        await card.deleteOne();
        res.json({ message: "Card ID " + req.params.id + " removido." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao remover o card." });
    }
});

export default router;