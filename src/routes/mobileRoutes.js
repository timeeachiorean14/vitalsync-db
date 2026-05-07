const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Measurement = require('../models/Measurement');
const Patient = require('../models/Patient');
const Alarm = require('../models/Alarm');

// 1. POST /api/mobile/sync-measurements (Sincronizare la 10s)
router.post('/sync-measurements', auth, async (req, res) => {
    try {
        const { puls, ecg, temperatura, umiditate, accelBurst } = req.body;

        // Salvare măsurătoare
        const measurement = new Measurement({
            patientId: req.user.id,
            puls, ecg, temperatura, umiditate, accelBurst,
            timestamp: new Date()
        });
        await measurement.save();

        // LOGICA DE ALARMĂ: Verificăm pragurile din fișa pacientului
        const patient = await Patient.findOne({ userId: req.user.id });
        if (patient && patient.thresholds) {
            let alarmTriggered = false;
            let tipAlarma = "";

            if (puls > patient.thresholds.pulsMax) {
                alarmTriggered = true;
                tipAlarma = "Puls Ridicat";
            } else if (temperatura > patient.thresholds.tempMax) {
                alarmTriggered = true;
                tipAlarma = "Febră";
            }

            if (alarmTriggered) {
                const newAlarm = new Alarm({
                    patientId: req.user.id,
                    tip: tipAlarma,
                    valoare: puls > patient.thresholds.pulsMax ? puls : temperatura,
                    timestamp: new Date()
                });
                await newAlarm.save();
                console.log(`⚠️ ALERTĂ GENERATĂ: ${tipAlarma} pentru ${patient.nume}`);
            }
        }

        res.status(201).json({ msg: "Date procesate la 10s" });
    } catch (err) {
        console.error("Eroare colectare 10s:", err);
        res.status(500).json({ error: "Eroare server" });
    }
});

// 2. POST /api/mobile/offline-sync (Pentru pachete de date)
router.post('/offline-sync', auth, async (req, res) => {
    try {
        const { dataBatch } = req.body; 
        if (!Array.isArray(dataBatch)) return res.status(400).json({ msg: "Format invalid" });

        const formattedData = dataBatch.map(item => ({
            ...item,
            patientId: req.user.id
        }));

        await Measurement.insertMany(formattedData);
        res.status(200).json({ msg: `Batch sincronizat: ${dataBatch.length} poziții` });
    } catch (err) {
        res.status(500).json({ error: "Eroare sincronizare batch" });
    }
});

module.exports = router;