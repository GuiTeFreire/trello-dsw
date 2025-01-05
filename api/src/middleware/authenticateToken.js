import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Assume formato 'Bearer TOKEN'

    if (!token) {
        return res.sendStatus(401); // N�o autorizado se n�o houver token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token inv�lido ou expirado
        }

        req.user = user;
        next();
    });
};

export default authenticateToken;
