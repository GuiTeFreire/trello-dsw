// src/controllers/userController.js
import User from '../models/User.js';

// Pegar perfil do usuário
export async function getUserProfile(req, res) {
    console.log("Fetching user profile");
    try {
        const user = await User.findById(req.user.id); // Supondo que req.user.id está disponível através do middleware de autenticação
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os dados do usuário', error: error.message });
    }
}

// Atualizar perfil do usuário
export async function updateUserProfile(req, res) {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar os dados do usuário', error: error.message });
    }
}
