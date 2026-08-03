const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Hapa tunalazimisha seva isome lile faili lako la kwanza kabisa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'trading.html'));
});

// Tokeni ya siri ya Deriv
const DERIV_SECRET_TOKEN = "188dd1a91d72c1400dae14838aaa84f0afa10008f3a813b9b1f7bfa1dc1f1e69";
const derivSocket = new WebSocket('wss://://derivws.com');

derivSocket.on('open', () => {
    console.log("Connected to Deriv Core Seva!");
    derivSocket.send(JSON.stringify({ authorize: DERIV_SECRET_TOKEN }));
});

derivSocket.on('message', (data) => {
    const response = JSON.parse(data);
    
    if (response.msg_type === 'authorize' && !response.error) {
        derivSocket.send(JSON.stringify({ ticks: "1HZ10V" }));
    }
    
    if (response.msg_type === 'tick' && response.tick) {
        const liveMarketData = JSON.stringify({
            price: response.tick.quote,
            epoch: response.tick.epoch
        });
        
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(liveMarketData);
            }
        });
    }
});

app.post('/api/mpesa/deposit', (req, res) => {
    const { phone, amount } = req.body;
    res.json({ success: true, message: "STK Push sent successfully" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Genz Server running on Port ${PORT}`);
});
