const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const orderRoutes = require('./routes/orderRoutes');
const fabricRoutes = require('./routes/fabricRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logger

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/fabrics', fabricRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Fit & Flare Studio API is running...' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

module.exports = app;
