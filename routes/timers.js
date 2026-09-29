const express = require('express');
const router = express.Router();
const Timer = require('../models/Timer');

const precisaEstarLogado = (req, res, next) => {
    if(!req.session.usuario) return res.redirect('/cadastro');
    next();
};

router.get('/', precisaEstarLogado, async (req, res) => {
    const timers = await Timer.find({
        usuarioId: req.session.usuario.id
    }).sort({ criadoEm: -1});
    res.render('salvos', {timers, rotaAtual: 'salvos'});
});

router.post('/editar/:id', precisaEstarLogado, async (req, res) => {
    const { nome, minutos, segundos } = req.body;

    await Timer.findOneAndUpdate(
        { _id: req.params.id, usuarioId: req.session.usuario.id },
        {
            nome,
            minutos: parseInt(minutos) || 0,
            segundos: parseInt(segundos) || 0
        }
    );
    res.redirect('/salvos');
});

router.post('/deletar/:id', precisaEstarLogado, async (req, res) => {
    await Timer.findOneAndDelete({
        _id: req.params.id, usuarioId: req.params.usuario.id
    });
    res.redirect('/salvos');
});

module.exports = router;