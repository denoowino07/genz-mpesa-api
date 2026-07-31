const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
// Inalazimisha seva kusoma mafaili yote ya static kwenye folda kuu
app.use(express.static(__dirname));

// LALIZIMISHA NJIA ZA UKURASA KUSOMWA KUTOKA GITHUB BILA MAKOSA
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/join.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'join.html'));
});

app.get('/trading.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'trading.html'));
});

// Kanzidata ya muda ya ndani ya seva (Local In-Memory Database)
const localUsersDB = {};

// 2. MFUMO WA SIGN UP & LOGIN
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
        localUsersDB[cleanEmail] = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            email: cleanEmail,
            password: password,
            demoBalance: 10000.00,
            realBalance: 0.00 
        };
        return res.json({ message: "Success!", userId: localUsersDB[cleanEmail].id });
    } else {
        let foundUser = Object.values(localUsersDB).find(u => u.email === cleanEmail && u.password === password);
        if (!foundUser) return res.status(400).json({ error: "Invalid credentials!" });
        return res.json({ message: "Welcome!", userId: foundUser.id });
    }
});

// 3. KUVUTA DATA ZA SALIO LA MTEJA
app.get('/api/user/:id', (req, res) => {
    const foundUser = Object.values(localUsersDB).find(u => u.id === req.params.id);
    if (!foundUser) {
        return res.json({ demoBalance: 10000.00, realBalance: 0.00 });
    }
    res.json({ demoBalance: foundUser.demoBalance, realBalance: foundUser.realBalance });
});

// 4. INJINI YA BIASHARA (WIN/LOSS TRADING LOGIC)
app.post('/api/trade', (req, res) => {
    const { userId, accountType, amount } = req.body;
    let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
    if (!foundUser) {
        // Ikitokea session imepotea, inajaza temporary user ili isikwame skrini
        foundUser = { demoBalance: 10000.00, realBalance: 0.00 };
    }

    let currentBalance = accountType === 'real' ? foundUser.realBalance : foundUser.demoBalance;
    if (amount > currentBalance) return res.status(400).json({ error: "Insufficient balance!" });

    const isWin = Math.random() > 0.48; 
    let profitLoss = isWin ? (amount * 0.95) : -amount;
    currentBalance += profitLoss;

    if (accountType === 'real') foundUser.realBalance = currentBalance;
    else foundUser.demoBalance = currentBalance;

    res.json({ result: isWin ? "WIN" : "LOSS", pnl: profitLoss, newBalance: currentBalance });
});

// 5. MFUMO WA KUWEKA PESA (MPESA DEPOSIT)
app.post('/api/deposit', (req, res) => {
    const { userId, phone, amountUSD } = req.body;
    let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
    
    // Backup: Kama user hayupo kwenye local db kwa sasa, mtengeneze papo hapo
    if (!foundUser && userId) {
        localUsersDB[userId] = { id: userId, demoBalance: 10000.00, realBalance: 0.00 };
        foundUser = localUsersDB[userId];
    }

    setTimeout(() => {
        if (foundUser) foundUser.realBalance += parseFloat(amountUSD);
    }, 3000);

    res.json({ message: `STK Push successfully sent to ${phone}. Balance will update in 3 seconds once approved.` });
});

// 6. MFUMO WA KUTOA PESA (MPESA WITHDRAWAL)
app.post('/api/withdraw', (req, res) => {
    const { userId, phone, amountUSD } = req.body;
    let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
    
    if (!foundUser) {
        return res.status(400).json({ error: "Session profile missing, please refresh page." });
    }
    if (foundUser.realBalance < parseFloat(amountUSD)) {
        return res.status(400).json({ error: "Insufficient Real balance to withdraw!" });
    }

    foundUser.realBalance -= parseFloat(amountUSD);
    res.json({ message: `Withdrawal request of $${amountUSD} processed. KES will be sent to ${phone} via M-Pesa.` });
});

app.listen(PORT, () => console.log(`GenzTrending System Running Context Over Port ${PORT}`));
