import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Importe o modelo User

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Assume formato 'Bearer TOKEN'

    if (!token) {
        return res.sendStatus(401); // Não autorizado se não houver token
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        console.log("Decoded ID:", decoded.id);
        if (err) {
            return res.sendStatus(403); // Token inválido ou expirado
        }

        try {
            const user = await User.findById(decoded.id).select('-password'); // Exclui a senha nos dados retornados
            if (!user) {
                return res.sendStatus(404); // Usuário não encontrado
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Authentication Middleware Error:', error);
            return res.sendStatus(500); // Erro interno do servidor
        }
    });
};

export default authenticateToken;
