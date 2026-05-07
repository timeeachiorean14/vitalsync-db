const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    puls: Number,         // Valoare medie la 30s [cite: 60, 140]
    ecg: Number,          // Semnal ECG 
    temperatura: Number,  // Temperatură 
    umiditate: Number,    // Umiditate 
    accelBurst: String    // Date accelerometru sub formă de burst [cite: 63, 140, 162]
});

module.exports = mongoose.model('Measurement', MeasurementSchema);