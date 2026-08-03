const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Ruhusu seva isome data za JSON zinazotoka kwenye trading.html
app.use(express.json());

// Fanya mafaili yako ya HTML yaonekane kwenye kivinjari (Browser)
app.use(express.static(path.join(__dirname)));

// Njia kuu ya kufungua ukurasa wa trading
app.get('/trading', (req, res) => {
    res.sendFile(path.join(__dirname, 'trading.html'));
});

// API ya kupokea oda za Biashara (Buy / Sell) kutoka kwa wateja
app.post('/api/trade', (req, res) => {
    const { direction, amount, asset } = req.body;

    console.log(`Oda Mpya Imepokelewa: Mteja ametabiri ${direction} ya $${amount} kwenye soko la ${asset}`);

    // Hapa ndipo unapoweza kuweka mfumo wako wa kuhakiki salio la mteja (Linalotokana na M-Pesa)
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Kiasi kisichokubalika!" });
    }

    // Tengeneza namba ya kumbukumbu ya trade (Mock Trade Execution)
    const mockTradeId = "TXN" + Math.floor(Math.random() * 10000000);

    // Rudisha majibu kwa mteja kuwa oda yake imepokelewa kwa mafanikio
    res.json({
        success: true,
        message: "Oda imetekelezwa kikamilifu",
        tradeId: mockTradeId,
        details: { asset, direction, amount }
    });
});

// Washa seva
app.listen(PORT, () => {
    console.log(`Seva ya Biashara imewaka kwenye http://localhost:${PORT}`);
    console.log(`Fungua http://localhost:${PORT}/trading ili kuona chati halisi!`);
});
