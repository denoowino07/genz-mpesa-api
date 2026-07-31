const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Njia kuu (Root Route) inayorudisha muonekano wa giza na kijani
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Auto Traders - Dashboard</title>
            <script src="https://tailwindcss.com"></script>
            <style>
                body {
                    background-color: #0d1117;
                    color: #c9d1d9;
                }
                .neon-text {
                    color: #00ff66;
                    text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
                }
                .neon-border {
                    border: 1px solid #00ff66;
                    box-shadow: 0 0 15px rgba(0, 255, 102, 0.2);
                }
                .card-bg {
                    background-color: #161b22;
                }
            </style>
        </head>
        <body class="font-sans antialiased min-h-screen flex flex-col justify-between">

            <!-- Navbar -->
            <header class="border-b border-gray-800 bg-[#161b22] p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <h1 class="text-2xl font-bold neon-text tracking-wider">AUTO TRADERS</h1>
                    <nav class="space-x-6 hidden md:flex">
                        <a href="#" class="text-white hover:text-[#00ff66] transition">Nyumbani</a>
                        <a href="#" class="text-gray-400 hover:text-[#00ff66] transition">Soko</a>
                        <a href="#" class="text-gray-400 hover:text-[#00ff66] transition">Akaunti</a>
                    </nav>
                    <button class="bg-[#00ff66] text-black font-bold px-4 py-2 rounded hover:bg-[#00cc52] transition">
                        Ingia / Sajili
                    </button>
                </div>
            </header>

            <!-- Main Content -->
            <main class="container mx-auto p-6 flex-grow">
                <div class="mb-8 p-6 rounded-lg card-bg neon-border">
                    <h2 class="text-xl font-semibold mb-2 text-white">Karibu Kwenye Toleo Jipya!</h2>
                    <p class="text-gray-400">Hapa unaweza kufuatilia masoko ya magari kupitia server.js kwa mfumo wa kisasa wa giza.</p>
                </div>

                <!-- Grid ya Takwimu -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase">Magari Yanayouzwa</h3>
                        <p class="text-3xl font-bold mt-2 neon-text">1,240</p>
                        <span class="text-xs text-green-500">+12% Wiki hii</span>
                    </div>

                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase">Wauzaji Walioidhinishwa</h3>
                        <p class="text-3xl font-bold mt-2 text-white">85</p>
                        <span class="text-xs text-[#00ff66]">Wote wapo hai</span>
                    </div>

                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase">Jumla ya Maombi</h3>
                        <p class="text-3xl font-bold mt-2 neon-text">342</p>
                        <span class="text-xs text-gray-500">Yanasubiri kufanyiwa kazi</span>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="border-t border-gray-800 bg-[#161b22] p-4 text-center text-sm text-gray-500">
                <p>&copy; 2026 Auto Traders. Haki zote zimehifadhiwa.</p>
            </footer>

        </body>
        </html>
    `);
});

// Kuanzisha seva
app.listen(PORT, () => {
    console.log(`Server inafanya kazi kwenye port \${PORT}`);
});
