const express = require('express');
const path = require('path');
const app = express();

// Inasoma PORT ya Render au inatumia 3000 ukiwa local
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Kanzidata ya muda ya ndani ya seva (Local In-Memory Database)
const localUsersDB = {};

// 1. MIELEKEO YA KURASA (ROUTING)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/join.html', (req, res) => res.sendFile(path.join(__dirname, 'join.html')));
app.get('/trading.html', (req, res) => res.sendFile(path.join(__dirname, 'trading.html')));

// 2. MFUMO WA USAJILI NA KUINGIA (SIGN UP & LOGIN)
app.post('/api/auth', (req, res) => {
    const { email, password, action } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in all fields!" });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (action === 'signup') {
        if (localUsersDB[cleanEmail]) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        
        // Msajili mteja mpya: Real Account inaanzia $0.00 na Demo ina $10,000.00
        localUsersDB[cleanEmail] = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            email: cleanEmail,
            password: password,
            demoBalance: 10000.00,
            realBalance: 0.00 
        };
        return res.json({ message: "Registration successful!", userId: localUsersDB[cleanEmail].id });
    } else {
        // Mfumo wa kuingia (Login)
        let foundUser = Object.values(localUsersDB).find(u => u.email === cleanEmail && u.password === password);
        if (!foundUser) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }
        return res.json({ message: "Welcome back!", userId: foundUser.id });
    }
});

// 3. KUVUTA DATA ZA SALIO LA MTEJA
app.get('/api/user/:id', (req, res) => {
    const foundUser = Object.values(localUsersDB).find(u => u.id === req.params.id);
    if (!foundUser) {
        // Ikitokea seva imereset, inampa salio hili la haraka ili asikwame
        return res.json({ demoBalance: 10000.00, realBalance: 0.00 });
    }
    res.json({ demoBalance: foundUser.demoBalance, realBalance: foundUser.realBalance });
});

// 4. INJINI YA BIASHARA (WIN/LOSS TRADING LOGIC)
app.post('/api/trade', (req, res) => {
    const { userId, accountType, amount } = req.body;
    
    let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
    if (!foundUser) {
        return res.status(400).json({ error: "Session expired, please log in again." });
    }

    let currentBalance = accountType === 'real' ? foundUser.realBalance : foundUser.demoBalance;
    if (amount > currentBalance) {
        return res.status(400).json({ error: "Insufficient balance to place this trade!" });
    }

    // Algorithm ya ushindi: 50% nafasi ya kushinda au kushindwa kulingana na soko
    const isWin = Math.random() > 0.48; 
    let profitLoss = isWin ? (amount * 0.95) : -amount;
    currentBalance += profitLoss;

    // Hifadhi salio jipya kwenye database ya seva
    if (accountType === 'real') {
        foundUser.realBalance = currentBalance;
    } else {
        foundUser.demoBalance = currentBalance;
    }

    res.json({ 
        result: isWin ? "WIN" : "LOSS", 
        pnl: profitLoss, 
        newBalance: currentBalance 
    });
});

// 5. MFUMO WA KUWEKA PESA (MPESA DEPOSIT SIMULATION)
app.post('/api/deposit', (req, res) => {
    const { userId, phone, amountUSD } = req.body;
    const amountKES = Math.round(amountUSD * 135); // Shilingi dhidi ya Dola

    // Simulizi: Ongeza salio kwenye akaunti ya kweli (Real Account) baada ya sekunde 5
    setTimeout(() => {
        let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
        if (foundUser) {
            foundUser.realBalance += parseFloat(amountUSD);
        }
    }, 5000);

    res.json({ message: `STK Push of KES ${amountKES} sent to ${phone}. Enter your PIN to deposit $${amountUSD}.` });
});

// 6. MFUMO WA KUTOA PESA (MPESA WITHDRAWAL)
app.post('/api/withdraw', (req, res) => {
    const { userId, phone, amountUSD } = req.body;
    let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
    
    if (!foundUser) {
        return res.status(400).json({ error: "User profile not found." });
    }

    if (foundUser.realBalance < parseFloat(amountUSD)) {
        return res.status(400).json({ error: "Insufficient Real balance to process withdrawal!" });
    }

    // Kata kiasi cha fedha kwenye salio la Real account
    foundUser.realBalance -= parseFloat(amountUSD);
    res.json({ message: `Withdrawal request of $${amountUSD} accepted! KES will be sent to ${phone} via M-Pesa shortly.` });
});

// KUWASHA SEVA RASMI
app.listen(PORT, () => {
    console.log(`GenzTrending Active Engine Running Smoothly on Port ${PORT}`);
});
