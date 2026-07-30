const express = require('express');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// UKUNGANISHI WA DATA YA MAPRO TRADERS (In-Memory Mock Database ya Copy Trading)
let viongoziWaTrading = [
    { id: 1, jina: "Alex FX Master", winRate: "92%", followers: 142, profit: "+340%" },
    { id: 2, jina: "Mama Mboga Trader", winRate: "88%", followers: 98, profit: "+180%" },
    { id: 3, jina: "Genz Alpha Pips", winRate: "85%", followers: 310, profit: "+410%" }
];

// 1. UKURASA MKUU WA COPY TRADING DASHBOARD (Frontend HTML) - Inafunguka mtandaoni kupitia Render
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Genz Trending.com - Copy Trading Platform</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #111; color: #fff; margin: 0; padding: 20px; }
                .navbar { display: flex; justify-content: space-between; background: #222; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-bottom: 3px solid #46B525; }
                .container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
                .card { background: #222; padding: 20px; border-radius: 12px; width: 320px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border-top: 4px solid #46B525; }
                .balance { font-size: 28px; font-weight: bold; color: #46B525; margin: 10px 0; }
                input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; font-size: 16px; }
                .btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; color: white; margin-top: 5px; }
                .btn-deposit { background: #46B525; }
                .btn-copy { background: #007bff; width: auto; padding: 8px 15px; font-size: 14px; margin: 0; }
                .trader-row { display: flex; justify-content: space-between; align-items: center; background: #333; padding: 12px; margin: 10px 0; border-radius: 8px; font-size: 14px; }
                .market-ticker { background: #1a1a1a; padding: 12px; font-weight: bold; color: #ffcc00; border-radius: 8px; margin-bottom: 20px; font-family: monospace; border-left: 5px solid #ffcc00; }
            </style>
        </head>
        <body>
            <div class="navbar">
                <div style="font-size: 22px; font-weight: bold; color: #46B525;">Genz Trending.com 📈</div>
                <div style="font-size: 16px;">Mtumiaji: <span style="color:#46B525; font-weight:bold;">Trader_Deno07</span></div>
            </div>

            <div class="market-ticker">
                Soko la FX Moja kwa Moja: EUR/USD: 1.0924 🟢 | GBP/USD: 1.2845 🔴 | XAU/USD (Gold): $2,385.40 🟢
            </div>

            <div class="container">
                <!-- WALLET & DEPOSIT CARD -->
                <div class="card">
                    <h3>Mkoba Wako (Wallet)</h3>
                    <p>Salio la Uwekezaji:</p>
                    <div class="balance">KSh <span id="userBalance">5,500.00</span></div>
                    
                    <hr style="border-color: #444; margin: 20px 0;">
                    
                    <h4>Weka Pesa na M-PESA</h4>
                    <input type="text" id="phone" placeholder="Namba ya M-Pesa (Mfano: 07123...)">
                    <input type="number" id="amount" placeholder="Kiasi (KES)" value="100">
                    <button class="btn btn-deposit" onclick="wekaHela()">Deposit Sasa (STK Push)</button>
                </div>

                <!-- COPY TRADING LIST -->
                <div class="card" style="width: 450px;">
                    <h3>Wafanyabiashara Bora wa Kunakili (Top Traders)</h3>
                    <p>Bonyeza 'Copy' ili mfumo unakili mikakati yao kiotomatiki kulingana na salio lako:</p>
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

                function copyTrader(jina) {
                    alert("Umeshaanza kunakili (Copying) mikakati ya " + jina + " kwa usahihi! Muamala wowote atakaofungua kule MetaTrader utajifungua kiotomatiki kwenye akaunti yako.");
                }

                function wekaHela() {
                    const namba = document.getElementById('phone').value;
                    const kiasi = document.getElementById('amount').value;
                    if(!namba) return alert('Tafadhali weka namba ya simu!');
                    alert('Ombi la STK Push la KSh ' + kiasi + ' limerushwa kwenda simu namba ' + namba + '. Weka PIN ya M-Pesa kukamilisha uwekezaji wako kwenda Genz Trending.com.');
                }
            </script>
        </body>
        </html>
    `);
});

// 2. API Endpoint ya kupata Traders (Kwa ajili ya Mobile App ya Play Store baadaye)
app.get('/api/traders', (req, res) => {
    res.json(viongoziWaTrading);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CopyTrading Platform imewaka Live kwenye port ${PORT}`));
