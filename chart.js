<!-- ========================================== -->
<!-- CHART CONTAINER AND LOCAL CHART SCRIPT     -->
<!-- ========================================== -->

<!-- The div element where the live chart will be rendered -->
<div id="chart-container" style="width: 100%; height: 400px; margin-top: 20px; border-radius: 8px; overflow: hidden; position: relative; z-index: 999;"></div>

<!-- Loading the chart library locally from your project -->
<script src="chart.js"></script>


<!-- ========================================== -->
<!-- WEBSOCKET INTEGRATION FOR DERIV LIVE DATA  -->
<!-- ========================================== -->
<script>
    // 1. Initialize and configure the chart appearance
    const chartContainer = document.getElementById('chart-container');
    const chart = LightweightCharts.createChart(chartContainer, {
        layout: { 
            backgroundColor: '#131722', 
            textColor: '#d1d4dc'        
        },
        grid: { 
            vertLines: { color: '#2b2b43' }, 
            horzLines: { color: '#2b2b43' } 
        },
        timeScale: { 
            timeVisible: true, 
            secondsVisible: true 
        }
    });

    // Create the line series for price data tracking
    const lineSeries = chart.addLineSeries({ 
        color: '#26a69a', 
        lineWidth: 2 
    });

    // 2. Establish connection to Deriv WebSocket API
    const APP_ID = '1089'; 
    const ws = new WebSocket(`wss://://derivws.com{APP_ID}`);

    ws.onopen = function() {
        console.log("WebSocket connection established successfully.");
        const request = {
            ticks: '1HZ10V', 
            subscribe: 1     
        };
        ws.send(JSON.stringify(request));
    };

    ws.onmessage = function(msg) {
        const data = JSON.parse(msg.data);
        if (data.tick) {
            const price = data.tick.quote; 
            const time = data.tick.epoch;   

            lineSeries.update({
                time: time,
                value: price
            });
        }
    };

    ws.onerror = function(error) {
        console.error("Deriv WebSocket Error details:", error);
    };

    ws.onclose = function() {
        console.log("WebSocket stream closed. Attempting reconnect protocol in 5 seconds...");
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    };
</script>
