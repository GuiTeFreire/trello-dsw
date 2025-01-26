import { Router } from 'express';
import Card from '../models/Card.js';
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
    var id = req.body._id;
    var nome = req.body.nome;
    var usuario = req.body.usuario;
    var descricao = req.body.descricao;
    var quadro = req.body.quadro;
    var coluna = req.body.coluna;
    var dataInicio = req.body.dataInicio;
    var dataFim = req.body.dataFim;

    if (verificaRegrasNegocio(nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res)) {
        if (id == "") {
            criarCard(nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res);
        } else {
            atualizarCard(id, nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res);
        }
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

// Função de verificação de regras de negócio
function verificaRegrasNegocio(nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res) {
    if (!nome || !usuario || !quadro || !coluna) {
        res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
        return false;
    }
    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
        res.status(400).json({ error: "Data de início não pode ser maior que a data de fim." });
        return false;
    }
    return true;
}

// Funções de criação e atualização do card
async function criarCard(nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res) {
    try {
        const card = new Card({ nome, usuario, descricao, quadro, coluna, dataInicio, dataFim });
        card.save();
        res.json({ message: "O card foi criado.", card });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar o card." });
    }
}

async function atualizarCard(id, nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res) {
    try {
        const card = Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: "Card não encontrado." });
        }
        card.nome = nome;
        card.usuario = usuario;
        card.descricao = descricao;
        card.quadro = quadro;
        card.coluna = coluna;
        card.dataInicio = dataInicio;
        card.dataFim = dataFim;
        card.save();
        res.json({ message: "Card atualizado.", card });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar o card." });
    }
}

export default router;
