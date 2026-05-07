require('dotenv').config(); // Aceasta trebuie să fie PRIMA linie
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pentru a parsa JSON-ul primit de la Mobil/Web [cite: 114]

// Rute de test
app.get('/', (req, res) => res.send('API VitalSync Online'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/web', require('./routes/webMedicRoutes'));
app.use('/api/mobile', require('./routes/mobileRoutes'));
app.use('/api/web/pacient', require('./routes/webPacientRoutes'));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Nu s-a putut porni serverul din cauza DB:', err.message || err);
    process.exit(1);
  });