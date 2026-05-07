const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Measurement = require('../models/Measurement');
const Alarm = require('../models/Alarm');

// 1. VIZUALIZARE FIȘĂ PROPRIE
// Pacientul vede ce a completat medicul despre el și pragurile setate
router.get('/my-profile', auth, async (req, res) => {
    try {
        // Căutăm în Patient folosind userId-ul din token
        const patientData = await Patient.findOne({ userId: req.user.id });
        if (!patientData) return res.status(404).json({ msg: "Fișa medicală nu a fost găsită. Contactați medicul." });
        res.json(patientData);
    } catch (err) {
        res.status(500).send("Eroare server la preluarea profilului");
    }
});

// 2. GRAFICE VALORI SENZORI (DATE LIVE 10s)
// Pacientul își vede propriile măsurători
router.get('/my-stats', auth, async (req, res) => {
    try {
        const stats = await Measurement.find({ patientId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(50); // 50 de puncte sunt suficiente pentru un grafic lizibil (aprox. 8 min de date)
        res.json(stats);
    } catch (err) {
        res.status(500).send("Eroare server la preluarea statisticilor");
    }
});

// 3. ISTORIC ALARME PERSONALE
// Pacientul vede când sistemul a detectat anomalii
router.get('/my-alerts', auth, async (req, res) => {
    try {
        const alerts = await Alarm.find({ patientId: req.user.id }).sort({ timestamp: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).send("Eroare server la preluarea alertelor");
    }
});

module.exports = router;