import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

// Configurar transporte de email (nodemailer)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "trabalhodsw@gmail.com",
        pass: "arti vvcq lvlq smdj" // Use a senha do aplicativo gerada
    },
});

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password});
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

// Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Usuario nao encontrado a partir do email' });
    }
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao logar', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout efetuado com sucesso.' });
});

// Esqueci minha senha
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: "trabalhodsw@gmail.com",
      to: email,
      subject: 'Redefinição de Senha',
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
    res.status(200).json({ message: 'Email de redefinição de senha enviado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar redefinição de senha.', error: error.message });
  }
});

// Redefinir senha
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao redefinir senha.', error: error.message });
  }
});

// Mudar a senha
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Senha atual incorreta." });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar senha.", error: error.message });
  }
});

export default router;
