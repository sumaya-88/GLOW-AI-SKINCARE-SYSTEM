const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../users_data.json');

let users = [];
const tempUsers = {};

// Load users on startup
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        users = JSON.parse(data);
        console.log(`Loaded ${users.length} users from storage.`);
    } else {
        // Create file if it doesn't exist
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
        console.log("Created new users storage file.");
    }
} catch (e) {
    console.error("Failed to load users from storage:", e);
}

// Helper to save users
const saveUsers = () => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        fs.appendFileSync(path.join(__dirname, '../debug.log'), `[${new Date().toISOString()}] Saved ${users.length} users to ${DATA_FILE}\n`);
    } catch (e) {
        console.error("Failed to save users to storage:", e);
        fs.appendFileSync(path.join(__dirname, '../debug.log'), `[${new Date().toISOString()}] ERROR saving users: ${e.message}\n`);
    }
};

module.exports = { users, tempUsers, saveUsers };
