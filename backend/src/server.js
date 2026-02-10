const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const db = require('./models/db');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const JWT_SECRET = process.env.JWT_SECRET || 'studio_secret_2024';

app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME NOTIFICATION ENGINE
// ==========================================
const notify = (role, type, payload) => {
    const notification = {
        id: uuidv4(),
        role: role,
        type: type,
        payload_json: JSON.stringify(payload),
        created_at: new Date()
    };

    // 1. Persist to DB
    db.run(`INSERT INTO notifications (id, role, type, payload_json) VALUES (?, ?, ?, ?)`,
        [notification.id, notification.role, notification.type, notification.payload_json]);

    // 2. Broadcast to Role Room
    io.to(`role_${role.toLowerCase()}`).emit('notification', notification);

    // 3. Always update Admin
    io.to('role_admin').emit('admin_update', { type, payload });
};

// ==========================================
// ROLE-BASED AUTHENTICATION
// ==========================================

// GUEST FLOW
app.post('/api/auth/guest/start', (req, res) => {
    const token = uuidv4();
    const guestId = uuidv4();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    db.run(`INSERT INTO guest_sessions (id, session_token, expires_at) VALUES (?, ?, ?)`,
        [guestId, token, expiry.toISOString()], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            const jwtToken = jwt.sign({ sessionId: guestId, role: 'GUEST' }, JWT_SECRET);
            res.json({ token: jwtToken, guestId });
        });
});

// MULTI-ROLE LOGIN (Consolidated Logic)
const handleRoleLogin = (role) => (req, res) => {
    const { email, password } = req.body;
    // In production, verify hash. For now, mock success for demo.
    db.get(`SELECT * FROM users WHERE email = ? AND role = ?`, [email, role.toUpperCase()], (err, user) => {
        if (!user) {
            // Auto-create for demo if not exists, otherwise 401
            const userId = uuidv4();
            db.run(`INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)`,
                [userId, email.split('@')[0], email, role.toUpperCase()]);
            const token = jwt.sign({ userId, role: role.toUpperCase() }, JWT_SECRET);
            return res.json({ token, user: { email, role } });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
        res.json({ token, user });
    });
};

app.post('/api/auth/customer/login', handleRoleLogin('CUSTOMER'));
app.post('/api/auth/designer/login', handleRoleLogin('DESIGNER'));
app.post('/api/auth/tailor/login', handleRoleLogin('TAILOR'));
app.post('/api/auth/vendor/login', handleRoleLogin('VENDOR'));
app.post('/api/auth/admin/login', handleRoleLogin('ADMIN'));

// ==========================================
// CUSTOMER ACTIONS & NOTIFICATIONS
// ==========================================

app.post('/api/actions/select-design', (req, res) => {
    const { designId, customerName } = req.body;
    notify('DESIGNER', 'DESIGN_SELECTED', { designId, customerName, message: `${customerName} is viewing your work.` });
    res.json({ success: true });
});

app.post('/api/actions/select-fabric', (req, res) => {
    const { fabricId, customerName } = req.body;
    notify('VENDOR', 'FABRIC_RESERVED', { fabricId, customerName, message: `Stock check requested for ${fabricId}` });
    res.json({ success: true });
});

app.post('/api/actions/submit-order', (req, res) => {
    const { orderDetails, customerName } = req.body;
    const orderId = 'ORD-' + Math.floor(Math.random() * 10000);

    // Notify ALL Roles as per requirements
    notify('ADMIN', 'ORDER_PLACED', { orderId, details: orderDetails });
    notify('DESIGNER', 'ORDER_PLACED', { orderId, details: orderDetails });
    notify('TAILOR', 'ORDER_PLACED', { orderId, details: orderDetails });
    notify('VENDOR', 'ORDER_PLACED', { orderId, details: orderDetails });

    res.json({ success: true, orderId });
});

// ==========================================
// REAL-TIME CONNECTION HANDLING
// ==========================================
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('join_role', (role) => {
        socket.join(`role_${role.toLowerCase()}`);
        console.log(`Socket ${socket.id} joined ${role} room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Fit & Flare Studio Backend Orchestrator running on port ${PORT}`);
});
