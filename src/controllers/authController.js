const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Verificăm dacă utilizatorul există
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Utilizatorul există deja.' });

        // Hash parolă (Sursa [134, 181])
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({ email, password: passwordHash, role });
        await user.save();

        res.status(201).json({ msg: 'Cont creat cu succes.' });
    } catch (err) {
        res.status(500).send('Eroare server.');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Date invalide.' });

        // Verificare parolă 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Date invalide.' });

        // Generare JWT (Sursa [147, 181])
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role, userId: user._id });
    } catch (err) {
        res.status(500).send('Eroare server.');
    }
};