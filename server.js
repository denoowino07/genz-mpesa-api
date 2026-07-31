const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Custom headers to bind your genztrending domain properly during network checks
app.use((req, res, next) => {
    res.setHeader('X-Platform-Domain', 'genztrending.com');
    next();
});

// Primary landing routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicit routes for secondary documents
app.get('/join.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'join.html'));
});

app.get('/trading.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'trading.html'));
});

// Simulated backend processing point for the dynamic dashboard auth
app.post('/api/auth', (req, res) => {
    res.json({ 
        status: "success",
        origin: "genztrending.com",
        message: "Successfully synchronized domain environment parameters." 
    });
});

app.listen(PORT, () => {
    console.log(`System active. Core server initialized over port context: ${PORT}`);
});
