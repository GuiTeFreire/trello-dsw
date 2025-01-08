const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());

const port = 3000;
const dbName = "trello-dsw";

var Card = null;
var connection = null;

// Conexão com o banco de dados
async function connect() {
    if (connection && Card) {
        return { connection, Card };
    }

    console.log("Tentando conectar ao banco de dados...");
    try {
        connection = await mongoose.connect(
            "mongodb://127.0.0.1:27017/",
            {
                dbName: dbName,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log(`Conectado ao banco de dados ${dbName}`);

        Card = mongoose.model('Card', {
            nome: String,
            usuario: String,
            descricao: String,
            quadro: String,
            coluna: String,
            dataInicio: Date,
            dataFim: Date,
        });
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    }
    return { connection, Card };
}

// Rotas iniciais
app.get("/", async (req, res) => {
    const { Card } = await connect();
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar os cards." });
    }
});

app.get('/:id', async (req, res) => {
    const { Card } = await connect();
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

app.post('/', async (req, res) => {
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

app.delete('/:id', async (req, res) => {
    const { Card } = await connect();
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
    const { Card } = await connect();
    try {
        const card = new Card({ nome, usuario, descricao, quadro, coluna, dataInicio, dataFim });
        await card.save();
        res.json({ message: "O card foi criado.", card });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar o card." });
    }
}

async function atualizarCard(id, nome, usuario, descricao, quadro, coluna, dataInicio, dataFim, res) {
    const { Card } = await connect();
    try {
        const card = await Card.findById(id);
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
        await card.save();
        res.json({ message: "Card atualizado.", card });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar o card." });
    }
}

app.listen(port, () => {
    connect();
    console.log(`Servidor rodando na porta ${port}`);
});
