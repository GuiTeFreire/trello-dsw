import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import listRoutes from './routes/listRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import authenticateToken from './middleware/authenticateToken.js';
import cardRoutes from './routes/cardRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4331;

app.use(express.json())
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/trello-dsw')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rotas
app.use('/api/lists', listRoutes);
app.use('/api/boards', authenticateToken, boardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);


// Exporta��o do app
export default app;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
