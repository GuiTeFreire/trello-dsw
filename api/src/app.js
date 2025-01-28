import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authenticateToken from './middleware/authenticateToken.js';
import cardRoutes from './routes/cardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import BoardPermissions from './models/BoardPermissions.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4331;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/trello-dsw', {
    serverSelectionTimeoutMS: 30000 // 30 segundos
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Rotas

app.use('/api/lists', listRoutes);
app.use('/api/boards', authenticateToken, boardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/boardsPermissions', authenticateToken, BoardPermissions);
app.use('/api/users', authenticateToken, userRoutes);

export default app;