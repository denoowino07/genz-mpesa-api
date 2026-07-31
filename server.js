const express = require('express');
const path = require('path');
const app = express();

// Inatafuta Port ya seva ya Render au inatumia 3000 ukiwa local
const PORT = process.env.PORT || 3000;

// Muhimu: Inaruhusu seva kusoma na kupokea data za JSON kutoka kwenye fomu
app.use(express.json());

// Inaruhusu seva kusoma mafaili yote yaliyopo kwenye folda kuu (kama index.html)
app.use(express.static(path.join(__dirname)));

// Mtu akifungua tu tovuti yako, anapelekwa kwenye index.html mara moja
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Sehemu inayopokea na kuruhusu ombi la mtu anayejiunga (Sign Up / Join)
app.post('/api/auth', (req, res) => {
    const { email } = req.body;
    res.json({ message: `Umefanikiwa! Karibu GenzTrending.com.` });
});

// Kuanzisha seva rasmi
app.listen(PORT, () => {
    console.log(`GenzTrending seva ipo imara kwenye port ${PORT}`);
});
