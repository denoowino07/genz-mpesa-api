const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Mfumo wa kusoma data kutoka kwenye fomu za HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruhusu seva kusoma mafaili ya static (kama yapo)
app.use(express.static(path.join(__dirname, 'public')));

// Njia kuu inayofungua ukurasa wako mzuri ulio hai sasa hivi
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MFUMO MPYA: Huu ndio unaopokea usajili mtumiaji akibonyeza "Register / Join Now"
app.post('/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Kwa sasa, mfumo unamruhusu kuingia moja kwa moja kwa usalama
    res.json({ success: true, message: "Registration successful", user: { name, email } });
});

// MFUMO MPYA: Huu ndio unaopokea login mtumiaji akibonyeza "Access Account"
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    res.json({ success: true, message: "Login successful" });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
