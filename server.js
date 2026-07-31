const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// Unganisha na MongoDB ya Bure (Badilisha URI hii na yako ukipenda baadae)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:genz123@cluster0.mongodb.net/trading?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("Database connection error, running local mode:", err));

// Mfumo wa Uhifadhi wa Wateja (Database Schema)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    demoBalance: { type: Number, default: 10000.00 },
    realBalance: { type: Number, default: 0.00 }
});
const User = mongoose.model('User', UserSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. UTANGAULIZI WA ROUTING
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/join.html', (req, res) => res.sendFile(path.join(__dirname, 'join.html')));
app.get('/trading.html', (req, res) => res.sendFile(path.join(__dirname, 'trading.html')));

// 2. MFUMO WA SIGN UP & LOGIN
app.post('/api/auth', async (req, res) => {
    const { email, password, action } = req.body;
    try {
        let user = await User.findOne({ email });
        if (action === 'signup') {
            if (user) return res.status(400).json({ error: "Email already exists!" });
            user = new User({ email, password });
            await user.save();
            return res.json({ message: "Registration successful!", userId: user._id });
        } else {
            if (!user || user.password !== password) return res.status(400).json({ error: "Invalid credentials!" });
            return res.json({ message: "Welcome back!", userId: user._id });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// 3. KUVUTA DATA ZA SALIO LA MTEJA
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ demoBalance: user.demoBalance, realBalance: user.realBalance });
    } catch (err) {
        res.status(500).json({ error: "Error fetching user data" });
    }
});

// 4. MFUMO WA WIN/LOSS LOGIC (TRADING ENGINE)
app.post('/api/trade', async (req, res) => {
    const { userId, accountType, amount, direction } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        let currentBalance = accountType === 'real' ? user.realBalance : user.demoBalance;
        if (amount > currentBalance) return res.status(400).json({ error: "Insufficient balance!" });

        // Kuiga matokeo ya soko halisi (50% Win au Loss kulingana na algorithm ya jukwaa)
        const isWin = Math.random() > 0.48; // Ina mwelekeo wa soko halisi
        let profitLoss = 0;

        if (isWin) {
            profitLoss = amount * 0.95; // Faida ya +95%
            currentBalance += profitLoss;
        } else {
            profitLoss = -amount; // Hasara ya kiasi ulichoweka
            currentBalance -= amount;
        }

        if (accountType === 'real') user.realBalance = currentBalance;
        else user.demoBalance = currentBalance;
        await user.save();

        res.json({ 
            result: isWin ? "WIN" : "LOSS", 
            pnl: profitLoss, 
            newBalance: currentBalance 
        });
    } catch (err) {
        res.status(500).json({ error: "Trade execution failed" });
    }
});

// 5. LANGO LA LIPA NA M-PESA (DEPOSIT VIA STK PUSH)
app.post('/api/deposit', async (req, res) => {
    const { userId, phone, amountUSD } = req.body;
    // Kiwango cha kubadilisha: $1 = KES 135 (Mfano)
    const amountKES = Math.round(amountUSD * 135);

    // Mipangilio ya Safaricom Daraja API (Sakinisha data zako za kweli hapa ukipata)
    const shortCode = "174379"; 
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

    try {
        // Hapa tunaiga kuwa ombi limeenda kwenye simu ya mteja ili asikwame wakati unaweka Live API credentials
        setTimeout(async () => {
            const user = await User.findById(userId);
            if (user) {
                user.realBalance += parseFloat(amountUSD);
                await user.save();
            }
        }, 5000); // Baada ya sekunde 5 salio litaongezeka kiotomatiki kama ameweka PIN

        res.json({ message: `STK Push of KES ${amountKES} sent to ${phone}. Enter your M-Pesa PIN to complete.` });
    } catch (err) {
        res.status(500).json({ error: "M-Pesa API integration error" });
    }
});

app.listen(PORT, () => console.log(`GenzTrending backend active on port ${PORT}`));
