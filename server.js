const express = require('express');
const axios = require('axios');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());
app.use(cors());

// =========================================================================
// SEHEMU YA VIGEZO VYA LIVE (PRODUCTION SETTINGS)
// Badilisha hapa chini uweke funguo zako za ukweli pindi utakapopewa na Safaricom
// =========================================================================
const CONSUMER_KEY = "WEKA_CONSUMER_KEY_YAKO_YA_LIVE_HAPA";
const CONSUMER_SECRET = "WEKA_CONSUMER_SECRET_YAKO_YA_LIVE_HAPA";
const LIVE_PASSKEY = "WEKA_LIPA_NA_MPESA_PASSKEY_YAKO_YA_LIVE_HAPA";
const BUSINESS_SHORTCODE = "WEKA_TILL_NUMBER_AU_PAYBILL_YAKO_HAPA"; 
const CALLBACK_URL = "https://genztrending.com"; 

// 1. UKURASA MKUU WA WEBSITE (Frontend HTML) - Inafunguka mtandaoni kupitia Render
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Genz Trending.com - Malipo ya Salama</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px; }
                .checkout-card { background: white; max-width: 400px; margin: 0 auto; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-top: 5px solid #46B525; }
                h2 { color: #333; margin-top: 5px; }
                .amount-tag { font-size: 24px; font-weight: bold; color: #46B525; margin: 15px 0; }
                input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
                .btn { width: 100%; padding: 12px; margin: 8px 0; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; color: white; }
                .btn-stk { background-color: #46B525; }
                .btn-qr { background-color: #007bff; }
            </style>
        </head>
        <body>
            <div class="checkout-card">
                <h2>Genz Trending.com</h2>
                <p>Ukurasa wa Malipo ya M-PESA</p>
                <div class="amount-tag">KES 1.00</div>
                
                <label style="text-align: left; display: block; font-weight: bold;">Namba ya M-PESA:</label>
                <input type="text" id="phoneNumber" placeholder="Mfano: 0712345678" required>
                
                <button class="btn btn-stk" onclick="lipaNaPinHalisi()">Lipa na M-PESA (STK Push)</button>
                <button class="btn btn-qr" onclick="tengenezaQR()">Onyesha M-PESA QR Code</button>
                <div id="statusMessage" style="margin-top: 15px; font-weight: bold; color: blue;"></div>
            </div>

            <script>
                async function lipaNaPinHalisi() {
                    let namba = document.getElementById('phoneNumber').value.trim();
                    if(!namba) return alert('Tafadhali weka namba ya simu!');
                    
                    if (namba.startsWith('0')) { namba = '254' + namba.substring(1); }
                    if (namba.startsWith('+')) { namba = namba.substring(1); }

                    document.getElementById('statusMessage').style.color = 'blue';
                    document.getElementById('statusMessage').innerText = "Inatuma ombi Safaricom... Angalia simu yako...";

                    try {
                        const response = await fetch('/api/v1/mpesa/stkpush', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ phone: namba })
                        });
                        const data = await response.json();
                        
                        if(data.success) {
                            document.getElementById('statusMessage').style.color = '#46B525';
                            document.getElementById('statusMessage').innerText = data.message;
                        } else {
                            document.getElementById('statusMessage').style.color = 'red';
                            document.getElementById('statusMessage').innerText = "Hitilafu: " + data.message;
                        }
                    } catch (err) {
                        document.getElementById('statusMessage').style.color = 'red';
                        document.getElementById('statusMessage').innerText = "Mawasiliano yamefeli.";
                    }
                }

                function tengenezaQR() {
                    window.location.href = '/angalia-qr';
                }
            </script>
        </body>
        </html>
    `);
});

// 2. Kazi ya Kupata Access Token kutoka Seva Kuu za Live za Safaricom
async function getLiveMpesaToken() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const url = "https://safaricom.co.ke";

    try {
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Basic ${auth}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GenzTrending/1.0'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Live Token Error:", error.response ? error.response.data : error.message);
        throw new Error("Imeshindwa kupata uthibitisho wa malipo.");
    }
}

// 3. API ya Kurusha STK Push ya Kweli kwenda kwenye Simu ya Mteja Halisi
app.post('/api/v1/mpesa/stkpush', async (req, res) => {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Weka namba ya simu." });

    try {
        const token = await getLiveMpesaToken();
        const url = "https://safaricom.co.ke";

        const date = new Date();
        const timestamp = date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

        const password = Buffer.from(BUSINESS_SHORTCODE + LIVE_PASSKEY + timestamp).toString('base64');

        const response = await axios.post(url, {
            "BusinessShortCode": BUSINESS_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline", 
            "Amount": 1, 
            "PartyA": phone,
            "PartyB": BUSINESS_SHORTCODE,
            "PhoneNumber": phone,
            "CallBackURL": CALLBACK_URL,
            "AccountReference": "Genz Trending",
            "TransactionDesc": "Malipo ya Bidhaa"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (response.data.ResponseCode === "0") {
            return res.json({ success: true, message: "Ombi limefanikiwa! Angalia simu yako uweke PIN." });
        } else {
            return res.status(400).json({ success: false, message: response.data.ResponseDescription });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Hitilafu ya mfumo wa Safaricom." });
    }
});

// 4. Mfumo wa QR Code Generator
app.get('/angalia-qr', async (req, res) => {
    try {
        const mpesaQRString = `MPESA|C2B|${BUSINESS_SHORTCODE}|1|ORDER12345|Genz Trending.com`;
        const pichaYaQR = await QRCode.toDataURL(mpesaQRString, { errorCorrectionLevel: 'H', margin: 1 });
        res.send(`
            <body style="text-align:center; padding-top:50px; font-family:Arial; background-color:#f4f4f4;">
                <div style="background:white; display:inline-block; padding:30px; border-radius:15px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                    <h2 style="color: #46B525;">M-PESA QR Code Iko Ready!</h2>
                    <img src="${pichaYaQR}" style="border:4px solid #46B525; padding:10px; width:250px; height:250px; border-radius:10px;" />
                    <p>Skeni kwa kutumia M-PESA App kulipia KES 1 kwenda Genz Trending.com</p>
                    <button style="padding:10px 20px; cursor:pointer;" onclick="window.location.href='/'">Rudi Kwenye Duka</button>
                </div>
            </body>
        `);
    } catch (error) { res.status(500).send(error.message); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Website imewaka kwa port ${PORT}`));
