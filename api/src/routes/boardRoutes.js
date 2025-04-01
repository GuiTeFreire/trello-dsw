import { Router } from 'express';
import Board from '../models/Board.js';
import authenticateToken from '../middleware/authenticateToken.js';
import BoardPermissions from '../models/BoardPermissions.js';

const router = Router();

// Aplicar o middleware de autenticação a todas as rotas de boards
router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        console.log('Iniciando busca de boards para o usuário:', req.user.id);

        // Buscar quadros do usuário autenticado
        const ownedBoards = await Board.find({ owner: req.user.id }).populate('lists');
        console.log('Quadros próprios encontrados:', ownedBoards);

        // Buscar permissões para os quadros próprios
        const ownedBoardPermissions = await BoardPermissions.find({
            board: { $in: ownedBoards.map(board => board._id) },
            user: req.user.id,
        });

        console.log('Permissões para quadros próprios:', ownedBoardPermissions);

        const ownedBoardsWithFavorites = ownedBoards.map(board => {
            const permission = ownedBoardPermissions.find(p => p.board.toString() === board._id.toString());
            return {
                ...board.toObject(),
                isFavorite: permission ? permission.isFavorite : false, // Usar o valor de BoardPermissions
            };
        });

        console.log('Quadros próprios com favoritos:', ownedBoardsWithFavorites);

        // Buscar quadros compartilhados com o usuário
        const sharedPermissions = await BoardPermissions.find({ user: req.user.id }).populate('board');
        console.log('Permissões compartilhadas encontradas:', sharedPermissions);

        const sharedBoards = sharedPermissions
            .filter(permission => permission.board !== null) // Filtrar permissões com boards nulos
            .map(permission => ({
                ...permission.board.toObject(),
                isFavorite: permission.isFavorite, // Usar o valor de BoardPermissions
            }));

        console.log('Quadros compartilhados encontrados:', sharedBoards);

        // Combinar quadros próprios e compartilhados, removendo duplicados
        const allBoards = [
            ...ownedBoardsWithFavorites,
            ...sharedBoards.filter(sharedBoard =>
                !ownedBoardsWithFavorites.some(ownedBoard =>
                    ownedBoard && sharedBoard && ownedBoard._id.equals(sharedBoard._id) // Verificar nulos
                )
            ),
        ];

        console.log('Todos os quadros combinados:', allBoards);

        res.json(allBoards);
    } catch (error) {
        console.error('Erro ao buscar os boards:', error);
        res.status(500).json({ error: 'Erro ao buscar boards' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate('lists');

        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado.' });
        }

        // Verificar se o usuário tem permissão para acessar o quadro
        let canEdit = false;
        if (board.owner.toString() === req.user.id) {
            canEdit = true; // O proprietário sempre pode editar
        } else {
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (permission && permission.canEdit) {
                canEdit = true;
            }
        }

        res.json({ ...board.toObject(), canEdit });
    } catch (error) {
        console.error('Erro ao buscar board:', error);
        res.status(500).json({ error: 'Erro ao buscar board.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite, lists } = req.body;
        const owner = req.user.id; // Usuário autenticado como dono do quadro

        // Criar o quadro
        const newBoard = await Board.create({
            title,
            backgroundColor,
            textColor,
            isFavorite: isFavorite || false, // Certifique-se de que o campo está sendo tratado
            owner,
            lists,
        });

        // Criar a permissão para o dono do quadro
        await BoardPermissions.create({
            board: newBoard._id,
            user: owner,
            canEdit: true, // O dono sempre pode editar
            isFavorite: isFavorite || false, // Sincronizar com o campo do board
        });

        return res.status(201).json(newBoard);
    } catch (error) {
        console.error('Erro ao criar board:', error);
        res.status(500).json({ error: 'Erro ao criar board' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, backgroundColor, textColor, isFavorite, lists } = req.body;

        // Verificar se o usuário é o dono do quadro
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }

        if (board.owner.toString() !== req.user.id) {
            // Verificar se o usuário tem permissão de edição
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission || !permission.canEdit) {
                return res.status(403).json({ error: 'Você não tem permissão para editar este quadro.' });
            }
        }

        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.id,
            { title, backgroundColor, textColor, isFavorite, lists },
            { new: true }
        );

        if (!updatedBoard) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }

        return res.json(updatedBoard);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar board' });
    }
});

router.put('/:id/favorite', authenticateToken, async (req, res) => {
    try {
        const { isFavorite } = req.body;

        console.log('Atualizando favorito:', { boardId: req.params.id, userId: req.user.id, isFavorite });

        const permission = await BoardPermissions.findOneAndUpdate(
            { board: req.params.id, user: req.user.id },
            { isFavorite },
            { new: true } // Retorna o documento atualizado
        );

        if (!permission) {
            return res.status(404).json({ error: 'Permissão não encontrada para este quadro.' });
        }

        res.json({ message: 'Favorito atualizado com sucesso.', permission });
    } catch (error) {
        console.error('Erro ao atualizar favorito:', error);
        res.status(500).json({ error: 'Erro ao atualizar favorito.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ error: 'Board não encontrado' });
        }

        // Verificar se o usuário é o dono do quadro
        if (board.owner.toString() !== req.user.id) {
            // Verificar se o usuário tem permissão de edição
            const permission = await BoardPermissions.findOne({ board: board._id, user: req.user.id });
            if (!permission || !permission.canEdit) {
                return res.status(403).json({ error: 'Você não tem permissão para excluir este quadro.' });
            }
        }

        await Board.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Board removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover board' });
    }
});

export default router;