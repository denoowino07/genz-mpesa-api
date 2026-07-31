const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Njia kuu ya Trading Dashboard yenye Chati, Historia na Habari
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sw">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Auto Traders - FX Dashboard</title>
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
                        <a href="#" class="text-white hover:text-[#00ff66] transition">Dashboard</a>
                        <a href="#" class="text-gray-400 hover:text-[#00ff66] transition">Masoko (FX)</a>
                        <a href="#" class="text-gray-400 hover:text-[#00ff66] transition">Pochi (Wallet)</a>
                    </nav>
                    <button class="bg-[#00ff66] text-black font-bold px-4 py-2 rounded hover:bg-[#00cc52] transition">
                        Unganisha Wallet
                    </button>
                </div>
            </header>

            <!-- Main Content -->
            <main class="container mx-auto p-6 flex-grow">
                <!-- Hali ya Soko kwa Ujumla -->
                <div class="mb-8 p-6 rounded-lg card-bg neon-border flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 class="text-xl font-semibold mb-2 text-white">Soko la FX Lipo Wazi (Live)</h2>
                        <p class="text-gray-400">Uchambuzi wa algoridimi zako za kiotomatiki unafanya kazi vizuri.</p>
                    </div>
                    <div class="mt-4 md:mt-0 bg-green-900/30 text-[#00ff66] px-4 py-2 rounded border border-[#00ff66]/30 font-mono text-sm animate-pulse">
                        ● Bot Status: RUNNING
                    </div>
                </div>

                <!-- Grid ya Takwimu za Forex -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Jumla ya Mtaji (Balance)</h3>
                        <p class="text-3xl font-bold mt-2 text-white font-mono">$12,450.80</p>
                        <span class="text-xs text-green-500">+4.5% Leo</span>
                    </div>

                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Trades Zinazofanya Kazi</h3>
                        <p class="text-3xl font-bold mt-2 neon-text font-mono">3 Active</p>
                        <span class="text-xs text-[#00ff66]">Faida ya sasa: +$142.20</span>
                    </div>

                    <div class="p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Win Rate ya Bot</h3>
                        <p class="text-3xl font-bold mt-2 text-white font-mono">78.4%</p>
                        <span class="text-xs text-gray-500">Kutokana na trades 150 zilizopita</span>
                    </div>
                </div>

                <!-- Chati ya TradingView -->
                <div class="mb-8 p-4 rounded-lg card-bg border border-gray-800">
                    <h3 class="text-lg font-semibold text-white mb-4">Chati ya Masoko ya Forex (Live Advanced Chart)</h3>
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

                <!-- SEHEMU MPYA: Grid ya Historia ya Trades na Habari za Soko -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    <!-- Upande wa Kushoto: Historia ya Trades (Inachukua nafasi 2/3 kwenye screen kubwa) -->
                    <div class="lg:col-span-2 p-6 rounded-lg card-bg border border-gray-800">
                        <h3 class="text-lg font-semibold text-white mb-4">Historia ya Trades (Recent Activity)</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left font-mono text-sm">
                                <thead>
                                    <tr class="border-b border-gray-800 text-gray-400">
                                        <th class="pb-3">Muda</th>
                                        <th class="pb-3">Pair</th>
                                        <th class="pb-3">Aina</th>
                                        <th class="pb-3">Kiasi (Lots)</th>
                                        <th class="pb-3">Matokeo</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-800/50">
                                    <tr>
                                        <td class="py-3 text-gray-500">Leo, 14:20</td>
                                        <td class="py-3 font-bold text-white">EUR/USD</td>
                                        <td class="py-3 text-green-500">BUY</td>
                                        <td class="py-3">0.50</td>
                                        <td class="py-3 text-green-400 font-bold">+$75.00</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3 text-gray-500">Leo, 11:05</td>
                                        <td class="py-3 font-bold text-white">GBP/USD</td>
                                        <td class="py-3 text-red-500">SELL</td>
                                        <td class="py-3">1.00</td>
                                        <td class="py-3 text-red-400 font-bold">-$32.10</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3 text-gray-500">Jana, 18:45</td>
                                        <td class="py-3 font-bold text-white">USD/JPY</td>
                                        <td class="py-3 text-green-500">BUY</td>
                                        <td class="py-3">0.20</td>
                                        <td class="py-3 text-green-400 font-bold">+$114.50</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3 text-gray-500">Jana, 09:15</td>
                                        <td class="py-3 font-bold text-white">XAU/USD</td>
                                        <td class="py-3 text-green-500">BUY</td>
                                        <td class="py-3">0.10</td>
                                        <td class="py-3 text-green-400 font-bold">+$45.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Upande wa Kulia: Live Market News (Inachukua nafasi 1/3) -->
                    <div class="p-6 rounded-lg card-bg border border-gray-800 flex flex-col justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4">Habari za Masoko (Live News)</h3>
                            <div class="space-y-4">
                                <div class="border-l-2 border-[#00ff66] pl-3">
                                    <h4 class="text-sm font-bold text-white hover:text-[#00ff66] cursor-pointer">Fed kuamua kuhusu riba wiki hii...</h4>
