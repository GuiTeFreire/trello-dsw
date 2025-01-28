import { Router } from 'express';
import Card from '../models/Card.js';
import List from '../models/List.js';
import authenticateToken from '../middleware/authenticateToken.js';

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

router.post('/', async (req, res) => {
    const { nome, usuario, descricao, quadro, coluna, dataInicio, dataFim } = req.body;

    if (!nome || !usuario || !quadro || !coluna) {
        return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
    }

    try {
        const card = new Card({ nome, usuario, descricao, quadro, coluna, dataInicio, dataFim });
        await card.save();

        // Adicionar o card à lista correspondente
        await List.findByIdAndUpdate(coluna, { $push: { cards: card._id } });

        res.status(201).json({ message: "O card foi criado.", card });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar o card." });
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