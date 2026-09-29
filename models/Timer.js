const mongoose = require('mongoose');

const TimerSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    minutos: {
        type: Number,
        required: true,
        default: 0
    },
    segundos: {
        type: Number,
        required: true,
        default: 0
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Timer', TimerSchema);