const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// UKURASA MKUU WA TOVUTI YAKO
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'trading.html'));
});

// TOKENI YAKO YA SIRI YA DERIV INAFICHWA HAPA SEVA YA NYUMA
const DERIV_SECRET_TOKEN = "188dd1a91d72c1400dae14838aaa84f0afa10008f3a813b9b1f7bfa1dc1f1e69";

// Unganisha Seva yako na Deriv Seva Kuu ya Dunia
const derivSocket = new WebSocket('wss://://derivws.com');

derivSocket.on('open', () => {
    console.log("Seva yako imeunganishwa na Deriv Kuu!");
    // Thibitisha usalama wa tokeni yako ya siri
    derivSocket.send(JSON.stringify({ authorize: DERIV_SECRET_TOKEN }));
});

derivSocket.on('message', (data) => {
    const response = JSON.parse(data);
    
    // Akaunti ikikubaliwa, seva inaomba soko la Volatility 10 moja kwa moja
    if (response.msg_type === 'authorize' && !response.error) {
        derivSocket.send(JSON.stringify({ ticks: "1HZ10V" }));
    }
    
    // Seva inapokea bei kila sekunde na kuwarushia wateja wako wote waliopo kwenye App
    if (response.msg_type === 'tick' && response.tick) {
        const liveMarketData = JSON.stringify({
            price: response.tick.quote,
            epoch: response.tick.epoch
        });
        
        // Sambaza bei kwa wateja wote waliopo mtandaoni kwenye Genz Trading
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(liveMarketData);
            }
        });
    }
});

// M-PESA STK PUSH BACKEND APIS (Kupokea pesa za amana)
app.post('/api/mpesa/deposit', (req, res) => {
    const { phone, amount } = req.body;
    console.log(`Ombi la M-Pesa limepokelewa: Ksh ${amount} kwenda namba ${phone}`);
    // Hapa utaweka msimbo wa Safaricom Daraja API wa kusukuma PIN ya mteja
    res.json({ success: true, message: "STK Push sent successfully" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Jukwaa la Genz Trading linakimbia kwenye Port ${PORT}`);
});
