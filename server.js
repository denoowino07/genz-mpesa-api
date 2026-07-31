const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Main Route for GENZTRENDING Dashboard
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GenZTrending - FX Dashboard</title>
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
                    <h1 class="text-2xl font-bold neon-text tracking-wider">GENZTRENDING</h1>
                    <nav class="space-x-6 hidden md:flex">
                        <a href="#" class="text-white hover:text-[#00ff66] transition">Dashboard</a>
                        <a href="#" class="text-gray-400 hover:text-[#00ff66] transition">FX Markets</a>
                        <a href="#" class="text-gray-400 hover:text-[#00ff66] transition">My Wallet</a>
                    </nav>
                    <div class="space-x-3">
                        <button class="text-gray-300 hover:text-[#00ff66] font-medium text-sm transition">
                            Sign In
                        </button>
                        <button class="bg-[#00ff66] text-black font-bold px-4 py-2 rounded text-sm hover:bg-[#00cc52] transition">
                            Create Account
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="container mx-auto p-6 flex-grow">
                <!-- System Status -->
                <div class="mb-8 p-6 rounded-lg card-bg neon-border flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 class="text-xl font-semibold mb-2 text-white">FX Markets Are Live</h2>
                        <p class="text-gray-400">Your automated algorithm systems are analyzing current market trends.</p>
                    </div>
                    <div class="mt-4 md:mt-0 bg-green-900/30 text-[#00ff66] px-4 py-2 rounded border border-[#00ff66]/30 font-mono text-sm animate-pulse">
                        ● Bot Status: ACTIVE
                    </div>
                </div>

                <!-- Financial Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Account Balance</h3>
                        <p class="text-3xl font-bold mt-2 text-white font-mono">$12,450.80</p>
                        <span class="text-xs text-green-500">+4.5% Today</span>
                    </div>

                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Active Trades</h3>
                        <p class="text-3xl font-bold mt-2 neon-text font-mono">3 Running</p>
                        <span class="text-xs text-[#00ff66]">Current Profit: +$142.20</span>
                    </div>

                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Bot Win Rate</h3>
                        <p class="text-3xl font-bold mt-2 text-white font-mono">78.4%</p>
                        <span class="text-xs text-gray-500">Based on past 150 trades</span>
                    </div>
                </div>

                <!-- TradingView Chart -->
                <div class="mb-8 p-4 rounded-lg card-bg border border-gray-800">
                    <h3 class="text-lg font-semibold text-white mb-4">Live Advanced Forex Chart</h3>
                    <div class="w-full" style="height: 450px;">
                        <div class="tradingview-widget-container" style="height:100%;width:100%">
                            <div id="tradingview_chart" style="height:calc(100% - 32px);width:100%"></div>
                            <script type="text/javascript" src="https://tradingview.com"></script>
                            <script type="text/javascript">
                            new TradingView.widget({
                                "width": "100%",
                                "height": "100%",
                                "symbol": "FX:EURUSD",
                                "interval": "15",
                                "timezone": "Etc/UTC",
                                "theme": "dark",
                                "style": "1",
                                "locale": "en",
                                "toolbar_bg": "#161b22",
                                "enable_publishing": false,
                                "hide_side_toolbar": false,
                                "allow_symbol_change": true,
                                "container_id": "tradingview_chart"
                            });
                            </script>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity & Market News Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    <!-- Trade History -->
                    <div class="lg:col-span-2 p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-lg font-semibold text-white mb-4">Recent Trade History</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left font-mono text-sm">
                                <thead>
                                    <tr class="border-b border-gray-800 text-gray-400">
                                        <th class="pb-3">Time</th>
                                        <th class="pb-3">Pair</th>
                                        <th class="pb-3">Type</th>
                                        <th class="pb-3">Size (Lots)</th>
                                        <th class="pb-3">Profit/Loss</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-800/50">
                                    <tr>
                                        <td class="py-3 text-gray-500">Today, 14:20</td>
                                        <td class="py-3 font-bold text-white">EUR/USD</td>
                                        <td class="py-3 text-green-500">BUY</td>
                                        <td class="py-3">0.50</td>
                                        <td class="py-3 text-green-400 font-bold">+$75.00</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3 text-gray-500">Today, 11:05</td>
                                        <td class="py-3 font-bold text-white">GBP/USD</td>
                                        <td class="py-3 text-red-500">SELL</td>
                                        <td class="py-3">1.00</td>
                                        <td class="py-3 text-red-400 font-bold">-$32.10</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3 text-gray-500">Yesterday, 18:45</td>
                                        <td class="py-3 font-bold text-white">USD/JPY</td>
                                        <td class="py-3 text-green-500">BUY</td>
                                        <td class="py-3">0.20</td>
                                        <td class="py-3 text-green-400 font-bold">+$114.50</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Live Market News -->
                    <div class="p-6 rounded-lg card-bg border border-gray-800 flex flex-col justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4">Live Market News</h3>
                            <div class="space-y-4">
                                <div class="border-l-2 border-[#00ff66] pl-3">
                                    <h4 class="text-sm font-bold text-white hover:text-[#00ff66] cursor-pointer">Federal Reserve to decide on interest rates this week...</h4>
                                    <p class="text-xs text-gray-500 mt-1">15 mins ago</p>
                                </div>
                                <div class="border-l-2 border-gray-700 pl-3">
                                    <h4 class="text-sm font-bold text-white hover:text-[#00ff66] cursor-pointer">US Dollar Index (DXY) rallies to fresh monthly highs</h4>
                                    <p class="text-xs text-gray-500 mt-1">1 hour ago</p>
