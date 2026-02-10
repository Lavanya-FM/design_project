import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useToast } from './Toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { showToast } = useToast();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        // Connect to the orchestrator
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && user?.role) {
            // Join the role-specific room
            socket.emit('join_role', user.role);

            // Universal listener for notifications
            socket.on('notification', (notif) => {
                const payload = JSON.parse(notif.payload_json);
                showToast(`🔔 ${notif.type.replace('_', ' ')}: ${payload.message || 'Check your dashboard for details.'}`, "info");
            });

            // Special Admin real-time updates for the Cockpit
            if (user.role === 'ADMIN') {
                socket.on('admin_update', (data) => {
                    showToast(`🚨 System Alert: New ${data.type} recorded.`, "warning");
                });
            }
        }
    }, [socket, user, showToast]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
