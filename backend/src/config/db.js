const sqliteDb = require('../models/db');

// --- UNIFIED DATABASE WRAPPER (POSTGRES -> SQLITE BRIDGE) ---

module.exports = {
    query: async (text, params = []) => {
        // Convert $1, $2, etc. to ?, ?, etc. for SQLite compatibility
        const sql = text.replace(/\$\d+/g, '?');
        
        return new Promise((resolve, reject) => {
            const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
            
            if (isSelect) {
                sqliteDb.all(sql, params, (err, rows) => {
                    if (err) {
                        console.error('SQLite Execution Error:', err.message);
                        reject(err);
                    } else {
                        resolve({ rows });
                    }
                });
            } else {
                sqliteDb.run(sql, params, function(err) {
                    if (err) {
                        console.error('SQLite Execution Error:', err.message);
                        reject(err);
                    } else {
                        resolve({ 
                            rows: [], 
                            rowCount: this.changes, 
                            insertId: this.lastID 
                        });
                    }
                });
            }
        });
    },
    isConnected: () => true
};
