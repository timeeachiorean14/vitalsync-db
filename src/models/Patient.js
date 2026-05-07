const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referință către contul de login [cite: 128]
    medicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Medicul responsabil 
    nume: { type: String, required: true },
    prenume: { type: String, required: true },
    cnp: { type: String, required: true, unique: true }, // [cite: 138]
    varsta: Number,
    adresa: String,
    telefon: String,
    profesie: String,
    locMunca: String,
    istoricMedical: String,
    alergii: String,
    consultatiiCardiologice: String,
    thresholds: { // Praguri pentru alarme [cite: 38, 151]
        pulsMax: { type: Number, default: 100 },
        pulsMin: { type: Number, default: 50 },
        tempMax: { type: Number, default: 37.5 }
    }
});

module.exports = mongoose.model('Patient', PatientSchema);