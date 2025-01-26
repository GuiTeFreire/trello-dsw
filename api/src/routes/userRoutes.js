import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = Router();

// Rota para obter os dados do usuário
router.get('/profile', getUserProfile);

// Rota para atualizar os dados do usuário
router.put('/profile', updateUserProfile);

export default router;
