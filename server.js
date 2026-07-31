const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mfumo wa Kumbukumbu ya Ndani (In-Memory Database) badala ya MongoDB
// Inahifadhi wateja na salio lao kwa muda kwenye seva
const localUsersDB = {};

// 1. UTANGULIZI WA ROUTING
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/join.html', (req, res) => res.sendFile(path.join(__dirname, 'join.html')));
app.get('/trading.html', (req, res) => res.sendFile(path.join(__dirname, 'trading.html')));

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
        // Msajili mteja mpya na salio la mwanzo
        localUsersDB[cleanEmail] = {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            email: cleanEmail,
            password: password,
            demoBalance: 10000.00,
            realBalance: 0.00
        };
        return res.json({ message: "Registration successful!", userId: localUsersDB[cleanEmail].id });
    } else {
        // Log in logic
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
        // Ikitokea seva imereset, itengeneze akaunti ya haraka ili mteja asikwame screen nyeupe
        return res.json({ demoBalance: 10000.00, realBalance: 0.00 });
    }
    res.json({ demoBalance: foundUser.demoBalance, realBalance: foundUser.realBalance });
});

// 4. MFUMO WA WIN/LOSS LOGIC (TRADING ENGINE)
app.post('/api/trade', (req, res) => {
    const { userId, accountType, amount, direction } = req.body;
    
    let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
    
    // Ikitokea mtumiaji hayupo (mfano server imereset), tengeneza temporary session
    if (!foundUser) {
        foundUser = { demoBalance: 10000.00, realBalance: 0.00 };
    }

    let currentBalance = accountType === 'real' ? foundUser.realBalance : foundUser.demoBalance;
    if (amount > currentBalance) {
        return res.status(400).json({ error: "Insufficient balance!" });
    }

    // Algorithm ya Ushindi na Hasara (50% Win / 50% Loss)
    const isWin = Math.random() > 0.48; 
    let profitLoss = 0;

    if (isWin) {
        profitLoss = amount * 0.95; // Faida ya +95%
        currentBalance += profitLoss;
    } else {
        profitLoss = -amount; // Hasara ya kiasi kilichowekezwa
        currentBalance -= amount;
    }

    if (accountType === 'real') foundUser.realBalance = currentBalance;
    else foundUser.demoBalance = currentBalance;

    res.json({ 
        result: isWin ? "WIN" : "LOSS", 
        pnl: profitLoss, 
        newBalance: currentBalance 
    });
});

// 5. LANGO LA LIPA NA M-PESA (DEPOSIT VIA STK PUSH)
app.post('/api/deposit', (req, res) => {
    const { userId, phone, amountUSD } = req.body;
    const amountKES = Math.round(amountUSD * 135);

    // Kuiga uwekaji wa pesa (Simulation) ili mteja akijaribu iongezeke sekunde 5 baadae
    setTimeout(() => {
        let foundUser = Object.values(localUsersDB).find(u => u.id === userId);
        if (foundUser) {
            foundUser.realBalance += parseFloat(amountUSD);
        }
    }, 5000); 

    res.json({ message: `STK Push request of KES ${amountKES} successfully sent to ${phone}. Enter your M-Pesa PIN to approve.` });
});

app.listen(PORT, () => console.log(`GenzTrending local engine active on port ${PORT}`));
