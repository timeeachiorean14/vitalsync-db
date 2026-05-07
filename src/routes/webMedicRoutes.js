const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Measurement = require('../models/Measurement');
const Alarm = require('../models/Alarm');

// 1. ADĂUGARE PACIENT (Doar pentru Medici)
router.post('/patients/add', auth, async (req, res) => {
    if (req.user.role !== 'Medic') return res.status(403).json({ msg: 'Acces interzis.' });

    try {
        const newPatient = new Patient({
            ...req.body,
            medicId: req.user.id 
        });

        const patient = await newPatient.save();
        res.json(patient);
    } catch (err) {
        res.status(500).send('Eroare la salvarea pacientului.');
    }
});

// 2. LISTA PACIENȚILOR (Asociați medicului logat)
router.get('/patients/list', auth, async (req, res) => {
    try {
        const patients = await Patient.find({ medicId: req.user.id });
        res.json(patients);
    } catch (err) {
        res.status(500).send('Eroare server.');
    }
});

// 3. DETALII PACIENT SPECIFIC
router.get('/patients/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ msg: "Pacient negăsit" });
        res.json(patient);
    } catch (err) {
        res.status(500).send('Eroare server.');
    }
});

// 4. DATE SENZORI PENTRU GRAFIC (Ultimele măsurători - Frecvență 10s)
router.get('/patients/:id/measurements', auth, async (req, res) => {
    try {
        // Luăm ultimele 50 de înregistrări pentru a desena graficul
        const measurements = await Measurement.find({ patientId: req.params.id })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(measurements);
    } catch (err) {
        res.status(500).send('Eroare la preluarea măsurătorilor.');
    }
});

// 5. LISTA ALARME PACIENT
router.get('/patients/:id/alarms', auth, async (req, res) => {
    try {
        const alarms = await Alarm.find({ patientId: req.params.id }).sort({ timestamp: -1 });
        res.json(alarms);
    } catch (err) {
        res.status(500).send('Eroare la preluarea alarmelor.');
    }
});

module.exports = router;