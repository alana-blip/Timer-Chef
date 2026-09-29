const express = require('express');
const router = express.Router();
const Timer = require('../models/Timer');

router.get('/', (req, res) => {
    const {min, seg, nome} = req.query;
    res.render('index', {
        timerAtivo: {
            nome:nome ||'Cronômetro Principal',
            minutos: min !== undefined ? parseInt(min) : 0,
            segundos: seg !== undefined ? parseInt(seg) : 0
        },
        rotaAtual: 'inicio'
    });
});

router.post('/finalizar-timer', (req, res) => {
    const {minutos, segundos} = req.body;

    req.session.tempTimer = {
        minutos: parseInt(minutos) || 0,
        segundos: parseInt(segundos) || 0
    };

    if(!req.session.usuario){
        return res.redirect('/login');
    }

    res.redirect('/salvar-timer');
});

router.get('/salvar-timer', (req, res) => {
    if(!req.session.tempTimer) return res.redirect('/');
    res.render('salvar_pos_timer', {
        rotaAtual: 'inicio',
        tempTimer: req.session.tempTimer
    });
});

router.post('/salvar-timer-confirmar', async (req, res) => {
    if(!req.session.usuario || !req.session.tempTimer) {
        return res.redirect('/');
    }

    const {nome} = req.body;
    const {minutos, segundos} = req.session.tempTimer;

    await Timer.create({
        nome: nome || 'Meu Cronometro',
        minutos,
        segundos,
        usuarioId: req.session.usuario.id
    });

    delete req.session.tempTimer;
    res.redirect('/salvos');
});

module.exports = router;