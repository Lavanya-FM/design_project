const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const orderRoutes = require('./routes/orderRoutes');
const fabricRoutes = require('./routes/fabricRoutes');
const customizationRoutes = require('./routes/customizationRoutes');
const fulfillmentRoutes = require('./routes/fulfillmentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Security Middleware (MOCKED/DISABLED for Demo to avoid missing module errors)
// const helmet = require('helmet');
// app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(morgan('dev'));

// Serve Static Files
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/blouses', designRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/fabrics', fabricRoutes);
app.use('/api/customize', customizationRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Fit & Flare Studio API is running...' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

module.exports = app;
