import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { SocketProvider } from './components/SocketContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToastProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </ToastProvider>
    </React.StrictMode>
)
