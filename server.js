const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());
app.use(cors());

// LIVE DATA SIMULATION
let topTraders = [
    { id: 1, name: "Alex FX Master", winRate: "92%", profit: "+340%" },
    { id: 2, name: "Mama Mboga Trader", winRate: "88%", profit: "+180%" },
    { id: 3, name: "Genz Alpha Pips", winRate: "85%", profit: "+410%" }
];

// MAIN WEBSITE HOME PAGE (English Frontend HTML)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Genz Trending.com - Copy Trading Platform</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #111; color: #fff; text-align: center; margin: 0; padding: 20px; }
                .navbar { background: #222; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-bottom: 3px solid #46B525; display: flex; justify-content: space-between; align-items: center; }
                .nav-logo { font-size: 22px; font-weight: bold; color: #46B525; }
                .container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 10px; }
                .card { background: #222; padding: 25px; border-radius: 12px; width: 340px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border-top: 4px solid #46B525; text-align: left; }
                .balance { font-size: 28px; font-weight: bold; color: #46B525; margin: 10px 0; }
                input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; font-size: 16px; }
                .btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; color: white; margin-top: 5px; }
                .btn-deposit { background: #46B525; }
                .btn-withdraw { background: #e1b12c; }
                .btn-copy { background: #007bff; width: auto; padding: 8px 15px; font-size: 14px; }
                .trader-row { display: flex; justify-content: space-between; align-items: center; background: #333; padding: 12px; margin: 10px 0; border-radius: 8px; }
                .market-ticker { background: #1a1a1a; padding: 12px; font-weight: bold; color: #ffcc00; border-radius: 8px; margin-bottom: 20px; font-family: monospace; border-left: 5px solid #ffcc00; text-align: left; }
                .btn-reg { background: #ff5722; }
                .btn-toggle { background: transparent; border: 1px solid #46B525; color: #46B525; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; margin-top: 5px; width: 100%; }
                .limit-text { font-size: 11px; color: #aaa; margin-top: -5px; margin-bottom: 10px; display: block; }
                .auth-box { max-width: 400px; margin: 60px auto; background: #222; padding: 30px; border-radius: 12px; border-top: 5px solid #46B525; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            </style>
        </head>
        <body>
            <div class="navbar">
                <div class="nav-logo">Genz Trending.com 📈</div>
                <div id="userNavDisplay" style="display:none; font-size: 16px;">Trader: <span id="navName" style="color:#46B525; font-weight:bold;"></span></div>
            </div>

            <!-- 1. INITIAL AUTHENTICATION WALL (SIGN UP / LOGIN) -->
            <div id="authScreen" class="auth-box">
                <!-- SIGN UP VIEW -->
                <div id="signUpView">
                    <h3>Create Your Account (Join)</h3>
                    <p>Register now to start trading and copying master strategies:</p>
                    <input type="text" id="regName" placeholder="Full Name">
                    <input type="email" id="regEmail" placeholder="Email Address">
                    <input type="password" id="regPass" placeholder="Password">
                    <button class="btn btn-reg" onclick="sajiliMteja()">Sign Up & Start Trading</button>
                    <button class="btn-toggle" onclick="toggleAuth(false)">Already have an account? Login here</button>
                </div>

                <!-- LOGIN VIEW -->
                <div id="loginView" style="display:none;">
                    <h3>Welcome Back (Login)</h3>
                    <p>Enter your details to access your trading dashboard:</p>
                    <input type="email" id="loginEmail" placeholder="Email Address" value="trader@genztrending.com">
                    <input type="password" id="loginPass" placeholder="Password" value="123456">
                    <button class="btn" style="background:#46B525;" onclick="ingiaMteja()">Login / Sign In</button>
                    <button class="btn-toggle" onclick="toggleAuth(true)">Don't have an account? Sign Up / Join</button>
                </div>
            </div>

            <!-- 2. SECURE INNER DASHboard SYSTEM (HIDDEN UNTIL SIGN UP/LOGIN) -->
            <div id="innerDashboard" style="display: none;">
                <div class="market-ticker">
                    Live FX Market: EUR/USD: 1.0924 🟢 | GBP/USD: 1.2845 🔴 | XAU/USD (Gold): $2,385.40 🟢
                </div>

                <div class="container">
                    <!-- MPESA WALLET MANAGER -->
                    <div class="card">
                        <h3>Your Trading Wallet</h3>
                        <p>Available Balance:</p>
                        <div class="balance">KSh <span id="userBalance">5,500.00</span></div>
                        
                        <hr style="border-color: #444; margin: 15px 0;">
                        
                        <!-- DEPOSIT SYSTEM -->
                        <h4>Deposit Funds (M-PESA)</h4>
                        <span class="limit-text">Min: KSh 100 | Max: KSh 300,000</span>
                        <input type="number" id="depositAmount" placeholder="Amount (KES)" value="500">
                        <input type="text" id="phone" placeholder="M-Pesa Number (07...)">
                        <button class="btn btn-deposit" onclick="wekaHela()">Deposit via STK Push</button>
                        
                        <hr style="border-color: #444; margin: 15px 0;">

                        <!-- WITHDRAWAL SYSTEM -->
                        <h4>Withdraw Funds</h4>
                        <span class="limit-text">Minimum Withdrawal: KSh 500</span>
                        <input type="number" id="withdrawAmount" placeholder="Amount (KES)" value="500">
                        <button class="btn btn-withdraw" onclick="toaHela()">Withdraw to M-Pesa</button>
                    </div>

                    <!-- COPY TRADING SYSTEM -->
                    <div class="card" style="width: 420px;">
                        <h3>Professional Master Traders</h3>
                        <p>Replicate trades instantly into your account:</p>
                        <div id="tradersList"></div>
                    </div>
                </div>
            </div>

            <script>
                let currentBalance = 5500;
                const viongozi = ${JSON.stringify(topTraders)};
                let listHtml = "";
                
                viongozi.forEach(t => {
                    listHtml += \`
                        <div class="trader-row">
                            <div><strong>\${t.name}</strong><br><span style="color:#aaa;">WinRate: \${t.winRate}</span></div>
                            <div style="color:#46B525; font-weight:bold;">\${t.profit}</div>
                            <div><button class="btn btn-copy" onclick="copyTrader('\${t.name}')">Copy Trades</button></div>
                        </div>
                    \`;
                });
                document.getElementById('tradersList').innerHTML = listHtml;

                function toggleAuth(showSignUp) {
                    if(showSignUp) {
                        document.getElementById('signUpView').style.display = 'block';
                        document.getElementById('loginView').style.display = 'none';
                    } else {
                        document.getElementById('signUpView').style.display = 'none';
                        document.getElementById('loginView').style.display = 'block';
                    }
                }

                function openDashboard(username) {
                    // Mbinu ya kuficha fomu kabisa na kufungua ukurasa wa ndani wa trading
                    document.getElementById('authScreen').style.display = 'none';
                    document.getElementById('innerDashboard').style.display = 'block';
                    document.getElementById('userNavDisplay').style.display = 'block';
                    document.getElementById('navName').innerText = username;
                }

                function sajiliMteja() {
                    const name = document.getElementById('regName').value;
                    const email = document.getElementById('regEmail').value;
                    if(!name || !email) return alert('Please enter your name and email to join!');
                    
                    openDashboard(name);
                    alert('Registration Successful! Welcome ' + name + ' to Genz Trending.com. Your active trading account dashboard is now ready.');
                }

                function ingiaMteja() {
                    const email = document.getElementById('loginEmail').value;
                    if(!email) return alert('Please enter your email address!');
                    
                    openDashboard("Trader_Deno07");
                    alert('Login Successful! Welcome back to Genz Trending.com.');
                }

                function copyTrader(name) {
