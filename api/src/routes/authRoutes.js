import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
            expiresIn: '1d'
        });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
            expiresIn: '1d'
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao logar', error: error.message });
    }
});

// Logout (opcional para fazer no servidor, já que o JWT geralmente é controlado no cliente)
router.post('/logout', (req, res) => {
    res.status(200).json({ token: null });
});

export default router;
