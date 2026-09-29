const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { rotaAtual: 'cadastro', erro: null});
});

router.post('/cadastro', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExistente = await User.findOne({ username });
    if (userExistente) {
      return res.render('cadastro', { 
        rotaAtual: 'cadastro', 
        erro: 'Este nome de usuário já está em uso. Escolha outro.' 
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const novoUsuario = await User.create({
      username,
      password: hashedPassword
    });

    req.session.usuario = { id: novoUsuario._id, username: novoUsuario.username };

    if (req.session.tempTimer) {
      return res.redirect('/salvar-timer');
    }

    res.redirect('/salvos');
  } catch (error) {
    console.error("❌ ERRO NO CADASTRO:", error); 
    res.render('cadastro', { rotaAtual: 'cadastro', erro: 'Erro ao cadastrar. Tente novamente.' });
  }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

router.get('/login', (req, res) => {
  res.render('login', { rotaAtual: 'login', erro: null });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usuario = await User.findOne({ username });
    if (!usuario) {
      return res.render('login', { rotaAtual: 'login', erro: 'Usuário ou senha incorretos.' });
    }

    const senhaValida = bcrypt.compareSync(password, usuario.password);
    if (!senhaValida) {
      return res.render('login', { rotaAtual: 'login', erro: 'Usuário ou senha incorretos.' });
    }

    req.session.usuario = { id: usuario._id, username: usuario.username };

    if (req.session.tempTimer) {
      return res.redirect('/salvar-timer');
    }

    res.redirect('/salvos');
  } catch (error) {
    console.error("❌ ERRO NO LOGIN:", error);
    res.render('login', { rotaAtual: 'login', erro: 'Erro ao fazer login. Tente novamente.' });
  }
});
module.exports = router;