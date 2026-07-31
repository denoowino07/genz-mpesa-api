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
            <title>Genz Trending.com - Copy Trading & Learning</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #111; color: #fff; text-align: center; margin: 0; padding: 20px; }
                .navbar { background: #222; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-bottom: 3px solid #46B525; display: flex; justify-content: space-between; align-items: center; }
                .nav-logo { font-size: 22px; font-weight: bold; color: #46B525; }
                .container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 10px; }
                .card { background: #222; padding: 25px; border-radius: 12px; width: 320px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border-top: 4px solid #46B525; text-align: left; }
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
                .demo-badge { background: #ffcc00; color: #000; padding: 3px 8px; font-size: 12px; font-weight: bold; border-radius: 5px; }
                .limit-text { font-size: 11px; color: #aaa; margin-top: -5px; margin-bottom: 10px; display: block; }
            </style>
        </head>
        <body>
            <div class="navbar">
                <div class="nav-logo">Genz Trending.com 📈</div>
            </div>

            <div class="market-ticker">
                Live FX Market: EUR/USD: 1.0924 🟢 | GBP/USD: 1.2845 🔴 | XAU/USD (Gold): $2,385.40 🟢
            </div>

            <div class="container">
                <!-- AUTHENTICATION CARD (SIGN UP & LOGIN) -->
                <div class="card" id="authCard">
                    <!-- SIGN UP VIEW -->
                    <div id="signUpView">
                        <h3>Create Your Account</h3>
                        <p>Join now to start learning and copying pro master traders for free:</p>
                        <input type="text" id="regName" placeholder="Full Name">
                        <input type="email" id="regEmail" placeholder="Email Address">
                        <input type="password" id="regPass" placeholder="Password">
                        <button class="btn btn-reg" onclick="sajiliMteja()">Sign Up Now</button>
                        <button class="btn-toggle" onclick="toggleAuth(false)">Already have an account? Login / Join</button>
                    </div>

                    <!-- LOGIN VIEW -->
                    <div id="loginView" style="display:none;">
                        <h3>Welcome Back</h3>
                        <p>Login to your account to resume copy trading:</p>
                        <input type="email" id="loginEmail" placeholder="Email Address" value="trader@genz.com">
                        <input type="password" id="loginPass" placeholder="Password" value="123456">
                        <button class="btn btn-stk" style="background:#46B525;" onclick="ingiaMteja()">Login & Start Trending</button>
                        <button class="btn-toggle" onclick="toggleAuth(true)">Don't have an account? Sign Up</button>
                    </div>
                </div>

                <!-- USER DASHBOARD / WALLET -->
                <div class="card" id="walletCard" style="display:none;">
                    <h3>Dashboard <span class="demo-badge">LIVE TRADING</span></h3>
                    <p>Welcome back, <span id="mtejaJina" style="color:#46B525; font-weight:bold;"></span></p>
                    <p>Your Account Balance:</p>
                    <div class="balance">KSh <span id="userBalance">5,500.00</span></div>
                    
                    <hr style="border-color: #444; margin: 15px 0;">
                    
                    <!-- MPESA DEPOSIT WITH LIMITS -->
                    <h4>Deposit funds via M-PESA</h4>
                    <span class="limit-text">Min: KSh 100 | Max: KSh 300,000</span>
                    <input type="number" id="depositAmount" placeholder="Amount (KES)" value="500">
                    <input type="text" id="phone" placeholder="M-Pesa Number (07...)">
                    <button class="btn btn-deposit" onclick="wekaHela()">Deposit via STK Push</button>
                    
                    <hr style="border-color: #444; margin: 15px 0;">

                    <!-- WITHDRAWAL WITH LIMITS -->
                    <h4>Withdraw Funds</h4>
                    <span class="limit-text">Minimum Withdrawal: KSh 500</span>
                    <input type="number" id="withdrawAmount" placeholder="Amount (KES)" value="500">
                    <button class="btn btn-withdraw" onclick="toaHela()">Withdraw to M-Pesa</button>
                </div>

                <!-- COPY TRADING SYSTEM -->
                <div class="card" style="width: 400px;">
                    <h3>Top Professional Traders</h3>
                    <p>Click 'Copy' to replicate their trading strategies automatically:</p>
                    <div id="tradersList"></div>
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
                            <div><button class="btn btn-copy" onclick="copyTrader('\${t.name}')">Copy</button></div>
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

                function sajiliMteja() {
                    const name = document.getElementById('regName').value;
                    const email = document.getElementById('regEmail').value;
                    if(!name || !email) return alert('Please fill in your name and email address!');
                    
                    document.getElementById('authCard').style.display = 'none';
                    document.getElementById('walletCard').style.display = 'block';
                    document.getElementById('mtejaJina').innerText = name;
                    alert('Success! Account Created. Welcome ' + name + ' to Genz Trending.com!');
                }

                function ingiaMteja() {
                    const email = document.getElementById('loginEmail').value;
                    if(!email) return alert('Please enter your email!');
                    
                    document.getElementById('authCard').style.display = 'none';
                    document.getElementById('walletCard').style.display = 'block';
                    document.getElementById('mtejaJina').innerText = "Trader_Deno07";
                    alert('Login Successful! Welcome back.');
                }

                function copyTrader(name) {
                    alert("Copy Trading Active! You are now automatically replicating " + name + ". Trades will execute according to your KSh " + currentBalance + " balance.");
                }

                function wekaHela() {
                    const amount = parseFloat(document.getElementById('depositAmount').value);
                    const phone = document.getElementById('phone').value;
                    
