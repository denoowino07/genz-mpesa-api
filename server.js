const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Njia ya ukurasa mkuu
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Njia ya ukurasa wa ndani wa trading
app.get('/trading.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'trading.html'));
});

app.post('/api/trade', (req, res) => {
    const { amount } = req.body;
    const isWin = Math.random() > 0.48;
    let profitLoss = isWin ? (amount * 0.95) : -amount;
    res.json({ result: isWin ? "WIN" : "LOSS", pnl: profitLoss });
});

app.listen(PORT, () => console.log(`Server is Live on port ${PORT}`));
