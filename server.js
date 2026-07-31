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
            <title>GenZTrending - Trading Made Easy</title>
            <script src="https://tailwindcss.com"></script>
            <style>
                body { background-color: #06090e; color: #c9d1d9; }
                .neon-green { color: #00ff66; }
                .bg-neon-green { background-color: #00ff66; }
                .bg-neon-green:hover { background-color: #00cc52; }
                .card-bg { background-color: #0d1117; }
                .badge-bg { background-color: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0, 255, 102, 0.15); }
            </style>
        </head>
        <body class="font-sans antialiased min-h-screen flex flex-col justify-between">

            <!-- NAVBAR -->
            <header class="p-5">
                <div class="container mx-auto flex justify-between items-center">
                    <h1 class="text-xl font-bold text-white tracking-wider cursor-pointer" onclick="window.location.reload()">GENZTRENDING</h1>
                    
                    <!-- Hizi zitaonekana tu mtumiaji akiwa ameshaingia Ndani (Dashboard) -->
                    <nav id="main-nav" class="space-x-6 hidden md:flex">
                        <button onclick="switchView('dashboard')" id="nav-dashboard" class="text-white font-medium">Dashboard</button>
                        <button onclick="switchView('wallet')" id="nav-wallet" class="text-gray-400 font-medium">My Wallet</button>
                    </nav>

                    <div class="flex items-center space-x-6" id="auth-nav-buttons">
                        <button onclick="switchView('login')" class="text-gray-300 hover:text-white font-medium text-sm transition">Log in</button>
                        <button onclick="switchView('register')" class="bg-neon-green text-black font-bold px-4 py-2 rounded-full text-sm transition">Get Started</button>
                    </div>
                </div>
            </header>

            <!-- MAIN CONTENT CONTAINER -->
            <main class="container mx-auto px-6 flex-grow flex flex-col justify-center">

                <!-- VIEW 0: LANDING PAGE (Sawa kabisa na Picha yako ya mfano) -->
                <div id="view-landing" class="view-section text-center max-w-2xl mx-auto py-12">
                    
                    <!-- Top Badge -->
                    <div class="inline-flex items-center gap-2 badge-bg text-[#00ff66] px-4 py-1.5 rounded-full text-xs font-medium mb-8">
                        ✨ Over 1 million traders and counting
                    </div>

                    <!-- Main Heading -->
                    <h2 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Trading Made Easy, <br><span class="neon-green">Trade Smart</span>
                    </h2>

                    <!-- Subtext -->
                    <p class="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        The best Trusted Binary Automated trading platform with fast withdrawals and fast response customer service
                    </p>

                    <!-- Action Buttons -->
                    <div class="flex flex-col items-center gap-4 max-w-xs mx-auto mb-16 w-full">
                        <button onclick="switchView('register')" class="w-full bg-neon-green text-black font-bold py-3.5 rounded-full text-sm transition tracking-wide">
                            Get Started – It's Free →
                        </button>
                        <button onclick="switchView('login')" class="w-full bg-gray-900/50 hover:bg-gray-900 border border-gray-800 text-white font-medium py-3.5 rounded-full text-sm transition">
                            ▷ Try Demo
                        </button>
                    </div>

                    <!-- Footer Badges/Features -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400 border-t border-gray-900 pt-8">
                        <div class="flex items-center justify-center gap-1.5">⚡ &lt;1s execution</div>
                        <div class="flex items-center justify-center gap-1.5">📈 Up to 95% payout</div>
                        <div class="flex items-center justify-center gap-1.5">🛡️ Bank-level security</div>
                        <div class="flex items-center justify-center gap-1.5">💎 Zero fees</div>
                    </div>
                </div>

                <!-- VIEW 1: DASHBOARD (Inafunguka baada ya ku-Join/Sign In) -->
                <div id="view-dashboard" class="view-section hidden">
                    <div class="mb-8 p-6 rounded-lg card-bg border border-[#00ff66] flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 class="text-xl font-semibold text-white">FX Markets Are Live</h2>
                            <p class="text-gray-400">Welcome inside your trading terminal.</p>
                        </div>
                        <div class="bg-green-900/30 text-[#00ff66] px-4 py-2 rounded border border-[#00ff66]/30 font-mono text-sm">● Bot Status: ACTIVE</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="p-6 rounded-lg card-bg border border-gray-800"><h3 class="text-sm text-gray-400">Account Balance</h3><p class="text-3xl font-bold text-white font-mono">$12,450.80</p></div>
                        <div class="p-6 rounded-lg card-bg border border-gray-800"><h3 class="text-sm text-gray-400">Active Trades</h3><p class="text-3xl font-bold text-[#00ff66] font-mono">3 Running</p></div>
                        <div class="p-6 rounded-lg card-bg border border-gray-800"><h3 class="text-sm text-gray-400">Bot Win Rate</h3><p class="text-3xl font-bold text-white font-mono">78.4%</p></div>
                    </div>
                    <!-- TradingView Chart -->
                    <div class="mb-8 p-4 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-lg font-semibold text-white mb-4">Live Advanced Forex Chart</h3>
                        <div style="height: 450px; width:100%">
                            <div id="tradingview_chart" style="height:100%; width:100%"></div>
                            <script type="text/javascript" src="https://tradingview.com"></script>
                            <script type="text/javascript">
                            new TradingView.widget({"width": "100%", "height": "100%", "symbol": "FX:EURUSD", "interval": "15", "theme": "dark", "style": "1", "locale": "en", "container_id": "tradingview_chart"});
                            </script>
                        </div>
                    </div>
                </div>

                <!-- VIEW 2: WALLET -->
                <div id="view-wallet" class="view-section hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-1 p-6 rounded-lg card-bg border border-[#00ff66]"><h3 class="text-gray-400 text-sm">Crypto Wallet</h3><p class="text-3xl font-bold text-white font-mono">$5,240.15</p></div>
                        <div class="lg:col-span-2 p-6 rounded-lg card-bg border border-gray-800">
                            <h3 class="text-xl font-bold text-white mb-6">Deposit Funds Via M-Pesa</h3>
                            <div class="p-4 bg-[#06090e] rounded-lg border border-gray-800">
                                <input type="text" placeholder="Phone Number (e.g. 2557XXXXXXXX)" class="w-full bg-[#161b22] text-white p-2 rounded mb-3 border border-gray-800">
                                <input type="number" placeholder="Amount" class="w-full bg-[#161b22] text-white p-2 rounded mb-4 border border-gray-800">
                                <button onclick="alert('Processing M-Pesa Payment... Check phone')" class="w-full bg-neon-green text-black font-bold py-2 rounded">Pay with M-Pesa</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- VIEW 3: LOGIN FORM -->
                <div id="view-login" class="view-section hidden max-w-md mx-auto w-full p-6 rounded-lg card-bg border border-[#00ff66]">
                    <h3 class="text-2xl font-bold text-white text-center mb-6">Sign In</h3>
                    <input type="email" placeholder="Email" class="w-full bg-[#06090e] text-white p-3 rounded mb-4 border border-gray-800">
                    <input type="password" placeholder="Password" class="w-full bg-[#06090e] text-white p-3 rounded mb-4 border border-gray-800">
                    <button onclick="loginSuccess()" class="w-full bg-neon-green text-black font-bold py-3 rounded">Access Account</button>
                </div>

                <!-- VIEW 4: REGISTER FORM -->
                <div id="view-register" class="view-section hidden max-w-md mx-auto w-full p-6 rounded-lg card-bg border border-gray-800">
                    <h3 class="text-2xl font-bold text-white text-center mb-6">Create Account</h3>
                    <input type="text" placeholder="Full Name" class="w-full bg-[#06090e] text-white p-3 rounded mb-4 border border-gray-800">
                    <input type="email" placeholder="Email" class="w-full bg-[#06090e] text-white p-3 rounded mb-4 border border-gray-800">
                    <input type="password" placeholder="Password" class="w-full bg-[#06090e] text-white p-3 rounded mb-4 border border-gray-800">
