const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());
app.use(cors());

// DATA YA MAJARIBIO (Hapa ndipo wateja wapya wanapohifadhiwa mtandaoni)
let watejaWapya = [];
let viongoziWaTrading = [
    { id: 1, jina: "Alex FX Master", winRate: "92%", profit: "+340%" },
    { id: 2, jina: "Mama Mboga Trader", winRate: "88%", profit: "+180%" },
    { id: 3, jina: "Genz Alpha Pips", winRate: "85%", profit: "+410%" }
];

// 1. UKURASA MKUU WA WEBSITE (Frontend HTML) - Inafunguka kwenye https://onrender.com
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Genz Trending.com - Copy Trading & Malipo</title>
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
            </style>
        </head>
        <body>
            <div class="navbar">Genz Trending.com 📈</div>

            <div class="market-ticker">
                Soko la FX Live: EUR/USD: 1.0924 🟢 | GBP/USD: 1.2845 🔴 | XAU/USD (Gold): $2,385.40 🟢
            </div>

            <div class="container">
                <!-- SEHEMU YA AJILI YA WATU KUJIUNGA (REGISTRATION CARD) -->
                <div class="card" id="regCard">
                    <h3>Fungua Akaunti Hapa Jukwaani</h3>
                    <p>Jiunge sasa ili uanze ku-trend na kunakili miamala:</p>
                    <input type="text" id="regName" placeholder="Jina Kamili">
                    <input type="email" id="regEmail" placeholder="Barua Pepe (Email)">
                    <input type="password" id="regPass" placeholder="Nenosiri (Password)">
                    <button class="btn btn-reg" onclick="sajiliMteja()">Jiunge Sasa (Sign Up)</button>
                </div>

                <!-- MKOBA WA MPESA (WALLET) -->
                <div class="card" id="walletCard" style="display:none;">
                    <h3>Mkoba Wako (Wallet)</h3>
                    <p>Mteja: <span id="mtejaJina" style="color:#46B525; font-weight:bold;"></span></p>
                    <div class="balance">KSh <span id="userBalance">0.00</span></div>
                    <hr style="border-color: #444; margin: 15px 0;">
                    <h4>Weka Pesa na M-PESA</h4>
                    <input type="text" id="phone" placeholder="Namba ya M-Pesa (07...)">
                    <button class="btn btn-deposit" onclick="wekaHela()">Deposit Sasa (STK Push)</button>
                    <button class="btn" style="background:#007bff; margin-top:10px;" onclick="window.location.href='/angalia-qr'">Onyesha QR Code</button>
                </div>

                <!-- COPY TRADING LIST -->
                <div class="card" style="width: 400px;">
                    <h3>Wafanyabiashara Bora (Top Traders)</h3>
                    <p>Kunakili mikakati yao kiotomatiki:</p>
                    <div id="tradersList"></div>
                </div>
            </div>

            <script>
                // Kupandisha Orodha ya Wafanyabiashara kwenye skrini
                const viongozi = ${JSON.stringify(viongoziWaTrading)};
                let listHtml = "";
                viongozi.forEach(t => {
                    listHtml += \`
                        <div class="trader-row">
                            <div><strong>\${t.jina}</strong><br><span style="color:#aaa;">WinRate: \${t.winRate}</span></div>
                            <div style="color:#46B525; font-weight:bold;">\${t.profit}</div>
                            <div><button class="btn btn-copy" onclick="copyTrader('\${t.jina}')">Copy</button></div>
                        </div>
                    \`;
                });
                document.getElementById('tradersList').innerHTML = listHtml;

                function sajiliMteja() {
                    const jina = document.getElementById('regName').value;
                    const email = document.getElementById('regEmail').value;
                    if(!jina || !email) return alert('Tafadhali jaza jina na email yako!');
                    
                    // Kuficha fomu ya kujisajili na kufungua Wallet ya mteja
                    document.getElementById('regCard').style.display = 'none';
                    document.getElementById('walletCard').style.display = 'block';
                    document.getElementById('mtejaJina').innerText = jina;
                    document.getElementById('userBalance').innerText = '10,000.00';
                    alert('Hongera ' + jina + '! Akaunti yako imefunguliwa kwa mafanikio kwenye Genz Trending.com. Umepewa KSh 10,000 ya majaribio.');
                }

                function copyTrader(jina) {
                    alert("Umeshaanza kunakili (Copying) mikakati ya " + jina + ". Miamala yake itatokea kwenye akaunti yako.");
                }

                function wekaHela() {
                    const namba = document.getElementById('phone').value;
                    if(!namba) return alert('Tafadhali weka namba ya simu!');
                    alert('Ombi la STK Push limerushwa kwenda simu namba ' + namba + '. Weka PIN ya M-Pesa kukamilisha uwekezaji wako.');
                }
            </script>
        </body>
        </html>
    `);
});

// 2. Mfumo wa QR Code Generator
app.get('/angalia-qr', async (req, res) => {
    try {
        const mpesaQRString = `MPESA|C2B|373203|1|ORDER12345|Genz Trending.com`;
        const pichaYaQR = await QRCode.toDataURL(mpesaQRString, { errorCorrectionLevel: 'H', margin: 1 });
        res.send(`
            <body style="text-align:center; padding-top:50px; font-family:Arial; background-color:#111; color:#fff;">
                <div style="background:#222; display:inline-block; padding:30px; border-radius:15px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #46B525;">
                    <h2 style="color: #46B525;">M-PESA QR Code Iko Ready!</h2>
                    <img src="${pichaYaQR}" style="border:4px solid #46B525; padding:10px; width:250px; height:250px; border-radius:10px; background:white;" />
                    <p>Skeni kwa kutumia M-PESA App kulipia KES 1 kwenda Genz Trending.com</p>
                    <button style="padding:10px 20px; cursor:pointer; background:#46B525; color:white; border:none; border-radius:5px; font-weight:bold;" onclick="window.location.href='/'">Rudi Kwenye Jukwaa</button>
                </div>
            </body>
        `);
    } catch (error) { res.status(500).send(error.message); }
});

// API ya kupata Traders (Kwa ajili ya Mobile App ya Play Store baadaye)
app.get('/api/traders', (req, res) => { res.json(viongoziWaTrading); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Website imewaka vizuri kwenye port ${PORT}`));
