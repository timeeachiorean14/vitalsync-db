const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acces refuzat. Lipsă token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Salvăm datele utilizatorului (id, role) în request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token invalid.' });
    }
};