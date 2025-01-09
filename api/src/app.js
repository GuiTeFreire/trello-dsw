import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import listRoutes from './routes/listRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import authenticateToken from './middleware/authenticateToken.js';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rotas
app.use('/api/lists', listRoutes);
app.use('/api/boards', authenticateToken, boardRoutes);
app.use('/api/auth', authRoutes);

// Exportação do app
export default app;
