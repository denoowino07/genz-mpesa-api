const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GenZTrending FX</title>
            <script src="https://tailwindcss.com"></script>
        </head>
        <body class="bg-[#0d1117] text-white flex items-center justify-center min-h-screen font-sans">
            <div class="text-center p-8 rounded-lg border border-[#00ff66] bg-[#161b22] shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                <h1 class="text-4xl font-bold tracking-wider text-[#00ff66] mb-4">GENZTRENDING</h1>
                <p class="text-gray-400 text-lg mb-6">Our cyber-green FX platform is under a quick optimization upgrade.</p>
                <div class="inline-block bg-green-950 text-[#00ff66] px-4 py-2 rounded text-sm font-mono border border-green-800 animate-pulse">
                    SYSTEM STATUS: ACTIVE & DEPLOYING
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
