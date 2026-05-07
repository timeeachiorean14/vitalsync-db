const mongoose = require('mongoose');

const AlarmSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // Ex: Tahicardie, Cădere [cite: 142]
    message: String,
    sensorValue: Number,
    patientNote: String, // Textul introdus de pacient în momentul alarmei [cite: 64, 142]
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alarm', AlarmSchema);