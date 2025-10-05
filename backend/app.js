require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chambres', require('./routes/chambres'));
app.use('/api/reservations', require('./routes/reservations'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur le port ${PORT}`);
});
