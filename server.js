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

// 1. MAIN WEBSITE HOME PAGE (English Frontend HTML with Registration Form Built-In)
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
                .navbar { background: #222; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-bottom: 3px solid #46B525; font-size: 22px; font-weight: bold; color: #46B525; }
                .container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 10px; }
                .card { background: #222; padding: 25px; border-radius: 12px; width: 320px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border-top: 4px solid #46B525; text-align: left; }
                .balance { font-size: 28px; font-weight: bold; color: #46B525; margin: 10px 0; }
                input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; font-size: 16px; }
                .btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; color: white; margin-top: 5px; }
                .btn-deposit { background: #46B525; }
                .btn-copy { background: #007bff; width: auto; padding: 8px 15px; font-size: 14px; }
                .trader-row { display: flex; justify-content: space-between; align-items: center; background: #333; padding: 12px; margin: 10px 0; border-radius: 8px; }
                .market-ticker { background: #1a1a1a; padding: 12px; font-weight: bold; color: #ffcc00; border-radius: 8px; margin-bottom: 20px; font-family: monospace; border-left: 5px solid #ffcc00; text-align: left; }
                .btn-reg { background: #ff5722; }
                .demo-badge { background: #ffcc00; color: #000; padding: 3px 8px; font-size: 12px; font-weight: bold; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="navbar">Genz Trending.com 📈</div>

            <div class="market-ticker">
                Live FX Market: EUR/USD: 1.0924 🟢 | GBP/USD: 1.2845 🔴 | XAU/USD (Gold): $2,385.40 🟢
            </div>

            <div class="container">
                <!-- USER SIGN UP CARD -->
                <div class="card" id="regCard">
                    <h3>Create Your Account</h3>
                    <p>Join now to start learning and copying pro master traders for free:</p>
                    <input type="text" id="regName" placeholder="Full Name">
                    <input type="email" id="regEmail" placeholder="Email Address">
                    <input type="password" id="regPass" placeholder="Password">
                    <button class="btn btn-reg" onclick="sajiliMteja()">Create Free Practice Account / Sign Up</button>
                </div>

                <!-- USER DASHBOARD / WALLET -->
                <div class="card" id="walletCard" style="display:none;">
                    <h3>Your Dashboard <span class="demo-badge">DEMO MODE ACTIVE</span></h3>
                    <p>Welcome, <span id="mtejaJina" style="color:#46B525; font-weight:bold;"></span></p>
                    <p>Free Learning Balance:</p>
                    <div class="balance">KSh <span id="userBalance">10,000.00</span></div>
                    <p style="font-size:12px; color:#aaa;">*This is virtual money for learning purposes. No real money required.</p>
                    
                    <hr style="border-color: #444; margin: 15px 0;">
                    <h4>Want to go live? Deposit via M-PESA</h4>
                    <input type="text" id="phone" placeholder="M-Pesa Number (07...)">
                    <button class="btn btn-deposit" onclick="wekaHela()">Deposit via STK Push</button>
                    <button class="btn" style="background:#007bff; margin-top:10px;" onclick="window.location.href='/angalia-qr'">Show M-Pesa QR Code</button>
                </div>

                <!-- COPY TRADING SYSTEM -->
                <div class="card" style="width: 400px;">
                    <h3>Top Professional Traders</h3>
                    <p>Click 'Copy' to replicate their trading strategies automatically using your Demo Balance:</p>
                    <div id="tradersList"></div>
                </div>
            </div>

            <script>
                const viongozi = ${JSON.stringify(topTraders)};
                let listHtml = "";
                viongozi.forEach(t => {
                    listHtml += \`
                        <div class="trader-row">
                            <div><strong>\${t.name}</strong><br><span style="color:#aaa;">WinRate: \${t.winRate}</span></div>
                            <div style="color:#46B525; font-weight:bold;">\${t.profit}</div>
                            <div><button class="btn btn-copy" onclick="copyTrader('\${t.name}')">Copy (Demo)</button></div>
                        </div>
                    \`;
                });
                document.getElementById('tradersList').innerHTML = listHtml;

                function sajiliMteja() {
                    const name = document.getElementById('regName').value;
                    const email = document.getElementById('regEmail').value;
                    if(!name || !email) return alert('Please enter your name and email address!');
                    
                    document.getElementById('regCard').style.display = 'none';
                    document.getElementById('walletCard').style.display = 'block';
                    document.getElementById('mtejaJina').innerText = name;
                    alert('Success! Welcome ' + name + ' to Genz Trending.com. Your practice account has been activated with KSh 10,000!');
                }

                function copyTrader(name) {
                    alert("Learning Session Started! You are now automatically copying " + name + " using your free Demo Balance.");
                }

                function wekaHela() {
                    const phone = document.getElementById('phone').value;
                    if(!phone) return alert('Please enter your Safaricom mobile number!');
                    alert('STK Push request sent to ' + phone + '. Enter your PIN to complete investment.');
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/api/traders', (req, res) => { res.json(topTraders); });

// 2. M-PESA QR Code Generator Page
app.get('/angalia-qr', async (req, res) => {
    try {
        const mpesaQRString = `MPESA|C2B|373203|1|ORDER12345|Genz Trending.com`;
        const pichaYaQR = await QRCode.toDataURL(mpesaQRString, { errorCorrectionLevel: 'H', margin: 1 });
        res.send(`
            <body style="text-align:center; padding-top:50px; font-family:Arial; background-color:#111; color:#fff;">
                <div style="background:#222; display:inline-block; padding:30px; border-radius:15px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #46B525;">
                    <h2 style="color: #46B525;">M-PESA QR Code Is Ready!</h2>
                    <img src="${pichaYaQR}" style="border:4px solid #46B525; padding:10px; width:250px; height:250px; border-radius:10px; background:white;" />
                    <p>Scan using M-PESA App to pay KES 1 to Genz Trending.com</p>
                    <button style="padding:10px 20px; cursor:pointer; background:#46B525; color:white; border:none; border-radius:5px; font-weight:bold;" onclick="window.location.href='/'">Return To Platform</button>
                </div>
            </body>
        `);
    } catch (error) { res.status(500).send(error.message); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
