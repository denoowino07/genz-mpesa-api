const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GenZTrending - FX & Wallet</title>
            <script src="https://tailwindcss.com"></script>
            <style>
                body { background-color: #0d1117; color: #c9d1d9; }
                .neon-text { color: #00ff66; text-shadow: 0 0 10px rgba(0, 255, 102, 0.5); }
                .neon-border { border: 1px solid #00ff66; box-shadow: 0 0 15px rgba(0, 255, 102, 0.2); }
                .card-bg { background-color: #161b22; }
            </style>
        </head>
        <body class="font-sans antialiased min-h-screen flex flex-col justify-between">

            <!-- Header -->
            <header class="border-b border-gray-800 bg-[#161b22] p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <h1 class="text-2xl font-bold neon-text tracking-wider cursor-pointer" onclick="switchView('dashboard')">GENZTRENDING</h1>
                    <nav class="space-x-6 hidden md:flex">
                        <button onclick="switchView('dashboard')" id="nav-dashboard" class="text-white hover:text-[#00ff66] transition font-medium">Dashboard</button>
                        <button onclick="switchView('wallet')" id="nav-wallet" class="text-gray-400 hover:text-[#00ff66] transition font-medium">My Wallet</button>
                    </nav>
                    <div class="space-x-3">
                        <button onclick="switchView('login')" class="text-gray-300 hover:text-[#00ff66] font-medium text-sm transition">Sign In</button>
                        <button onclick="switchView('register')" class="bg-[#00ff66] text-black font-bold px-4 py-2 rounded text-sm hover:bg-[#00cc52] transition">Create Account</button>
                    </div>
                </div>
            </header>

            <!-- Main Content Container -->
            <main class="container mx-auto p-6 flex-grow">

                <!-- VIEW 1: DASHBOARD -->
                <div id="view-dashboard" class="view-section">
                    <div class="mb-8 p-6 rounded-lg card-bg neon-border flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 class="text-xl font-semibold mb-2 text-white">FX Markets Are Live</h2>
                            <p class="text-gray-400">Your automated algorithm systems are analyzing current market trends.</p>
                        </div>
                        <div class="mt-4 md:mt-0 bg-green-900/30 text-[#00ff66] px-4 py-2 rounded border border-[#00ff66]/30 font-mono text-sm animate-pulse">● Bot Status: ACTIVE</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="p-6 rounded-lg card-bg border border-gray-800">
                            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Account Balance</h3>
                            <p class="text-3xl font-bold mt-2 text-white font-mono">$12,450.80</p>
                        </div>
                        <div class="p-6 rounded-lg card-bg border border-gray-800">
                            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Active Trades</h3>
                            <p class="text-3xl font-bold mt-2 neon-text font-mono">3 Running</p>
                        </div>
                        <div class="p-6 rounded-lg card-bg border border-gray-800">
                            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Bot Win Rate</h3>
                            <p class="text-3xl font-bold mt-2 text-white font-mono">78.4%</p>
                        </div>
                    </div>

                    <!-- Live Chart -->
                    <div class="mb-8 p-4 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-lg font-semibold text-white mb-4">Live Advanced Forex Chart</h3>
                        <div class="w-full" style="height: 450px;">
                            <div class="tradingview-widget-container" style="height:100%;width:100%">
                                <div id="tradingview_chart" style="height:calc(100% - 32px);width:100%"></div>
                                <script type="text/javascript" src="https://tradingview.com"></script>
                                <script type="text/javascript">
                                new TradingView.widget({
                                    "width": "100%", "height": "100%", "symbol": "FX:EURUSD", "interval": "15",
                                    "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#161b22",
                                    "enable_publishing": false, "hide_side_toolbar": false, "allow_symbol_change": true,
                                    "container_id": "tradingview_chart"
                                });
                                </script>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- VIEW 2: WALLET -->
                <div id="view-wallet" class="view-section hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-1 p-6 rounded-lg card-bg neon-border">
                            <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider">Crypto Wallet</h3>
                            <p class="text-3xl font-bold mt-2 text-white font-mono">$5,240.15</p>
                        </div>
                        <div class="lg:col-span-2 p-6 rounded-lg card-bg border border-gray-800">
                            <h3 class="text-xl font-bold text-white mb-6">Deposit Funds</h3>
                            <div class="p-4 bg-[#0d1117] rounded-lg border border-gray-800">
                                <label class="block text-xs text-gray-400 mb-1">Select Asset</label>
                                <select class="w-full bg-[#161b22] text-white p-2 rounded mb-3 border border-gray-800"><option>USDT (TRC20)</option><option>Bitcoin (BTC)</option></select>
                                <button class="w-full bg-[#00ff66] text-black font-bold py-2 rounded text-sm">Generate Wallet Address</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- VIEW 3: LOGIN -->
                <div id="view-login" class="view-section hidden max-w-md mx-auto p-6 rounded-lg card-bg neon-border my-12">
                    <h3 class="text-2xl font-bold text-white text-center mb-6">Sign In</h3>
                    <input type="email" placeholder="Email" class="w-full bg-[#0d1117] text-white p-3 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                    <input type="password" placeholder="Password" class="w-full bg-[#0d1117] text-white p-3 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                    <button onclick="switchView('dashboard')" class="w-full bg-[#00ff66] text-black font-bold py-3 rounded">Access Account</button>
                </div>

                <!-- VIEW 4: REGISTER -->
                <div id="view-register" class="view-section hidden max-w-md mx-auto p-6 rounded-lg card-bg border border-gray-800 my-12">
                    <h3 class="text-2xl font-bold text-white text-center mb-6">Create Account</h3>
                    <input type="text" placeholder="Full Name" class="w-full bg-[#0d1117] text-white p-3 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                    <input type="email" placeholder="Email Address" class="w-full bg-[#0d1117] text-white p-3 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                    <button onclick="switchView('dashboard')" class="w-full bg-[#00ff66] text-black font-bold py-3 rounded">Register Now</button>
                </div>

            </main>

            <footer class="border-t border-gray-800 bg-[#161b22] p-4 text-center text-sm text-gray-500">
                <p>&copy; 2026 GenZTrending FX. All rights reserved.</p>
            </footer>

            <script>
                function switchView(viewName) {
                    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
                    document.getElementById('view-' + viewName).classList.remove('hidden');
                    
                    document.getElementById('nav-dashboard').className = viewName === 'dashboard' ? 'text-white font-medium' : 'text-gray-400 hover:text-[#00ff66] font-medium';
                    document.getElementById('nav-wallet').className = viewName === 'wallet' ? 'text-white font-medium' : 'text-gray-400 hover:text-[#00ff66] font-medium';
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
