const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Soma faili lako la kwanza la HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'trading.html'));
});

// Njia rahisi ya kupima kama seva ipo hai
app.get('/health', (req, res) => {
    res.json({ status: "alive" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Genz Server successfully running on Port ${PORT}`);
});
