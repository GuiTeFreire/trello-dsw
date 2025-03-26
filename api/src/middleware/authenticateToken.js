import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Importe o modelo User

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token recebido:', token);

    if (!token) {
        console.error('Token não fornecido');
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        const user = await User.findById(decoded.id);
        console.log('Usuário autenticado:', user);

        if (!user) {
            console.error('Usuário não encontrado');
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
};

export default authenticateToken;
