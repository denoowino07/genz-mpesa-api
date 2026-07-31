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
            <title>GenZTrending - Welcome</title>
            <script src="https://tailwindcss.com"></script>
            <style>
                body { background-color: #0d1117; color: #c9d1d9; }
                .neon-text { color: #00ff66; text-shadow: 0 0 10px rgba(0, 255, 102, 0.5); }
                .neon-border { border: 1px solid #00ff66; box-shadow: 0 0 15px rgba(0, 255, 102, 0.2); }
                .card-bg { background-color: #161b22; }
            </style>
        </head>
        <body class="font-sans antialiased min-h-screen flex flex-col justify-between">

            <!-- Navbar -->
            <header class="border-b border-gray-800 bg-[#161b22] p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <h1 class="text-2xl font-bold neon-text tracking-wider cursor-pointer" onclick="window.location.reload()">GENZTRENDING</h1>
                    
                    <!-- Hizi zitaonekana tu mtumiaji akiwa ameshaingia ndani (Dashboard) -->
                    <nav id="main-nav" class="space-x-6 hidden">
                        <button onclick="switchView('dashboard')" id="nav-dashboard" class="text-white font-medium">Dashboard</button>
                        <button onclick="switchView('wallet')" id="nav-wallet" class="text-gray-400 hover:text-[#00ff66] transition font-medium">My Wallet</button>
                    </nav>

                    <div class="space-x-3" id="auth-nav-buttons">
                        <button onclick="switchView('login')" class="text-gray-300 hover:text-[#00ff66] font-medium text-sm transition">Sign In</button>
                        <button onclick="switchView('register')" class="bg-[#00ff66] text-black font-bold px-4 py-2 rounded text-sm hover:bg-[#00cc52] transition">Create Account</button>
                    </div>
                </div>
            </header>

            <!-- Main Content Container -->
            <main class="container mx-auto p-6 flex-grow flex flex-col justify-center">

                <!-- VIEW 0: LANDING WELCOME PAGE -->
                <div id="view-landing" class="view-section text-center max-w-2xl mx-auto py-12">
                    <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        The Next-Gen <span class="neon-text">FX Automation</span> Platform
                    </h2>
                    <p class="text-gray-400 text-lg mb-8">
                        Join the future of algorithmic forex trading. Analyze live markets, manage your digital wallet, and let automation drive your consistency.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onclick="switchView('register')" class="w-full sm:w-auto bg-[#00ff66] text-black font-bold px-8 py-3 rounded-lg hover:bg-[#00cc52] transition shadow-lg shadow-green-500/20">
                            Join Now & Start Trading
                        </button>
                        <button onclick="switchView('login')" class="w-full sm:w-auto border border-gray-700 text-white font-medium px-8 py-3 rounded-lg hover:bg-gray-800 transition">
                            Sign In to Account
                        </button>
                    </div>
                </div>

                <!-- VIEW 1: DASHBOARD -->
                <div id="view-dashboard" class="view-section hidden">
                    <div class="mb-8 p-6 rounded-lg card-bg neon-border flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 class="text-xl font-semibold mb-2 text-white">FX Markets Are Live</h2>
                            <p class="text-gray-400">Welcome inside! Your automated systems are live on genztrending.co analyzing trends.</p>
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
                            <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider">Crypto & Mobile Wallet</h3>
                            <p class="text-3xl font-bold mt-2 text-white font-mono">$5,240.15</p>
                        </div>
                        <div class="lg:col-span-2 p-6 rounded-lg card-bg border border-gray-800">
                            <h3 class="text-xl font-bold text-white mb-6">Deposit Funds Via M-Pesa</h3>
                            <div class="p-4 bg-[#0d1117] rounded-lg border border-gray-800">
                                <label class="block text-xs text-gray-400 mb-1">Enter Phone Number</label>
                                <input type="text" placeholder="e.g. 2557XXXXXXXX" class="w-full bg-[#161b22] text-white p-2 rounded mb-3 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                                <label class="block text-xs text-gray-400 mb-1">Amount</label>
                                <input type="number" placeholder="Amount" class="w-full bg-[#161b22] text-white p-2 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                                <button onclick="alert('Processing M-Pesa STK Push... Check your phone')" class="w-full bg-[#00ff66] text-black font-bold py-2 rounded text-sm hover:bg-[#00cc52] transition">Pay with M-Pesa</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- VIEW 3: LOGIN FORM -->
                <div id="view-login" class="view-section hidden max-w-md mx-auto w-full p-6 rounded-lg card-bg neon-border my-6">
                    <h3 class="text-2xl font-bold text-white text-center mb-6">Sign In</h3>
                    <input type="email" placeholder="Email" class="w-full bg-[#0d1117] text-white p-3 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                    <input type="password" placeholder="Password" class="w-full bg-[#0d1117] text-white p-3 rounded mb-4 border border-gray-800 focus:outline-none focus:border-[#00ff66]">
                    <button onclick="loginSuccess()" class="w-full bg-[#00ff66] text-black font-bold py-3 rounded hover:bg-[#00cc52] transition">Access Account</button>
                </div>

                <!-- VIEW 4: REGISTER FORM (JOIN) -->
                <div id="view-register" class="view-section hidden max-w-md mx-auto w-full p-6 rounded-lg card-bg border border-gray-800 my-6">
                    <h3 class="text-2xl font-bold text-white text-center mb-6">Create Account (Join)</h3>
