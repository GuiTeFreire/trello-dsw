import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao logar', error: error.message });
    }
});

router.post('/logout', (req, res) => {
    // JWT é um mecanismo stateless, logo o logout deve ser controlado no cliente.
    res.status(200).json({ message: 'Logout efetuado com sucesso.' });
});

export default router;
