console.log(Blockly.Python);
let blockType = "Duration";
let selectedSymbol = null;
let chart = null;
let series = null;
// 🌐 Global chart state variables
//let chartMode = 'line'; // default to line chart before any button click
//let lineSeries, candleSeries;

let pendingFullData = null;       // ← for full candle history
let pendingLiveUpdate = null;     // ← for live candle updates
let liveCandle = null;
let currentCandleEpoch = null;
//const candleInterval = 60; // seconds for 1-minute candles
let candleInterval = 60; // default to 1m
let chartMode = 'candle'; // Default mode is candlestick

/*
function setCandleIntervalFromUI(tf) {
    const map = {
        "1m": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "4h": 14400,
        "8h": 28800,
        "12h": 43200,
        "1d": 86400,
    };

    if (tf === 'tick') {
        candleInterval = null;         // No granularity needed
        chartMode = 'tick';            // New mode flag
        console.log("⏱️ Tick mode selected — using raw tick stream.");
    } else {
        candleInterval = map[tf] || 60;
        chartMode = 'candle';
        console.log("⏱️ Candle interval set to", candleInterval, "seconds");
    }
}
*/
function setCandleIntervalFromUI(tf) {
    const map = {
        "1m": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "4h": 14400,
        "8h": 28800,
        "12h": 43200,
        "1d": 86400,
    };

    if (tf === 'tick') {

        candleInterval = null;         // No granularity needed
        chartMode = 'tick';            // New mode flag

        window.candleInterval = null;
        window.chartMode = 'tick';

        localStorage.setItem('chartMode', 'tick');
        localStorage.removeItem('candleInterval');

        console.log("⏱️ Tick mode selected.");
    } else {
        const interval = map[tf] || 60;

        candleInterval = map[tf] || 60;
        chartMode = 'candle';

        window.candleInterval = interval;
        window.chartMode = 'candle';

        localStorage.setItem('chartMode', 'candle');
        localStorage.setItem('candleInterval', interval.toString());

        console.log(`⏱️ Candle interval set to ${interval} seconds`);
    }
}

/*
function setCandleIntervalFromUI(tf) {
    const map = {
        "1m": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "4h": 14400,
        "8h": 28800,
        "12h": 43200,
        "1d": 86400,
    };
    candleInterval = map[tf] || 60; // fallback to 1m if unknown
    console.log("⏱️ Candle interval set to", candleInterval, "seconds");
}
*/
// ✅ Safely access WebSocket data to prevent errors
console.log("💰 Current Balance:", window.WS_DATA?.balance ?? "Not Available");
console.log("📜 Active Symbols:", window.WS_DATA?.activeSymbols ?? "Not Available");
console.log("📊 Asset Index:", window.WS_DATA?.assetIndex ?? "Not Available");
console.log("📜 Contract Data:", window.WS_DATA?.contractData ?? "Not Available");
console.log("🛒 Buy Response:", window.WS_DATA?.buyResponse ?? "Not Available");
console.log("📑 Open Contract:", window.WS_DATA?.openContract ?? "Not Available");
const currentAccount = window.WS_DATA?.currentAccount;

if (currentAccount) {
    console.log("👤 Current Account Type in botbuilder.js:", currentAccount);
} else {
    console.log("⚠️ Account type not yet set.");
}

window.addEventListener("accountTypeUpdated", (e) => {
    const accountType = e.detail;
    console.log("🔔 Account type updated in botbuilder.js:", accountType);

    // You can now use accountType as needed
});
/*
window.addEventListener("fullCandleHistory", function (event) {
    if (series) {
        console.log("📊 Setting full candle history...");
        series.setData(event.detail);  // Set full data
    } else {
        console.warn("⛔ Chart series not initialized yet.");
    }
});*/
/*
window.addEventListener("liveCandleUpdate", function (event) {
    if (series) {
        console.log("📈 Updating with new candle...");
        series.update(event.detail);  // Update live candle
    } else {
        console.warn("⛔ Chart series not initialized yet.");
    }
});
*/
/*
// ✅ Then in WebSocket or live update listener
window.addEventListener('liveCandleUpdate', (event) => {
    const c = event.detail;

    // Update series with new candle data
    series.update({
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
    });
});*/

window.addEventListener("fullCandleHist", function (event) {
    if (series) {
        console.log("📊 Setting full candle history...");
        console.log("🧪 Data:", event.detail);  // ✅ log the data
        series.setData(event.detail);
    } else {
        console.warn("⛔ Chart series not initialized yet. Stashing history...");
        pendingFullData = event.detail;
    }
});

window.addEventListener("fullCandleHistory", function (event) {
    if (series) {
        console.log("📊 Setting full candle history...");
        console.log("🧪 Data:", event.detail);  // ✅ log the data
        series.setData(event.detail);
    } else {
        console.warn("⛔ Chart series not initialized yet. Stashing history...");
        pendingFullData = event.detail;
    }
});
/*
window.addEventListener("tickDataUpdated", function (event) {
    const tick = event.detail.quote;
    const tickEpoch = parseInt(event.detail.echo_req?.subscribe === 1 ? event.detail.tick.epoch : Date.now() / 1000);
    const tickPrice = parseFloat(tick);

    if (!tickPrice || !window.WS_DATA.series) return;

    const chartType = window.WS_DATA.chartType;  // store this when creating chart
    const series = window.WS_DATA.series;

    const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

    if (chartType === 'candlestick') {
        if (!liveCandle || currentCandleEpoch !== bucketTime) {
            liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice
            };
            currentCandleEpoch = bucketTime;
            series.update(liveCandle);
        } else {
            liveCandle.high = Math.max(liveCandle.high, tickPrice);
            liveCandle.low = Math.min(liveCandle.low, tickPrice);
            liveCandle.close = tickPrice;
            series.update(liveCandle);
        }

        //series.update(liveCandle);
    } else {
        // ✅ Area/Line chart update
        series.update({ time: tickEpoch, value: tickPrice });
    }

    // ✅ Live floating price label
    const label = document.getElementById("livePriceLabel");
    if (label) {
        label.textContent = tickPrice.toFixed(2);
    }
});
tako4*/
/*
window.addEventListener("tickDataUpdated", function (event) {
    const series = window.WS_DATA?.series;
    if (!series) {
        console.warn("⚠️ No chart series found.");
        return;
    }

    // Get chart settingschart
    const chartMode = window.chartMode || localStorage.getItem("chartMode") || "tick";
    candleInterval = window.candleInterval || candleInterval;
    if (!candleInterval && chartMode === "candle") {
        candleInterval = parseInt(localStorage.getItem("candleInterval")) || 60;
    }

    // Safely extract tick price and epoch
    let tickPrice = null;
    let tickEpoch = null;

    if (event?.detail?.tick) {
        tickPrice = parseFloat(event.detail.tick.quote || event.detail.tick.ask || event.detail.quote);
        tickEpoch = parseInt(event.detail.tick.epoch);
    } else {
        tickPrice = parseFloat(event?.detail?.quote || event?.detail?.ask);
        tickEpoch = parseInt(event?.detail?.epoch);
    }

    if (isNaN(tickPrice) || isNaN(tickEpoch)) {
        console.warn("❌ Invalid tick data received:", event.detail);
        return;
    }

    console.log("🕒 Chart Mode:", chartMode);
    console.log("⏱️ Candle Interval:", candleInterval);
    console.log("🧮 Tick Epoch:", tickEpoch);

    if (chartMode === "candle" && candleInterval) {
        const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

        if (!window.liveCandle || window.currentCandleEpoch !== bucketTime) {
            // Start new candle
            window.liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice,
            };
            window.currentCandleEpoch = bucketTime;
            console.log("🆕 New Candle Started:", window.liveCandle);
        } else {
            // Update existing candle
            window.liveCandle.high = Math.max(window.liveCandle.high, tickPrice);
            window.liveCandle.low = Math.min(window.liveCandle.low, tickPrice);
            window.liveCandle.close = tickPrice;
            console.log("🔁 Candle Updated:", window.liveCandle);
        }

        series.update(window.liveCandle);
    } else {
        // Tick or line chart mode
        const liveTick = {
            time: tickEpoch,
            value: tickPrice,
        };
        console.log("📈 Updating Tick Series with:", liveTick);
        series.update(liveTick);
    }

    // Update live price label if it exists
    const label = document.getElementById("livePriceLabel");
    if (label) label.textContent = tickPrice.toFixed(2);
});
tako3*/
/*
window.addEventListener("tickDataUpdated", function (event) {
    const tick = event.detail.quote;
    const tickEpoch = parseInt(event.detail.echo_req?.subscribe === 1 ? event.detail.tick.epoch : Date.now() / 1000);
    const tickPrice = parseFloat(tick);

    if (!tickPrice || !window.WS_DATA.series) return;

    const chartType = window.WS_DATA.chartType;  // store this when creating chart
    const series = window.WS_DATA.series;

    const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

    if (chartType === 'candlestick') {
        if (!liveCandle || currentCandleEpoch !== bucketTime) {
            liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice
            };
            currentCandleEpoch = bucketTime;
            series.update(liveCandle);
        } else {
            liveCandle.high = Math.max(liveCandle.high, tickPrice);
            liveCandle.low = Math.min(liveCandle.low, tickPrice);
            liveCandle.close = tickPrice;
            series.update(liveCandle);
        }

        //series.update(liveCandle);
    } else {
        // ✅ Area/Line chart update
        series.update({ time: tickEpoch, value: tickPrice });
    }

    // ✅ Live floating price label
    const label = document.getElementById("livePriceLabel");
    if (label) {
        label.textContent = tickPrice.toFixed(2);
    }
});
tako*/
/*
window.addEventListener("tickDataUpdated", function (event) {
    const tick = event.detail.quote;
    const tickEpoch = parseInt(event.detail.echo_req?.subscribe === 1 ? event.detail.tick.epoch : Date.now() / 1000);
    const tickPrice = parseFloat(tick);

    if (!tickPrice || !series) return;

    // Round the timestamp to nearest lower candle time (bucket it)
    const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

    if (!liveCandle || currentCandleEpoch !== bucketTime) {
        // New candle begins
        liveCandle = {
            time: bucketTime,
            open: tickPrice,
            high: tickPrice,
            low: tickPrice,
            close: tickPrice
        };
        currentCandleEpoch = bucketTime;
    } else {
        // Update the current candle
        liveCandle.high = Math.max(liveCandle.high, tickPrice);
        liveCandle.low = Math.min(liveCandle.low, tickPrice);
        liveCandle.close = tickPrice;
    }

    // Update chart candle
    series.update(liveCandle);

    // Update the floating price label
    const label = document.getElementById("livePriceLabel");
    if (label) {
        label.textContent = tickPrice.toFixed(2);
    }
});*/

/*
window.addEventListener("tickDataUpdated", function (event) {
    const tick = event.detail.quote;
    const tickEpoch = parseInt(event.detail.echo_req?.subscribe === 1 ? event.detail.tick.epoch : Date.now() / 1000);
    const tickPrice = parseFloat(tick);

    if (!tickPrice || !series) return;

    // Round the timestamp to nearest lower candle time (bucket it)
    const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

    if (!liveCandle || currentCandleEpoch !== bucketTime) {
        // New candle begins
        liveCandle = {
            time: bucketTime,
            open: tickPrice,
            high: tickPrice,
            low: tickPrice,
            close: tickPrice
        };
        currentCandleEpoch = bucketTime;
    } else {
        // Update the current candle
        liveCandle.high = Math.max(liveCandle.high, tickPrice);
        liveCandle.low = Math.min(liveCandle.low, tickPrice);
        liveCandle.close = tickPrice;
    }

    // Update chart candle
    series.update(liveCandle);

    // Update the floating price label
    const label = document.getElementById("livePriceLabel");
    if (label) {
        label.textContent = tickPrice.toFixed(2);
    }
});

*/
/*
window.addEventListener("liveCandleUpdate", (event) => {
    const c = event.detail;
    console.log("📥 Live update received:", c); // ✅ log the data

    if (series) {
        series.update({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        });
    } else {
        console.warn("⛔ Chart series not initialized yet. Stashing live candle...");
        pendingLiveUpdate = c;
    }
});
*/
window.addEventListener("proposalUpdateReceived", function (event) {
    const proposalData = event.detail;

    console.log("📬📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊📊 Received proposal update in botbuilder.js:", proposalData);

    // ✅ Do whatever you want with proposalData here
    // Example:
    //updateProposalUI(proposalData);
    console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅ Proposal data:", window.WS_DATA.proposalUpdate);
});

// ✅ Listen for WebSocket updates
window.addEventListener("balanceUpdated", function (event) {
    console.log("💰 Updated Balance:", event.detail);
    //updateBalanceUI(event.detail);  // Example function to update UI
});

window.addEventListener("activeSymbolsUpdated", function (event) {
    console.log("📜 Updated Active Symbols:", event.detail);
    //populateActiveSymbols(event.detail);
    if (window.WS_DATA.activeSymbols && window.WS_DATA.assetIndex) {
        console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
        console.log("ACTIVE_SYMBOLS:", window.WS_DATA.activeSymbols);
        console.log("ASSET_INDEX:", window.WS_DATA.assetIndex);
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        waitForBlockType();
        //console.log("🚀 Calling populateDropdowns now!");
        /*populateTradeTypeDropdowns(selectedSymbol, window.WS_DATA.assetIndex);
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        manageDynamicBlock(blockType);
        populateBlockDropdowns(window.WS_DATA.contractData);*/

    } else {
        console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
    }
});

window.addEventListener("assetIndexUpdated", function (event) {
    console.log("📊 Updated Asset Index:", event.detail);
    //populateAssetDropdown(event.detail);
    //populateActiveSymbols(event.detail);
    if (window.WS_DATA.activeSymbols && window.WS_DATA.assetIndex) {
        console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
        console.log("ACTIVE_SYMBOLS:", window.WS_DATA.activeSymbols);
        console.log("ASSET_INDEX:", window.WS_DATA.assetIndex);
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        waitForBlockType();
        //console.log("🚀 Calling populateDropdowns now!");
        /*populateTradeTypeDropdowns(selectedSymbol, window.WS_DATA.assetIndex);
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        manageDynamicBlock(blockType);
        populateBlockDropdowns(window.WS_DATA.contractData);*/
    } else {
        console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
    }
});

window.addEventListener("contractDataUpdated", function (event) {
    console.log("📜 Updated Contracts Data:", event.detail);
    //handleContracts(event.detail);  // Call the function that needs contract data
    if (window.WS_DATA.activeSymbols && window.WS_DATA.assetIndex && window.WS_DATA.contractData) {
        console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
        console.log("ACTIVE_SYMBOLS:", window.WS_DATA.activeSymbols);
        console.log("ASSET_INDEX:", window.WS_DATA.assetIndex);
        console.log("📜 Contracts Data:", window.WS_DATA.contractData);
        //console.log("🚀 Calling populateDropdowns now!");
        //waitForSymbolAndAssetIndex(); // this new one
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        waitForBlockType();

        /*populateTradeTypeDropdowns(selectedSymbol, window.WS_DATA.assetIndex);
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        manageDynamicBlock(blockType);
        populateBlockDropdowns(window.WS_DATA.contractData);*/

        //populateDropdowns(window.WS_DATA.contractData);
        //populateTradeTypeDropdowns(selectedSymbol, window.WS_DATA.assetIndex);
        //(blockType);
        //populateBlockDropdowns(blockType);
        //populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
    } else {
        console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX & Contracts Data...");
    }
});

//window.addEventListener("tickDataUpdated", function (event) {
    //console.log("📜 Updated tick Data:", event.detail);
    //handleContracts(event.detail);  // Call the function that needs contract data
    /*if (window.WS_DATA.tickData) {
        console.log("🔍 Checking if tick Data are ready...");
        console.log("tick_Data:", window.WS_DATA.tickData);
        //populateDropdowns(window.WS_DATA.contractData);
        //populateBlockDropdowns(window.WS_DATA.contractData);
    } else {
        console.log("⏳ Waiting for tick Data...");
    }*/
//});

window.addEventListener("buyResponseUpdated", function (event) {
    console.log("🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒 Updated Buy Response:", event.detail);
    // You can trigger any function here based on new buy data

    // 🔥 Call the Byr() function immediately
    Byr(event.detail);
});

window.addEventListener("openContractUpdated", function (event) {
    console.log("📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑v Updated Open Contract:", event.detail);
    // Do something useful here too

    // 🔥 Call the Opc function
    Opc(event.detail);
});

window.addEventListener("botStarted", function (event) {
    console.log("🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 Bot status message received:", event.detail);
    // Do whatever you want now (e.g. show spinner, activate strategy blocks, etc.)

    // 🔥 Call your function
    Bis();
});

window.addEventListener("balanceUpdated", function (event) {
    console.log("💰 Updated Balance:", event.detail);

    const balance = window.WS_DATA?.balance;

    if (balance) {
        console.log("💼 Current Stored Balance:", balance);

        if (balance > 1000) {
            console.log("🟢 Balance is above $1,000 ✅");
        } else {
            console.log("🟡 Balance is below $1,000 ⚠️");
        }
    } else {
        console.log("⏳ Waiting for balance data...");
    }
});

// Add an event listener for the login button click
/*document.getElementById("loginButton").addEventListener("click", function () {
    // Redirect to the Deriv OAuth URL
    const derivOAuthUrl = "https://oauth.deriv.com/oauth2/authorize?app_id=61801&l=EN&signup_device=desktop&redirect_uri=http://127.0.0.1:8001/";
    window.location.href = derivOAuthUrl;
});*/
/*  mildred
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runButton');

    const currentAccount = window.WS_DATA?.currentAccount;

    if (currentAccount) {
        console.log("👤 Current Account Type (inside runButton):", currentAccount);
    } else {
        console.warn("⚠️ Account type not set yet when Run button was clicked.");
    }

    runButton.addEventListener('click', () => {
        const icon = runButton.querySelector(".run-icon");
        const text = runButton.querySelector(".run-text");

        const stopIcon = runButton.getAttribute("data-stop-icon");
        const playIcon = runButton.getAttribute("data-play-icon");

        const isCurrentlyRunning = icon.src.includes("stop.svg") || text.textContent.trim().toLowerCase() === "stop";

        if (isCurrentlyRunning) {
            // ✅ It's already running. Stop it and reset UI.
            if (icon && playIcon) icon.src = playIcon;
            if (text) text.textContent = "Run";
            runButton.style.backgroundColor = ""; // remove red
            console.log("🔁 Switched to Play mode");

            // Send Stop signal to backend
            sendStopSignalToBackend();  // <-- New method to send stop message
        } else {
            // ✅ If we're in Run mode (clicked to start the bot)
            try {
                const workspace = Blockly.getMainWorkspace();
                const workspaceXml = Blockly.Xml.workspaceToDom(workspace);
                const xmlText = Blockly.Xml.domToText(workspaceXml);
                console.log('Extracted Workspace XML:', xmlText);

                const pythonCode = Blockly.Python.workspaceToCode(workspace);
                console.log('Generated Python Code:', pythonCode);

                // Send Python code to backend
                sendPythonCodeToBackend(pythonCode);

                // Switch button to Stop mode
                if (icon && stopIcon) icon.src = stopIcon;
                if (text) text.textContent = "Stop";
                runButton.style.backgroundColor = "rgba(255, 82, 95, 1)"; //"rgba(255, 0, 0, 0.2)"; // strong red
                console.log("🚦 Bot started, switched to Stop button");
            } catch (error) {
                console.error('❌ Error extracting Blockly workspace XML:', error);
            }
        }
    });
});
*/
/*
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runButton');

    setTimeout(() => {
        const workspace = Blockly.getMainWorkspace();

        if (!workspace) {
            console.error('Blockly workspace is not initialized.');
            alert('Error: Blockly workspace not available.');
            return;
        }

        console.log('Workspace initialized:', workspace);

        runButton.addEventListener('click', () => {
            const icon = runButton.querySelector(".run-icon");
            const text = runButton.querySelector(".run-text");

            const stopIcon = runButton.getAttribute("data-stop-icon");
            const playIcon = runButton.getAttribute("data-play-icon");

            const isCurrentlyRunning = icon.src.includes("stop.svg") || text.textContent.trim().toLowerCase() === "stop";

            if (isCurrentlyRunning) {
                // ✅ It's already running. Stop it and reset UI.
                if (icon && playIcon) icon.src = playIcon;
                if (text) text.textContent = "Run";
                runButton.style.backgroundColor = ""; // remove red
                console.log("🔁 Switched to Play mode");
                // Send Stop signal to backend
                sendStopSignalToBackend();  // <-- New method to send stop message
                return;
            }

            // ✅ If we're in Run mode (clicked to start the bot)
            try {
                const workspaceXml = Blockly.Xml.workspaceToDom(workspace);
                const xmlText = Blockly.Xml.domToText(workspaceXml);
                console.log('Extracted Workspace XML:', xmlText);

                const pythonCode = Blockly.Python.workspaceToCode(workspace);
                console.log('Generated Python Code:', pythonCode);

                // Send code to backend
                sendPythonCodeToBackend(pythonCode);

                // Switch button to Stop mode
                if (icon && stopIcon) icon.src = stopIcon;
                if (text) text.textContent = "Stop";
                runButton.style.backgroundColor = "rgba(255, 0, 0, 0.2)"; // strong red
                console.log("🚦 Bot started, switched to Stop button");
            } catch (error) {
                console.error('❌ Error extracting Blockly workspace XML:', error);
            }
        });
    }, 500);
});
*/
// Send Stop signal to backend
function sendStopSignalToBackend() {
    const stopMessage = {
        event: "stop_bot",
        message: "Stop the bot",
    };

    // Use the existing WebSocket send function to send the stop message
    window.sendWebSocketMessage(stopMessage);
}

/*
// Ensure Blockly is initialized before adding the run button listener
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runButton');

    setTimeout(() => {
        const workspace = Blockly.getMainWorkspace();

        if (!workspace) {
            console.error('Blockly workspace is not initialized.');
            alert('Error: Blockly workspace not available.');
            return;
        }

        console.log('Workspace initialized:', workspace);
        runButton.addEventListener('click', () => {
            try {
                const workspaceXml = Blockly.Xml.workspaceToDom(workspace);
                const xmlText = Blockly.Xml.domToText(workspaceXml);
                console.log('Extracted Workspace XML:', xmlText);

                // Generate Python code
                const pythonCode = Blockly.Python.workspaceToCode(workspace);
                console.log('Generated Python Code:', pythonCode);

                // Send Python code to backend
                sendPythonCodeToBackend(pythonCode);
            } catch (error) {
                console.error('Error extracting Blockly workspace XML:', error);
            }
        });
    }, 500);
});
*/
document.addEventListener("DOMContentLoaded", function () {
    const fullscreenButton = document.getElementById("fullscreenToggle");

    if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function () {
            if (!document.fullscreenElement) {
                // Enter fullscreen mode
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                // Exit fullscreen mode
                document.exitFullscreen();
            }
        });
    } else {
        console.error("Fullscreen button not found.");
    }
});

function Bis() {
    const statusDiv = document.querySelector(".status-text");

    if (statusDiv) {
        // Update status text
        statusDiv.textContent = "Bot is starting";
        console.log("✅ Updated status text to: Bot is starting");

        // Animate dots
        const dots = document.querySelectorAll(".dot");
        dots.forEach(dot => dot.classList.remove("animate"));
        void document.body.offsetWidth;
        dots.forEach(dot => dot.classList.add("animate"));
        setTimeout(() => {
            dots.forEach(dot => dot.classList.remove("animate"));
        }, 1600);

        // Update Run button to Stop
        const runButton = document.getElementById("runButton");
        if (runButton) {
            const icon = runButton.querySelector(".run-icon");
            const text = runButton.querySelector(".run-text");

            const stopIcon = runButton.getAttribute("data-stop-icon");

            if (icon && stopIcon) {
                icon.src = stopIcon; // ✅ Set the correct stop icon from HTML
            }

            if (text) {
                text.textContent = "Stop";
            }

            // ✅ Make the button background red with RGBA (strong red)
            runButton.style.backgroundColor = "rgba(255, 0, 0, 0.85)";

            console.log("✅ Changed Run button to Stop and turned it red");

        } else {
            console.warn("⚠️ #runButton not found");
        }
    } else {
        console.warn("⚠️ .status-text not found");
    }
}

function Byr(buyr) {
    const statusDiv = document.querySelector(".status-text");
    const progressBar = document.querySelector("#progress-bar");

    if (!statusDiv) {
        console.warn("⚠️ .status-text element not found!");
        return;
    }

    statusDiv.textContent = "Buying contract";
    console.log("🛒 Updated status text to: Buying contract...");

    const centerDot = document.querySelector(".center-dot");
    const rightDot = document.querySelector(".right-dot");

    const pulseDot = (dot, colorClass) => {
        if (dot) {
            dot.classList.remove("red", "green");
            void dot.offsetWidth;
            dot.classList.add(colorClass);

            setTimeout(() => {
                dot.classList.remove(colorClass);
            }, 900);
        }
    };

    pulseDot(centerDot, "green");
    pulseDot(rightDot, "red");

    if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";

        setTimeout(() => {
            progressBar.style.transition = "width 0.2s linear";
        }, 50);
    }

    const jnc = document.querySelector(".jonco");
    if (jnc) {
        jnc.style.display = "flex";
        jnc.style.flexDirection = "column";
        jnc.style.alignItems = "stretch";
        //jnc.style.border = "1px solid red";
        jnc.style.width = "100%"; // 👈 ensures .jonco fills its container
        jnc.style.boxSizing = "border-box";
    }

    const boxContainer = document.querySelector(".box-container");
    if (boxContainer) {
        boxContainer.style.display = "flex";
        boxContainer.style.flexDirection = "column";
        boxContainer.style.alignItems = "stretch";
        boxContainer.style.width = "100%"; // 👈 fill its parent (.jonco)
        boxContainer.style.height = "100%"; // 👈 fill its parent (.jonco)
        //boxContainer.style.border = "1px solid blue";
        boxContainer.style.boxSizing = "border-box"; // 👈 avoids unexpected width shrink
    }
    //const boxContainer = document.querySelector(".box-container");
    if (!boxContainer) {
        console.error("❌ .boxContainer element not found!");
        return;
    }

    console.log("✅ Contract bought! Proceeding to update .boxContainer UI...");

    const hSC = boxContainer.querySelector("img") || boxContainer.querySelector(".no-messages");
    if (hSC) {
        boxContainer.innerHTML = "";
        //boxContainer.dataset.lineCount = "0";
        console.log("🧹 Cleared static boxContainer content");
    }

    const jolDiv = document.createElement("div");
    jolDiv.className = "jol";
    Object.assign(jolDiv.style, {
        position: "relative",
        width: "100%",
        //border: "1px solid red",
        backgroundColor: "white",
        textAlign: "left",
        borderRadius: "1px",
        paddingLeft: "2vh",
        paddingRight: "2vh",
        boxSizing: "border-box", // 🛑 very important to include padding within width
    });

    // Extract data safely
    const cid = buyr?.buy?.contract_id || "(No contract_id)";
    const p_t = buyr?.buy?.purchase_time;
    const longCode = buyr?.buy?.longcode || "(No code)";

    // Convert purchase_time to human-readable UTC string
    let formattedTime = "(No purchase_time)";
    if (p_t) {
        const date = new Date(p_t * 1000); // convert seconds to ms
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        formattedTime = `${year}-${month}-${day} | ${hours}:${minutes}:${seconds} GMT`;
   }

    jolDiv.innerHTML = `
        <div style="margin-bottom: 10px; margin-top: 10px;">
            <span style="color: rgba(0, 0, 255, 0.7); font-size: 126upx;">Bought:</span>
            <span style="color: rgba(0, 0, 0, 0.7); font-size: 12px;">${longCode} (ID: ${cid})</span>
        </div>
        <div style="font-size: 11px; color: rgba(128, 128, 128, 0.6); margin-bottom: 10px;">${formattedTime}</div>
    `;
    //0.85em
    if (boxContainer.firstChild) {
        boxContainer.insertBefore(jolDiv, boxContainer.firstChild);
    } else {
        boxContainer.appendChild(jolDiv);
    }

    const amount = parseFloat(window?.WS_DATA?.proposalUpdate?.echo_req?.amount) || 0;
    const contract_type = window?.WS_DATA?.proposalUpdate?.echo_req?.contract_type;
    const currency = window?.WS_DATA?.proposalUpdate?.echo_req?.currency;
    const contract = buyr?.buy || {};

    const boxDiv = document.querySelector(".box");
    if (!boxDiv) {
        console.error("❌ .box element not found!");
        return;
    }

    if (boxDiv) {
        Object.assign(boxDiv.style, {
            //border: "1px solid blue",
            "padding-top": "0vw"
        });
    }

    console.log("✅ Contract bought! Proceeding to update .box UI...");

    const hasStaticContent = boxDiv.querySelector("img") || boxDiv.querySelector(".box-title");
    if (hasStaticContent) {
        boxDiv.innerHTML = "";
        //boxDiv.dataset.lineCount = "0";
        console.log("🧹 Cleared static box content");
    }

    const lineCount = parseInt(boxDiv.dataset.lineCount || "0", 10);
    const newLineNumber = lineCount + 1;

    const container = document.createElement("div");
    container.classList.add("hover-gray"); // 👈 Add the class
    Object.assign(container.style, {
        position: "relative",
        width: "100%",
        //height: "5vw",
        //padding: "px",
        //marginBottom: "5px",
        marginTop: "0px", // or "0" if you want no margin at the top
        //border: "1px solid red",
        //borderBottom: "0.5px solid gray",
        marginBottom: "1.5px", // 👈 adds vertical space below this div
        backgroundColor: "white",
        paddingTop: "10px",   // ✅ space from top border
        paddingBottom: "10px", // ✅ space from bottom border
        borderTop: "1px solid rgba(200, 200, 200, 0.4)", // Light gray top border
    });
/*
    container.innerHTML = `
        <div style="margin-left: 10vh; font-size: 10px; display: flex; flex-direction: column; align-items: flex-end; min-width: 8vh;">
            <!-- Entry / Exit column with same vertical height structure -->
            <div style="height: 20px;"></div> <!-- placeholder to align with amount -->
            <div class="entry-spot" style="width: 6vh; height: 2vh; background: lightgray; border-radius: 1px;"></div>
            <div class="exit-spot" style="margin-top: 4px; width: 100%; height: 10px; background: lightgray; border-radius: 1px;"></div>
        </div>

        <div style="margin-left: 10vh; font-size: 10px; display: flex; flex-direction: column; align-items: flex-end; min-width: 8vh;">
            <div style="color: rgba(0, 0, 0, 0.5); font-size: 10px; font-weight: 750; text-align: right;" class="amount">${amount.toFixed(2)} ${currency}</div>
            <div class="profit" style="margin-top: 4px; width: 100%; height: 10px; background: lightgray; border-radius: 1px;"></div>
        </div>
    `;
    */ // align-items: flex-start;
    container.innerHTML = `
        <div style="display: flex; width: 100%; justify-content: flex-start;">
            <div style="margin-left: 2vh; font-size: 11px; display: flex; flex-direction: column; align-items: center;">
                <div>${contract_type} #${newLineNumber}</div>
            </div>
            <div style="margin-left: 10vh; font-size: 10px; display: flex; flex-direction: column; align-items: center; color: rgba(0, 0, 0, 0.5); font-weight: 750;">
                <div class="entry-spot" style="width: 6vh; height: 2vh; background: lightgray; border-radius: 1px;"></div>
                <div class="exit-spot" style="margin-top: 4px; width: 100%; height: 10px; background: lightgray; border-radius: 1px;"></div>
            </div>
            <div style="margin-left: 10vh; font-size: 11px; display: flex; flex-direction: column; align-items: center;">
                <div style="color: rgba(0, 0, 0, 0.5); font-size: 10px; font-weight: 750;" class="amount">${amount.toFixed(2)} ${currency}</div>
                <div class="profit" style="margin-top: 4px; width: 100%; height: 10px; background: lightgray; border-radius: 1px;"></div>
            </div>
        </div>
    `;

    if (boxDiv.firstChild) {
        boxDiv.insertBefore(container, boxDiv.firstChild);
    } else {
        boxDiv.appendChild(container);
    }

    boxDiv.scrollTop = 0;
    //boxDiv.dataset.lineCount = newLineNumber.toString();
}


let countdownInterval = null;
let lastCountdownValue = null;
let totalDuration = null;

function formatTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const timeStr = [hrs, mins, secs].map(unit => String(unit).padStart(2, "0")).join(":");
    return days > 0 ? `${days}d ${timeStr}` : timeStr;
}

function blinkDots(dots, color) {
    dots.forEach(dot => {
        if (dot) {
            dot.classList.remove("red", "green");
            void dot.offsetWidth; // trigger reflow
            dot.classList.add(color);
            setTimeout(() => dot.classList.remove(color), 900);
        }
    });
}

function startCountdown(timerDiv, countdownFill) {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        if (lastCountdownValue === null || totalDuration === null) return;

        lastCountdownValue--;

        if (lastCountdownValue <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            if (timerDiv) timerDiv.textContent = "00:00:00";
            if (countdownFill) countdownFill.style.width = "0%";
            return;
        }

        if (timerDiv) timerDiv.textContent = formatTime(lastCountdownValue);
        if (countdownFill) countdownFill.style.width = `${(lastCountdownValue / totalDuration) * 100}%`;
    }, 1000);
}

function Opc(data) {
    const statusDiv = document.querySelector(".status-text");
    const progressBar = document.querySelector("#progress-bar");
    const centerDot = document.querySelector(".center-dot");
    const rightDot = document.querySelector(".right-dot");
    const bpDiv = document.querySelector(".bp");
    const bpd = document.querySelector(".bpd");
    const boxDiv = document.querySelector(".box"); // <--- the box you mentioned

    if (!statusDiv || !bpDiv || !bpd) return;

    const contract = data?.proposal_open_contract;
    if (!contract) return;

    const {
        is_sold,
        tick_stream = [],
        profit = 0,
        entry_spot = 0,
        exit_tick = 0,
        display_name,
        contract_type,
        expiry_time,
        purchase_time,
        current_spot_time,
        is_valid_to_sell,
        payout = 0,
        status,
        currency,
        contract_id, // ✅ Add this line
    } = contract;

    const amount = parseFloat(window?.WS_DATA?.proposalUpdate?.echo_req?.amount) || 0;
    const totalPayout = amount + profit;


    if (is_sold === 1) {

        const boxContainer = document.querySelector(".box-container");

        const jnc = document.querySelector(".jonco");
        if (jnc) {
            jnc.style.display = "flex";
            jnc.style.flexDirection = "column";
            jnc.style.alignItems = "stretch";
            //jnc.style.border = "1px solid red";
            jnc.style.width = "100%"; // 👈 ensures .jonco fills its container
            jnc.style.boxSizing = "border-box";
        }

        //const boxContainer = document.querySelector(".box-container");
        if (boxContainer) {
            boxContainer.style.display = "flex";
            boxContainer.style.flexDirection = "column";
            boxContainer.style.alignItems = "stretch";
            boxContainer.style.width = "100%"; // 👈 fill its parent (.jonco)
            boxContainer.style.height = "100%"; // 👈 fill its parent (.jonco)
            //boxContainer.style.border = "1px solid blue";
            boxContainer.style.boxSizing = "border-box"; // 👈 avoids unexpected width shrink
        }
        if (!boxContainer) {
            console.error("❌ .boxContainer element not found!");
            return;
        }

        console.log("✅ Contract bought! Proceeding to update .boxContainer UI...");

        const hSC = boxContainer.querySelector("img") || boxContainer.querySelector(".no-messages");
        if (hSC) {
            boxContainer.innerHTML = "";
            console.log("🧹 Cleared static boxContainer content");
        }

        const plDiv = document.createElement("div");
        plDiv.className = "pl";
        Object.assign(plDiv.style, {
            position: "relative",
            width: "100%",
            //height: "5vw",
            //padding: "5px",
            //marginBottom: "5px",
            //borderBottom: "0.5px solid gray",
            borderRadius: "1px",
            backgroundColor: "rgba(128, 128, 128, 0.15)",
            textAlign: "left",
            //border: "1px solid black",
            paddingLeft: "2vh",
        });

        // Convert purchase_time to human-readable UTC string
        let formattedTime = "(No purchase_time)";
        if (expiry_time) {
            const date = new Date(expiry_time * 1000); // convert seconds to ms
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');
            formattedTime = `${year}-${month}-${day} | ${hours}:${minutes}:${seconds} GMT`;
       }
/*
       if (contract.status === "won") {
            // Set plDiv content with longCode, contract_id, and formatted time
            plDiv.innerHTML = `
                <div>Profit amount: ${profit}</div>
                <div style="font-size: 0.85em; color: gray;">${formattedTime}</div>
            `;
        }

       if (contract.status === "lost") {
            // Set plDiv content with longCode, contract_id, and formatted time
            plDiv.innerHTML = `
                <div>Loss amount: ${profit}</div>
                <div style="font-size: 0.85em; color: gray;">${formattedTime}</div>
            `;
        }
*/
        if (contract.status === "won") {
            plDiv.innerHTML = `
                <div style="font-size: 10px; color: rgba(0, 0, 0, 0.7); margin-bottom: 12px; margin-top: 10px;">
                    Profit amount:
                    <span style="color: rgba(0, 128, 0, 0.7); font-size: 10px;">${profit.toFixed(2)}</span>
                </div>
                <div style="font-size: 10px; color: rgba(128, 128, 128, 0.85); margin-bottom: 10px;">${formattedTime}</div>
            `;
        }

        if (contract.status === "lost") {
            plDiv.innerHTML = `
                <div style="font-size: 10px; color: rgba(0, 0, 0, 0.7); margin-bottom: 10px; margin-top: 10px;">
                    Loss amount:
                    <span style="color: rgba(255, 0, 0, 0.7); font-size: 10px;">${profit.toFixed(2)}</span>
                </div>
                <div style="font-size: 10px; color: rgba(128, 128, 128, 0.85); margin-bottom: 10px;">${formattedTime}</div>
            `;
        }

        if (boxContainer.firstChild) {
            boxContainer.insertBefore(plDiv, boxContainer.firstChild);
        } else {
            boxContainer.appendChild(plDiv);
        }
    }

    if (boxDiv) {
        // === ENTRY SPOT ===
        const entrySpotDiv = boxDiv.querySelector(".entry-spot");
        if (entrySpotDiv && contract.entry_spot !== undefined) {
            entrySpotDiv.style.background = "none"; // Remove gray background
            entrySpotDiv.textContent = parseFloat(contract.entry_spot).toFixed(2);
        }

        // === WHEN CONTRACT IS SOLD ===
        if (contract.is_sold === 1) {
            // === EXIT SPOT ===
            const exitSpotDiv = boxDiv.querySelector(".exit-spot");
            if (exitSpotDiv && contract.exit_tick !== undefined) {
                exitSpotDiv.style.background = "none"; // Remove gray background
                exitSpotDiv.textContent = parseFloat(contract.exit_tick).toFixed(2);
            }

            // === PROFIT ===
            /*const profitDiv = boxDiv.querySelector(".profit");
            if (profitDiv && contract.profit !== undefined) {
                profitDiv.style.background = "none"; // Remove gray background
                profitDiv.textContent = parseFloat(contract.profit).toFixed(2);
            }*/

            const profitDiv = boxDiv.querySelector(".profit");
            if (profitDiv && contract.profit !== undefined) {
                const profit = parseFloat(contract.profit);
                profitDiv.style.background = "none";
                profitDiv.style.fontSize = "10px";
                profitDiv.style.fontWeight = "750";

                if (profit < 0) {
                    profitDiv.style.color = "rgba(255, 0, 0, 0.7)";
                    profitDiv.textContent = `${profit.toFixed(2)} ${currency}`;  // Negative already has a minus sign
                } else {
                    profitDiv.style.color = "rgba(0, 128, 0, 0.8)";
                    profitDiv.textContent = `+${profit.toFixed(2)} ${currency}`; // Add + before positive values
                }
            }
/*
            const profitDiv = boxDiv.querySelector(".profit");
            if (profitDiv && contract.profit !== undefined) {
                const profit = parseFloat(contract.profit);
                profitDiv.style.background = "none";          // Remove background
                profitDiv.style.fontSize = "10px";            // Set font size
                // profitDiv.textContent = profit.toFixed(2);    // Show profit value
                profitDiv.textContent = `${profit.toFixed(2)} ${currency}`; // Show profit + currency

                // Set color based on value
                if (profit < 0) {
                    profitDiv.style.color = "rgba(255, 0, 0, 0.5)"; // Soft red
                    profitDiv.style.fontWeight = "750";            // Semi-bold style
                } else {
                    profitDiv.style.color = "rgba(0, 128, 0, 0.8)"; // Soft green
                    profitDiv.style.fontWeight = "750";            // Semi-bold style
                }
            }*/
        }
    }

    // 🧹 Reset bp panel
    bpDiv.innerHTML = "";
    Object.assign(bpDiv.style, {
        position: "relative",
        borderRadius: "2px",
        padding: "2vw",
        display: "block",
        height: "20.0vh",
        width: "20vw",
        overflowY: "auto",
        //border: "5px solid black",
        overflowX: "hidden",
        marginTop: "1.5vh" // ✅ Make it sit right at the top of its container
    });
    // <div style="font-size: 3vh; margin-bottom: 5px; color: ${flagColor};">🏁</div>

    if (is_sold === 1) {
        statusDiv.textContent = "Contract closed";
        blinkDots([centerDot, rightDot], "red");

        const flagColor = profit >= 0 ? "green" : "red";
        if (progressBar) progressBar.style.width = "100%";
        const backgroundColor = profit >= 0 ? "rgba(144, 238, 144, 0.3)" : "rgba(255, 99, 71, 0.3)";
        bpDiv.style.background = `linear-gradient(to bottom, ${backgroundColor}, white)`;
        bpDiv.style.display = "flex";
        bpDiv.style.flexDirection = "column";
        bpDiv.style.justifyContent = "center"; // vertical center
        bpDiv.style.alignItems = "center";     // horizontal center
        bpDiv.style.textAlign = "center";      // center text inside

        const profitText = profit > 0 ? `+ ${profit.toFixed(2)}` : profit.toFixed(2);

        bpDiv.innerHTML += `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <div style="font-size: 2vh; color: ${flagColor};">
                    <i class="fas fa-flag-checkered"></i>
                </div>
                <div style="font-size: 12px; font-weight: 750; color: ${flagColor};">
                    Closed
                </div>
            </div>

            <div style="font-size: 15px; font-weight: 6500; color: ${flagColor}; margin-top: 5px;">
                ${profitText}
            </div>
        `;

/*
            <div style="font-size: 12px; font-weight: bold; color: ${flagColor}; margin-top: 5px;">
                Profit: ${profit.toFixed(2)}
            </div>


        const flagColor = profit >= 0 ? "green" : "red";
        if (progressBar) progressBar.style.width = "100%";
        const backgroundColor = profit >= 0 ? "rgba(144, 238, 144, 0.3)" : "rgba(255, 99, 71, 0.3)";
        bpDiv.style.background = `linear-gradient(to bottom, ${backgroundColor}, white)`;
        //bpDiv.style.background = "linear-gradient(to bottom, rgba(255, 99, 71, 0.1), white)";
        bpDiv.innerHTML += `
            <div style="font-size: 3vh; margin-bottom: 5px; color: ${flagColor};">
                <i class="fas fa-flag-checkered"></i>
            </div>
            <div style="font-size: 14px; font-weight: bold; color: ${profit >= 0 ? "green" : "red"};">Closed</div>
            <div style="font-size: 12px; font-weight: bold; color: ${profit >= 0 ? "green" : "red"}; margin-top: 5px;">
                Profit: ${profit.toFixed(2)}
            </div>
        `;
*/
        //const flagColor = profit >= 0 ? "green" : "red";
/*
        if (progressBar) progressBar.style.width = "100%";
        bpDiv.style.background = "linear-gradient(to bottom, rgba(255, 99, 71, 0.1), white)";
        bpDiv.innerHTML += `
            <div style="font-size: 3vh; margin-bottom: 5px; color: ${flagColor};">🏁</div>
            <div style="font-size: 14px; font-weight: bold; color: red;">Closed</div>
            <div style="font-size: 12px; font-weight: bold; color: ${profit >= 0 ? "green" : "red"}; margin-top: 5px;">
                Profit: ${profit.toFixed(2)}
            </div>
        `;
*/
/*
        const flagColor = profit >= 0 ? "green" : "red";

        if (progressBar) progressBar.style.width = "100%";
        const gradientColor = profit >= 0 ? "rgba(144, 238, 144, 0.2)" : "rgba(255, 99, 71, 0.2)";
        bpDiv.style.background = `linear-gradient(to bottom, ${flagColor}, white)`;

        //bpDiv.style.background = "linear-gradient(to bottom, rgba(255, 99, 71, 0.1), white)";

        // Make sure Font Awesome is loaded in your HTML <head>:
        // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        bpDiv.innerHTML += `
            <div style="font-size: 3vh; margin-bottom: 5px; color: ${flagColor};">
                <i class="fas fa-flag-checkered"></i>
            </div>
            <div style="font-size: 14px; font-weight: bold; color: ${profit >= 0 ? "rgba(144, 238, 144, 0.2)" : "rgba(255, 99, 71, 0.2)"};">Closed</div>
            <div style="font-size: 12px; font-weight: bold; color: ${profit >= 0 ? "rgba(144, 238, 144, 0.2)" : "rgba(255, 99, 71, 0.2)"}; margin-top: 5px;">
                Profit: ${profit.toFixed(2)}
            </div>
        `;


        // Set HTML content
        bpDiv.innerHTML += `
            <div style="font-size: 3vh; margin-bottom: 5px; color: ${profitColor};">🏁</div>
            <div style="font-size: 14px; font-weight: bold; color: ${profitColor};">Closed</div>
            <div style="font-size: 12px; font-weight: bold; color: ${profitColor}; margin-top: 5px;">
                Profit: ${profit.toFixed(2)}
            </div>
        `;
*/
        const getNumFromText = (text) => {
            const match = text.match(/[-+]?\d*\.?\d+/);
            return match ? parseFloat(match[0]) : 0;
        };

        const bpdContainers = document.querySelectorAll('.bpd');

        const updateBpdItem = (bpd, selector, value, format = true, style = "", prefix = "") => {
            const el = bpd.querySelector(selector);
            if (!el) return console.warn("Missing BPD element:", selector);

            const strongText = el.querySelector("strong")?.outerHTML || "";
            const currentTextNode = el.querySelector("span")?.textContent || "0";
            const currentValue = getNumFromText(currentTextNode);
            const updated = currentValue + value;

            // ✅ If this is the profit block, dynamically decide style/prefix based on updated value
            if (selector === ".bpd-profit") {
                if (updated > 0) {
                    style = "color: rgba(0, 128, 0, 0.5); font-weight: 1000; font-size: 10px;";
                    prefix = "+ ";
                } else if (updated < 0) {
                    style = "color: rgba(255, 0, 0, 0.5); font-weight: 1000; font-size: 10px;";
                    prefix = ""; // No "+" for negative
                } else {
                    style = "color: rgba(0, 0, 0, 0.5); font-size: 10px;";
                    prefix = "";
                }
            }

            const newValue = format ? `${prefix}${updated.toFixed(2)} USD` : updated;
            el.innerHTML = `${strongText}<br><span style="${style}">${newValue}</span>`;
        };

        bpdContainers.forEach(bpd => {
            const defaultStyle = "color: rgba(0, 0, 0, 0.5); font-size: 10px;";
            updateBpdItem(bpd, ".bpd-stake", amount, true, defaultStyle);
            updateBpdItem(bpd, ".bpd-payout", totalPayout, true, defaultStyle);
            updateBpdItem(bpd, ".bpd-runs", 1, false, defaultStyle);
            updateBpdItem(bpd, profit < 0 ? ".bpd-lost" : ".bpd-won", 1, false, defaultStyle);
            updateBpdItem(bpd, ".bpd-profit", profit, true); // ✅ style and prefix now handled inside
        });

/*
        const bpdContainers = document.querySelectorAll('.bpd');

        const updateBpdItem = (bpd, selector, value, format = true, style = "", prefix = "") => {
            const el = bpd.querySelector(selector);
            if (!el) return console.warn("Missing BPD element:", selector);

            const strongText = el.querySelector("strong")?.outerHTML || "";
            const currentTextNode = el.querySelector("span")?.textContent || "0";
            const currentValue = getNumFromText(currentTextNode);
            const updated = currentValue + value;
            const newValue = format ? `${prefix}${updated.toFixed(2)} USD` : updated;

            el.innerHTML = `${strongText}<br><span style="${style}">${newValue}</span>`;
        };

        bpdContainers.forEach(bpd => {
            const defaultStyle = "color: rgba(0, 0, 0, 0.5); font-size: 10px;";
            let profitStyle = defaultStyle;
            let prefix = "";

            if (profit > 0) {
                profitStyle = "color: rgba(0, 128, 0, 0.5); font-weight: 1000; font-size: 10px;";
                prefix = "+ ";
            } else if (profit < 0) {
                profitStyle = "color: rgba(255, 0, 0, 0.5); font-weight: 1000; font-size: 10px;";
            }

            updateBpdItem(bpd, ".bpd-stake", amount, true, defaultStyle);
            updateBpdItem(bpd, ".bpd-payout", totalPayout, true, defaultStyle);
            updateBpdItem(bpd, ".bpd-runs", 1, false, defaultStyle);
            updateBpdItem(bpd, profit < 0 ? ".bpd-lost" : ".bpd-won", 1, false, defaultStyle);
            updateBpdItem(bpd, ".bpd-profit", profit, true, profitStyle, prefix);
        });*/
/*
        const updateBpdItem = (bpd, selector, value, format = true, style = "") => {
            const el = bpd.querySelector(selector);
            if (!el) return console.warn("Missing BPD element:", selector);

            const strongText = el.querySelector("strong")?.outerHTML || "";
            const currentTextNode = el.childNodes[2];
            const currentValue = currentTextNode ? getNumFromText(currentTextNode.textContent) : 0;
            const updated = currentValue + value;

            const newValue = format ? `${updated.toFixed(2)} USD` : updated;
            el.innerHTML = `${strongText}<br>${newValue}`;

            if (style) el.style.cssText = style;
        };

        bpdContainers.forEach(bpd => {
            const defaultStyle = "color: rgba(0, 0, 0, 0.7); font-size: 10px;";
            const profitValue = profit;
            let profitStyle = defaultStyle;
            let profitDisplay = profitValue;

            // Apply styles and formatting based on profit
            if (profitValue > 0) {
                profitStyle = "color: rgba(0, 128, 0, 0.8); font-weight: bold; font-size: 12px;";
                profitDisplay = profitValue;  // formatting handled by updateBpdItem
            } else if (profitValue < 0) {
                profitStyle = "color: rgba(255, 0, 0, 0.7); font-weight: bold; font-size: 12px;";
                profitDisplay = profitValue;
            } else {
                // Zero profit: use default style
                profitStyle = defaultStyle;
                profitDisplay = profitValue;
            }

            // Update each bpd item
            updateBpdItem(bpd, ".bpd-stake", amount, true, defaultStyle);
            updateBpdItem(bpd, ".bpd-payout", totalPayout, true, defaultStyle);
            updateBpdItem(bpd, ".bpd-runs", 1, false, defaultStyle);
            updateBpdItem(bpd, profit < 0 ? ".bpd-lost" : ".bpd-won", 1, false, defaultStyle);
            updateBpdItem(bpd, ".bpd-profit", profitDisplay, true, profitStyle);
        });
*/
/*
        const bpdContainers = document.querySelectorAll('.bpd');

        const updateBpdItem = (bpd, selector, value, format = true) => {
            const el = bpd.querySelector(selector);
            if (!el) return console.warn("Missing BPD element:", selector);
            const strongText = el.querySelector("strong")?.outerHTML || "";
            const currentTextNode = el.childNodes[2];
            const currentValue = currentTextNode ? getNumFromText(currentTextNode.textContent) : 0;
            const updated = currentValue + value;
            const newValue = format ? `${updated.toFixed(2)} USD` : updated;
            el.innerHTML = `${strongText}<br>${newValue}`;
        };

        bpdContainers.forEach(bpd => {
            updateBpdItem(bpd, ".bpd-stake", amount);
            updateBpdItem(bpd, ".bpd-payout", totalPayout);
            updateBpdItem(bpd, ".bpd-runs", 1, false);
            updateBpdItem(bpd, profit < 0 ? ".bpd-lost" : ".bpd-won", 1, false);
            updateBpdItem(bpd, ".bpd-profit", profit);
        });
*/
        return;
    }

    statusDiv.textContent = "Contract bought";
    blinkDots([rightDot], "green");
    if (progressBar) progressBar.style.width = "52%";

    //bpDiv.style.background = profit < 0
      //  ? "linear-gradient(to bottom, rgba(255, 99, 71, 0.3), white)"
        //: "linear-gradient(to bottom, rgba(144, 238, 144, 0.3), white)";

    const isExactTime = purchase_time === current_spot_time;

    if (isExactTime) {
        // Full height gradient (100%) when purchase_time === current_spot_time
        bpDiv.style.background = profit < 0
            ? "linear-gradient(to bottom, rgba(255, 99, 71, 0.2), white)"
            : "linear-gradient(to bottom, rgba(144, 238, 144, 0.2), white)";
    } else {
        // Only top 20% is a fading color; rest is white
        const gradientColor = profit < 0 ? "rgba(255, 99, 71, 0.3)" : "rgba(144, 238, 144, 0.2)";
        bpDiv.style.background = `linear-gradient(to bottom,
            ${gradientColor} 0%,
            ${gradientColor} 1%,
            rgba(255, 255, 255, 1) 20%,
            white 100%)`;
    }

    const addInfo = (text, top, left, color = "black", fontSize = "1.5vh", bold = false) => {
        const div = document.createElement("div");
        div.textContent = text;
        Object.assign(div.style, {
            position: "absolute",
            top,
            left,
            fontSize,
            fontWeight: bold ? "bold" : "normal",
            color
        });
        bpDiv.appendChild(div);
    };

    const addLine = (top) => {
        const div = document.createElement("div");
        Object.assign(div.style, {
            position: "absolute",
            top,
            left: "1vh",
            width: "calc(100% - 2vh)",
            height: "1px",
            backgroundColor: "gray"
        });
        bpDiv.appendChild(div);
    };

    if (display_name) addInfo(display_name, "3vh", "7vh", "rgba(0, 0, 0, 0.6)", "1.7vh", true);
    if (contract_type) {
        const label = contract_type === "CALL" ? "Higher" : contract_type === "PUT" ? "Lower" : contract_type;
        addInfo(label, "3vh", "35vh", "black", "1.5vh", true);
    }

    addLine("12vh");

    const usdRect = document.createElement("div");
    usdRect.textContent = "USD";
    Object.assign(usdRect.style, {
        position: "absolute", top: "13vh", left: "2vh", width: "4.5vh", height: "2.5vh",
        backgroundColor: "green", color: "white", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: "bold", borderRadius: "3px"
    });
    bpDiv.appendChild(usdRect);

    addInfo("Total profit/loss:", "17vh", "2vh", "black", "1.5vh", true);
    addInfo(profit.toFixed(2), "19vh", "2vh", profit >= 0 ? "green" : "red", "1.5vh", true);

    addInfo("stake:", "21vh", "2vh", "black", "1.5vh");
    addInfo("Contract value:", "17vh", "20vh", "black", "1.5vh", true);
    addInfo("Potential payout:", "21vh", "20vh", "black", "1.5vh", true);
    addInfo(amount.toFixed(2), "23vh", "2vh", "black", "1.5vh", true);
    //addInfo(totalPayout.toFixed(2), "19vh", "20vh", "black", "1.5vh", true);

    let payoutText = totalPayout.toFixed(2);
    let payoutColor = "black";
    let payoutBold = false;

    if (totalPayout > 0) {
        payoutText = `+${payoutText}`;
        payoutColor = "rgba(0, 128, 0, 0.7)"; // less intense green
        payoutBold = true;
    } else if (totalPayout < 0) {
        payoutColor = "rgba(255, 0, 0, 0.7)"; // less intense red
        payoutBold = true;
    }

    addInfo(payoutText, "19vh", "20vh", payoutColor, "1.5vh", payoutBold);

    addInfo(payout.toFixed(2), "23vh", "20vh", "black", "1.5vh", true);

    addLine("25vh");

    if (is_valid_to_sell === 0) {
        addInfo("Resale not offered", "27vh", "10vh", "black", "1.5vh");
    } else {
        // Create a proper button
        const sellBox = document.createElement("button");
        sellBox.textContent = "Sell";

        // Style the button
        Object.assign(sellBox.style, {
            position: "absolute",
            top: "27vh",
            left: "1vh",
            width: "calc(100% - 2vh)",
            height: "4vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            border: "1px solid black",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer"
        });

        // Add click event to send WebSocket message
        sellBox.addEventListener("click", () => {
            const sellMessage = {
                event: "sell_contract",
                action: "SELL",
                contract_id: contract_id, // send it to backend
                timestamp: new Date().toISOString()
            };

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(sellMessage));
                console.log("📤 Sent sell message:", sellMessage);
            } else {
                console.error("WebSocket is not open");
            }
        });

        // Add to the DOM
        bpDiv.appendChild(sellBox);
    }

/*
    if (is_valid_to_sell === 0) {
        addInfo("Resale not offered", "27vh", "10vh", "black", "1.5vh");
    } else {
        const sellBox = document.createElement("div");
        sellBox.textContent = "Sell";
        Object.assign(sellBox.style, {
            position: "absolute", top: "27vh", left: "1vh", width: "calc(100% - 2vh)",
            height: "4vh", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: "bold", border: "1px solid black", borderRadius: "4px"
        });
        bpDiv.appendChild(sellBox);
    }
*/
    if (expiry_time && purchase_time && current_spot_time) {
        const duration = Math.max(expiry_time - purchase_time, 1);
        const remaining = Math.max(expiry_time - current_spot_time, 0);

        const timerDiv = document.createElement("div");
        timerDiv.classList.add("countdown-timer");
        Object.assign(timerDiv.style, {
            position: "absolute", top: "7vh", left: "1vh",
            fontSize: "10px", fontWeight: "bold", color: "black"
        });
        timerDiv.textContent = formatTime(remaining);
        bpDiv.appendChild(timerDiv);

        const countdownBar = document.createElement("div");
        Object.assign(countdownBar.style, {
            position: "absolute", top: "10vh", left: "1vh",
            width: "calc(100% - 2vh)", height: "5px", backgroundColor: "#eee",
            borderRadius: "4px", overflow: "hidden"
        });

        const fill = document.createElement("div");
        Object.assign(fill.style, {
            height: "100%", backgroundColor: "green",
            transition: "width 1s linear",
            width: `${(remaining / duration) * 100}%`
        });

        countdownBar.appendChild(fill);
        bpDiv.appendChild(countdownBar);

        startCountdown(timerDiv, fill);
    }

    if (tick_stream.length === 0) {
        blinkDots([centerDot, rightDot], "red");
    } else {
        blinkDots([rightDot], "green");
    }
}

document.querySelector('.reset-button').addEventListener('click', () => {
    // 1. Reset `.bp` startup message
    const bp = document.querySelector('.bp');
    if (bp) {
        bp.innerHTML = `
            When you’re ready to trade, hit <strong>Run</strong>.<br>
            You’ll be able to track your bot’s<br>
            performance here.
        `;
        bp.style.background = 'linear-gradient(to bottom, #f0f0f0, white)';
    }

    // 2. Reset `.bpd` stats (both in main and #transaction)
    const bpdItems = document.querySelectorAll('.bpd-item');
    bpdItems.forEach(item => {
        if (item.querySelector('strong')) {
            const label = item.querySelector('strong').textContent.trim();
            let resetValue = '0';
            if (label.toLowerCase().includes('stake') || label.toLowerCase().includes('payout') || label.toLowerCase().includes('profit')) {
                resetValue = '0.00 USD';
            }
            item.innerHTML = `<strong>${label}</strong><br>${resetValue}`;
        }
    });

    // 3. Reset `.box` in #transaction
    const box = document.querySelector('#transaction .box');
    if (box) {
        box.innerHTML = `
            <img src="/static/icons/box.png" alt="Box Icon" class="box-icon">
            <p class="box-title">There are no transactions to display</p>
            <p class="box-subtitle">Here are the possible reasons:</p>
            <ul class="box-reasons">
                <li>The bot is not running...</li>
                <li>The stats are cleared...</li>
            </ul>
        `;
    }

    // 4. Reset `.box-container` in #journal
    const boxContainer = document.querySelector('#journal .box-container');
    if (boxContainer) {
        boxContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 2vh;">
                <img src="/static/icons/box.png" alt="Box Icon" class="box-icon">
                <p class="no-messages"><strong>There are no messages to display</strong></p>
                <p class="reason-text">Here are the possible reasons:</p>
            </div>
            <ul class="reason-list" style="padding-left: 2.0vw; text-align: left; margin-top: 1vh;">
                <li>The bot is not running</li>
                <li>The stats are cleared</li>
                <li>All messages are filtered out</li>
            </ul>
        `;
    }
});

/*
document.querySelector('.reset-button').addEventListener('click', () => {
    // Reset the top message
    document.querySelector('.bp').innerHTML = `
        When you’re ready to trade, hit <strong>Run</strong>.<br>
        You’ll be able to track your bot’s<br>
        performance here.
    `;

    // Reset all stats
    document.querySelector('.bpd').innerHTML = `
        <div class="bpd-top">
            <div class="bpd-item bpd-stake"><strong>Total stake</strong><br>0.00 USD</div>
            <div class="bpd-item bpd-payout"><strong>Total payout</strong><br>0.00 USD</div>
            <div class="bpd-item bpd-runs"><strong>No. of runs</strong><br>0</div>
        </div>
        <div class="bpd-bottom">
            <div class="bpd-item bpd-lost"><strong>Contracts lost</strong><br>0</div>
            <div class="bpd-item bpd-won"><strong>Contracts won</strong><br>0</div>
            <div class="bpd-item bpd-profit"><strong>Total profit/loss</strong><br>0.00 USD</div>
        </div>
    `;
});
*/
// Function to send Python code to the backend via WebSocket
/*function sendPythonCodeToBackend(pythonCode) {
    if (ws.readyState === WebSocket.OPEN) {
        // Send the Python code through WebSocket
        const message = {
            event: "run_bot",
            pythonCode: pythonCode
        };

        ws.send(JSON.stringify(message));
        console.log("✅ Sent Python Code via WebSocket:", pythonCode);
    } else {
        console.error("🚨 WebSocket is not open. Cannot send data.");
        alert("WebSocket connection is closed. Please refresh the page.");
    }
}*/
/*
mildred
function sendPythonCodeToBackend(pythonCode) {
    if (!window.ws || window.ws.readyState !== WebSocket.OPEN) {
        console.error("🚨 WebSocket is not open or not available.");
        alert("WebSocket is not ready. Please refresh the page.");
        return;
    }

    const message = {
        event: "run_bot",
        pythonCode: pythonCode
    };

    window.ws.send(JSON.stringify(message));
    console.log("✅ Sent Python Code via WebSocket:", pythonCode);
}
kibiti
*/
// Run fetchAllData on page load
//document.addEventListener('DOMContentLoaded', fetchAllData);

document.addEventListener("DOMContentLoaded", function() {
    function updateGMTTime() {
        const gmtTimeElement = document.getElementById("gmtTime");
        if (gmtTimeElement) {
            const now = new Date();

            // Extract date components and ensure two-digit format
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Add 1 to month and format
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');

            // Format to "YYYY-MM-DD HH:MM:SS GMT"
            const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`;

            gmtTimeElement.innerText = formattedTime;
        }
    }

    // Update every second
    setInterval(updateGMTTime, 1000);
    updateGMTTime();
});

let userSelections = {
    market: null,
    submarket: null,
    symbol: null,
};

// Define a global variable for the selected symbol
//let selectedSymbol = null;

// Function to fetch both market and asset data at once
async function fetchAllData() {
    try {
        console.log("Starting unified fetch for market and asset data");

        // Fetch both market and asset data in parallel
        const [marketResponse, assetResponse] = await Promise.all([
            fetch('api/market-data/'),
            fetch('api/asset_data/')
        ]);

        if (!marketResponse.ok || !assetResponse.ok) {
            throw new Error("Failed to fetch market or asset data.");
        }

        const [marketData, assetData] = await Promise.all([
            marketResponse.json(),
            assetResponse.json()
        ]);

        console.log("Fetched market data:", marketData);
        console.log("Fetched asset data:", assetData);

        // Populate dropdowns using the fetched data
        populateDropdowns(marketData, assetData);
        //await fetchContracts(symbol);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Global variable to store contract data
//let globalContractData = null;

async function fetchContracts(symbol) {
    if (!symbol) {
        console.error("Cannot fetch contracts: Symbol is undefined or null.");
        return; // Exit early if no valid symbol
    }

    try {
        // Log the symbol being used
       console.log("Fetching contracts for symbol:", symbol);

        // Make the fetch request
        const response = await fetch(`/botbuilder/api/contracts/?symbol=${symbol}`);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response JSON
        const contractData = await response.json();

        // Update the global variable
        globalContractData = contractData;

        // Log the response data
        console.log("Contracts data received:", contractData);

        // Pass the data to populateBlockDropdowns
        //populateBlockDropdowns(globalContractData);

    } catch (error) {
        // Log any errors that occur during fetch or processing
        console.error("Error fetching contracts data:", error);
    }
    //populateBlockDropdowns(blockType, data);
}

//let newBlockType; // Declare it in a higher scope
/*
function populateDropdowns(marketData, assetData) {
    console.log("🔍 Received Data 1:", marketData); // Debugging
    console.log("🔍 Received Data 2:", assetData); // Debugging
    console.log("📜 Contracts Data:", window.WS_DATA.contractData);

    if (!workspaceReady) {
        console.warn("⚠️ Blockly workspace is not ready yet. Retrying...");
        setTimeout(populateDropdowns, 100);
        return;
    }

    const workspace = Blockly.getMainWorkspace();

    if (!workspace) {
        console.error("❌ Blockly workspace is not initialized.");
        return;
    }

    const marketBlock = workspace.getBlocksByType('market')[0];
    if (!marketBlock) {
        console.error("Market block not found in workspace.");
        return;
    }
    const marketDropdown = marketBlock.getField('mkts');
    const submarketDropdown = marketBlock.getField('sbmkts');
    const symbolDropdown = marketBlock.getField('sl');

    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
    const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];

    if (!marketDropdown || !submarketDropdown || !symbolDropdown) {
        console.error("One or more dropdown fields are missing in the market block.");
        return;
    }

    selectedSymbol = symbolDropdown.getValue();

    console.log("Fetching contracts for symbol0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000:", selectedSymbol);

    // Populate market dropdown
    const markets = Object.keys(marketData).map(market => {
        const isClosed = marketData[market].status === 'closed';
        return [isClosed ? `${market} (closed)` : market, market];
    });
    marketDropdown.menuGenerator_ = markets;
    const selectedMarket = userSelections.market || markets[0][1];
    marketDropdown.setValue(selectedMarket);
    // Set the market dropdown value
    if (!userSelections.market) {
        userSelections.market = markets[0][1];
        marketDropdown.setValue(userSelections.market);
    }

    function updateSubmarketAndSymbol(selectedMarket) {
        const submarkets = Object.keys(marketData[selectedMarket].submarkets).map(submarket => {
            const isClosed = marketData[selectedMarket].submarkets[submarket].status === 'closed';
            return [isClosed ? `${submarket} (closed)` : submarket, submarket];
        });
        submarketDropdown.menuGenerator_ = submarkets;

        // Set the submarket dropdown value
        if (!userSelections.submarket || marketDropdown.getValue() !== selectedMarket) {
            userSelections.submarket = submarkets[0][1];
            submarketDropdown.setValue(userSelections.submarket);
        }

        // Update symbols immediately when submarket changes
        updateSymbols(selectedMarket, userSelections.submarket);

        // Populate trade type dropdowns based on the selected symbol
        populateTradeTypeDropdowns(userSelections.symbol, assetData);
    }

    function updateSymbols(selectedMarket, selectedSubmarket) {
        const symbols = marketData[selectedMarket].submarkets[selectedSubmarket].symbols.map(symbol => {
            const isClosed = symbol.is_open !== 'open';
            return [isClosed ? `${symbol.display_name} (closed)` : symbol.display_name, symbol.symbol];
        });
        symbolDropdown.menuGenerator_ = symbols;

        // Update symbol dropdown value and display
        if (!userSelections.symbol || submarketDropdown.getValue() !== selectedSubmarket) {
            userSelections.symbol = symbols[0][1];
            selectedSymbol = userSelections.symbol; // Update the global variable
            symbolDropdown.setValue(userSelections.symbol);

            // Fetch contracts immediately after setting the symbol
            //fetchContracts(userSelections.symbol);
        } else {
            // Force update to refresh the display
            const currentValue = userSelections.symbol;
            symbolDropdown.setValue(null); // Clear temporarily
            symbolDropdown.setValue(currentValue); // Reset to refresh

            // Fetch contracts immediately after setting the symbol
            //fetchContracts(userSelections.symbol);
        }
    }

    // Function to update contracts based on the symbol dropdown value
    function updateContractsFromSymbol() {
        const currentSymbol = symbolDropdown.getValue();
        selectedSymbol = symbolDropdown.getValue();
        if (currentSymbol) {
            console.log("Fetching contracts for symbol:", currentSymbol);
            //fetchContracts(selectedSymbol);
            //populateBlockDropdowns(globalContractData);
            //populateBlockDropdowns(blockType);
        } else {
            console.warn("No valid symbol selected in symbol dropdown.");
        }
    }

    // Initialize submarket and symbol dropdowns
    updateSubmarketAndSymbol(userSelections.market);

    // Add event listeners for manual changes
    marketDropdown.setValidator(value => {
        userSelections.market = value;
        updateSubmarketAndSymbol(value);
        updateContractsFromSymbol();

        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        return value;
    });

    submarketDropdown.setValidator(value => {
        userSelections.submarket = value;
        updateSymbols(userSelections.market, value);
        //updateContractsFromSymbol();
        selectedSymbol = symbolDropdown.getValue();
        populateTradeTypeDropdowns(selectedSymbol, assetData);
        updateContractsFromSymbol();

        //dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        //dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        //dropdownValues.contractDropdown = contractTypeDropdown.getValue()

        return value;
    });

    symbolDropdown.setValidator(value => {
        userSelections.symbol = value;
        selectedSymbol = value; // Update the global variable
        //fetchContracts(selectedSymbol);

        // Send the selected symbol to the backend via WebSocket
        window.sendWebSocketMessage({
            event: "get_contracts",
            symbol: selectedSymbol,
            api_token : "api_token"
        });

        populateTradeTypeDropdowns(value, assetData);
        updateContractsFromSymbol();

        //dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        //dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        //dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        return value;
    });
}*/
/*
function updateContractsFromSymbol() {
    const currentSymbol = symbolDropdown.getValue();
    selectedSymbol = currentSymbol;

    if (currentSymbol) {
        console.log("Fetching contracts for symbol:", currentSymbol);

        // Send WebSocket request to fetch contract data
        window.sendWebSocketMessage({
            event: "get_contracts",
            symbol: selectedSymbol,
            api_token: "api_token"
        });

    } else {
        console.warn("No valid symbol selected in symbol dropdown.");
    }
}

*/

async function waitForMarketBlockAndUpdate(maxRetries = 10, delay = 300) {
    const workspace = Blockly.getMainWorkspace();

    for (let i = 0; i < maxRetries; i++) {
        const marketBlock = workspace.getBlocksByType('market')[0];
        if (marketBlock) {
            console.log("✅ Market block found. Updating contracts...");
            updateContractsFromSymbol();  // safe to call now
            return;
        }
        console.log(`⏳ Waiting for market block... (${i + 1}/${maxRetries})`);
        await new Promise(res => setTimeout(res, delay));
    }

    console.warn("⚠️ Market block not found after waiting.");
}

async function updateContractsFromSymbol() {
    // Wait until symbolDropdown exists and has a value
    const workspace = Blockly.getMainWorkspace();

    if (!workspace) {
        console.error("❌ Blockly workspace is not initialized.");
        return;
    }

    const marketBlock = workspace.getBlocksByType('market')[0];
    if (!marketBlock) {
        console.error("Market block not found in workspace.");
        return;
    }
    const symbolDropdown = marketBlock.getField('sl');
    while (
        !symbolDropdown ||
        !symbolDropdown.getValue() ||
        symbolDropdown.getValue() === 'null' ||
        symbolDropdown.getValue() === ''
    ) {
        console.log("⏳ Waiting for a valid symbol in symbolDropdown...");
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    const currentSymbol = symbolDropdown.getValue();
    selectedSymbol = currentSymbol;

    console.log("✅ Valid symbol detected. Fetching contracts for:", currentSymbol);

    // Send WebSocket request to fetch contract data
    window.sendWebSocketMessage({
        event: "get_contract",
        symbol: selectedSymbol,
        api_token: "api_token"
    });
}


function populateDropdowns(marketData, assetData) {
    console.log("🔍 Received Data 1:", marketData); // Debugging
    console.log("🔍 Received Data 2:", assetData); // Debugging
    console.log("📜 Contracts Data:", window.WS_DATA.contractData);

    if (!workspaceReady) {
        // Try restoring from window.workspaceReady
        if (window.workspaceReady) {
            workspaceReady = true;
            console.log("🔁 Restored workspaceReady from window.");
        }
        // If still not ready, check localStorage
        else if (localStorage.getItem("workspace_initialized") === "true") {
            workspaceReady = true;
            console.log("🧠 Restored workspaceReady from localStorage.");
        }
    }

    // If STILL not ready after all fallbacks, retry later
    if (!workspaceReady) {
        console.warn("⚠️ Blockly workspace is not ready yet. Retrying...");
        setTimeout(() => populateDropdowns(marketData, assetData), 100);
        return;
    }

    //const workspace = Blockly.getMainWorkspace();

    if (!workspace) {
        console.warn("🧱 Blockly workspace is not set. Attempting to restore...");

        // Try restoring from global window
        if (window.workspace) {
            workspace = window.workspace;
            console.log("🔁 Restored workspace from window.");
        } else {
            workspace = Blockly.getMainWorkspace();
        }
    }

    if (!workspace) {
        console.error("❌ Blockly workspace is not initialized.");
        return;
    }

    const marketBlock = workspace.getBlocksByType('market')[0];
    if (!marketBlock) {
        console.error("Market block not found in workspace.");
        return;
    }

    const marketDropdown = marketBlock.getField('mkts');
    const submarketDropdown = marketBlock.getField('sbmkts');
    const symbolDropdown = marketBlock.getField('sl');

    if (!marketDropdown || !submarketDropdown || !symbolDropdown) {
        console.error("One or more dropdown fields are missing in the market block.");
        return;
    }

    // New function to update markets
    function updateMarkets() {
        console.log("Updating Market Dropdown...");
        const markets = Object.keys(marketData).map(market => {
            const isClosed = marketData[market].status === 'closed';
            return [isClosed ? `${market} (closed)` : market, market];
        });

        marketDropdown.menuGenerator_ = markets;

        // Keep the user's previous selection if possible, otherwise use the first available market
        if (!userSelections.market || !markets.some(m => m[1] === userSelections.market)) {
            userSelections.market = markets.length > 0 ? markets[0][1] : "";
        }

        marketDropdown.setValue(userSelections.market);
        console.log("✅ Market set to:", userSelections.market);

        // Now update submarkets and symbols after setting the market
        updateSubmarketAndSymbol(userSelections.market);
    }

    function updateSubmarketAndSymbol(selectedMarket) {
        console.log("Updating Submarket Dropdown for:", selectedMarket);

        let submarkets = Object.keys(marketData[selectedMarket].submarkets).map(submarket => {
            const isClosed = marketData[selectedMarket].submarkets[submarket].status === 'closed';
            return [isClosed ? `${submarket} (closed)` : submarket, submarket];
        });

        // Ensure "Continuous Indices" is at the top
        submarkets.sort((a, b) => {
            if (a[1] === "Continuous Indices") return -1; // Move to the top
            if (b[1] === "Continuous Indices") return 1;  // Move to the bottom
            return 0; // Keep original order for others
        });

        // Update the dropdown
        submarketDropdown.menuGenerator_ = submarkets;

        // Ensure the selected submarket is set correctly
        if (!userSelections.submarket || marketDropdown.getValue() !== selectedMarket) {
            userSelections.submarket = submarkets.length > 0 ? submarkets[0][1] : "";
        }

        submarketDropdown.setValue(userSelections.submarket);
        console.log("✅ Submarket set to:", userSelections.submarket);

        // Update symbols based on the new submarket selection
        updateSymbols(selectedMarket, userSelections.submarket);
    }

    function updateSymbols(selectedMarket, selectedSubmarket) {
        console.log("Updating Symbols for:", selectedMarket, selectedSubmarket);
        const symbols = marketData[selectedMarket].submarkets[selectedSubmarket].symbols.map(symbol => {
            const isClosed = symbol.is_open !== 'open';
            return [isClosed ? `${symbol.display_name} (closed)` : symbol.display_name, symbol.symbol];
        });

        symbolDropdown.menuGenerator_ = symbols;

        if (!userSelections.symbol || submarketDropdown.getValue() !== selectedSubmarket) {
            userSelections.symbol = symbols.length > 0 ? symbols[0][1] : "";
        }

        selectedSymbol = userSelections.symbol; // ✅ Updates global scope variable

        symbolDropdown.setValue(userSelections.symbol);
        console.log("✅ Symbol set to:", userSelections.symbol);

        // Fetch contract details
        //updateContractsFromSymbol();
        waitForMarketBlockAndUpdate();
    }
/*
    function updateContractsFromSymbol() {
        const currentSymbol = symbolDropdown.getValue();
        selectedSymbol = currentSymbol;

        if (currentSymbol) {
            console.log("Fetching contracts for symbol:", currentSymbol);

            // Send WebSocket request to fetch contract data
            window.sendWebSocketMessage({
                event: "get_contracts",
                symbol: selectedSymbol,
                api_token: "api_token"
            });

        } else {
            console.warn("No valid symbol selected in symbol dropdown.");
        }
    }
*/
    // Initialize dropdowns in correct order
    updateMarkets();

    async function waitForSymbolAndAssetIndex() {
        while (
            !window.WS_DATA?.assetIndex ||
            !symbolDropdown?.getValue() ||
            symbolDropdown.getValue() === 'null' ||
            symbolDropdown.getValue() === ''
        ) {
            console.log("⏳ Waiting for symbolDropdown value and assetIndex...");
            await new Promise(resolve => setTimeout(resolve, 300)); // check every 300ms
        }

        console.log("✅ Symbol and assetIndex available. Populating trade type dropdowns...");
        populateTradeTypeDropdowns(symbolDropdown.getValue(), window.WS_DATA.assetIndex);
    }

    // Event listeners to handle manual selection updates
    marketDropdown.setValidator(value => {
        console.log("Market changed to:", value);
        userSelections.market = value;
        updateSubmarketAndSymbol(value);
        //updateContractsFromSymbol();  // This is now async-safe
        waitForMarketBlockAndUpdate();
        waitForSymbolAndAssetIndex();
        return value;
    });

    submarketDropdown.setValidator(value => {
        console.log("Submarket changed to:", value);
        userSelections.submarket = value;
        updateSymbols(userSelections.market, value);
        //updateContractsFromSymbol();  // This is now async-safe
        waitForMarketBlockAndUpdate();
        waitForSymbolAndAssetIndex();
        //waitForData();
        //waitForBlockType();
        return value;
    });

    symbolDropdown.setValidator(value => {
        console.log("Symbol changed to:", value);
        userSelections.symbol = value;
        //updateContractsFromSymbol();
        waitForMarketBlockAndUpdate();
        //populateTradeTypeDropdowns(value, window.WS_DATA.assetIndex);
        waitForSymbolAndAssetIndex(); // this new one
        //populateTradeTypeDropdowns(value, window.WS_DATA.contractData);
        return value;
    });
    const currentSymbol = symbolDropdown.getValue();

    //populateTradeTypeDropdowns(symbolDropdown, window.WS_DATA.assetIndex);selectedSymbol
    //populateTradeTypeDropdowns(symbolDropdown.getValue(), window.WS_DATA.assetIndex);
    waitForSymbolAndAssetIndex(); // this new one
}


// Global variable to store the block type
//let blockType = null;

function manageDynamicBlock(newBlockType) {
    const workspace = Blockly.getMainWorkspace();
    const tradeParametersBlock = workspace.getBlocksByType('tradeparameters')[0];

    if (!tradeParametersBlock) {
        console.error("❌ 'tradeparameters' block not found!");
        return;
    }

    const toInput = tradeParametersBlock.getInput('to');

    if (!toInput) {
        console.error('"to" input not found or is invalid.');
        return;
    }

    const existingBlock = toInput.connection?.targetBlock();

    // If the block type doesn't match the desired type, replace it
    if (existingBlock && existingBlock.type !== newBlockType) {
        console.log(`Replacing block of type: ${existingBlock.type} with ${newBlockType}`);
        existingBlock.unplug();
        existingBlock.dispose();
    }

    // If no block exists or a replacement is needed, create the new block
    if (!existingBlock || existingBlock.type !== newBlockType) {
        if (!Blockly.Blocks[newBlockType]) {
            console.error(`Invalid block type: ${newBlockType}`);
            return;
        }

        const newBlock = workspace.newBlock(newBlockType);
        newBlock.initSvg();
        newBlock.render();

        // Connect the new block to the "to" input
        if (toInput.connection && newBlock.previousConnection) {
            toInput.connection.connect(newBlock.previousConnection);
            console.log(`Connected new block of type: ${newBlockType}`);
            populateBlockDropdowns(newBlockType);
        } else {
            console.error("Failed to connect: Invalid connection points.");
        }
    } else {
        console.log(`Block of type ${newBlockType} already exists.`);
        populateBlockDropdowns(newBlockType);
    }

    // Move blockType assignment and log statement to the end
    blockType = newBlockType;
    console.log("Block type set toooooooooooooooooooooooooooo.......+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++======================================............................................................................:", newBlockType);
}


function populateBlockDropdowns(blockType) {
    const contractData = window.WS_DATA.contractData;
    console.log("Contract data received for dropdown population111111111111111111111122222222:", contractData);
    console.log("Using block type:", blockType); // Log the blockType being used
    console.log("Current dropdown values:", dropdownValues); // Access global variable
    if (!blockType) {
        console.error("❌ No valid block type provided to populateBlockDropdowns.");
       // return;
    }
    //const dropdownField = block.getField('NAME'); // Adjust field name as per block definition

    switch (blockType) {

    case "Growth_Rate":
        try {
            // Ensure the required structure exists
            if ( contractData &&
                contractData.data &&
                contractData.data.accumulator &&
                contractData.data.accumulator.contracts &&
                Array.isArray(contractData.data.accumulator.contracts) &&
                contractData.data.accumulator.contracts.length > 0)

             {  // Navigate to the growth_rate_range data
                const growthRateRange = contractData.data.accumulator.contracts[0].growth_rate_range;

                // Log the growthRateRange for debugging
                console.log("Growth rate range data:", growthRateRange);

                if (Array.isArray(growthRateRange) && growthRateRange.length > 0) {
                    // Convert growth rate data into dropdown options
                    //const growthRateOptions = growthRateRange.map(rate => [`${rate}%`, rate]);
                    const workspace = Blockly.getMainWorkspace();
                    const GrowthRateBlock = workspace.getBlocksByType('Growth_Rate')[0];

                    if (!GrowthRateBlock) {
                        console.error("GrowthRate block not found in workspace.");
                        return;
                    }
                    const GrowthRateDropdown = GrowthRateBlock.getField('grvdd');

                    if (!GrowthRateDropdown) {
                        console.error("One or more dropdown fields are missing in the GrowthRate block.");
                        return;
                    }

                    // Retain the current selection
                    const currentValue = GrowthRateDropdown.getValue();

                    const growthRateOptions = growthRateRange.map(rate => [`${rate * 100}%`, rate]);

                    // Populate the dropdown
                    GrowthRateDropdown.menuGenerator_ = growthRateOptions;

                    // Set the default value to the first option
                    //GrowthRateDropdown.setValue(growthRateOptions[0][1]);

                    // Restore the previous selection if it still exists
                    const validValue = growthRateOptions.find(option => option[1] === currentValue);
                    if (validValue) {
                        GrowthRateDropdown.setValue(currentValue);
                    } else {
                        GrowthRateDropdown.setValue(growthRateOptions[0][1]); // Default to the first option
                    }
                } else {
                    console.error("Growth rate range is empty or invalid:", growthRateRange);
                }
            } else {
                console.error("Invalid contractData structure for Growth_Rate:", contractData);
            }
        } catch (error) {
            console.error("Error processing Growth_Rate dropdown:", error);
        }
        break;

    case "Multiplier":
        try {
            // Ensure the required structure exists
            if (
                contractData &&
                contractData.data &&
                contractData.data.multiplier &&
                contractData.data.multiplier.contracts &&
                Array.isArray(contractData.data.multiplier.contracts) &&
                contractData.data.multiplier.contracts.length > 0
            ) {
                // Navigate to the multiplier_range data
                const multiplierRange = contractData.data.multiplier.contracts[0].multiplier_range;

                // Log the multiplierRange for debugging
                console.log("Multiplier range data:", multiplierRange);

                if (Array.isArray(multiplierRange) && multiplierRange.length > 0) {
                    // Get the main Blockly workspace
                    const workspace = Blockly.getMainWorkspace();

                    // Find the Multiplier block by type
                    const MultiplierBlock = workspace.getBlocksByType('Multiplier')[0];

                    if (!MultiplierBlock) {
                        console.error("Multiplier block not found in workspace.");
                        return;
                    }

                    // Get the dropdown field by name
                    const MultiplierDropdown = MultiplierBlock.getField('mvdd'); // Replace 'mv' with the actual field name for the Multiplier dropdown

                    if (!MultiplierDropdown) {
                        console.error("Dropdown field is missing in the Multiplier block.");
                        return;
                    }

                    // Retain the current selection
                    const currentValue = MultiplierDropdown.getValue();

                    // Convert multiplier range data into dropdown options
                    const multiplierOptions = multiplierRange.map(multiplier => [`${multiplier}`, multiplier]);

                    // Populate the dropdown
                    MultiplierDropdown.menuGenerator_ = multiplierOptions;

                    // Set the default value to the first option
                    //MultiplierDropdown.setValue(multiplierOptions[0][1]);

                    // Restore the previous selection if it still exists
                    const validValue = multiplierOptions.find(option => option[1] === currentValue);
                    if (validValue) {
                        MultiplierDropdown.setValue(currentValue);
                    } else {
                        MultiplierDropdown.setValue(multiplierOptions[0][1]); // Default to the first option
                    }
                } else {
                    console.error("Multiplier range is empty or invalid:", multiplierRange);
                }
            } else {
                console.error("Invalid contractData structure for Multiplier:", contractData);
            }
        } catch (error) {
            console.error("Error processing Multiplier dropdown:", error);
        }
        break;


    case "Duration":
        try {
            console.log("Current dropdown values:", dropdownValues); // Debugging
            console.log("Received contractData:", contractData); // Debugging

            const workspace = Blockly.getMainWorkspace();

            const marketBlock = workspace.getBlocksByType('market')[0];
            if (!marketBlock) {
                console.error("Market block not found in workspace.");
                return;
            }

            const symbolDropdown = marketBlock.getField('sl');
            const currentSymbol = symbolDropdown.getValue();
            console.log("Market Symbol Dropdown (sl):", currentSymbol);

            const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
            const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
            const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

            // Declare variables in outer scope
            let ttt1, ttt2;

            if (tradeTypeBlock && contractTypeBlock && purchaseBlock) {
                const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
                const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
                const contractTypeDropdown = contractTypeBlock.getField('ct1');
                const purchaseDropdown = purchaseBlock.getField('Pdd');

                ttt1 = tradeTypeDropdown1.getValue();
                ttt2 = tradeTypeDropdown2.getValue();

                console.log("Trade Type Dropdown 111:", ttt1);
                console.log("Trade Type Dropdown 222:", ttt2);

                console.log("Trade Type Dropdown 1:", tradeTypeDropdown1?.getValue());
                console.log("Trade Type Dropdown 2:", tradeTypeDropdown2?.getValue());
                console.log("Contract Type Dropdown:", contractTypeDropdown?.getValue());
                console.log("Purchase Dropdown:", purchaseDropdown?.getValue());
            } else {
                console.warn("One or more required blocks not found in the workspace.");
            }

            if (
                contractData &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                //const { firstDropdown, secondDropdown } = dropdownValues;
                const firstDropdown = ttt1;
                const secondDropdown = ttt2;
                console.log("Invalid dropdown values:", dropdownValues);

                console.log("Trade Type firstDropdown 111:", firstDropdown);
                console.log("Trade Type secondDropdown 222:", secondDropdown);

                //if (!firstDropdown || !secondDropdown) {
                  //  console.error("Invalid dropdown values:", dropdownValues);
                    //return;
                //}

                // Map firstDropdown to corresponding categories in contractData
                const categoryKeys =
                    firstDropdown === "Up/Down" ? ["callput", "callputequal"] :
                    firstDropdown === "Multipliers" ? ["multiplier"] :
                    firstDropdown === "Touch/No Touch" ? ["touchnotouch"] :
                    firstDropdown === "In/Out" ? ["endsinout"] :
                    firstDropdown === "Asians" ? ["asian"] :
                    firstDropdown === "Digits" ? ["digits"] :
                    firstDropdown === "Reset Call/Reset Put" ? ["reset"] :
                    firstDropdown === "High/Low Ticks" ? ["highlowticks"] :
                    firstDropdown === "Only Ups/Only Downs" ? ["runs"] :
                    firstDropdown === "Accumulator" ? ["accumulator"] :
                    null;

                if (!categoryKeys || categoryKeys.length === 0) {
                    console.error("No categories found for firstDropdown:", firstDropdown);
                    return;
                }

                const secondDropdownMapping = {
                    "Asian Up/Asian Down": "asian",
                    "Rise Equals/Fall Equals": "callputequal",
                    "callput-Rise/Fall": "callput",
                    "callput-Higher/Lower": "callput",
                    "touchnotouch-Touch/No Touch": "touchnotouch",
                    "endsinout-Ends Between/Ends Outside": "endsinout",
                    "staysinout-Stays Between/Goes Outside": "staysinout",
                    "Matches/Differs": "digits",
                    "Even/Odd": "digits",
                    "Over/Under": "digits",
                    "reset-Reset Call/Reset Put": "reset",
                    "High Ticks/Low Ticks": "highlowticks",
                    "runs-Only Ups/BuyOnly Downs": "runs",
                    "Buy": "accumulator"
                };

                console.log("Second dropdown value:", secondDropdown);

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                // Access the relevant contracts using the specific key
                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey];
                console.log("Category data for key:", contractTypeKey, categoryData);

                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    console.error("No contracts found for contractTypeKey:", contractTypeKey);
                    return;
                }

                // Process the filtered contracts
                const durationOptions = [];
                const seenCategories = new Set();

                let smallestValues = {
                    t: null, // Ticks
                    s: null, // Seconds
                    m: null, // Minutes
                    h: null, // Hours
                    d: null  // Days
                };

                // Extract the minimum and maximum durations from the relevant contracts
                let minDuration = null;
                let maxDuration = null;

                relevantContracts.forEach((contract) => {
                    const { min_contract_duration } = contract;
                    const { max_contract_duration } = contract;

                    // Update minDuration and maxDuration by comparing their numeric values
                    if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                        minDuration = min_contract_duration;
                    }

                    if (maxDuration === null || parseInt(min_contract_duration, 10) > parseInt(maxDuration, 10)) {
                        maxDuration = max_contract_duration;
                    }

                    // Extract the numeric part of min_contract_duration
                    const numericValue = parseInt(min_contract_duration, 10);

                    console.log(`min_contract_duration: ${min_contract_duration}, numericValue: ${numericValue}`);

                    // Update duration options and smallestValue based on the selected unit
                    if (min_contract_duration.endsWith("t") && !seenCategories.has("Ticks")) {
                        durationOptions.push({ name: "Ticks", value: "t" });
                        seenCategories.add("Ticks");
                    }
                    if (min_contract_duration.endsWith("t")) {
                        smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                    }

                    if (min_contract_duration.endsWith("s") && !seenCategories.has("Seconds")) {
                        durationOptions.push({ name: "Seconds", value: "s" });
                        seenCategories.add("Seconds");
                    }
                    if (min_contract_duration.endsWith("s")) {
                        smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                    }

                    if (min_contract_duration.endsWith("m") && !seenCategories.has("Minutes")) {
                        durationOptions.push({ name: "Minutes", value: "m" });
                        seenCategories.add("Minutes");
                    }
                    if (min_contract_duration.endsWith("m")) {
                        smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                    }

                    if (min_contract_duration.endsWith("h") && !seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        seenCategories.add("Hours");
                    }
                    if (min_contract_duration.endsWith("h")) {
                        smallestValues.h = 1; // Default to 1 for Hours
                    }

                    if (min_contract_duration.endsWith("d") && !seenCategories.has("Days")) {
                        durationOptions.push({ name: "Days", value: "d" });
                        seenCategories.add("Days");
                    }
                    if (min_contract_duration.endsWith("d")) {
                        smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                    }
                });

                // Log the extracted minimum and maximum durations
                console.log(`Min duration: ${minDuration}, Max duration: ${maxDuration}`);

                // Automatically add "Hours" if "Minutes" exists in the minimum duration and "Days" exists in the maximum duration
                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d") && !seenCategories.has("Hours")) {
                    durationOptions.push({ name: "Hours", value: "h" });
                    seenCategories.add("Hours");
                    smallestValues.h = 1; // Default to 1 for Hours
                }

                // Sort options from smallest to largest unit
                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                console.log("Filtered and sorted duration categories:", durationOptions);
                console.log("Smallest values for each duration unit:", smallestValues);

                const workspace = Blockly.getMainWorkspace();
                const DurationBlock = workspace.getBlocksByType("Duration")[0];

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("drd");
                const DurationValueField = DurationBlock.getField("drv");

                if (!DurationDropdown || !DurationValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Retain the current selection
                const currentValue = DurationDropdown.getValue();

                // Populate the dropdown with the processed and sorted categories
                const dropdownMenuOptions = durationOptions.map((option) => [option.name, option.value]);
                DurationDropdown.menuGenerator_ = dropdownMenuOptions;
                //DurationDropdown.setValue(dropdownMenuOptions[0][1]);

                // Restore the previous selection if it still exists
                const validValue = dropdownMenuOptions.find(option => option[1] === currentValue);
                if (validValue) {
                    DurationDropdown.setValue(currentValue);
                } else {
                    DurationDropdown.setValue(dropdownMenuOptions[0][1]); // Default to the first option
                }

                if (smallestValues) {
                    // Determine the currently selected unit from the dropdown
                    const selectedUnit = DurationDropdown.getValue(); // e.g., "s" for Seconds, "t" for Ticks, etc.

                    // Get the corresponding smallest value for the selected unit
                    const smallestDurationValue = smallestValues[selectedUnit];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(
                            `No valid duration numeric value found for selected unit: ${selectedUnit}`
                        );
                    }
                } else {
                    console.error("Smallest values object is undefined or invalid.");
                }

                DurationDropdown.setValidator(function(newValue) {
                    const smallestDurationValue = smallestValues[newValue];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(`No valid duration numeric value found for selected unit: ${newValue}`);
                    }

                    return newValue; // must return newValue for the change to apply
                });
            } else {
                console.error("Invalid contractData structure for Duration:", contractData);
            }
        } catch (error) {
            console.error("Error processing Duration dropdown:", error);
        }
        break;

        //case "Duration_HD":

    case "Duration_HD":
        try {
            console.log("Current dropdown values:", dropdownValues); // Debugging
            console.log("Received contractData:", contractData); // Debugging


            const workspace = Blockly.getMainWorkspace();

            const marketBlock = workspace.getBlocksByType('market')[0];
            if (!marketBlock) {
                console.error("Market block not found in workspace.");
                return;
            }

            const symbolDropdown = marketBlock.getField('sl');
            const currentSymbol = symbolDropdown.getValue();
            console.log("Market Symbol Dropdown (sl):", currentSymbol);

            const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
            const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
            const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

            // Declare variables in outer scope
            let ttt1, ttt2;

            if (tradeTypeBlock && contractTypeBlock && purchaseBlock) {
                const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
                const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
                const contractTypeDropdown = contractTypeBlock.getField('ct1');
                const purchaseDropdown = purchaseBlock.getField('Pdd');

                ttt1 = tradeTypeDropdown1.getValue();
                ttt2 = tradeTypeDropdown2.getValue();

                console.log("Trade Type Dropdown 111:", ttt1);
                console.log("Trade Type Dropdown 222:", ttt2);

                console.log("Trade Type Dropdown 1:", tradeTypeDropdown1?.getValue());
                console.log("Trade Type Dropdown 2:", tradeTypeDropdown2?.getValue());
                console.log("Contract Type Dropdown:", contractTypeDropdown?.getValue());
                console.log("Purchase Dropdown:", purchaseDropdown?.getValue());
            } else {
                console.warn("One or more required blocks not found in the workspace.");
            }

            if (
                //const { firstDropdown, secondDropdown } = dropdownValues;
                //const firstDropdown = ttt1;
                //const secondDropdown = ttt2;
                //console.log("Invalid dropdown values:", dropdownValues);

                //console.log("Trade Type firstDropdown 111:", firstDropdown);
                //console.log("Trade Type secondDropdown 222:", secondDropdown);

                contractData &&
                //contractData.success &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                //const { firstDropdown, secondDropdown } = dropdownValues;
                const firstDropdown = ttt1;
                const secondDropdown = ttt2;
                //console.log("Invalid dropdown values:", dropdownValues);

                console.log("Trade Type firstDropdown 111:", firstDropdown);
                console.log("Trade Type secondDropdown 222:", secondDropdown);

                if (!firstDropdown || !secondDropdown) {
                    console.error("Invalid dropdown values:", dropdownValues);
                    return;
                }

                // Map firstDropdown to corresponding categories in contractData
                const categoryKeys =
                    firstDropdown === "Up/Down" ? ["callput", "callputequal"] :
                    firstDropdown === "Multipliers" ? ["multiplier"] :
                    firstDropdown === "Touch/No Touch" ? ["touchnotouch"] :
                    firstDropdown === "In/Out" ? ["endsinout"] :
                    firstDropdown === "Asians" ? ["asian"] :
                    firstDropdown === "Digits" ? ["digits"] :
                    firstDropdown === "Reset Call/Reset Put" ? ["reset"] :
                    firstDropdown === "High/Low Ticks" ? ["highlowticks"] :
                    firstDropdown === "Only Ups/Only Downs" ? ["runs"] :
                    firstDropdown === "Accumulator" ? ["accumulator"] :
                    null;

                if (!categoryKeys || categoryKeys.length === 0) {
                    console.error("No categories found for firstDropdown:", firstDropdown);
                    return;
                }

                const secondDropdownMapping = {
                    "Asian Up/Asian Down": "asian",
                    "Rise Equals/Fall Equals": "callputequal",
                    "callput-Rise/Fall": "callput",
                    "callput-Higher/Lower": "callput",
                    "touchnotouch-Touch/No Touch": "touchnotouch",
                    "endsinout-Ends Between/Ends Outside": "endsinout",
                    "staysinout-Stays Between/Goes Outside": "staysinout",
                    "Matches/Differs": "digits",
                    "Even/Odd": "digits",
                    "Over/Under": "digits",
                    "reset-Reset Call/Reset Put": "reset",
                    "High Ticks/Low Ticks": "highlowticks",
                    "runs-Only Ups/Only Downs": "runs",
                    "Buy": "accumulator"
                };

                console.log("Second dropdown value:", secondDropdown);

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                // Access the relevant contracts using the specific key
                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey];
                console.log("Category data for key:", contractTypeKey, categoryData);

                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    console.error("No contracts found for contractTypeKey:", contractTypeKey);
                    return;
                }

                // Process the filtered contracts
                const durationOptions = [];
                const seenCategories = new Set();

                let smallestValues = {
                    t: null, // Ticks
                    s: null, // Seconds
                    m: null, // Minutes
                    h: null, // Hours
                    d: null  // Days
                };

                // Extract the minimum and maximum durations from the relevant contracts
                let minDuration = null;
                let maxDuration = null;

                relevantContracts.forEach((contract) => {
                    const { min_contract_duration } = contract;
                    const { max_contract_duration } = contract;

                    // Update minDuration and maxDuration by comparing their numeric values
                    if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                        minDuration = min_contract_duration;
                    }

                    if (maxDuration === null || parseInt(min_contract_duration, 10) > parseInt(maxDuration, 10)) {
                        maxDuration = max_contract_duration;
                    }

                    // Extract the numeric part of min_contract_duration
                    const numericValue = parseInt(min_contract_duration, 10);

                    console.log(`min_contract_duration: ${min_contract_duration}, numericValue: ${numericValue}`);

                    // Update duration options and smallestValue based on the selected unit
                    if (min_contract_duration.endsWith("t") && !seenCategories.has("Ticks")) {
                        durationOptions.push({ name: "Ticks", value: "t" });
                        seenCategories.add("Ticks");
                    }
                    if (min_contract_duration.endsWith("t")) {
                        smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                    }

                    if (min_contract_duration.endsWith("s") && !seenCategories.has("Seconds")) {
                        durationOptions.push({ name: "Seconds", value: "s" });
                        seenCategories.add("Seconds");
                    }
                    if (min_contract_duration.endsWith("s")) {
                        smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                    }

                    if (min_contract_duration.endsWith("m") && !seenCategories.has("Minutes")) {
                        durationOptions.push({ name: "Minutes", value: "m" });
                        seenCategories.add("Minutes");
                    }
                    if (min_contract_duration.endsWith("m")) {
                        smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                    }

                    if (min_contract_duration.endsWith("h") && !seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        seenCategories.add("Hours");
                    }
                    if (min_contract_duration.endsWith("h")) {
                        smallestValues.h = 1; // Default to 1 for Hours
                    }

                    if (min_contract_duration.endsWith("d") && !seenCategories.has("Days")) {
                        durationOptions.push({ name: "Days", value: "d" });
                        seenCategories.add("Days");
                    }
                    if (min_contract_duration.endsWith("d")) {
                        smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                    }
                });

                // Log the extracted minimum and maximum durations
                console.log(`Min duration: ${minDuration}, Max duration: ${maxDuration}`);

                // Automatically add "Hours" if "Minutes" exists in the minimum duration and "Days" exists in the maximum duration
                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d") && !seenCategories.has("Hours")) {
                    durationOptions.push({ name: "Hours", value: "h" });
                    seenCategories.add("Hours");
                    smallestValues.h = 1; // Default to 1 for Hours
                }

                // Sort options from smallest to largest unit
                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                console.log("Filtered and sorted duration categories:", durationOptions);
                console.log("Smallest values for each duration unit:", smallestValues);

                const workspace = Blockly.getMainWorkspace();
                const DurationBlock = workspace.getBlocksByType("Duration_HD")[0];

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("d1");
                const DurationValueField = DurationBlock.getField("dv");

                if (!DurationDropdown || !DurationValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Retain the current selection
                const currentValue = DurationDropdown.getValue();

                // Populate the dropdown with the processed and sorted categories
                const dropdownMenuOptions = durationOptions.map((option) => [option.name, option.value]);
                DurationDropdown.menuGenerator_ = dropdownMenuOptions;
                //DurationDropdown.setValue(dropdownMenuOptions[0][1]);

                // Restore the previous selection if it still exists
                const validValue = dropdownMenuOptions.find(option => option[1] === currentValue);
                if (validValue) {
                    DurationDropdown.setValue(currentValue);
                } else {
                    DurationDropdown.setValue(dropdownMenuOptions[0][1]); // Default to the first option
                }

                if (smallestValues) {
                    // Determine the currently selected unit from the dropdown
                    const selectedUnit = DurationDropdown.getValue(); // e.g., "s" for Seconds, "t" for Ticks, etc.

                    // Get the corresponding smallest value for the selected unit
                    const smallestDurationValue = smallestValues[selectedUnit];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(
                            `No valid duration numeric value found for selected unit: ${selectedUnit}`
                        );
                    }
                } else {
                    console.error("Smallest values object is undefined or invalid.");
                }

                DurationDropdown.setValidator(function(newValue) {
                    const smallestDurationValue = smallestValues[newValue];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(`No valid duration numeric value found for selected unit: ${newValue}`);
                    }

                    return newValue; // must return newValue for the change to apply
                });

            } else {
                console.error("Invalid contractData structure for Duration:", contractData);
            }
        } catch (error) {
            console.error("Error processing Duration dropdown:", error);
        }
        break;


        //case "Duration_T":
    case "Duration_T":
        // Global variable to store dropdown values

        try {
            console.log("Current dropdown values---------------------------------------------:", dropdownValues); // Debugging
            console.log("Received contractData:", contractData); // Debugging

            const workspace = Blockly.getMainWorkspace();

            const marketBlock = workspace.getBlocksByType('market')[0];
            if (!marketBlock) {
                console.error("Market block not found in workspace.");
                return;
            }

            const symbolDropdown = marketBlock.getField('sl');
            const currentSymbol = symbolDropdown.getValue();
            console.log("Market Symbol Dropdown (sl):", currentSymbol);

            const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
            const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
            const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

            // Declare variables in outer scope
            let ttt1, ttt2;

            if (tradeTypeBlock && contractTypeBlock && purchaseBlock) {
                const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
                const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
                const contractTypeDropdown = contractTypeBlock.getField('ct1');
                const purchaseDropdown = purchaseBlock.getField('Pdd');

                ttt1 = tradeTypeDropdown1.getValue();
                ttt2 = tradeTypeDropdown2.getValue();

                console.log("Trade Type Dropdown 111:", ttt1);
                console.log("Trade Type Dropdown 222:", ttt2);

                console.log("Trade Type Dropdown 1:", tradeTypeDropdown1?.getValue());
                console.log("Trade Type Dropdown 2:", tradeTypeDropdown2?.getValue());
                console.log("Contract Type Dropdown:", contractTypeDropdown?.getValue());
                console.log("Purchase Dropdown:", purchaseDropdown?.getValue());
            } else {
                console.warn("One or more required blocks not found in the workspace.");
            }

            if (
                contractData &&
                //contractData.success &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                //const { firstDropdown, secondDropdown } = dropdownValues;
                const firstDropdown = ttt1;
                const secondDropdown = ttt2;
                //console.log("Invalid dropdown values:", dropdownValues);

                console.log("Trade Type firstDropdown 111:", firstDropdown);
                console.log("Trade Type secondDropdown 222:", secondDropdown);

                if (!firstDropdown || !secondDropdown) {
                    console.error("Invalid dropdown values:", dropdownValues);
                    return;
                }
                //const secondDropdown = "touchnotouch-Touch/No Touch";

                // Map firstDropdown to corresponding categories in contractData
                const categoryKeys =
                    firstDropdown === "Up/Down" ? ["callput", "callputequal"] :
                    firstDropdown === "Multipliers" ? ["multiplier"] :
                    firstDropdown === "Touch/No Touch" ? ["touchnotouch"] :
                    firstDropdown === "In/Out" ? ["endsinout", "staysinout"] :
                    firstDropdown === "Asians" ? ["asian"] :
                    firstDropdown === "Digits" ? ["digits"] :
                    firstDropdown === "Reset Call/Reset Put" ? ["reset"] :
                    firstDropdown === "High/Low Ticks" ? ["highlowticks"] :
                    firstDropdown === "Only Ups/Only Downs" ? ["runs"] :
                    firstDropdown === "Accumulator" ? ["accumulator"] :
                    null;

                if (!categoryKeys || categoryKeys.length === 0) {
                    console.error("No categories found for firstDropdown:", firstDropdown);
                    return;
                }

                const secondDropdownMapping = {
                    "Asian Up/Asian Down": "asian",
                    "Rise Equals/Fall Equals": "callputequal",
                    "callput-Rise/Fall": "callput",
                    "callput-Higher/Lower": "callput",
                    "touchnotouch-Touch/No Touch": "touchnotouch",
                    "endsinout-Ends Between/Ends Outside": "endsinout",
                    "staysinout-Stays Between/Goes Outside": "staysinout",
                    "Matches/Differs": "digits",
                    "Even/Odd": "digits",
                    "Over/Under": "digits",
                    "reset-Reset Call/Reset Put": "reset",
                    "High Ticks/Low Ticks": "highlowticks",
                    "runs-Only Ups/Only Downs": "runs",
                    "Buy": "accumulator"
                };

                console.log("Second dropdown value:", secondDropdown);

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                // Access the relevant contracts using the specific key
                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey]; // contractTypeKey
                console.log("Category data for key:", contractTypeKey, categoryData);

                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    console.error("No contracts found for contractTypeKey:", contractTypeKey);
                    return;
                }

                // Process the filtered contracts
                const durationOptions = [];
                const seenCategories = new Set();

                let smallestValues = {
                    t: null, // Ticks
                    s: null, // Seconds
                    m: null, // Minutes
                    h: null, // Hours
                    d: null  // Days
                };

                // Extract the minimum and maximum durations from the relevant contracts
                let minDuration = null;
                let maxDuration = null;

                relevantContracts.forEach((contract) => {
                    const { min_contract_duration } = contract;
                    const { max_contract_duration } = contract;

                    // Update minDuration and maxDuration by comparing their numeric values
                    if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                        minDuration = min_contract_duration;
                    }

                    //if (maxDuration === null || parseInt(min_contract_duration, 10) > parseInt(maxDuration, 10)) {
                    if (maxDuration === null || parseInt(max_contract_duration, 10) > parseInt(maxDuration, 10)) {
                        maxDuration = max_contract_duration;
                    }

                    // Extract the numeric part of min_contract_duration
                    const numericValue = parseInt(min_contract_duration, 10);

                    console.log(`min_contract_duration: ${min_contract_duration}, numericValue: ${numericValue}`);

                    // Update duration options and smallestValue based on the selected unit
                    if (min_contract_duration.endsWith("t") && !seenCategories.has("Ticks")) {
                        durationOptions.push({ name: "Ticks", value: "t" });
                        seenCategories.add("Ticks");
                    }
                    if (min_contract_duration.endsWith("t")) {
                        smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                    }

                    if (min_contract_duration.endsWith("s") && !seenCategories.has("Seconds")) {
                        durationOptions.push({ name: "Seconds", value: "s" });
                        seenCategories.add("Seconds");
                    }
                    if (min_contract_duration.endsWith("s")) {
                        smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                    }

                    if (min_contract_duration.endsWith("m") && !seenCategories.has("Minutes")) {
                        durationOptions.push({ name: "Minutes", value: "m" });
                        seenCategories.add("Minutes");
                    }
                    if (min_contract_duration.endsWith("m")) {
                        smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                    }

                    if (min_contract_duration.endsWith("h") && !seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        seenCategories.add("Hours");
                    }
                    if (min_contract_duration.endsWith("h")) {
                        smallestValues.h = 1; // Default to 1 for Hours
                    }

                    if (min_contract_duration.endsWith("d") && !seenCategories.has("Days")) {
                        durationOptions.push({ name: "Days", value: "d" });
                        seenCategories.add("Days");
                    }
                    if (min_contract_duration.endsWith("d")) {
                        smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                    }
                });

                // Log the extracted minimum and maximum durations
                console.log(`Min duration: ${minDuration}, Max duration: ${maxDuration}`);

                // Automatically add "Hours" if "Minutes" exists in the minimum duration and "Days" exists in the maximum duration
                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d") && !seenCategories.has("Hours")) {
                    durationOptions.push({ name: "Hours", value: "h" });
                    seenCategories.add("Hours");
                    smallestValues.h = 1; // Default to 1 for Hours
                }

                // Sort options from smallest to largest unit
                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                console.log("Filtered and sorted duration categories:", durationOptions);
                console.log("Smallest values for each duration unit:", smallestValues);

                //const workspace = Blockly.getMainWorkspace();
                const DurationBlock = workspace.getBlocksByType("Duration_T")[0];

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("d1");
                const DurationValueField = DurationBlock.getField("dv");
                const BarrierOffsetDropdown = DurationBlock.getField("bod");
                const BarrierValueField = DurationBlock.getField("bov");

                if (!DurationDropdown || !DurationValueField || !BarrierOffsetDropdown) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Retain the current selection
                const currentValue = DurationDropdown.getValue();

                // Populate the dropdown with the processed and sorted categories
                const dropdownMenuOptions = durationOptions.map((option) => [option.name, option.value]);
                DurationDropdown.menuGenerator_ = dropdownMenuOptions;
                //DurationDropdown.setValue(dropdownMenuOptions[0][1]);

                // Restore the previous selection if it still exists
                const validValue = dropdownMenuOptions.find(option => option[1] === currentValue);
                if (validValue) {
                    DurationDropdown.setValue(currentValue);
                } else {
                    DurationDropdown.setValue(dropdownMenuOptions[0][1]); // Default to the first option
                }

                if (smallestValues) {
                    // Determine the currently selected unit from the dropdown
                    const selectedUnit = DurationDropdown.getValue(); // e.g., "s" for Seconds, "t" for Ticks, etc.

                    // Get the corresponding smallest value for the selected unit
                    const smallestDurationValue = smallestValues[selectedUnit];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(
                            `No valid duration numeric value found for selected unit: ${selectedUnit}`
                        );
                    }
                } else {
                    console.error("Smallest values object is undefined or invalid.");
                }

                DurationDropdown.setValidator(function(newValue) {
                    updateBarrierOffsetDropdown(); // This handles BarrierOffsetDropdown and BarrierValueField
                    const smallestDurationValue = smallestValues[newValue];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(`No valid duration numeric value found for selected unit: ${newValue}`);
                    }

                    return newValue; // must return newValue for the change to apply
                });

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                if (!DurationDropdown || !BarrierOffsetDropdown || !BarrierValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Determine the current selection for barrier offset (absolute or offset)
                let barrierOffsetType = BarrierOffsetDropdown.getValue(); // e.g., "ABSOLUTE" or "OFFSET_PLUS"/"OFFSET_MINUS"

                console.log("BarrierOffsetType before fetching:", barrierOffsetType);
                console.log("BarrierOffsetDropdown.getValue():", BarrierOffsetDropdown.getValue());

                // Retain the current selection for the bod dropdown
                const currentBodValue = BarrierOffsetDropdown.getValue();
                //console.log("currentBodValue??????????????????????????????????????????????????????????????????? :", currentBodValue);

                // Define options for Barrier Offset based on the selected duration unit
                const barrierOffsetOptions = {
                    default: [
                        ["Offset +", "OFFSET_PLUS"],
                        ["Offset -", "OFFSET_MINUS"],
                        ["Absolute", "ABSOLUTE"]
                    ],
                    days: [["Absolute", "ABSOLUTE"]]
                };

                // Determine the selected unit in the d1 dropdown
                const selectedUnit = DurationDropdown.getValue(); // e.g., "t" for Ticks, "s" for Seconds, etc.

                // Use the appropriate options based on the selected unit
                const availableOptions =
                    selectedUnit === "d" ? barrierOffsetOptions.days : barrierOffsetOptions.default;

                console.log(`Available options for bod:`, availableOptions);

                // Update the bod dropdown with the relevant options
                BarrierOffsetDropdown.menuGenerator_ = availableOptions;

                let previousBodValue = BarrierOffsetDropdown.getValue(); // Store initial value


                function updateBarrierOffsetDropdown() {

                    // Determine the current selection for barrier offset (absolute or offset)
                    barrierOffsetType = BarrierOffsetDropdown.getValue(); // e.g., "ABSOLUTE" or "OFFSET_PLUS"/"OFFSET_MINUS"

                    console.log("BarrierOffsetType before fetching:", barrierOffsetType);
                    console.log("BarrierOffsetType before fetching:1", BarrierOffsetDropdown.getValue());

                    // Define options for Barrier Offset based on the selected duration unit
                    const barrierOffsetOptions = {
                        default: [
                            ["Offset +", "OFFSET_PLUS"],
                            ["Offset -", "OFFSET_MINUS"],
                            ["Absolute", "ABSOLUTE"]
                        ],
                        days: [["Absolute", "ABSOLUTE"]]
                    };

                    // Determine the selected unit in the d1 dropdown
                    const selectedUnit = DurationDropdown.getValue(); // e.g., "t" for Ticks, "s" for Seconds, etc.

                    console.log("selectedUnit:", DurationDropdown.getValue());

                    // Use the appropriate options based on the selected unit
                    const availableOptions =
                        selectedUnit === "d" ? barrierOffsetOptions.days : barrierOffsetOptions.default;

                    console.log(`Available options for bod:`, availableOptions);

                    // Update the bod dropdown with the relevant options
                    BarrierOffsetDropdown.menuGenerator_ = availableOptions;

                    //previousBodValue = BarrierOffsetDropdown.getValue(); // Store initial value

                    const currentBodValue = BarrierOffsetDropdown.getValue(); // Get current value
                    const validBodValue = availableOptions.find(option => option[1] === BarrierOffsetDropdown.getValue());

                    if (validBodValue) {
                        BarrierOffsetDropdown.setValue(validBodValue[1]);  // ✅ correct
                    } else {
                        BarrierOffsetDropdown.setValue(availableOptions[0][1]);
                    }

                    const newBodValue = BarrierOffsetDropdown.getValue(); // Get updated value
                    console.log("selectedUnit:", DurationDropdown.getValue());
                    console.log("newBodValue newBodValue fetching:", validBodValue);

                    // Check if value changed
                    if (previousBodValue !== newBodValue) {
                        console.log(`BOD dropdown changes from ${previousBodValue} to ${newBodValue}`);
                    }

                    // Update previous value
                    previousBodValue = newBodValue;
                    //setBarrierOffsetValue(); // Call the function when dropdown changes
                }

                updateBarrierOffsetDropdown(); // This handles BarrierOffsetDropdown and BarrierValueField

                DurationDropdown.setValidator(function(newValue) {
                    updateBarrierOffsetDropdown(); // This handles BarrierOffsetDropdown and BarrierValueField
                    const smallestDurationValue = smallestValues[newValue];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(`No valid duration numeric value found for selected unit: ${newValue}`);
                    }

                    // ✅ Update barrier dropdown & value
                    updateBarrierOffsetDropdown(); // This handles BarrierOffsetDropdown and BarrierValueField

                    return newValue; // Important to return for the dropdown to actually change
                });

                //updateBarrierOffsetDropdown(); // This handles BarrierOffsetDropdown and BarrierValueField

                console.log(`Updated bod dropdown for selected unit (${selectedUnit}):`, BarrierOffsetDropdown.getValue());

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                if (!BarrierOffsetDropdown || !BarrierValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Initialize barrier variables
                let absoluteBarrier = null; // Largest barrier value for absolute
                let offsetBarrier = null;   // Middle barrier value for offset

                // Create an array to accumulate barrier details for all contracts
                let allBarrierDetails = [];

                // Iterate through relevant contracts to extract barrier data
                relevantContracts.forEach((contract) => {
                    const { barrier_details, minimum_duration } = contract;
                    const { min_contract_duration } = contract;
                    const { barrier, high_barrier, low_barrier } = barrier_details || {};

                    // Accumulate the contract's barrier details into the array
                    allBarrierDetails.push({
                        contract,
                        min_contract_duration,
                        barrier: barrier !== undefined ? parseFloat(barrier) : null,
                        high_barrier: high_barrier !== undefined ? parseFloat(high_barrier) : null,
                        low_barrier: low_barrier !== undefined ? parseFloat(low_barrier) : null,
                    });
                });

                // Log all barrier details at once
                console.log("All Barrier Details:", allBarrierDetails);

                // Extract all valid barrier values into an array
                const validBarriers = allBarrierDetails
                    .map(detail => detail.barrier)
                    //.filter(value => value !== null) // Remove null or undefined values
                    .filter(value => value !== null && !isNaN(value)) // Remove NaN values
                    .sort((a, b) => a - b); // Sort numerically

                if (validBarriers.length > 0) {
                    // Determine absoluteBarrier (largest value)
                    absoluteBarrier = validBarriers[validBarriers.length - 1];

                    // Determine offsetBarrier (middle value)
                    const middleIndex = Math.floor(validBarriers.length / 2);
                    offsetBarrier = validBarriers[middleIndex];

                    // Log the barriers
                    console.log("Absolute Barrier (Largest):", absoluteBarrier);
                    console.log("Offset Barrier (Middle):", offsetBarrier);
                } else {
                    console.error("No valid barriers found in the list.");
                }

                barrierOffsetType = BarrierOffsetDropdown.getValue();

                // Retain the current selection for the bod dropdown
                //const currentBodValue = BarrierOffsetDropdown.getValue();
                console.log("barrierOffsetType??????????????????????????????????????????????????????????????????? :", barrierOffsetType);

                function setBarrierOffsetValue() {
                    // Get the current value from the Barrier Offset dropdown
                    barrierOffsetType = BarrierOffsetDropdown.getValue();
                    console.log("Current barrierOffsetType:", barrierOffsetType);

                    // Determine the barrier value to set
                    let barrierValue = null;

                    if (barrierOffsetType === "ABSOLUTE") {
                        barrierValue = absoluteBarrier;
                        console.log("Using Absolute Barrier:", barrierValue);
                    } else if (barrierOffsetType === "OFFSET_PLUS" || barrierOffsetType === "OFFSET_MINUS") {
                        barrierValue = offsetBarrier;
                        console.log("Using Offset Barrier:", barrierValue);
                    }

                    console.log("Using  barrierOffsetType }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}:", barrierOffsetType);

                    // Ensure barrierValue is valid before setting it
                    if (barrierValue !== null) {
                        BarrierValueField.setValue(barrierValue);
                        console.log(`Barrier value set to: ${barrierValue} for type: ${barrierOffsetType}`);
                    } else {
                        console.error("No valid barrier value found to set.");
                    }

                    // Debugging logs
                    console.log(`Final absoluteBarrier: ${absoluteBarrier}`);
                    console.log(`Final offsetBarrier: ${offsetBarrier}`);
                }

                // Attach event listener to track dropdown changes
                BarrierOffsetDropdown.setValidator((newValue) => {
                    if (newValue !== previousBodValue) {
                        console.log(`BOD dropdown changes from ${previousBodValue} to ${newValue}`);
                    }
                    barrierOffsetType = newValue;
                    setBarrierOffsetValue(); // Call the function when dropdown changes
                    previousBodValue = newValue; // Update stored value
                    return newValue; // Allow change
                });

                updateBarrierOffsetDropdown();

                setBarrierOffsetValue();

            } else {
                console.error("Invalid contractData structure for Duration:", contractData);
            }
        } catch (error) {
            console.error("Error processing Duration dropdown:", error);
        }
        break;

        //case "Duration_I":
    case "Duration_I":

        try {
            console.log("Current dropdown values:", dropdownValues); // Debugging
            console.log("Received contractData:", contractData); // Debugging

            if (contractData &&/*contractData.success &&*/ contractData.data && typeof contractData.data === "object"
            ) {
                const { firstDropdown, secondDropdown } = dropdownValues;

                if (!firstDropdown || !secondDropdown) {
                    console.error("Invalid dropdown values:", dropdownValues);
                    return;
                }

                //Map firstDropdown to corresponding categories in contractData
                const categoryKeys =
                    firstDropdown === "Up/Down" ? ["callput", "callputequal"] :
                    firstDropdown === "Multipliers" ? ["multiplier"] :
                    firstDropdown === "Touch/No Touch" ? ["touchnotouch"] :
                    firstDropdown === "In/Out" ? ["endsinout", "staysinout"] :
                    firstDropdown === "Asians" ? ["asian"] :
                    firstDropdown === "Digits" ? ["digits"] :
                    firstDropdown === "Reset Call/Reset Put" ? ["reset"] :
                    firstDropdown === "High/Low Ticks" ? ["highlowticks"] :
                    firstDropdown === "Only Ups/Only Downs" ? ["runs"] :
                    firstDropdown === "Accumulator" ? ["accumulator"] :
                    null;

                if (!categoryKeys || categoryKeys.length === 0) {
                    console.error("No categories found for firstDropdown:", firstDropdown);
                    return;
                }

                const secondDropdownMapping = {
                    "Asian Up/Asian Down": "asian",
                    "Rise Equals/Fall Equals": "callputequal",
                    "callput-Rise/Fall": "callput",
                    "callput-Higher/Lower": "callput",
                    "touchnotouch-Touch/No Touch": "touchnotouch",
                    "endsinout-Ends Between/Ends Outside": "endsinout",
                    "staysinout-Stays Between/Goes Outside": "staysinout",
                    "Matches/Differs": "digits",
                    "Even/Odd": "digits",
                    "Over/Under": "digits",
                    "reset-Reset Call/Reset Put": "reset",
                    "High Ticks/Low Ticks": "highlowticks",
                    "runs-Only Ups/Only Downs": "runs",
                    "Buy": "accumulator"
                };

                console.log("Second dropdown value:", secondDropdown);

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                // Access the relevant contracts using the specific key
                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey];
                console.log("Category data for key:", contractTypeKey, categoryData);

                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    console.error("No contracts found for contractTypeKey:", contractTypeKey);
                    return;
                }

                // Process the filtered contracts
                const durationOptions = [];
                const seenCategories = new Set();

                let smallestValues = {
                    t: null, // Ticks
                    s: null, // Seconds
                    m: null, // Minutes
                    h: null, // Hours
                    d: null  // Days
                };

                // Extract the minimum and maximum durations from the relevant contracts
                let minDuration = null;
                let maxDuration = null;

                relevantContracts.forEach((contract) => {
                    const { min_contract_duration } = contract;
                    const { max_contract_duration } = contract;

                    // Update minDuration and maxDuration by comparing their numeric values
                    if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                        minDuration = min_contract_duration;
                    }

                    if (maxDuration === null || parseInt(min_contract_duration, 10) > parseInt(maxDuration, 10)) {
                        maxDuration = max_contract_duration;
                    }

                    // Extract the numeric part of min_contract_duration
                    const numericValue = parseInt(min_contract_duration, 10);

                    console.log(`min_contract_duration: ${min_contract_duration}, numericValue: ${numericValue}`);

                    // Update duration options and smallestValue based on the selected unit
                    if (min_contract_duration.endsWith("t") && !seenCategories.has("Ticks")) {
                        durationOptions.push({ name: "Ticks", value: "t" });
                        seenCategories.add("Ticks");
                    }
                    if (min_contract_duration.endsWith("t")) {
                        smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                    }

                    if (min_contract_duration.endsWith("s") && !seenCategories.has("Seconds")) {
                        durationOptions.push({ name: "Seconds", value: "s" });
                        seenCategories.add("Seconds");
                    }
                    if (min_contract_duration.endsWith("s")) {
                        smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                    }

                    if (min_contract_duration.endsWith("m") && !seenCategories.has("Minutes")) {
                        durationOptions.push({ name: "Minutes", value: "m" });
                        seenCategories.add("Minutes");
                    }
                    if (min_contract_duration.endsWith("m")) {
                        smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                    }

                    if (min_contract_duration.endsWith("h") && !seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        seenCategories.add("Hours");
                    }
                    if (min_contract_duration.endsWith("h")) {
                        smallestValues.h = 1; // Default to 1 for Hours
                    }

                    if (min_contract_duration.endsWith("d") && !seenCategories.has("Days")) {
                        durationOptions.push({ name: "Days", value: "d" });
                        seenCategories.add("Days");
                    }
                    if (min_contract_duration.endsWith("d")) {
                        smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                    }
                });

                // Log the extracted minimum and maximum durations
                console.log(`Min duration: ${minDuration}, Max duration: ${maxDuration}`);

                // Automatically add "Hours" if "Minutes" exists in the minimum duration and "Days" exists in the maximum duration
                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d") && !seenCategories.has("Hours")) {
                    durationOptions.push({ name: "Hours", value: "h" });
                    seenCategories.add("Hours");
                    smallestValues.h = 1; // Default to 1 for Hours
                }

                // Sort options from smallest to largest unit
                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                console.log("Filtered and sorted duration categories:", durationOptions);
                console.log("Smallest values for each duration unit:", smallestValues);

                const workspace = Blockly.getMainWorkspace();
                const DurationBlock = workspace.getBlocksByType("Duration_I")[0];

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("d1");
                const DurationValueField = DurationBlock.getField("dv");

                if (!DurationDropdown || !DurationValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Retain the current selection
                const currentValue = DurationDropdown.getValue();

                // Populate the dropdown with the processed and sorted categories
                const dropdownMenuOptions = durationOptions.map((option) => [option.name, option.value]);
                DurationDropdown.menuGenerator_ = dropdownMenuOptions;
                //DurationDropdown.setValue(dropdownMenuOptions[0][1]);

                // Restore the previous selection if it still exists
                const validValue = dropdownMenuOptions.find(option => option[1] === currentValue);
                if (validValue) {
                    DurationDropdown.setValue(currentValue);
                } else {
                    DurationDropdown.setValue(dropdownMenuOptions[0][1]); // Default to the first option
                }

                if (smallestValues) {
                    // Determine the currently selected unit from the dropdown
                    const selectedUnit = DurationDropdown.getValue(); // e.g., "s" for Seconds, "t" for Ticks, etc.

                    // Get the corresponding smallest value for the selected unit
                    const smallestDurationValue = smallestValues[selectedUnit];

                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                    } else {
                        console.error(
                            `No valid duration numeric value found for selected unit: ${selectedUnit}`
                        );
                    }
                } else {
                    console.error("Smallest values object is undefined or invalid.");
                }

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const BarrierOffsetDropdown = DurationBlock.getField("bod");
                const LowerBarrierOffsetDropdown = DurationBlock.getField("lbod");
                const BarrierValueField = DurationBlock.getField("bov");
                const LowerBarrierValueField = DurationBlock.getField("lbov");

                if (!BarrierOffsetDropdown || !BarrierValueField || !LowerBarrierOffsetDropdown || !LowerBarrierValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Retain the current selection for the bod dropdown
                const currentBodValue = BarrierOffsetDropdown.getValue();
                console.log("Barrier Offset Type:", currentBodValue);

                // Retain the current selection for the lbod dropdown
                const currentlBodValue = LowerBarrierOffsetDropdown.getValue();
                console.log("Lower Barrier Offset Type:", currentlBodValue);

                // Define options for Barrier Offset based on the selected duration unit
                const bodOptions = {
                    default: [
                        ["Offset +", "OFFSET_PLUS"],
                        ["Offset -", "OFFSET_MINUS"],
                        ["Absolute", "ABSOLUTE"]
                    ],
                    days: [["Absolute", "ABSOLUTE"]]
                };

                const lbodOptions = {
                    default: [
                        ["Offset -", "OFFSET_PLUS"],
                        ["Offset +", "OFFSET_MINUS"],
                        ["Absolute", "ABSOLUTE"]
                    ],
                    days: [["Absolute", "ABSOLUTE"]]
                };

                // Determine the selected unit in the d1 dropdown
                const selectedUnit = DurationDropdown.getValue(); // e.g., "t" for Ticks, "s" for Seconds, etc.

                // Use the appropriate options based on the selected unit
                const bodavailableOptions =
                    selectedUnit === "d" ? bodOptions.days: bodOptions.default;
               const lbodavailableOptions =
                    selectedUnit === "d" ? lbodOptions.days: lbodOptions.default;

                console.log(`Available options for bod:`, bodavailableOptions);
                console.log(`Available options for lbod:`, lbodavailableOptions);

                // Update the bod dropdown with the relevant options
                BarrierOffsetDropdown.menuGenerator_ = bodavailableOptions;
                LowerBarrierOffsetDropdown.menuGenerator_ = lbodavailableOptions;

                // Restore the previous selection if it still exists, otherwise default to the first option
                const validBodValue = bodavailableOptions.find(option => option[1] === currentBodValue);
                if (validBodValue) {
                    BarrierOffsetDropdown.setValue(currentBodValue);
                } else {
                    BarrierOffsetDropdown.setValue(bodavailableOptions[0][1]);
                }

                // Restore the previous selection if it still exists, otherwise default to the first option
                const validlBodValue = lbodavailableOptions.find(option => option[1] === currentlBodValue);
                if (validlBodValue) {
                    LowerBarrierOffsetDropdown.setValue(currentlBodValue);
                } else {
                    LowerBarrierOffsetDropdown.setValue(lbodavailableOptions[0][1]);
                }

                console.log(`Updated bod dropdown for selected unit (${selectedUnit}):`, bodavailableOptions);


                if (!BarrierOffsetDropdown || !LowerBarrierOffsetDropdown) {
                    console.error("Missing dropdown fields.");
                    return;
                }

                let isPopulating = false;

                function handleDropdownLogic(changedDropdown, otherDropdown, newValue, selectedUnit) {
                    console.log(`Handling logic for ${changedDropdown.name} with value ${newValue}`);

                    // General logic (when dropdowns are not both "ABSOLUTE")
                    if (newValue === "OFFSET_PLUS") {
                        if (otherDropdown.getValue() === "ABSOLUTE") {
                            otherDropdown.setValue("OFFSET_PLUS");
                        }
                    } else if (newValue === "OFFSET_MINUS") {
                        if (otherDropdown.getValue() === "ABSOLUTE") {
                            otherDropdown.setValue("OFFSET_MINUS");
                        }
                    } else if (newValue === "ABSOLUTE") {
                        if (otherDropdown.getValue() !== "ABSOLUTE") {
                            otherDropdown.setValue("ABSOLUTE");
                        }
                    }
                }

                function handleDropdownChange(changedDropdown, otherDropdown, newValue) {
                    if (isPopulating) {
                        return newValue; // Prevent recursion
                    }

                    isPopulating = true; // Prevent further changes during population

                    // Temporarily disable the validators to avoid infinite loops
                    const originalValidator1 = changedDropdown.getValidator();
                    const originalValidator2 = otherDropdown.getValidator();
                    changedDropdown.setValidator(null);
                    otherDropdown.setValidator(null);

                    // Get the currently selected unit in the DurationDropdown
                    const selectedUnit = DurationDropdown.getValue();

                    // Call the logic handler with the current dropdown values
                    handleDropdownLogic(changedDropdown, otherDropdown, newValue, selectedUnit);

                    // Restore validators
                    changedDropdown.setValidator(originalValidator1);
                    otherDropdown.setValidator(originalValidator2);

                    isPopulating = false; // Allow changes again

                    return newValue; // Return the new value
                }

                // Set validators for the dropdowns
                BarrierOffsetDropdown.setValidator((newValue) => {
                    return handleDropdownChange(BarrierOffsetDropdown, LowerBarrierOffsetDropdown, newValue);
                });

                LowerBarrierOffsetDropdown.setValidator((newValue) => {
                    return handleDropdownChange(LowerBarrierOffsetDropdown, BarrierOffsetDropdown, newValue);
                });

                // Ensure all necessary fields are available
                if (!BarrierOffsetDropdown || !LowerBarrierOffsetDropdown || !BarrierValueField || !LowerBarrierValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // Determine the current selection for barrier offset (absolute or offset)
                const barrierOffsetType = BarrierOffsetDropdown.getValue(); // e.g., "ABSOLUTE" or "OFFSET_PLUS"/"OFFSET_MINUS"
                const lowerBarrierOffsetType = LowerBarrierOffsetDropdown.getValue(); // e.g., "ABSOLUTE" or "OFFSET_PLUS"/"OFFSET_MINUS"

                // Initialize barrier variables for bov and lbov
                let absoluteHighBarrier = null; // Largest high barrier value for absolute
                let absoluteLowBarrier = null;  // Largest low barrier value for absolute
                let offsetHighBarrier = null;   // Smallest high barrier value for offset
                let offsetLowBarrier = null;    // Smallest low barrier value for offset

                // Separate lists to store high and low barriers from all contracts
                let highBarriers = [];
                let lowBarriers = [];

                // Iterate through relevant contracts to extract high and low barrier data
                relevantContracts.forEach((contract) => {
                    const { barrier_details } = contract;
                    const { high_barrier, low_barrier } = barrier_details || {};

                    // Add parsed high and low barriers to their respective lists
                    if (high_barrier !== undefined) {
                        highBarriers.push(parseFloat(high_barrier));
                    }
                    if (low_barrier !== undefined) {
                        lowBarriers.push(parseFloat(low_barrier));
                    }
                });

                // Log all barrier details for debugging
                console.log("High Barriers:", highBarriers);
                console.log("Low Barriers:", lowBarriers);

                // Process the barrier lists to find the required values
                if (highBarriers.length > 0) {
                    // Sort the high barriers to get the largest and smallest values
                    highBarriers.sort((a, b) => a - b);
                    absoluteHighBarrier = highBarriers[highBarriers.length - 1]; // Largest value
                    offsetHighBarrier = highBarriers[0]; // Smallest value
                }

                if (lowBarriers.length > 0) {
                    // Sort the low barriers to get the largest and smallest values
                    lowBarriers.sort((a, b) => a - b);
                    absoluteLowBarrier = lowBarriers[lowBarriers.length - 1]; // Largest value
                    offsetLowBarrier = lowBarriers[0]; // Smallest value
                }

                // Log processed barrier values
                console.log("Absolute High Barrier (Largest):", absoluteHighBarrier);
                console.log("Offset High Barrier (Smallest):", offsetHighBarrier);
                console.log("Absolute Low Barrier (Largest):", absoluteLowBarrier);
                console.log("Offset Low Barrier (Smallest):", offsetLowBarrier);

                // Determine the values to set for bov and lbov
                let bovValue = null;
                let lbovValue = null;

                if (barrierOffsetType === "ABSOLUTE") {
                    bovValue = absoluteHighBarrier;
                    console.log("Using Absolute High Barrier for bov:", bovValue);
                } else if (barrierOffsetType === "OFFSET_PLUS" || barrierOffsetType === "OFFSET_MINUS") {
                    bovValue = offsetHighBarrier;
                    console.log("Using Offset High Barrier for bov:", bovValue);
                }

                if (lowerBarrierOffsetType === "ABSOLUTE") {
                    lbovValue = absoluteLowBarrier;
                    console.log("Using Absolute Low Barrier for lbov:", lbovValue);
                } else if (lowerBarrierOffsetType === "OFFSET_PLUS" || lowerBarrierOffsetType === "OFFSET_MINUS") {
                    lbovValue = offsetLowBarrier;
                    console.log("Using Offset Low Barrier for lbov:", lbovValue);
                }

                // Remove negative signs from values
                if (bovValue !== null) {
                    bovValue = Math.abs(bovValue);
                }

                if (lbovValue !== null) {
                    lbovValue = Math.abs(lbovValue);
                }

                // Check for matching offset types and modify lbov if needed
                if (
                    (barrierOffsetType === "OFFSET_PLUS" && lowerBarrierOffsetType === "OFFSET_MINUS") ||
                    (barrierOffsetType === "OFFSET_MINUS" && lowerBarrierOffsetType === "OFFSET_PLUS")
                ) {
                    if (lbovValue !== null) {
                        const lbovStr = lbovValue.toString();
                        const decimalIndex = lbovStr.indexOf('.');
                        if (decimalIndex !== -1) {
                            lbovValue = parseFloat(lbovStr.slice(0, decimalIndex + 2)); // Keep only one decimal place
                        }
                    }
                    console.log("Modified lbov value to have one decimal place:", lbovValue);
                }

                // Ensure values are valid before setting them
                if (bovValue !== null) {
                    BarrierValueField.setValue(bovValue);
                    console.log(`bov value set to: ${bovValue} for type: ${barrierOffsetType}`);
                } else {
                    console.error("No valid value found to set for bov.");
                }

                if (lbovValue !== null) {
                    LowerBarrierValueField.setValue(lbovValue);
                    console.log(`lbov value set to: ${lbovValue} for type: ${lowerBarrierOffsetType}`);
                } else {
                    console.error("No valid value found to set for lbov.");
                }

                // Log final values for verification
                console.log(`Final bov value: ${bovValue}`);
                console.log(`Final lbov value: ${lbovValue}`);
            } else {
                console.error("Invalid contractData structure for Duration:", contractData);
            }
        } catch (error) {
            console.error("Error processing Duration dropdown:", error);
        }
        break;
        default:
        console.warn(`No specific handling for block type: ${blockType}`);
    }
}

// Global variable to store dropdown values
let dropdownValues = {
    firstDropdown: null,
    secondDropdown: null,
    contractDropdown: null,
};

async function waitForBlockType() {
    while (
        typeof blockType === 'undefined' ||
        blockType === null ||
        blockType === '' ||
        blockType === 'null'
    ) {
        console.log("⏳ Waiting for blockType to be defined...");
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log("✅ blockType is ready:", blockType);
    manageDynamicBlock(blockType);
    populateBlockDropdowns(blockType);
}

function populateTradeTypeDropdowns(selectedSymbol, assetData) {
    //assetData = window.WS_DATA.contractData;
    const workspace = Blockly.getMainWorkspace();
    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
    const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
    const purchaseBlock = workspace.getBlocksByType('Purchase')[0];
    console.log("Using Offset aelectd ssyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyymbol:", selectedSymbol);
    console.log("Using Offset aseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet:", assetData);

    if (!purchaseBlock) {
        console.error("purchaseBlock blocks not found in workspace.");
        return;
    }

    if (!tradeTypeBlock) {
        console.error("tradeTypeBlock blocks not found in workspace.");
        return;
    }

    if (!contractTypeBlock) {
        console.error("contractTypeBlock blocks not found in workspace.");
        return;
    }
    const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
    const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
    const contractTypeDropdown = contractTypeBlock.getField('ct1');
    const purchaseDropdown = purchaseBlock.getField('Pdd');

    const assetEntry = assetData.find(asset => {
        console.log("Checking asset:", asset.symbol);
        return asset.symbol === selectedSymbol;
    });

    console.log("✅ ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅Found Asset:", assetEntry);

    const categoryMappings = {
        "Up/Down": ["callput", "callputequal"],
        "Touch/No Touch": ["touchnotouch"],
        "In/Out": ["endsinout", "staysinout"],
        "Multipliers": ["multiplier"],
        "Asians": ["asian"],
        "Digits": ["digits"],
        "Reset Call/Reset Put": ["reset"],
        "High/Low Ticks": ["highlowticks"],
        "Only Ups/Only Downs": ["runs"],
        "Accumulators": ["accumulator"],
    };

    const predefinedOptions = {
        "High/Low Ticks": [["High Ticks/Low Ticks", "High Ticks/Low Ticks"]],
        "Accumulators": [["Buy", "Buy"]],
        "Multipliers": [["Up/Down", "Up/Down"]],
        "Asians": [["Asian Up/Asian Down", "Asian Up/Asian Down"]],
        "Digits": [
            ["Matches/Differs", "Matches/Differs"],
            ["Even/Odd", "Even/Odd"],
            ["Over/Under", "Over/Under"]
        ],
        "callputequal": [["Rise Equals/Fall Equals", "Rise Equals/Fall Equals"]]
    };

    function getCategoryMappings(symbolOptions) {
        const categories = {};
        for (const [category, types] of Object.entries(categoryMappings)) {
            const matchingOptions = symbolOptions.filter(option => types.includes(option.contract_type));
            if (matchingOptions.length > 0) {
                categories[category] = matchingOptions;
            }
        }
        return categories;
    }

    const symbolCategories = getCategoryMappings(assetEntry.options);
    const firstDropdownOptions = Object.keys(symbolCategories).map(name => [name, name]);

    // Preserve previously selected values
    let previousFirstDropdownValue = tradeTypeDropdown1.getValue();
    let previousSecondDropdownValue = tradeTypeDropdown2.getValue();
    let previousContractDropdownValue = contractTypeDropdown.getValue();

    // Update first dropdown options
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    const newFirstDropdownValue = firstDropdownOptions.find(opt => opt[1] === previousFirstDropdownValue)
        ? previousFirstDropdownValue
        : firstDropdownOptions[0][1];
    tradeTypeDropdown1.setValue(newFirstDropdownValue);

    // Print the desired statement
    console.log(`tradeTypeDropdown1.setValue(${newFirstDropdownValue});`);

    function updateSecondDropdown(selectedCategory) {
        let secondDropdownOptions = [];

        const hasCallPutEqual = symbolCategories[selectedCategory] &&
            symbolCategories[selectedCategory].some(option => option.contract_type === "callputequal");

        const hasCallPut = symbolCategories[selectedCategory] &&
            symbolCategories[selectedCategory].some(option => option.contract_type === "callput");

        if (hasCallPutEqual || hasCallPut) {
            if (hasCallPut) {
                const callPutOptions = symbolCategories[selectedCategory].filter(option => option.contract_type === "callput");
                secondDropdownOptions = callPutOptions.map(option => [
                    option.name,
                    option.contract_type + '-' + option.name
                ]);
            }

            if (hasCallPutEqual && predefinedOptions["callputequal"]) {
                secondDropdownOptions.push(predefinedOptions["callputequal"][0]);
            }
        } else if (predefinedOptions[selectedCategory]) {
            secondDropdownOptions = predefinedOptions[selectedCategory];
        } else {
            const contractOptions = symbolCategories[selectedCategory] || [];
            secondDropdownOptions = contractOptions.map(option => [
                option.name,
                option.contract_type + '-' + option.name
            ]);

            if (secondDropdownOptions.length === 0) {
                secondDropdownOptions.push(["No options available", "no_option"]);
            }
        }

        // Preserve previous selection in second dropdown
        const newSecondDropdownValue = secondDropdownOptions.find(opt => opt[1] === previousSecondDropdownValue)
            ? previousSecondDropdownValue
            : secondDropdownOptions[0][1];

        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(newSecondDropdownValue);

        updateContractTypeOptions(newSecondDropdownValue);
    }

    function updateContractTypeOptions(optionValue) {
        const cleanOptionValue = optionValue.includes('-') ? optionValue.split('-')[1] : optionValue;

        let contractTypeOptions;
        if (cleanOptionValue.includes('/')) {
            const [firstPart, secondPart] = cleanOptionValue.split('/');
            contractTypeOptions = [
                ["Both", "both"],
                [firstPart.trim(), firstPart.trim()],
                [secondPart.trim(), secondPart.trim()]
            ];
        } else {
            contractTypeOptions = [[cleanOptionValue, cleanOptionValue]];
        }

        // Preserve previous selection in contract dropdown
        const newContractDropdownValue = contractTypeOptions.find(opt => opt[1] === previousContractDropdownValue)
            ? previousContractDropdownValue
            : contractTypeOptions[0][1];

        contractTypeDropdown.menuGenerator_ = contractTypeOptions;
        contractTypeDropdown.setValue(newContractDropdownValue);

        // Log initial values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        waitForPurchaseOptions();
        //updatePurchaseDropdownOptions (newContractDropdownValue, contractTypeOptions);

    }

    async function waitForPurchaseOptions() {
        while (
            !contractTypeDropdown?.menuGenerator_ ||               // Wait for options to be loaded
            !contractTypeDropdown.menuGenerator_.length ||         // Make sure it has items
            !contractTypeDropdown?.getValue() ||                   // Wait for current value
            contractTypeDropdown.getValue() === 'null' ||
            contractTypeDropdown.getValue() === ''
        ) {
            console.log("⏳ Waiting for contract type and options...");
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        const currentValue = contractTypeDropdown.getValue();
        const options = contractTypeDropdown.menuGenerator_;

        console.log("✅ Purchase options ready. Updating for:", currentValue);
        updatePurchaseDropdownOptions(currentValue, options);
    }

    function updatePurchaseDropdownOptions(currentContractValue, contractDropdownOptions) {
        console.log(`All available contract dropdown options:`, contractDropdownOptions);
        let purchaseDropdownOptions = []; // Array to store options for the Purchase dropdown

        if (currentContractValue === "both") {
            // Extract options excluding "Both"
            purchaseDropdownOptions = contractDropdownOptions.filter(option => option[1] !== "both");
        } else {
            // If not "Both," use only the current value
            purchaseDropdownOptions = [[currentContractValue, currentContractValue]];
        }

        // Update the menu generator for the purchase dropdown
        purchaseDropdown.menuGenerator_ = purchaseDropdownOptions;

        // Set the default value of the purchase dropdown to the first available option
        const newDefaultValue = purchaseDropdownOptions[0][1];
        purchaseDropdown.setValue(newDefaultValue);

        console.log(`Purchase dropdown updated with options:`, purchaseDropdownOptions);
        console.log(`Default value set for Purchase dropdown: ${newDefaultValue}`);
    }

    // Set a validator to detect changes in the dropdown
    tradeTypeDropdown1.setValidator((newValue) => {
        console.log(`🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔🔔 Dropdown updated! New Value: ${newValue}`);
        console.log(`tradeTypeDropdown1 changed fromMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ${previousFirstDropdownValue} to ${newValue}`);

        // Update stored values when the dropdown changes
        dropdownValues.firstDropdown = newValue;
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        updateSecondDropdown(newValue);

        // Log the updated dropdownValues
        //console.log("Updated dropdownValues:", dropdownValues);
        console.log("%c Updated dropdownValues:", "font-weight: bold; color: blue;", dropdownValues);

        // Update previous value for the next change detection
        previousFirstDropdownValue = newValue;
        waitForBlockType();

        return newValue; // Allow the change
    });

    updateSecondDropdown(tradeTypeDropdown1.getValue());

    contractTypeDropdown.setValidator(newValue => {
        console.log("📦 Contract type selected:", newValue);

        // Update dropdown tracking values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = newValue;

        // Update purchase dropdowns or any logic tied to contract type
        updatePurchaseDropdownOptions(newValue, contractTypeDropdown.menuGenerator_);
        waitForBlockType();
        //waitForPurchaseOptions();
        return newValue; // Always return the selected value
    });

    // Set validator with block management logic in tradeTypeDropdown2
    tradeTypeDropdown2.setValidator(newValue => {
        updateContractTypeOptions(newValue);

        const newBlockType = {
            "Buy": "Growth_Rate",
            "Up/Down": "Multiplier",
            "callput-Higher/Lower": "Duration_T",
            "Matches/Differs": "Duration_HD",
            "Over/Under": "Duration_HD",
            "High Ticks/Low Ticks": "Duration_HD",
            "touchnotouch-Touch/No Touch": "Duration_T",
            "endsinout-Ends Between/Ends Outside": "Duration_I",
            "staysinout-Stays Between/Goes Outside": "Duration_I",
        }[newValue] || "Duration";

        blockType = newBlockType;
        console.log("Block type set tooo22222222222222222222222222AAAAAAAAAAAAAAAAAooooooooooooooooooooooooo:", blockType);

        // Log initial values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        //manageDynamicBlock(toInput, newBlockType);
        //manageDynamicBlock(newBlockType);
        //fetchContracts(selectedSymbol);
        //populateBlockDropdowns(newBlockType);
        waitForBlockType();

        return newValue;
    });

    // Log initial values
    /*dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
    dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
    dropdownValues.contractDropdown = contractTypeDropdown.getValue();*/
    //manageDynamicBlock(blockType);
    //populateBlockDropdowns(blockType);
    waitForBlockType();
    //populateTT1();
}

//console.log(typeof tradeParametersBlocks); // Output should be "object"
/*
const myTheme = Blockly.Theme.defineTheme('myTheme', {
  'blockStyles': {
    'math_blocks': {
      'colourPrimary': '#e5e5e5',  // Light gray color for math blocks
      'colourSecondary': '#b3b3b3',  // Optional secondary color
      'colourTertiary': '#999999'  // Optional tertiary color for borders
    },
    'logic_blocks': {
      'colourPrimary': '#e5e5e5',  // Blue color for logic blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'loop_blocks': {
      'colourPrimary': '#e5e5e5',  // Orange color for loop blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'list_blocks': {
      'colourPrimary': '#e5e5e5',  // Purple color for list blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'text_blocks': {
      'colourPrimary': '#e5e5e5',  // Green color for text blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    }
  },
  'componentStyles': {
    //'workspaceBackgroundColour': '#f4f4f4',  // Optional workspace background color
    //'scrollbarColour': '#888'  // Optional scrollbar color
  }
});
*/
/*
const myTheme = Blockly.Theme.defineTheme('myTheme', {
  'blockStyles': {
    'math_blocks': {
      'colourPrimary': '#e5e5e5',
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'logic_blocks': {
      'colourPrimary': '#e5e5e5',
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'loop_blocks': {
      'colourPrimary': '#e5e5e5',
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'list_blocks': {
      'colourPrimary': '#e5e5e5',
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'text_blocks': {
      'colourPrimary': '#e5e5e5',
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    variable_blocks: {
      colourPrimary: '#e5e5e5',
      colourSecondary: '#b3b3b3',
      colourTertiary: '#999999'
    }
  },
    componentStyles: {
    fieldTextColour: '#000000', // 🔥 sets ALL field text (including variable name)
  },
  'componentStyles': {
    'flyoutForegroundColour': '#000000', // Black text/icons in the flyout
    'flyoutBackgroundColour': '#ffffff', // Optional: white background
    'flyoutOpacity': 1                   // Optional: fully opaque
    //'dropdownTextColour': '#000000'  // Ensures dropdown text is black
    // You can optionally add other component styles here
    // 'workspaceBackgroundColour': '#f4f4f4',
    // 'scrollbarColour': '#888'
  }
});
*/
/*
const baseGrey = {
  colourPrimary: '#e5e5e5',
  colourSecondary: '#b3b3b3',
  colourTertiary: '#999999',
  hat: '' // Add this to apply rounded top edge (optional)
};
*/
/*
baseGrey = {
  colourPrimary: '#e5e5e5',
  colourSecondary: '#b3b3b3',
  colourTertiary: '#999999',
  hat: '' // Add this to apply rounded top edge (optional)
};

myTheme = Blockly.Theme.defineTheme('myTheme', {
  blockStyles: {
    math_blocks: baseGrey,
    logic_blocks: baseGrey,
    loop_blocks: baseGrey,
    list_blocks: baseGrey,
    text_blocks: baseGrey,
    variable_blocks: baseGrey
  },
  categoryStyles: {
    math_category: { colour: '#e5e5e5' },
    logic_category: { colour: '#e5e5e5' },
    loop_category: { colour: '#e5e5e5' },
    list_category: { colour: '#e5e5e5' },
    text_category: { colour: '#e5e5e5' },
    variable_category: { colour: '#e5e5e5' }
  },
  componentStyles: {
    flyoutForegroundColour: '#000000',
    flyoutBackgroundColour: '#ffffff',
    flyoutOpacity: 1,
    fieldTextColour: '#000000'
  }
});
*/
const blockSections = {
    /*'trade_param': Blockly.utils.xml.textToDom(tradeParametersBlocks),
    'purchase_cond': Blockly.utils.xml.textToDom(purchaseConditionsBlocks),
    'sell_cond': Blockly.utils.xml.textToDom(sellConditionsBlocks),
    'restart_trading': Blockly.utils.xml.textToDom(restartTradingConditionsBlocks)*/
};

class CustomBlockDragger extends Blockly.dragging.Dragger {
    constructor(draggable, workspace) {
        super(draggable, workspace);
        // Add any custom initialization here if needed
    }

    onDragStart(e) {
        this.startLoc = this.draggable.getRelativeToSurfaceXY(); // Save starting location
        this.draggable.startDrag(e); // Start the drag with the event
        console.log('Custom drag started');
    }

    onDrag(e, totalDelta) {
        const delta = this.pixelsToWorkspaceUnits(totalDelta);
        const newLoc = Coordinate.sum(this.startLoc, delta); //Blockly.utils.Coordinate.sum(this.startLoc, delta);

        //const newLoc = Coordinate.sum(this.startLoc, delta);
        this.draggable.drag(newLoc, e); // Move the draggable
        console.log('Block moved with custom dragger:', newLoc);
    }

    onDragEnd(e) {
        this.draggable.endDrag(e); // End the drag with the event
        console.log('Custom drag ended');
    }
}


// Register the custom dragger using Blockly's registry
Blockly.registry.register(Blockly.registry.Type.BLOCK_DRAGGER, 'CUSTOM_BLOCK_DRAGGER', CustomBlockDragger);

//let workspaceReady = false;
/*
document.addEventListener("DOMContentLoaded", async function () {
    // 1️⃣ Step: Initialize Blockly workspace
    createWorkspace();
    workspaceReady = true;
    console.log("✅ Workspace initialized");

    //const cachedActive = sessionStorage.getItem("activeSymbols");
    //const cachedIndex = sessionStorage.getItem("assetIndex");
    //const cachedContracts = sessionStorage.getItem("contractData");

    const cachedActive = localStorage.getItem("activeSymbols");
    const cachedIndex = localStorage.getItem("assetIndex");
    const cachedContracts = localStorage.getItem("contractData");

    if (cachedActive && cachedIndex && cachedContracts) {
        window.WS_DATA.activeSymbols = JSON.parse(cachedActive);
        window.WS_DATA.assetIndex = JSON.parse(cachedIndex);
        window.WS_DATA.contractData = JSON.parse(cachedContracts);
        console.log("♻️ Restored WebSocket data from sessionStorage");
    } else {
        console.log("⏳ No cached data found, waiting for live WebSocket data...");
    }

    // 3️⃣ Step: Wait for data to be ready, then populate dropdowns
    await waitForData();
});
*/
/*
document.addEventListener("DOMContentLoaded", async function () {
    // 🧱 Check and restore Blockly workspace state from localStorage
    const workspaceAlreadyInit = localStorage.getItem("workspace_initialized") === "true";

    if (!workspaceAlreadyInit) {
        console.log("🧱 Creating new Blockly workspace...");
        createWorkspace();
        localStorage.setItem("workspace_initialized", "true");
    } else {
        console.log("🧱 Blockly workspace already initialized, skipping creation");
    }

    // 🧠 Update global workspace state
    window.workspaceReady = true;

    // ♻️ Load cached WebSocket data from localStorage
    const cachedActive = localStorage.getItem("activeSymbols");
    const cachedIndex = localStorage.getItem("assetIndex");
    const cachedContracts = localStorage.getItem("contractData");

    if (cachedActive && cachedIndex && cachedContracts) {
        window.WS_DATA.activeSymbols = JSON.parse(cachedActive);
        window.WS_DATA.assetIndex = JSON.parse(cachedIndex);
        window.WS_DATA.contractData = JSON.parse(cachedContracts);
        console.log("♻️ Restored WebSocket data from localStorage");
    } else {
        console.log("⏳ No cached WebSocket data, waiting for live WebSocket updates...");
    }

    // ⏳ Wait for WebSocket data to become ready before doing next actions
    await waitForData();
});
*/

document.addEventListener("DOMContentLoaded", async function () {
    // 🧱 Check if workspace was already initialized before
    const workspaceAlreadyInit = localStorage.getItem("workspace_initialized") === "true";

    if (!workspaceAlreadyInit) {
        console.log("🧱 Creating new Blockly workspace...");
        const workspace = createWorkspace();
        window.workspace = workspace;
        localStorage.setItem("workspace_initialized", "true");
    } else {
        console.log("🧱 Blockly workspace already initialized, skipping creation");

        // ✅ Use existing window.workspace or try to access from Blockly
        let workspace = window.workspace;
        // 🔘 Attach strategy buttons to existing workspace
        if (workspace) {
            createQuickStrategyButton(workspace);
            createBlocksMenuButton(workspace);
            waitForData();
        } else {
            console.warn("⚠️ Workspace not available for UI button attachment. next line is creating it");
            const workspace = createWorkspace();
        }
        /*if (!workspace) {
            // Fallback: get main workspace from Blockly
            const workspace = createWorkspace();
            workspace = Blockly.getMainWorkspace(); // this assumes Blockly is globally available
            window.workspace = workspace;
        }*/
    }

    // ✅ Mark workspace as ready globally
    window.workspaceReady = true;

    // ♻️ Restore WebSocket data if available
    const cachedActive = localStorage.getItem("activeSymbols");
    const cachedIndex = localStorage.getItem("assetIndex");
    const cachedContracts = localStorage.getItem("contractData");

    if (cachedActive && cachedIndex && cachedContracts) {
        window.WS_DATA.activeSymbols = JSON.parse(cachedActive);
        window.WS_DATA.assetIndex = JSON.parse(cachedIndex);
        window.WS_DATA.contractData = JSON.parse(cachedContracts);
        console.log("♻️ Restored WebSocket data from localStorage");
    } else {
        console.log("⏳ No cached WebSocket data, waiting for live WebSocket updates...");
    }

    // ⏳ Wait for WebSocket data to be ready before continuing
    await waitForData();
});

function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,
        renderer: 'zelos',
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.5,
            maxScale: 1.5,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 0,
            colour: null,
            snap: false
        },
        move: {
            scrollbars: true,
            drag: true
        }
    });

    const lastKnownXML = localStorage.getItem("last_known_bot");

    try {
        if (lastKnownXML) {
            const xmlDom = Blockly.utils.xml.textToDom(lastKnownXML);
            workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, workspace);
            console.log("📦 Loaded last known bot from localStorage.");
        } else {
            const initialDom = Blockly.utils.xml.textToDom(InitialBlocks);
            Blockly.Xml.domToWorkspace(initialDom, workspace);
            console.log("🧱 Loaded default blocks.");
        }
    } catch (e) {
        console.error("❌ Failed to parse XML data:", e);
    }

    // Save current state to localStorage
    const initialXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    localStorage.setItem("last_known_bot", initialXML);
/*
    // Auto-save on changes
    workspace.addChangeListener(function (event) {
        if (event.type !== Blockly.Events.UI) {
            const updatedXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
            localStorage.setItem("last_known_bot", updatedXML);
            console.log("💾 Workspace auto-saved.");
        }
    });
*/

    workspace.addChangeListener(function (event) {
        if (
            event.type === Blockly.Events.CHANGE || // detects dropdown or input changes
            event.type === Blockly.Events.CREATE || // new blocks
            event.type === Blockly.Events.DELETE || // block deleted
            event.type === Blockly.Events.MOVE ||   // block moved
            event.type === Blockly.Events.VAR_CREATE || event.type === Blockly.Events.VAR_DELETE
        ) {
            const updatedXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
            localStorage.setItem("last_known_bot", updatedXML);
            console.log("💾 Workspace auto-saved on event:", event.type);
        }
    });

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
    waitForData();

    // Optional UI cleanup
    setTimeout(() => {
        document.querySelectorAll('.blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob')
            .forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
    }, 100);
}
/*
function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,
        renderer: 'zelos',
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.5,
            maxScale: 1.5,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 0,
            colour: null,
            snap: false
        },
        move: {
            scrollbars: true,
            drag: true
        }
    });

    const pendingXML = localStorage.getItem("botbuilder_pending_xml");
    const lastKnownXML = localStorage.getItem("last_known_bot");

    try {
        if (pendingXML) {
            const xmlDom = Blockly.utils.xml.textToDom(pendingXML);
            workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, workspace);
            console.log("✅ Loaded blocks from uploaded file.");
            localStorage.setItem("last_known_bot", pendingXML);
            localStorage.removeItem("botbuilder_pending_xml");
        } else if (lastKnownXML) {
            const xmlDom = Blockly.utils.xml.textToDom(lastKnownXML);
            workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, workspace);
            console.log("📦 Loaded last known bot from localStorage.");
        } else {
            const initialDom = Blockly.utils.xml.textToDom(InitialBlocks);
            Blockly.Xml.domToWorkspace(initialDom, workspace);
            console.log("🧱 Loaded default blocks.");
        }
    } catch (e) {
        console.error("❌ Failed to parse XML data:", e);
    }

    // 💾 Save current state as last known bot (initial snapshot)
    const initialXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    localStorage.setItem("last_known_bot", initialXML);

    // ✅ Add change listener to autosave on every workspace modification
    workspace.addChangeListener(function (event) {
        if (event.type !== Blockly.Events.UI) {
            const updatedXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
            localStorage.setItem("last_known_bot", updatedXML);
            console.log("💾 Workspace auto-saved.");
        }
    });

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
    waitForData();

    // 🚫 Optional: Hide scrollbars for cleaner UI
    setTimeout(() => {
        document.querySelectorAll('.blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob')
            .forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
    }, 100);
}
*/
//let workspace = null;  // Global or top-level variable
/*
function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,
        renderer: 'zelos',
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.5,
            maxScale: 1.5,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 0,
            colour: null,
            snap: false
        },
        move: {
            scrollbars: true,
            drag: true
        }
    });

    const pendingXML = localStorage.getItem("botbuilder_pending_xml");
    const lastKnownXML = localStorage.getItem("last_known_bot");

    if (pendingXML) {
        try {
            const xmlDom = Blockly.utils.xml.textToDom(pendingXML);
            workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, workspace);
            console.log("✅ Loaded blocks from uploaded file.");

            // 💾 Save to last known bot
            localStorage.setItem("last_known_bot", pendingXML);

            localStorage.removeItem("botbuilder_pending_xml");
        } catch (e) {
            console.error("❌ Failed to parse uploaded XML:", e);
        }
    } else if (lastKnownXML) {
        try {
            const xmlDom = Blockly.utils.xml.textToDom(lastKnownXML);
            workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, workspace);
            console.log("📦🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠❌❌❌❌❌❌❌❌❌❌ Loaded last known bot from localStorage.");
        } catch (e) {
            console.error("❌ Failed to parse last known XML:", e);
        }
    } else {
        // 🧱 Default blocks
        const InitialB = Blockly.utils.xml.textToDom(InitialBlocks);
        Blockly.Xml.domToWorkspace(InitialB, workspace);
    }

    // 💾 Save current workspace to localStorage as last known bot
    const currentXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    localStorage.setItem("last_known_bot", currentXML);

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
    waitForData();

    // Optional: Hide scrollbars
    setTimeout(() => {
        document.querySelectorAll('.blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob')
            .forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
    }, 100);
}
*/
/*
function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,
        renderer: 'zelos',
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.5,
            maxScale: 1.5,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 0,
            colour: null,
            snap: false
        },
        move: {
            scrollbars: true,
            drag: true
        }
    });

    // ✅ STEP 1: Check for uploaded XML in localStorage
    const pendingXML = localStorage.getItem("botbuilder_pending_xml");

    if (pendingXML) {
        try {
            // STEP 2: Parse and apply the XML
            const xmlDom = Blockly.utils.xml.textToDom(pendingXML);

            // STEP 3: Clear current blocks
            workspace.clear();

            // STEP 4: Inject new blocks
            Blockly.Xml.domToWorkspace(xmlDom, workspace);

            console.log("✅ Loaded blocks from uploaded file.");

            // STEP 5: Remove it so it doesn't reload every time
            localStorage.removeItem("botbuilder_pending_xml");
        } catch (e) {
            console.error("❌ Failed to parse uploaded XML:", e);
        }
    } else {
        // 🧱 Default blocks
        const InitialB = Blockly.utils.xml.textToDom(InitialBlocks);
        Blockly.Xml.domToWorkspace(InitialB, workspace);
    }

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
    waitForData();

    // Optional: Hide scrollbars
    setTimeout(() => {
        document.querySelectorAll('.blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob')
            .forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
    }, 100);
}
*/
/*
function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,
        renderer: 'zelos',
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.5,
            maxScale: 1.5,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 0,
            colour: null,
            snap: false
        },
        move: {
            scrollbars: true,
            drag: true,
        },
    });

    // 🔍 Check if any blocks exist
    if (workspace.getAllBlocks(false).length > 0) {
        workspace.clear(); // 🧹 Clear the existing blocks
    }

    // ⬇️ Try to get XML from localStorage (e.g., from previous page)
    const savedXml = localStorage.getItem("uploadedXML");
    if (savedXml) {
        try {
            const xmlDom = Blockly.utils.xml.textToDom(savedXml);
            Blockly.Xml.domToWorkspace(xmlDom, workspace);
            console.log("✅ Loaded blocks from localStorage.");
            localStorage.removeItem("uploadedXML"); // 🗑 Remove after use
        } catch (e) {
            console.error("❌ Failed to parse uploaded XML:", e);
        }
    } else {
        // 📦 Otherwise load default initial blocks
        try {
            InitialB = Blockly.utils.xml.textToDom(InitialBlocks);
            Blockly.Xml.domToWorkspace(InitialB, workspace);
        } catch (e) {
            console.error("❌ Failed to load InitialBlocks:", e);
        }
    }

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
    waitForData();

    setTimeout(() => {
        document.querySelectorAll('.blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob')
            .forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
    }, 100);
}
*/
/*
function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,  // Apply the custom theme
        renderer: 'zelos',  // Use the 'zelos' renderer
        zoom: {
            controls: false,   // 🔴 Hide zoom icons
            wheel: true,       // ✅ Allow scroll/pinch zooming
            startScale: 0.5,
            maxScale: 1.5,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,    // Set grid spacing for snapping (can be any number)
            length: 0,      // This effectively hides the grid lines
            colour: null,   // No grid line color to make it invisible
            snap: false     // Don't snap blocks to the invisible grid
        },
        //scrollbars: false,  // Enable scrollbars for panning the workspace
        move: {
            scrollbars: true,  // Allows the user to drag the workspace to hidden parts
            drag: true,        // Allow dragging the workspace itself
            //wheel: true        // Enable panning with the mouse wheel
        },
        //plugins: {
          //  blockDragger: CustomBlockDragger, // Use custom dragger
        //},
    });

    InitialB = Blockly.utils.xml.textToDom(InitialBlocks);
    Blockly.Xml.domToWorkspace(InitialB, workspace);

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
    waitForData();

    // Add selected blocks from IndicatorBlocks XML to the workspace
    //initializeBlocks(workspace, InitialBlocks);

    // 🔽 Add this LAST so it hides scrollbars after rendering is complete
    setTimeout(() => {
        document.querySelectorAll('.blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob')
            .forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
    }, 100);  // delay ensures Blockly is fully initialized
}
*/
async function waitForData() {
    // First: try to load from localStorage
    if (!window.WS_DATA) window.WS_DATA = {};

    window.WS_DATA.activeSymbols = window.WS_DATA.activeSymbols || JSON.parse(localStorage.getItem("activeSymbols"));
    window.WS_DATA.assetIndex = window.WS_DATA.assetIndex || JSON.parse(localStorage.getItem("assetIndex"));
    window.WS_DATA.contractData = window.WS_DATA.contractData || JSON.parse(localStorage.getItem("contractData"));

    // If still missing any part, wait for WebSocket data
    const start = Date.now();
    while (
        !window.WS_DATA?.activeSymbols ||
        !window.WS_DATA?.assetIndex ||
        !window.WS_DATA?.contractData
    ) {
        console.log("⏳ Waiting for WebSocket data...");
        await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms

        // Optional timeout (10s fallback)
        if (Date.now() - start > 10000) {
            console.warn("⚠️ Timed out waiting for WebSocket data. Using fallback only.");
            break;
        }
    }

    console.log("✅ Data available! Populating dropdowns...");
    populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
    // Add these if needed:
    // populateBlockDropdowns(window.WS_DATA.contractData);
}

function initializeBlocks(workspace, xmlString) {
    console.log('Initializing blocks...');

    try {
        // Convert the XML string to a DOM
        const xmlDom = Blockly.utils.xml.textToDom(xmlString);
        console.log('XML parsed successfully:', xmlDom);

        // Log all block types found in the XML
        const allBlockTypes = Array.from(xmlDom.querySelectorAll('block')).map(block => block.getAttribute('type'));
        console.log('Block types found in XML:', allBlockTypes);

        // Select specific blocks by their type
        const selectedBlockTypes = ['tradeparameters', 'Conditional_if', 'Take_profit', 'Stop_Loss'];

        selectedBlockTypes.forEach(blockType => {
            console.log(`Looking for block type: ${blockType}`);
            const block = xmlDom.querySelector(`block[type="${blockType}"]`);

            if (block) {
                console.log(`Found block of type "${blockType}"`, block);

                // Clone the block to prevent mutations
                const blockClone = block.cloneNode(true);

                // Add the block to the workspace
                Blockly.Xml.domToWorkspace(blockClone, workspace);
                console.log(`Successfully added block "${blockType}" to workspace.`);
            } else {
                console.warn(`Block type "${blockType}" not found in the XML.`);
            }
        });
    } catch (error) {
        console.error('Error initializing blocks:', error);
    }

    console.log("📌 Blocks initialized. Waiting for data to populate dropdowns...");
    waitForData();  // Call the async function to wait for data
}

window.addEventListener('resize', () => {
    Blockly.svgResize(workspace);
});

// Attach the event listener to the workspace
/*document.addEventListener('DOMContentLoaded', () => {
    Blockly.getMainWorkspace().addChangeListener(handleDropdownChange);
});
*/
function handleBlockClick(event, blockSvg) {
    event.stopPropagation(); // Prevent modal from closing

    const blockType = blockSvg.getAttribute('data-id') || 'unknown_block';
    console.log('Creating block:', blockType);

    const mainWorkspace = Blockly.getMainWorkspace();
    if (!mainWorkspace) return;

    // Close the modal
    modal.style.display = 'none';

    // Create a new block in the main workspace
    const newBlock = mainWorkspace.newBlock(blockType);
    newBlock.initSvg();
    newBlock.render();

    // Get mouse position relative to workspace
    const workspaceMetrics = mainWorkspace.getMetrics();
    const mouseX = event.clientX - workspaceMetrics.absoluteLeft;
    const mouseY = event.clientY - workspaceMetrics.absoluteTop;

    // Move the block to the mouse position
    newBlock.moveBy(mouseX, mouseY);

    // Start dragging the block
    startDraggingBlock(newBlock, mainWorkspace, event);
}

function startDraggingBlock(block, workspace, initialEvent) {
    const blockDragger = new Blockly.BlockDragger(block, workspace);

    // Start the drag
    blockDragger.startDrag(initialEvent);

    const onMouseMove = (moveEvent) => {
        blockDragger.drag(moveEvent);
    };

    const onMouseUp = (upEvent) => {
        blockDragger.endDrag(upEvent);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    // Listen for mouse movements and release
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

/*
document.addEventListener("DOMContentLoaded", function() {
    // Get the blocklyDiv
    const blocklyDiv = document.getElementById("blocklyDiv");

    // Create the left panel (optionsDiv)
    const optionsDiv = document.createElement("div");
    optionsDiv.id = "optionsDiv";
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 16vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
        border: 1px solid red;
    `;

    // Create the Quick Strategy button
    const quickStrategyBtn = document.createElement("button");
    quickStrategyBtn.id = "quickStrategy";
    quickStrategyBtn.innerText = "Quick Strategy";
    quickStrategyBtn.style = `
        background-color: red;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        height: 6vh;
        width: 32vh;
        text-align: center;
        z-index: 10;
        `;

    optionsDiv.appendChild(quickStrategyBtn);

    // Create the top panel (secondOptionsDiv)
    const secondOptionsDiv = document.createElement("div");
    secondOptionsDiv.id = "secondOptionsDiv";
    secondOptionsDiv.style = `
        position: absolute;
        top: 0;
        left: 16vw;
        width: 31.5vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    // Create the sODiv inside secondOptionsDiv
    const sODiv = document.createElement("div");
    sODiv.id = "sODiv";
    sODiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 31vw;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vw;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

    secondOptionsDiv.appendChild(sODiv);

    // Append to blocklyDiv instead of workspace
    blocklyDiv.appendChild(optionsDiv);
    blocklyDiv.appendChild(secondOptionsDiv);
    // Call the function after optionsDiv is added
    createBlocksMenuButton(optionsDiv);
});
*/

function sendCandleRequest(symbol, timeframe) {
    const message = {
        event: "subscribe_candles",
        symbol: symbol,
        timeframe: timeframe
    };

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        console.log("🟢 Sent candle request:", message);
    } else {
        alert("WebSocket is not open.");
    }
}
/*
function initChart() {
    const chartContainer = document.getElementById('tv_chart_container');
    chartContainer.innerHTML = '';

    chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
        layout: {
            backgroundColor: '#fff',
            textColor: '#000',
        },
        grid: {
            vertLines: { color: '#eee' },
            horzLines: { color: '#eee' },
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        },
    });

    //series = chart.addCandlestickSeries();
    series = chart.addSeries({ type: 'Candlestick' });
}
*/
/*
function initChart() {
    const chartContainer = document.getElementById('tv_chart_container');
    chartContainer.innerHTML = ''; // Reset if needed

    console.log("Lightweight Charts Version:", LightweightCharts.version);

    chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
        layout: {
            backgroundColor: '#fff',
            textColor: '#000',
        },
        grid: {
            vertLines: { color: '#eee' },
            horzLines: { color: '#eee' },
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        },
    });

    // ✅ Modern v4 syntax
    //series = chart.addSeries({ type: 'Candlestick' });
    series = chart.addSeries({ type: 'Candlestick' });

}
*/
/*
function initChart(containerId = 'tv_chart_container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';  // optional: reset container

    console.log("Lightweight Charts Version:", LightweightCharts.version);

    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: { background: { color: '#fff' }, textColor: '#000' },
        grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
        timeScale: { timeVisible: true },
    });

    series = chart.addCandlestickSeries();  // <- ✅ v5 syntax

    console.log("✅ Chart and series initialized.");

    // ⬇️ Apply any stashed data
    if (pendingFullData) {
        console.log("📦 Applying stashed full history...");
        series.setData(pendingFullData);
        pendingFullData = null;
    }

    if (pendingLiveUpdate) {
        console.log("📦 Applying stashed live update...");
        series.update(pendingLiveUpdate);
        pendingLiveUpdate = null;
    }
}
*/
/*

function initChart(containerId = 'tv_chart_container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';  // optional: reset container
    */
/*
    console.log("📈 Initializing chart...");

    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: { background: { color: '#fff' }, textColor: '#000' },
        grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
        timeScale: { timeVisible: true },
    });

    series = chart.addCandlestickSeries();

    console.log("✅ Chart and series initialized.");
*/
/*
    console.log("📈 Initializing chart...");

    try {
        chart = LightweightCharts.createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight,
            layout: { background: { color: '#fff' }, textColor: '#000' },
            grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
            timeScale: { timeVisible: true },
        });

        series = chart.addCandlestickSeries();

        console.log("✅ Chart and series initialized.");
    } catch (err) {
        console.error("❌ Error creating chart or series:", err);
    }

    // ✅ Use data from WS_DATA if available
    if (window.WS_DATA?.fullCandleHistory) {
        console.log("📦 Applying full history from WS_DATA...");
        series.setData(window.WS_DATA.fullCandleHistory);
    } else if (pendingFullData) {
        console.log("📦 Applying stashed full history...");
        series.setData(pendingFullData);
        pendingFullData = null;
    }

    if (window.WS_DATA?.lastLiveCandle) {
        console.log("📦 Applying latest live candle from WS_DATA...");
        series.update(window.WS_DATA.lastLiveCandle);
    } else if (pendingLiveUpdate) {
        console.log("📦 Applying stashed live update...");
        series.update(pendingLiveUpdate);
        pendingLiveUpdate = null;
    }

    // 🧠 Optionally store the series globally
    window.WS_DATA.chart = chart;
    window.WS_DATA.series = series;
}
*/
/*
function initChart(containerId = 'tv_chart_container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';  // optional: reset container

    console.log("📈 Initializing chart...");

    const { createChart, CandlestickSeries } = LightweightCharts;  // ✅ Pull from v5 bundle

    chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: { background: { color: '#fff' }, textColor: '#000' },
        grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
        timeScale: { timeVisible: true },
    });

    series = chart.addSeries(CandlestickSeries);  // ✅ Correct v5 syntax

    console.log("✅ Chart and series initialized.");

    // Optional: use data if it exists
    if (window.WS_DATA?.fullCandleHistory) {
        console.log("📦 Applying full history from WS_DATA...");
        series.setData(window.WS_DATA.fullCandleHistory);
    } else if (pendingFullData) {
        console.log("📦 Applying stashed full history...");
        series.setData(pendingFullData);
        pendingFullData = null;
    }

    if (window.WS_DATA?.lastLiveCandle) {
        console.log("📦 Applying latest live candle from WS_DATA...");
        series.update(window.WS_DATA.lastLiveCandle);
    } else if (pendingLiveUpdate) {
        console.log("📦 Applying stashed live update...");
        series.update(pendingLiveUpdate);
        pendingLiveUpdate = null;
    }

    // Store globally if needed
    window.WS_DATA.chart = chart;
    window.WS_DATA.series = series;
}
*/

function initChart(containerId = 'tv_chart_container', chartType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear container if reinitializing

    console.log(`📈 Initializing ${chartType} chart...`);

    const { createChart, CandlestickSeries, LineSeries, AreaSeries } = LightweightCharts;

    chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
            background: { color: '#fff' },
            textColor: '#666',
            fontSize: 8
        },
        grid: {
            vertLines: { color: '#eee' },
            horzLines: { color: '#eee' },
        },
        timeScale: {
            timeVisible: true ,
            borderColor: '#fff'
        },
        rightPriceScale: {
            borderColor: '#fff'
        },
        crossHair: { mode: 1 },
    });

    // 🎯 Choose series type based on chartType
    if (chartType === 'candlestick') {
        series = chart.addSeries(CandlestickSeries);
    } else if (chartType === 'line') {
        // Reinterpret 'line' as 'area' for shading support
        series = chart.addSeries(AreaSeries, {
            lineColor: 'rgba(0, 0, 0, 0.9)',
            topColor: 'rgba(0, 0, 0, 0.2)',
            bottomColor: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
        });
    }

    console.log("✅ Chart and series initialized.");

    // 🗃️ Load full history
    if (chartType === 'candlestick') {
        if (window.WS_DATA?.fullCandleHistory) {
            console.log("Tick data arriving:", window.WS_DATA.fullCandleHistory);
            series.setData(window.WS_DATA.fullCandleHistory);
        } else if (pendingFullData) {
            series.setData(pendingFullData);
            pendingFullData = null;
        }

        if (window.WS_DATA?.lastLiveCandle) {
            series.update(window.WS_DATA.lastLiveCandle);
        } else if (pendingLiveUpdate) {
            series.update(pendingLiveUpdate);
            pendingLiveUpdate = null;
        }

    } else {
        // For tick line data
        //if (window.WS_DATA?.fullCandleHist) {
          //  console.log("Tick data arriving:", window.WS_DATA.fullCandleHist.ticks);
            //series.setData(window.WS_DATA.fullCandleHist.ticks);
        //}
        // For line or area chart
        if (window.WS_DATA?.fullCandleHist?.ticks?.length) {
            console.log("Tick data arriving:", window.WS_DATA.fullCandleHist.ticks);
            series.setData(window.WS_DATA.fullCandleHist.ticks);
        }

        // ✅ Handle live tick updates
        if (window.WS_DATA?.lastLiveTick) {
            series.update(window.WS_DATA.lastLiveTick);
        }
    }

    // ✅ Create or reuse live price label
    let priceLabel = document.getElementById('livePriceLabel');
    if (!priceLabel) {
        priceLabel = document.createElement('div');
        priceLabel.id = 'livePriceLabel';
        priceLabel.style.cssText = `
            position: absolute;
            //top: 30px;
            //right: 10px;
            background: white;
            color: #00B386;
            //border: 1px solid #ccc;
            //padding: 4px 10px;
            //font-weight: bold;
            font-size: 14px;
            border-radius: 4px;
            z-index: 1000;
        `;
        container.appendChild(priceLabel);
    }

    chart.timeScale().fitContent();

    window.WS_DATA.chart = chart;
    window.WS_DATA.series = series;
}

function updateLiveChartTick(price, timestamp) {
    if (window.WS_DATA?.series) {
        window.WS_DATA.series.update({ time: timestamp, value: price });
        window.WS_DATA.lastLiveTick = { time: timestamp, value: price };
    }
}

function sendCloseChartsSignalToBackend() {
    const closeMessage = {
        event_type: "close_charts",
        message: "User closed the chart overlay",
    };

    // Use the existing WebSocket send function to send the message
    if (typeof window.sendWebSocketMessage === "function") {
        window.sendWebSocketMessage(closeMessage);
    } else {
        console.warn("⚠️ sendWebSocketMessage function not found!");
    }
}

// Function to create the Quick Strategy UI and attach behavior
function createQuickStrategyButton(workspace) {
    const tooltips = {
        'recycle.png': 'Reset',
        'folderopen.png': 'Import',
        'floppydisk.png': 'Save',
        'sortdescending.png': 'Sort',
        'chart.png': 'Charts',
        'linechart.png': 'TradingView Chart',
        'undo.png': 'Undo',
        'redo.png': 'Redo',
        'zoomin1.png': 'Zoom in',
        'zoomout.png': 'Zoom out'
    };

    const showResetOverlay = () => {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.style = `
            position: relative;
            width: 29.5vw;
            height: 22vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            padding: 20px;
        `;
        overlay.appendChild(modal);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) overlay.remove();
        });

        const closeBtn = document.createElement('div');
        closeBtn.innerText = '✕';
        closeBtn.style = `
            position: absolute;
            top: 6px;
            right: 10px;
            font-size: 2.5vh;
            color: #666;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(closeBtn);

        const heading = document.createElement('div');
        heading.innerText = 'Are you sure you want to reset?';
        heading.style = 'font-size: 2.5vh; font-weight: bold; margin-bottom: 2vh;';
        modal.appendChild(heading);

        const subtext = document.createElement('div');
        subtext.innerText = 'Any unsaved changes will be lost.';
        subtext.style = 'font-size: 2vh; margin-bottom: 4vh;';
        modal.appendChild(subtext);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.style = `
            position: absolute;
            bottom: 3vh;
            right: 8vw;
            height: 6vh;
            width: 5.4vw;
            border: 2px solid grey;
            background: white;
            color: black;
            cursor: pointer;
            border-radius: 4px;
        `;
        cancelBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(cancelBtn);

        const okBtn = document.createElement('button');
        okBtn.innerText = 'OK';
        okBtn.style = `
            position: absolute;
            bottom: 3vh;
            right: 2vw;
            height: 6vh;
            width: 5vw;
            border: none;
            background: #ff4d4d;
            color: white;
            cursor: pointer;
            border-radius: 4px;
        `;
        okBtn.addEventListener('click', () => {
            workspace.clear();
            const initialXml = Blockly.utils.xml.textToDom(InitialBlocks);
            Blockly.Xml.domToWorkspace(initialXml, workspace);
            Blockly.svgResize(workspace);
            overlay.remove();
        });
        modal.appendChild(okBtn);
    };

    const showImportOverlay = () => {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: '9999',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            width: '71vw', height: '74vh', backgroundColor: '#fff',
            borderRadius: '10px', padding: '20px', position: 'relative',
            display: 'flex', flexDirection: 'column'
        });

        const title = document.createElement('div');
        title.textContent = 'Load strategy';
        Object.assign(title.style, {
            fontWeight: 'bold', fontSize: '2.5vh', marginBottom: '3vh'
        });

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '10px', right: '15px',
            fontSize: '5vh', cursor: 'pointer', color: '#333'
        });
        closeBtn.addEventListener('click', () => overlay.remove());

        const tabContainer = document.createElement('div');
        Object.assign(tabContainer.style, {
            display: 'flex',
            gap: '0vw',
            marginTop: '6.0vh',
            alignItems: 'flex-end',
        });

        const tabs = [
            { text: 'Recent', width: '6.0vw' },
            { text: 'Local', width: '7.0vw' },
            { text: 'Google Drive', width: '10vw' }
        ];

        let activeTab = null;

        // ✅ Move this BEFORE the tab loop
        const contentArea = document.createElement('div');
        contentArea.style.position = 'relative';
        modal.appendChild(contentArea);

        tabs.forEach(({ text, width }, index) => {
            const tab = document.createElement('div');
            tab.textContent = text;
            Object.assign(tab.style, {
                width: width,
                borderBottom: '2px solid rgba(128, 128, 128, 0.5)',
                paddingBottom: '1vh',
                textAlign: 'center',
                fontSize: '2.5vh',
                cursor: 'pointer',
                fontWeight: 'normal',
                transition: 'all 0.2s ease'
            });

            tab.addEventListener('click', () => {
                if (activeTab) {
                    activeTab.style.borderBottom = '2px solid rgba(128, 128, 128, 0.5)';
                    activeTab.style.fontWeight = 'normal';
                }

                tab.style.borderBottom = '2px solid rgba(255, 66, 66, 0.8)';
                tab.style.fontWeight = 'bold';
                activeTab = tab;

                // Content rendering based on tab
                if (text === 'Recent') showRecentContent();
                if (text === 'Local') showLocalContent(overlay);
                if (text === 'Google Drive') showGoogleDriveContent();
            });

            // Set "Recent" active by default
            if (index === 0) {
                tab.style.borderBottom = '2px solid rgba(255, 66, 66, 0.8)';
                tab.style.fontWeight = 'bold';
                activeTab = tab;
                showRecentContent(); // Initial call
            }

            tabContainer.appendChild(tab);
        });

        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(tabContainer);
        modal.appendChild(contentArea); // ✅ This keeps the top layout safe

        // Create a container for dynamic content (Recent section, etc.)
        //const contentArea = document.createElement('div');
        //contentArea.style.position = 'relative';
        //modal.appendChild(contentArea);

        // Function to render Recent content
        function showRecentContent() {
            contentArea.innerHTML = ''; // clear previous content

            // Preview label box
            const preview = document.createElement('div');
            preview.textContent = 'Preview';
            Object.assign(preview.style, {
                position: 'absolute',
                top: '1.7vh',
                left: '26vw',
                width: '5.5vw',
                height: '6.5vh',
                backgroundColor: 'white',
                //border: '1px solid grey',
                fontSize: '2.4vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            });

            // Create main content box
            const box = document.createElement('div');
            Object.assign(box.style, {
                position: 'absolute',
                top: '8.5vh',
                left: '26vw',
                width: '44.5vw',
                height: '37.5vh',
                border: '1px solid rgba(128, 128, 128, 0.4)',  // Less gray with transparency
                borderRadius: '5px',
                backgroundColor: 'white'
            });
            document.body.appendChild(box);  // Append it to the body (or wherever you want)

            // Inject Blockly workspace into the box div
            const lsworkspace = Blockly.inject(box, {
                toolbox: null,
                trashcan: false,
                theme: myTheme,       // Apply your custom theme
                renderer: 'zelos',    // Use Zelos renderer
                zoom: {
                    controls: false,
                    wheel: true,
                    startScale: 0.62,
                    maxScale: 3.0,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                },
                grid: {
                    spacing: 20,
                    length: 0,
                    colour: null,
                    snap: false
                },
                move: {
                    scrollbars: false,
                    drag: true
                }
            });

            // Open button
            const openBtn = document.createElement('button');
            openBtn.textContent = 'Open';
            Object.assign(openBtn.style, {
                position: 'absolute',
                //bottom: '-15vh',
                top: '52.0vh',
                right: '0vw',
                backgroundColor: '#ff4e4e', // same red as image
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2vh',
                border: 'none',
                //padding: '1vh 2vw',
                borderRadius: '0.5vh',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                width: '5vw',
                height: '7vh',
            });

            contentArea.appendChild(preview);
            contentArea.appendChild(box);
            contentArea.appendChild(openBtn);
        }

        function showLocalContent(overlay) {
            contentArea.innerHTML = ''; // clear previous content

            // ---------- ⚠️ Warning Banner ----------
            const warning = document.createElement('div');
            Object.assign(warning.style, {
                position: 'absolute',
                top: '1.5vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '68.4vw',
                height: '10vh',
                backgroundColor: 'rgba(255, 243, 205, 1)',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '1vw',
                paddingLeft: '1.5vw',
                fontSize: '2.2vh',
            });

            const warnIcon = document.createElement('img');
            warnIcon.src = 'warning.png';
            warnIcon.style.width = '2.8vh';
            warnIcon.style.height = '2.8vh';

            const warnText = document.createElement('span');
            warnText.textContent = 'Importing XML files from Binary Bot and other third-party platforms may take longer.';
            warning.appendChild(warnIcon);
            warning.appendChild(warnText);

            // ---------- 📂 Upload Area ----------
            const uploadBox = document.createElement('div');
            Object.assign(uploadBox.style, {
                position: 'absolute',
                top: '12.5vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '68.2vw',
                height: '38vh',
                border: '2px dashed rgba(160, 160, 160, 0.8)',
                borderRadius: '5px',
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1vh',
                textAlign: 'center',
                padding: '2vh',
            });

            const icon = document.createElement('img');
            icon.src = '/static/icons/desktop.png';
            icon.style.width = '21vh';
            icon.style.height = '21vh';

            const line1 = document.createElement('div');
            line1.textContent = 'Drag your XML file here';
            line1.style.fontSize = '2.4vh';

            const line2 = document.createElement('div');
            line2.textContent = 'or, if you prefer...';
            line2.style.fontSize = '2.0vh';

            const btn = document.createElement('button');
            btn.textContent = 'Select an XML file from your device';
            Object.assign(btn.style, {
                marginTop: '1.2vh',
                fontSize: '2.0vh',
                backgroundColor: 'rgba(255, 66, 66, 0.9)',
                color: 'white',
                border: 'none',
                padding: '1vh 2vw',
                borderRadius: '5px',
                cursor: 'pointer',
            });

            uploadBox.appendChild(icon);
            uploadBox.appendChild(line1);
            uploadBox.appendChild(line2);
            uploadBox.appendChild(btn);

            contentArea.appendChild(warning);
            contentArea.appendChild(uploadBox);

            // ---------- 📁 File Input Element (Hidden) ----------
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xml';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            btn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const xmlText = reader.result;

                        console.log('📄 XML File Content:', xmlText);

                        const xmlDom = Blockly.utils.xml.textToDom(xmlText);

                        // ✅ Clear workspace before loading
                        workspace.clear();

                        // ✅ Load blocks into workspace
                        Blockly.Xml.domToWorkspace(xmlDom, workspace);

                        alert(`✅ Successfully loaded "${file.name}"`);

                        // ✅ Refresh any block-based state or observers
                        waitForData();

                        // ✅ Close modal or overlay
                        overlay.remove();

                    } catch (err) {
                        alert('❌ Failed to load XML. Make sure it’s a valid Blockly file.');
                        console.error(err);
                    }
                };

                reader.readAsText(file);
            });
/*
            // 🔘 Button opens file picker
            btn.addEventListener('click', () => fileInput.click());

            // 📥 Load file and inject to workspace
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const xmlText = reader.result;

                        // Log for debugging
                        console.log('📄 XML File Content:', xmlText);

                        // ✅ This is the officially documented method
                        const xmlDom = Blockly.utils.xml.textToDom(xmlText);

                        // ✅ Load into Blockly workspace
                        //Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
                        Blockly.Xml.domToWorkspace(xmlDom, workspace);

                        alert(`✅ Successfully loaded "${file.name}"`);
                        overlay.remove(); // ⛔ Removes the modal

                    } catch (err) {
                        alert('❌ Failed to load XML. Make sure it’s a valid Blockly file.');
                        console.error(err);
                    }
                };

                reader.readAsText(file);
            });*/
        }
/*
        function showLocalContent() {
            contentArea.innerHTML = ''; // clear previous content

            // Warning Banner
            const warning = document.createElement('div');
            warning.style.position = 'absolute';
            warning.style.top = '1.5vh';
            warning.style.left = '50%';
            warning.style.transform = 'translateX(-50%)';
            warning.style.width = '68.4vw';
            warning.style.height = '10vh';
            warning.style.backgroundColor = 'rgba(255, 243, 205, 1)'; // yellowish like screenshot
            warning.style.borderRadius = '5px';
            warning.style.display = 'flex';
            warning.style.alignItems = 'center';
            warning.style.gap = '1vw';
            warning.style.paddingLeft = '1.5vw';
            warning.style.fontSize = '2.2vh';

            const warnIcon = document.createElement('img');
            warnIcon.src = 'warning.png'; // the "goldish" warning icon you mentioned
            warnIcon.style.width = '2.8vh';
            warnIcon.style.height = '2.8vh';

            const warnText = document.createElement('span');
            warnText.textContent = 'Importing XML files from Binary Bot and other third-party platforms may take longer.';

            warning.appendChild(warnIcon);
            warning.appendChild(warnText);

            // Upload Area
            const uploadBox = document.createElement('div');
            Object.assign(uploadBox.style, {
                position: 'absolute',
                top: '12.5vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '68.2vw',
                height: '38vh',
                border: '2px dashed rgba(160, 160, 160, 0.8)', // broken border
                borderRadius: '5px',
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1vh',
                textAlign: 'center',
                padding: '2vh'
            });

            const icon = document.createElement('img');
            icon.src = '/static/icons/desktop.png';
            icon.style.width = '21vh';
            icon.style.height = '21vh';

            const line1 = document.createElement('div');
            line1.textContent = 'Drag your XML file here';
            line1.style.fontSize = '2.4vh';

            const line2 = document.createElement('div');
            line2.textContent = 'or, if you prefer...';
            line2.style.fontSize = '2.0vh';

            const btn = document.createElement('button');
            btn.textContent = 'Select an XML file from your device';
            Object.assign(btn.style, {
                marginTop: '1.2vh',
                fontSize: '2.0vh',
                backgroundColor: 'rgba(255, 66, 66, 0.9)', // soft red
                color: 'white',
                border: 'none',
                padding: '1vh 2vw',
                borderRadius: '5px',
                cursor: 'pointer'
            });

            uploadBox.appendChild(icon);
            uploadBox.appendChild(line1);
            uploadBox.appendChild(line2);
            uploadBox.appendChild(btn);

            // Add to content area
            contentArea.appendChild(warning);
            contentArea.appendChild(uploadBox);
        }*/

        function showGoogleDriveContent() {
            contentArea.innerHTML = '';

            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2vh',
                marginTop: '2.5vh'
            });

            const icon = document.createElement('img');
            //icon.src = 'googledrive.png';
            icon.src = '/static/icons/googledrive.png';
            icon.style.width = '21vh';
            icon.style.height = '21vh';

            const title = document.createElement('div');
            title.textContent = 'Google Drive';
            Object.assign(title.style, {
                fontSize: '2.5vh',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '1.0vh'
            });

            const description = document.createElement('div');
            description.innerHTML = `
                To import your bot from your Google Drive, you'll need to sign in to your Google account.<br>
                To know how Google Drive handles your data, please review Deriv’s Privacy policy.
            `;
            Object.assign(description.style, {
                fontSize: '2.4vh',
                fontWeight: 'normal',
                textAlign: 'center',
                width: '60vw',
                marginTop: '4.0vh'

            });

            const signInBtn = document.createElement('button');
            signInBtn.textContent = 'Sign in';
            Object.assign(signInBtn.style, {
                fontSize: '2.3vh',
                backgroundColor: 'rgba(255, 66, 66, 0.9)',
                color: 'white',
                padding: '2vh 2vh',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '4.0vh'
            });

            wrapper.appendChild(icon);
            wrapper.appendChild(title);
            wrapper.appendChild(description);
            wrapper.appendChild(signInBtn);

            contentArea.appendChild(wrapper);

        }

        // Show "Recent" content by default
        showRecentContent();

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) overlay.remove();
        });

    };

    function showSaveOverlay() {
        // Create screen overlay
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        // Remove overlay when clicking outside modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Modal box
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            width: '20vw',
            height: '74vh',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '3vh 2vw',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            textAlign: 'left',
            gap: '2vh',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
        });

        // Close button
        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '1vh',
            right: '1vw',
            fontSize: '2.5vh',
            color: '#333',
            cursor: 'pointer'
        });
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

        // Title
        const title = document.createElement('div');
        title.textContent = 'Save strategy';
        Object.assign(title.style, {
            fontSize: '3.0vh',
            fontWeight: 'bold',
            marginBottom: '4.5vh'  // Adjust this value to control the gap
        });

        // Subtitle
        const subtitle = document.createElement('div');
        subtitle.textContent = 'Enter your bot name, choose to save on your computer or Google Drive, and hit';
        Object.assign(subtitle.style, {
            fontSize: '2.5vh',
            fontWeight: 'normal'
        });

        // Description
        const description = document.createElement('div');
        description.textContent = 'Save.';
        Object.assign(description.style, {
            fontSize: '2.3vh',
            fontWeight: 'bold'
        });

        // Bot name label
        const botNameDiv = document.createElement('div');
        botNameDiv.textContent = 'Bot name';
        Object.assign(botNameDiv.style, {
            fontSize: '2vh',
            width: '4.0vw',
            height: '2.5vh',             // Add a height to enable vertical centering
            backgroundColor: 'white',
            marginLeft: '1vw',
            display: 'flex',             // Flexbox for centering
            alignItems: 'center',        // Vertical center
            justifyContent: 'center',    // Horizontal center
            position: 'relative',
            zIndex: 2,
            //border: '1px solid rgba(187, 187, 187, 0.5)',
        });

        // Input container div (grey bordered)
        const greyBorderedDiv = document.createElement('div');
        Object.assign(greyBorderedDiv.style, {
            width: '18vw',
            height: '5vh',
            border: '1px solid rgba(187, 187, 187, 0.5)',
            marginTop: '-3.5vh',
            borderRadius: '5px',
            position: 'relative',
            zIndex: 1,
            padding: '0.5vh 1vw',  // Optional padding inside the box
            display: 'flex',
            alignItems: 'center'
        });

        // Input element
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'yyy';
        Object.assign(inputField.style, {
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '2vh',
            backgroundColor: 'transparent',
            color: '#333',
            position: 'relative',   // Needed to apply z-index
            zIndex: 3               // Higher than the botNameDiv's zIndex (2)
        });

        // Add input to the grey container
        greyBorderedDiv.appendChild(inputField);

        // Container for save destination options
        const saveOptionsDiv = document.createElement('div');
        Object.assign(saveOptionsDiv.style, {
            width: '18.5vw',
            height: '19vh',
            marginTop: '2vh',
            backgroundColor: 'white',
            //border: '1px solid black',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '4px'
        });

        // Left option (Local)
        const localDiv = document.createElement('div');
        Object.assign(localDiv.style, {
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid rgba(187, 187, 187, 0.7)',
            borderRadius: '4px'
        });

        const localImg = document.createElement('img');
        localImg.src = '/static/icons/desktop.png'; // Make sure this path is correct
        localImg.style.width = '3vw';
        localImg.style.height = 'auto';

        const localLabel = document.createElement('div');
        localLabel.textContent = 'Local';
        Object.assign(localLabel.style, {
            fontWeight: 'bold',
            fontSize: '2vh',
            marginTop: '1vh'
        });

        localDiv.appendChild(localImg);
        localDiv.appendChild(localLabel);

        // Right option (Google Drive)
        const driveDiv = document.createElement('div');
        Object.assign(driveDiv.style, {
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        });

        const driveImg = document.createElement('img');
        driveImg.src = '/static/icons/googledrive.png'; // Make sure this path is correct
        driveImg.style.width = '3vw';
        driveImg.style.height = 'auto';

        const driveLabel = document.createElement('div');
        driveLabel.textContent = 'Google Drive';
        Object.assign(driveLabel.style, {
            fontWeight: 'bold',
            fontSize: '2vh',
            marginTop: '1vh'
        });

        driveDiv.appendChild(driveImg);
        driveDiv.appendChild(driveLabel);

        // Assemble options container
        saveOptionsDiv.appendChild(localDiv);
        saveOptionsDiv.appendChild(driveDiv);

        // Append everything
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(subtitle);
        modal.appendChild(description);
        modal.appendChild(botNameDiv);
        modal.appendChild(greyBorderedDiv);
        modal.appendChild(saveOptionsDiv);

        // Bottom bar
        const bottomBar = document.createElement('div');
        Object.assign(bottomBar.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '20vw',
            height: '8vh',
            borderTop: '2px solid rgba(150, 150, 150, 0.1)',
            display: 'flex',
            alignItems: 'center',
            //justifyContent: 'space-between',
            //padding: '0 2vw',
            backgroundColor: 'white',
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
        });

        // Cancel Button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        Object.assign(cancelBtn.style, {
            height: '5.0vh',
            width: '5.6vw',
            border: '1px solid rgba(180,180,180,0.7)',
            backgroundColor: 'white',
            color: '#333',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderRadius: '5px',
            marginLeft: '5vw'
        });
        cancelBtn.addEventListener('click', () => document.body.removeChild(overlay));

        // Save Button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        Object.assign(saveBtn.style, {
            height: '5.0vh',
            width: '5.6vw',
            border: '1px solid rgba(220, 53, 69, 0.5)',
            backgroundColor: '#ff4d4f', // Soft red
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderRadius: '5px',
            marginLeft: '2.0vw'
        });
        saveBtn.addEventListener('click', () => {
            const botName = inputField.value.trim() || 'MyBot';

            try {
                // SAVE
                const xmlDom = Blockly.Xml.workspaceToDom(workspace);
                const xmlText = Blockly.Xml.domToPrettyText(xmlDom);

                console.log('✅ XML to be saved:', xmlText);  // Debug log

                const blob = new Blob([xmlText], { type: 'text/xml' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${botName}.xml`;
                a.click();
                URL.revokeObjectURL(a.href);
            } catch (err) {
                console.error('❌ Error saving Blockly workspace:', err);
                alert('Something went wrong while saving the bot.');
            }
        });

/*
        saveBtn.addEventListener('click', () => {
            const botName = inputField.value.trim() || 'MyBot';

            const xmlDom = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToPrettyText(xmlDom);

            const blob = new Blob([xmlText], { type: 'text/xml' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${botName}.xml`;
            a.click();
            URL.revokeObjectURL(a.href);

            // Remove modal after saving
            document.body.removeChild(overlay);
        });
*/
        //saveBtn.addEventListener('click', () => {
          //  console.log('💾 Save clicked');
            // Add your save logic here
            //document.body.removeChild(overlay);
        //});

        // Append buttons
        bottomBar.appendChild(cancelBtn);
        bottomBar.appendChild(saveBtn);


        // Add bottom bar to modal
        modal.appendChild(bottomBar);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function sortBlocksVertically() {
        const blocks = workspace.getTopBlocks(true); // Top-level blocks only

        console.log('📦 Available top-level blocks:');
        blocks.forEach((block, index) => {
            console.log(`Block ${index + 1}:`, {
                id: block.id,
                type: block.type,
                text: block.toString()
            });
        });

        // Optional: Sort alphabetically by type or name
        blocks.sort((a, b) => {
            const aType = a.type.toLowerCase();
            const bType = b.type.toLowerCase();
            return aType.localeCompare(bType);
        });

        const workspaceMetrics = workspace.getMetrics();
        const centerX = workspaceMetrics.viewLeft + workspaceMetrics.viewWidth / 2;

        const startY = workspaceMetrics.viewTop + 20;
        const verticalGap = 40;
        let currentY = startY;

        blocks.forEach(block => {
            const blockBBox = block.getHeightWidth();
            const blockWidth = blockBBox.width;
            const blockHeight = blockBBox.height;

            const newX = centerX - blockWidth / 2;

            block.moveTo(new Blockly.utils.Coordinate(newX, currentY));
            currentY += blockHeight + verticalGap;
        });
    }

    function sortBlocksCustom() {
        const blocks = workspace.getTopBlocks(true);
        const blockMap = {};
        const others = [];

        // Categorize blocks by type
        blocks.forEach(block => {
            const type = block.type;
            if (['tradeparameters', 'Purchase_conditions', 'Sell_conditions', 'Restart_trading_conditions'].includes(type)) {
                blockMap[type] = block;
            } else {
                others.push(block);
            }
        });

        // Workspace metrics
        const metrics = workspace.getMetrics();
        const centerX = metrics.viewLeft + metrics.viewWidth / 2;
        const leftOffsetX = centerX - metrics.viewWidth * 0.2;

        let currentY = metrics.viewTop + 20; // starting Y position

        // 1. Trade Parameters → center top
        if (blockMap['tradeparameters']) {
            const block = blockMap['tradeparameters'];
            const blockW = block.getHeightWidth().width;
            const x = centerX - blockW / 2;
            block.moveTo(new Blockly.utils.Coordinate(x, currentY));
        }

        // 2. Purchase Conditions → below Trade Parameters
        if (blockMap['Purchase_conditions']) {
            currentY += blockMap['tradeparameters']?.getHeightWidth().height + 40 || 100;
            const block = blockMap['Purchase_conditions'];
            const blockW = block.getHeightWidth().width;
            const x = centerX - blockW / 2;
            block.moveTo(new Blockly.utils.Coordinate(x, currentY));
        }

        // 3. Sell Conditions → left of Trade Parameters
        if (blockMap['Sell_conditions']) {
            const block = blockMap['Sell_conditions'];
            const blockW = block.getHeightWidth().width;
            const blockH = block.getHeightWidth().height;
            const x = centerX + metrics.viewWidth * 0.3;
            const y = metrics.viewTop + 20;
            block.moveTo(new Blockly.utils.Coordinate(x, y));
        }

        // 4. Restart Trading Conditions → below Sell Conditions
        if (blockMap['Restart_trading_conditions']) {
            const block = blockMap['Restart_trading_conditions'];
            const sellBlock = blockMap['Sell_conditions'];
            const blockH = sellBlock ? sellBlock.getHeightWidth().height : 0;
            const x = centerX + metrics.viewWidth * 0.3;
            const y = (sellBlock ? metrics.viewTop + 20 + blockH + 40 : metrics.viewTop + 150);
            block.moveTo(new Blockly.utils.Coordinate(x, y));
        }

        // 5. Other blocks → vertically below Purchase Conditions
        let otherY = currentY + (blockMap['Purchase_conditions']?.getHeightWidth().height || 100) + 40;

        others.forEach(block => {
            const blockW = block.getHeightWidth().width;
            const blockH = block.getHeightWidth().height;
            const x = centerX - blockW / 2;
            block.moveTo(new Blockly.utils.Coordinate(x, otherY));
            otherY += blockH + 40;
        });
    }

    function showChartOverlay() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            pointerEvents: 'auto',
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            width: '39.5vw',
            height: '84.8vh',
            backgroundColor: 'white',
            borderRadius: '8px',
            position: 'fixed',
            top: '10vh',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            padding: '1vh'
        });

        const chartText = document.createElement('div');
        chartText.textContent = 'Chart';
        chartText.style.margin = '1vh 0';

        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '1vh',
            right: '1vw',
            fontSize: '3vh',
            cursor: 'pointer'
        });
        //closeBtn.onclick = () => document.body.removeChild(overlay);
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
            sendCloseChartsSignalToBackend();
        };

        //closeBtn.onclick = () => {
          //  chart.remove(); // Cleanup chart
            //document.body.removeChild(overlay);
        //};

        // 🔹 Timeframe buttons bar
        const buttonBar = document.createElement('div');
        Object.assign(buttonBar.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5vw',
            border: '1px solid rgba(100,100,100,0.4)',
            padding: '0.5vh',
            marginBottom: '1vh',
            overflowX: 'auto'
        });

        const timeframes = ['tick', '1m', '2m', '5m', '10m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d'];

        timeframes.forEach(frame => {
            const btn = document.createElement('button');
            btn.textContent = frame;
            Object.assign(btn.style, {
                padding: '0.2vh 0.0vw',
                border: '1px solid gray',
                borderRadius: '5px',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                fontSize: '9px' // 👈 reduce font size here
            });

            btn.onclick = () => {
                setCandleIntervalFromUI(frame);
                if (frame === 'tick') {
                    sendCandleRequest('1HZ10V', frame);  // ← your custom function for ticks
                    initChart('tv_chart_container', 'line');  // or 'area'
                } else {
                    sendCandleRequest('1HZ10V', frame);
                    initChart('tv_chart_container', 'candlestick');
                }
            };

            buttonBar.appendChild(btn);
        });

        // 🔹 Chart container
        const chartDiv = document.createElement('div');
        chartDiv.id = 'tv_chart_container';
        Object.assign(chartDiv.style, {
            width: '36vw',
            height: '60vh',
            margin: 'auto',
            border: '1px solid rgba(150, 150, 150, 0.3)',  // ✅ Light grey border using rgba
            borderRadius: '4px'  // Optional: makes the corners slightly rounded
        });

        modal.appendChild(chartText);
        modal.appendChild(closeBtn);
        modal.appendChild(buttonBar);
        modal.appendChild(chartDiv);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        setTimeout(() => {
            const container = document.getElementById('tv_chart_container');
            if (container && container.clientWidth > 0 && container.clientHeight > 0) {
                initChart();
            } else {
                // Retry until it's ready
                const retryInit = setInterval(() => {
                    const ready = container && container.clientWidth > 0 && container.clientHeight > 0;
                    if (ready) {
                        clearInterval(retryInit);
                        initChart();
                    }
                }, 50);
            }
        }, 100);  // give some time for modal to appear
    }

    function showlineChartOverlay() {
        // Create overlay (covers entire screen, but transparent and non-interactive outside modal)
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.0)', // fully transparent
            zIndex: 9999,
            pointerEvents: 'none' // allow clicks to pass through, except modal
        });

        // Modal container
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            width: '39.5vw',
            height: '84.8vh',
            backgroundColor: 'white',
            //borderRadius: '5px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            position: 'fixed',
            top: '10vh',
            left: '50%',
            transform: 'translateX(-50%)', // center horizontally
            display: 'flex',
            //alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '2vh',
            pointerEvents: 'auto', // enable interaction
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
        });

        // Chart title text
        const chartText = document.createElement('div');
        chartText.textContent = 'TradingView Chart';
        Object.assign(chartText.style, {
            marginLeft: '3vw',
            marginTop: '3vw'
        });

        // Close button (top right)
        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '1vh',
            right: '1vw',
            fontSize: '2vh',
            color: '#333',
            cursor: 'pointer'
        });
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

        // Append elements
        modal.appendChild(chartText);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // 🔄 Undo the last action in the workspace
    function handleUndo() {
        if (workspace) {
            Blockly.Events.setGroup(true);
            workspace.undo(false);  // false = undo
            Blockly.Events.setGroup(false);
        } else {
            console.warn('⚠️ Workspace not available for Undo');
        }
    }

    // 🔁 Redo the last undone action in the workspace
    function handleRedo() {
        if (workspace) {
            Blockly.Events.setGroup(true);
            workspace.undo(true);  // true = redo
            Blockly.Events.setGroup(false);
        } else {
            console.warn('⚠️ Workspace not available for Redo');
        }
    }

    // 🔍 Zoom in by increasing the scale
    function handleZoomIn() {
        if (workspace) {
            const zoomCenter = workspace.getMetrics();
            workspace.zoom(zoomCenter.viewLeft + zoomCenter.viewWidth / 2, zoomCenter.viewTop + zoomCenter.viewHeight / 2, 1);
        } else {
            console.warn('⚠️ Workspace not available for Zoom In');
        }
    }

    // 🔎 Zoom out by decreasing the scale
    function handleZoomOut() {
        if (workspace) {
            const zoomCenter = workspace.getMetrics();
            workspace.zoom(zoomCenter.viewLeft + zoomCenter.viewWidth / 2, zoomCenter.viewTop + zoomCenter.viewHeight / 2, -1);
        } else {
            console.warn('⚠️ Workspace not available for Zoom Out');
        }
    }

    const clickActions = {
        'recycle.png': showResetOverlay,
        'folderopen.png': showImportOverlay,
        'floppydisk.png': showSaveOverlay,
        'sortdescending.png': sortBlocksCustom,
        'chart.png': showChartOverlay,
        'linechart.png': showlineChartOverlay,
        'undo.png': handleUndo,
        'redo.png': handleRedo,
        'zoomin1.png': handleZoomIn,
        'zoomout.png': handleZoomOut,
    };

    const createIcon = (src) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = src;
        icon.style = 'width: 2.5vh; height: 2.5vh; margin-right: 1.9vw; cursor: pointer;';

        const tooltip = document.createElement('div');
        tooltip.className = 'icon-tooltip';
        tooltip.innerText = tooltips[src] || '';
        tooltip.style = `
            position: absolute;
            top: calc(100% + 3vh);
            left: 25%;
            transform: translateX(-50%);
            background-color: #e5e5e5;
            color: black;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 2vh;
            white-space: nowrap;
            display: none;
            z-index: 20;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
        `;

        const triangle = document.createElement('div');
        triangle.style = `
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #e5e5e5;
        `;
        tooltip.appendChild(triangle);

        icon.addEventListener('mouseover', () => tooltip.style.display = 'block');
        icon.addEventListener('mouseout', () => tooltip.style.display = 'none');
        icon.addEventListener('click', () => clickActions[src]?.());

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    };

    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0vh;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
    `;

    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        z-index: 10;
    `;

    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;
        const widths = ['11.5vw', '6.0vw', '5.5vw', '6.0vw'];
        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${widths[index]};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => groupDiv.appendChild(createIcon(iconName)));
        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);

    //const workspaceContainer = workspace.getParentSvg().parentNode;
    //workspaceContainer.appendChild(optionsDiv);
    //workspaceContainer.appendChild(secondOptionsDiv);
    const wrapper = document.getElementById('blocklyWrapper');
    wrapper.appendChild(optionsDiv);
    wrapper.appendChild(secondOptionsDiv);

}
/*

// Function to create the Quick Strategy UI and attach behavior
function createQuickStrategyButton(workspace) {
    const tooltips = {
        'recycle.png': 'Reset',
        'folderopen.png': 'Import',
        'floppydisk.png': 'Save',
        'sortdescending.png': 'Sort',
        'chart.png': 'Charts',
        'linechart.png': 'TradingView Chart',
        'undo.png': 'Undo',
        'redo.png': 'Redo',
        'zoomin1.png': 'Zoom in',
        'zoomout.png': 'Zoom out'
    };

    const showResetOverlay = () => {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.style = `
            position: relative;
            width: 29.5vw;
            height: 22vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            padding: 20px;
        `;
        overlay.appendChild(modal);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) overlay.remove();
        });

        const closeBtn = document.createElement('div');
        closeBtn.innerText = '✕';
        closeBtn.style = `
            position: absolute;
            top: 6px;
            right: 10px;
            font-size: 2.5vh;
            color: #666;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(closeBtn);

        const heading = document.createElement('div');
        heading.innerText = 'Are you sure you want to reset?';
        heading.style = 'font-size: 2.5vh; font-weight: bold; margin-bottom: 2vh;';
        modal.appendChild(heading);

        const subtext = document.createElement('div');
        subtext.innerText = 'Any unsaved changes will be lost.';
        subtext.style = 'font-size: 2vh; margin-bottom: 4vh;';
        modal.appendChild(subtext);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.style = `
            position: absolute;
            bottom: 3vh;
            right: 8vw;
            height: 6vh;
            width: 5.4vw;
            border: 2px solid grey;
            background: white;
            color: black;
            cursor: pointer;
            border-radius: 4px;
        `;
        cancelBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(cancelBtn);

        const okBtn = document.createElement('button');
        okBtn.innerText = 'OK';
        okBtn.style = `
            position: absolute;
            bottom: 3vh;
            right: 2vw;
            height: 6vh;
            width: 5vw;
            border: none;
            background: #ff4d4d;
            color: white;
            cursor: pointer;
            border-radius: 4px;
        `;
        okBtn.addEventListener('click', () => {
            workspace.clear();
            const initialXml = Blockly.utils.xml.textToDom(InitialBlocks);
            Blockly.Xml.domToWorkspace(initialXml, workspace);
            Blockly.svgResize(workspace);
            overlay.remove();
        });
        modal.appendChild(okBtn);
    };

    const showImportOverlay = () => {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: '9999',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            width: '71vw', height: '74vh', backgroundColor: '#fff',
            borderRadius: '10px', padding: '20px', position: 'relative',
            display: 'flex', flexDirection: 'column'
        });

        const title = document.createElement('div');
        title.textContent = 'Load strategy';
        Object.assign(title.style, {
            fontWeight: 'bold', fontSize: '2.5vh', marginBottom: '3vh'
        });

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '10px', right: '15px',
            fontSize: '5vh', cursor: 'pointer', color: '#333'
        });
        closeBtn.addEventListener('click', () => overlay.remove());

        const tabContainer = document.createElement('div');
        Object.assign(tabContainer.style, {
            display: 'flex',
            gap: '0vw',
            marginTop: '6.0vh',
            alignItems: 'flex-end',
        });

        // Create each tab and manage active state
        const tabs = [
            { text: 'Recent', width: '6.0vw' },
            { text: 'Local', width: '7.0vw' },
            { text: 'Google Drive', width: '10vw' }
        ];

        let activeTab = null;

        tabs.forEach(({ text, width }, index) => {
            const tab = document.createElement('div');
            tab.textContent = text;
            Object.assign(tab.style, {
                width: width,
                borderBottom: '2px solid rgba(128, 128, 128, 0.5)',
                paddingBottom: '1vh',
                textAlign: 'center',
                fontSize: '2.5vh',
                cursor: 'pointer',
                fontWeight: 'normal',
                transition: 'all 0.2s ease'
            });

            tab.addEventListener('click', () => {
                if (activeTab) {
                    activeTab.style.borderBottom = '2px solid rgba(128, 128, 128, 0.5)';
                    activeTab.style.fontWeight = 'normal';
                }
                tab.style.borderBottom = '2px solid rgba(255, 66, 66, 0.8)'; // reddish, like your screenshot
                tab.style.fontWeight = 'bold';
                activeTab = tab;

                // 🔄 Here you could also trigger content swapping if needed
                // showContentForTab(text);
                showRecentContent(); // handle div creation when "Recent" is active
           });

            // Set "Recent" as active by default
            if (index === 0) {
                tab.style.borderBottom = '2px solid rgba(255, 66, 66, 0.8)';
                tab.style.fontWeight = 'bold';
                activeTab = tab;
            }

            tabContainer.appendChild(tab);
        });


        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(tabContainer);

        // Create a container for dynamic content (Recent section, etc.)
        const contentArea = document.createElement('div');
        contentArea.style.position = 'relative';
        modal.appendChild(contentArea);

        // Function to render Recent content
        function showRecentContent() {
            contentArea.innerHTML = ''; // clear previous content

            // Preview label box
            const preview = document.createElement('div');
            preview.textContent = 'Preview';
            Object.assign(preview.style, {
                position: 'absolute',
                top: '1.2vh',
                left: '26vw',
                width: '5.5vw',
                height: '6.5vh',
                backgroundColor: 'white',
                //border: '1px solid grey',
                fontSize: '2.4vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            });

            // Create main content box
            const box = document.createElement('div');
            Object.assign(box.style, {
                position: 'absolute',
                top: '8vh',
                left: '26vw',
                width: '44.5vw',
                height: '37.5vh',
                border: '1px solid rgba(128, 128, 128, 0.4)',  // Less gray with transparency
                borderRadius: '5px',
                backgroundColor: 'white'
            });
            document.body.appendChild(box);  // Append it to the body (or wherever you want)

            // Inject Blockly workspace into the box div
            const lsworkspace = Blockly.inject(box, {
                toolbox: null,
                trashcan: false,
                theme: myTheme,       // Apply your custom theme
                renderer: 'zelos',    // Use Zelos renderer
                zoom: {
                    controls: false,
                    wheel: true,
                    startScale: 0.62,
                    maxScale: 3.0,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                },
                grid: {
                    spacing: 20,
                    length: 0,
                    colour: null,
                    snap: false
                },
                move: {
                    scrollbars: false,
                    drag: true
                }
            });


            // Open button
            const openBtn = document.createElement('button');
            openBtn.textContent = 'Open';
            Object.assign(openBtn.style, {
                position: 'absolute',
                //bottom: '-15vh',
                top: '52vh',
                right: '0vw',
                backgroundColor: '#ff4e4e', // same red as image
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2vh',
                border: 'none',
                //padding: '1vh 2vw',
                borderRadius: '0.5vh',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                width: '5vw',
                height: '7vh',
            });

            contentArea.appendChild(preview);
            contentArea.appendChild(box);
            contentArea.appendChild(openBtn);
        }

        // Show "Recent" content by default
        showRecentContent();

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) overlay.remove();
        });

    };

    const clickActions = {
        'recycle.png': showResetOverlay,
        'folderopen.png': showImportOverlay,
        'floppydisk.png': () => console.log('Save'),
        'sortdescending.png': () => console.log('Sort'),
        'chart.png': () => console.log('Charts. Please go to charts.'),
        'linechart.png': () => console.log('Please go to TradingView.'),
        'undo.png': () => console.log('Undo'),
        'redo.png': () => console.log('Redo'),
        'zoomin1.png': () => console.log('Zoom in'),
        'zoomout.png': () => console.log('Zoom out')
    };

    const createIcon = (src) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = src;
        icon.style = 'width: 2.5vh; height: 2.5vh; margin-right: 1.9vw; cursor: pointer;';

        const tooltip = document.createElement('div');
        tooltip.className = 'icon-tooltip';
        tooltip.innerText = tooltips[src] || '';
        tooltip.style = `
            position: absolute;
            top: calc(100% + 3vh);
            left: 25%;
            transform: translateX(-50%);
            background-color: #e5e5e5;
            color: black;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 2vh;
            white-space: nowrap;
            display: none;
            z-index: 20;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
        `;

        const triangle = document.createElement('div');
        triangle.style = `
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #e5e5e5;
        `;
        tooltip.appendChild(triangle);

        icon.addEventListener('mouseover', () => tooltip.style.display = 'block');
        icon.addEventListener('mouseout', () => tooltip.style.display = 'none');
        icon.addEventListener('click', () => clickActions[src]?.());

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    };

    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
    `;

    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        z-index: 10;
    `;

    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;
        const widths = ['11.5vw', '6.0vw', '5.5vw', '6.0vw'];
        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${widths[index]};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => groupDiv.appendChild(createIcon(iconName)));
        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);

    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);
}
*/
/*
function createQuickStrategyButton(workspace) {
    const tooltips = {
        'recycle.png': 'Reset',
        'folderopen.png': 'Import',
        'floppydisk.png': 'Save',
        'sortdescending.png': 'Sort',
        'chart.png': 'Charts',
        'linechart.png': 'TradingView Chart',
        'undo.png': 'Undo',
        'redo.png': 'Redo',
        'zoomin1.png': 'Zoom in',
        'zoomout.png': 'Zoom out'
    };

    const showResetOverlay = () => {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.style = `
            position: relative;
            width: 29.5vw;
            height: 22vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            padding: 20px;
        `;
        overlay.appendChild(modal);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        const closeBtn = document.createElement('div');
        closeBtn.innerText = '✕';
        closeBtn.style = `
            position: absolute;
            top: 6px;
            right: 10px;
            font-size: 2.5vh;
            color: #666;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(closeBtn);

        const heading = document.createElement('div');
        heading.innerText = 'Are you sure you want to reset?';
        heading.style = `
            font-size: 2.5vh;
            font-weight: bold;
            margin-bottom: 2vh;
        `;
        modal.appendChild(heading);

        const subtext = document.createElement('div');
        subtext.innerText = 'Any unsaved changes will be lost.';
        subtext.style = `
            font-size: 2vh;
            margin-bottom: 4vh;
        `;
        modal.appendChild(subtext);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.style = `
            position: absolute;
            bottom: 3vh;
            right: 8vw;
            height: 6vh;
            width: 5.4vw;
            border: 2px solid grey;
            background: white;
            color: black;
            cursor: pointer;
            border-radius: 4px;
        `;
        cancelBtn.addEventListener('click', () => overlay.remove());
        modal.appendChild(cancelBtn);

        const okBtn = document.createElement('button');
        okBtn.innerText = 'OK';
        okBtn.style = `
            position: absolute;
            bottom: 3vh;
            right: 2vw;
            height: 6vh;
            width: 5vw;
            border: none;
            background: #ff4d4d;
            color: white;
            cursor: pointer;
            border-radius: 4px;
        `;

        okBtn.addEventListener('click', () => {
            // Step 1: Clear the workspace
            workspace.clear();

            // Parse and inject the InitialBlocks XML
            const initialXml = Blockly.utils.xml.textToDom(InitialBlocks);
            Blockly.Xml.domToWorkspace(initialXml, workspace);

            // Optional: Resize workspace to adjust for block dimensions
            Blockly.svgResize(workspace);

            // Step 3: Close the modal
            overlay.remove();
        });

        modal.appendChild(okBtn);
    };

    const clickActions = {
        'recycle.png': showResetOverlay,
        'folderopen.png': () => console.log('Import'),
        'floppydisk.png': () => console.log('Save'),
        'sortdescending.png': () => console.log('Sort'),
        'chart.png': () => console.log('Charts. Please go to charts.'),
        'linechart.png': () => console.log('Please go to TradingView.'),
        'undo.png': () => console.log('Undo'),
        'redo.png': () => console.log('Redo'),
        'zoomin1.png': () => console.log('Zoom in'),
        'zoomout.png': () => console.log('Zoom out')
    };

    const createIcon = (src) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = src;
        icon.style = `
            width: 2.5vh;
            height: 2.5vh;
            margin-right: 1.9vw;
            cursor: pointer;
        `;

        const tooltip = document.createElement('div');
        tooltip.className = 'icon-tooltip';
        tooltip.innerText = tooltips[src] || '';
        tooltip.style = `
            position: absolute;
            top: calc(100% + 3vh);
            left: 25%;
            transform: translateX(-50%);
            background-color: #e5e5e5;
            color: black;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 2vh;
            white-space: nowrap;
            display: none;
            z-index: 20;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
        `;

        const triangle = document.createElement('div');
        triangle.style = `
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #e5e5e5;
        `;

        tooltip.appendChild(triangle);

        icon.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
        });

        icon.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        icon.addEventListener('click', () => {
            if (clickActions[src]) clickActions[src]();
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    };

    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
    `;

    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        z-index: 10;
    `;

    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;

        const widths = ['11.5vw', '6.0vw', '5.5vw', '6.0vw'];
        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${widths[index]};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => {
            const icon = createIcon(iconName);
            groupDiv.appendChild(icon);
        });

        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);

    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);
}
*/
/*
function createQuickStrategyButton(workspace) {
    const tooltips = {
        'recycle.png': 'Reset',
        'folderopen.png': 'Import',
        'floppydisk.png': 'Save',
        'sortdescending.png': 'Sort',
        'chart.png': 'Charts',
        'linechart.png': 'TradingView Chart',
        'undo.png': 'Undo',
        'redo.png': 'Redo',
        'zoomin1.png': 'Zoom in',
        'zoomout.png': 'Zoom out'
    };

    const showResetOverlay = () => {
        console.log('Reset');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'resetOverlay';
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(30, 30, 30, 0.5);
            backdrop-filter: blur(3px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal box
        const modal = document.createElement('div');
        modal.style = `
            position: relative;
            background: white;
            width: 20vw;
            height: 20vh;
            border-radius: 6px;
            box-shadow: 0 0 12px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 2vh;
        `;

        // Top-right close (X) button
        const closeBtn = document.createElement('div');
        closeBtn.innerText = '✕';
        closeBtn.style = `
            position: absolute;
            top: 6px;
            right: 10px;
            font-size: 2.5vh;
            color: #666;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        // "Are you sure?" heading
        const heading = document.createElement('div');
        heading.innerText = 'Are you sure?';
        heading.style = `
            font-size: 2.5vh;
            font-weight: bold;
            margin-bottom: 1vh;
        `;

        // Subtext
        const subtext = document.createElement('div');
        subtext.innerText = 'Any unsaved changes will be lost.';
        subtext.style = `
            font-size: 2.0vh;
            font-weight: normal;
        `;

        modal.appendChild(closeBtn);
        modal.appendChild(heading);
        modal.appendChild(subtext);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    };

    const clickActions = {
        'recycle.png': showResetOverlay,
        'folderopen.png': () => console.log('Import'),
        'floppydisk.png': () => console.log('Save'),
        'sortdescending.png': () => console.log('Sort'),
        'chart.png': () => console.log('Charts. Please go to charts.'),
        'linechart.png': () => console.log('Please go to TradingView.'),
        'undo.png': () => console.log('Undo'),
        'redo.png': () => console.log('Redo'),
        'zoomin1.png': () => console.log('Zoom in'),
        'zoomout.png': () => console.log('Zoom out')
    };

    const createIcon = (src) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = src;
        icon.style = `
            width: 2.5vh;
            height: 2.5vh;
            margin-right: 1.9vw;
            cursor: pointer;
        `;

        const tooltip = document.createElement('div');
        tooltip.className = 'icon-tooltip';
        tooltip.innerText = tooltips[src] || '';
        tooltip.style = `
            position: absolute;
            top: calc(100% + 3vh);
            left: 25%;
            transform: translateX(-50%);
            background-color: #e5e5e5;
            color: black;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 2.0vh;
            white-space: nowrap;
            display: none;
            z-index: 20;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
        `;

        const triangle = document.createElement('div');
        triangle.style = `
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #e5e5e5;
        `;

        tooltip.appendChild(triangle);

        icon.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
        });

        icon.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        icon.addEventListener('click', () => {
            if (clickActions[src]) clickActions[src]();
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    };

    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    // --- Left panel
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
    `;

    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    // --- Top control panel
    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        z-index: 10;
    `;

    // --- Icon groups
    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;

        const widths = ['11.5vw', '6.0vw', '5.5vw', '6.0vw'];
        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${widths[index]};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => {
            const icon = createIcon(iconName);
            groupDiv.appendChild(icon);
        });

        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);

    // Append to Blockly container
    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);
};
*/
/*
function createQuickStrategyButton(workspace) {
    const tooltips = {
        'recycle.png': 'Reset',
        'folderopen.png': 'Import',
        'floppydisk.png': 'Save',
        'sortdescending.png': 'Sort',
        'chart.png': 'Charts',
        'linechart.png': 'TradingView Chart',
        'undo.png': 'Undo',
        'redo.png': 'Redo',
        'zoomin1.png': 'Zoom in',
        'zoomout.png': 'Zoom out'
    };

    const clickActions = {
        'recycle.png': () => console.log('Reset'),
        'folderopen.png': () => console.log('Import'),
        'floppydisk.png': () => console.log('Save'),
        'sortdescending.png': () => console.log('Sort'),
        'chart.png': () => console.log('Charts. Please go to charts.'),
        'linechart.png': () => console.log('Please go to TradingView.'),
        'undo.png': () => console.log('Undo'),
        'redo.png': () => console.log('Redo'),
        'zoomin1.png': () => console.log('Zoom in'),
        'zoomout.png': () => console.log('Zoom out')
    };

    const createIcon = (src) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = src;
        icon.style = `
            width: 2.5vh;
            height: 2.5vh;
            margin-right: 1.9vw;
            cursor: pointer;
        `;

        const tooltip = document.createElement('div');
        tooltip.className = 'icon-tooltip';
        tooltip.innerText = tooltips[src] || '';
        tooltip.style = `
            position: absolute;
            top: calc(100% + 3vh);
            left: 25%;
            transform: translateX(-50%);
            background-color: #e5e5e5;
            color: black;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 2.0vh;
            white-space: nowrap;
            display: none;
            z-index: 20;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
        `;

        const triangle = document.createElement('div');
        triangle.style = `
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #e5e5e5;
        `;

        tooltip.appendChild(triangle);

        icon.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
        });

        icon.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        icon.addEventListener('click', () => {
            if (clickActions[src]) clickActions[src]();
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    };

    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    // --- Left panel
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
    `;

    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    // --- Top control panel
    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        z-index: 10;
    `;

    // --- Icon groups
    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;

        const widths = ['11.5vw', '6.0vw', '5.5vw', '6.0vw'];
        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${widths[index]};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => {
            const icon = createIcon(iconName);
            groupDiv.appendChild(icon);
        });

        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);

    // Append to Blockly container
    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);
}
*/
/*
function createQuickStrategyButton(workspace) {
    // Create the left panel container
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
    `;

    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);

    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        z-index: 10;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
    `;

    const tooltips = {
        'recycle.png': 'Reset',
        'folderopen.png': 'Import',
        'floppydisk.png': 'Save',
        'sortdescending.png': 'Sort',
        'chart.png': 'Charts',
        'linechart.png': 'TradingView Chart',
        'undo.png': 'Undo',
        'redo.png': 'Redo',
        'zoomin1.png': 'Zoom in',
        'zoomout.png': 'Zoom out'
    };

    const clickActions = {
        'recycle.png': () => console.log('Reset'),
        'folderopen.png': () => console.log('Import'),
        'floppydisk.png': () => console.log('Save'),
        'sortdescending.png': () => console.log('Sort'),
        'chart.png': () => console.log('Charts. Please go to charts.'),
        'linechart.png': () => console.log('Please go to TradingView.'),
        'undo.png': () => console.log('Undo'),
        'redo.png': () => console.log('Redo'),
        'zoomin1.png': () => console.log('Zoom in'),
        'zoomout.png': () => console.log('Zoom out')
    };

    const createIcon = (src) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = src;
        icon.style = `
            width: 2.5vh;
            height: 2.5vh;
            margin-right: 1.9vw;
            cursor: pointer;
        `;

        const tooltip = document.createElement('div');
        tooltip.innerText = tooltips[src] || '';
        tooltip.style = `
            position: absolute;
            bottom: -200%;
            left: 25%;
            transform: translateX(-50%);
            background-color: #e5e5e5;
            color: black;
            padding: 4px 6px;
            border-radius: 3px;
            white-space: nowrap;
            font-size: 2.0vh;
            display: none;
            z-index: 20;
        `;

        icon.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
        });

        icon.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        icon.addEventListener('click', () => {
            if (clickActions[src]) clickActions[src]();
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    };

    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;

        let groupWidth;
        if (index === 0) groupWidth = '11.5vw';
        else if (index === 1) groupWidth = '6.0vw';
        else if (index === 2) groupWidth = '5.5vw';
        else groupWidth = '6.0vw';

        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${groupWidth};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => {
            const icon = createIcon(iconName);
            groupDiv.appendChild(icon);
        });

        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);
}
*/
/*
function createQuickStrategyButton(workspace) {
    // Create the left panel container
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
        border: 0vh solid #ccc;
    `;

    // Quick Strategy button
    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    // Create top panel container
    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        //top: 0;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    // Append to workspace container
    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);

    // Create sODiv
    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
        background-color: white;
        z-index: 10;
        border: 1px solid #ccc;
        border-radius: 4px;
        position: relative;
        padding-top: -1vh;
    `;

    // Icon helper
    const createIcon = (src, alt = '') => {
        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = alt;
        icon.style = `
            width: 2.5vh;
            height: 2.5vh;
            margin-right: 1.9vw;
        `;
        return icon;
    };

    // Define icons to insert in each sub-div
    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;

        //const groupWidth = index === 0 ? '11.5vw' : '6.0vw';
        let groupWidth;
        if (index === 0) groupWidth = '11.5vw';
        else if (index === 1) groupWidth = '6.0vw';
        else if (index === 2) groupWidth = '5.5vw';
        else groupWidth = '6.0vw';

        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';

        groupDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: ${groupWidth};
            height: 5vh;
            ${borderLeft}
            padding-left: 1.5vw;
        `;

        icons.forEach(iconName => {
            const icon = createIcon(iconName);
            groupDiv.appendChild(icon);
        });

        sODiv.appendChild(groupDiv);
    });

    secondOptionsDiv.appendChild(sODiv);
};
*/
/*
function createQuickStrategyButton(workspace) {
    // Create the options container div (left panel)
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
        border: 0vh solid #ccc;
    `;

    // Create the Quick Strategy button
    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%;
        text-align: center;
        z-index: 10;
    `;

    optionsDiv.appendChild(quickStrategyBtn);

    // Create the second options container div (top panel holder)
    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        top: 0;
        left: 17.55vw;
        width: 36.2vw;
        height: 9vh;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    `;

    // Create the actual options bar inside the top panel
    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 35.5vw;
        height: 6vh;
        margin-top: 1.5vh;
        margin-bottom: 1.5vw;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 2vw;
        padding: 0 1vw;
        z-index: 10;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

    // Helper function to create icons
    const createIcon = (src, alt = '') => {
        const icon = document.createElement('img');
        icon.src = `/static/icons/${src}`;
        icon.alt = alt;
        icon.style = `
            width: 2.5vh;
            height: 2.5vh;
            margin-right: 2vw;
        `;
        return icon;
    };

    // Define icons to insert in each sub-div
    const iconGroups = {
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sortdescending.png'],
        O_1: ['chart.png', 'linechart.png'],
        O_2: ['redo.png', 'undo.png'],
        O_3: ['zoomin.png', 'zoomout.png']
    };

    // Create sub-divs and append icons
    Object.entries(iconGroups).forEach(([id, icons]) => {
        const div = document.createElement('div');
        div.id = id;
        div.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
        `;
        icons.forEach(iconName => {
            const icon = createIcon(iconName);
            div.appendChild(icon);
        });
        sODiv.appendChild(div);
    });

    // Append everything to the workspace container
    secondOptionsDiv.appendChild(sODiv);
    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);
*/
/*
function createQuickStrategyButton(workspace) {
    // Create the options container div (left panel)
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 17.5vw;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        z-index: 10;
        border: 0vh solid #ccc;
    `;

    // Create the Quick Strategy button
    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 92%; // Make width responsive with 5px padding
        text-align: center;
        z-index: 10;
    `;

    // Append button to optionsDiv
    optionsDiv.appendChild(quickStrategyBtn);

    // Create the second options container div (top panel)
    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        position: absolute;
        top: 0; // Aligns it to the extreme top
        left: 17.55vw; // Starts from the right edge of optionsDiv
        width: 36.2vw; // Specified width
        height: 9vh; // Specified height
        background-color: white; //rgba(0, 0, 255, 0.1); // Slight blue background to differentiate
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        //border: 1px solid #ccc;
    `;

    // Append divs to the workspace container
    const workspaceContainer = workspace.getParentSvg().parentNode;
    workspaceContainer.appendChild(optionsDiv);
    workspaceContainer.appendChild(secondOptionsDiv);

    // Create the second options container div (top panel)
    const sODiv = document.createElement('div');
    sODiv.id = 'sODiv';
    sODiv.style = `
        position: absolute;
        top: 0; // Aligns it to the extreme top
        left: 0vh; // Starts from the right edge of optionsDiv
        width: 35.5vw; // Specified width
        height: 6vh; // Specified height
        margin-top: 1.5vh;
        margin-bottom: 1.5vw;
        background-color: white; //rgba(0, 0, 255, 0.1); // Slight blue background to differentiate
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

    secondOptionsDiv.appendChild(sODiv);

}
*/
/*
function createQuickStrategyButton(workspace) {
    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick strategy';
    quickStrategyBtn.style = 'position: absolute; top: 5px; left: 5px; background-color: red; color: white; padding: 10px 45px; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: bold; z-index: 10;';
    workspace.getParentSvg().parentNode.appendChild(quickStrategyBtn);
}
*/
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("nav ul li a");

    // Check which page is active on load
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            // Remove "active" class from all links
            navLinks.forEach(nav => nav.classList.remove("active"));

            // Add "active" class to the clicked link
            this.classList.add("active");
        });
    });
});
/*
document.addEventListener("DOMContentLoaded", function () {
    const blocklyDiv = document.getElementById("blocklyDiv");
    const toggleButton = document.getElementById("tBut");
    const resultWindow = document.getElementById("resultwindow"); // Select result window

    if (!blocklyDiv || !toggleButton || !resultWindow) {
        console.error("Element not found! Check your IDs.");
        return;
    }

    let isToggled = false;

    toggleButton.addEventListener("click", function () {
        console.log("Toggle button clicked!"); // Debugging log

        if (!isToggled) {
            // Shrink blocklyDiv
            blocklyDiv.style.width = "76vw";
            blocklyDiv.style.transformOrigin = "right center";
            toggleButton.style.transform = "rotate(180deg)";

            // Show result window
            resultWindow.style.display = "block";
        } else {
            // Expand blocklyDiv back
            blocklyDiv.style.width = "100vw";
            blocklyDiv.style.transformOrigin = "right center";
            toggleButton.style.transform = "rotate(0deg)";

            // Hide result window
            resultWindow.style.display = "none";
        }

        isToggled = !isToggled;
    });
});
*/
/*
document.addEventListener("DOMContentLoaded", function () {
    const blocklyDiv = document.getElementById("blocklyDiv");
    const toggleButton = document.getElementById("tBut");
    const resultWindow = document.getElementById("resultwindow"); // Select result window

    if (!blocklyDiv || !toggleButton || !resultWindow) {
        console.error("Element not found! Check your IDs.");
        return;
    }

    let isToggled = true; // Set to true so it's open by default

    // Open by default
    blocklyDiv.style.width = "73vw";
    blocklyDiv.style.transformOrigin = "right center";
    toggleButton.style.transform = "rotate(180deg)";
    //Blockly.svgResize(workspace);

    // Show result window by default
    resultWindow.style.display = "block";

    toggleButton.addEventListener("click", function () {
        console.log("Toggle button clicked!"); // Debugging log

        if (!isToggled) {
            // Shrink blocklyDiv
            blocklyDiv.style.width = "73vw";
            blocklyDiv.style.transformOrigin = "right center";
            toggleButton.style.transform = "rotate(180deg)";

            // Show result window
            resultWindow.style.display = "block";
            //Blockly.svgResize(workspace);
        } else {
            // Expand blocklyDiv back
            blocklyDiv.style.width = "100vw";
            blocklyDiv.style.transformOrigin = "right center";
            toggleButton.style.transform = "rotate(0deg)";

            // Hide result window
            resultWindow.style.display = "none";
            //Blockly.svgResize(workspace);
        }

        isToggled = !isToggled;

        // ✅ Resize Blockly canvas to fit the new dimensions
        if (workspace) {
            Blockly.svgResize(workspace);
        } else {
            console.warn('Workspace is not initialized yet!');
        }
    });
});
*/

document.addEventListener("DOMContentLoaded", function () {
    const blocklyDiv = document.getElementById("blocklyDiv");
    const toggleButton = document.getElementById("tBut");
    const resultWindow = document.getElementById("resultwindow"); // Select result window

    if (!blocklyDiv || !toggleButton || !resultWindow) {
        console.error("Element not found! Check your IDs.");
        return;
    }

    let isToggled = true; // Set to true so it's open by default

    // Open by default
    blocklyDiv.style.width = "73vw";
    blocklyDiv.style.transformOrigin = "right center";
    toggleButton.style.transform = "rotate(180deg)";
    //Blockly.svgResize(workspace);

    // Show result window by default
    resultWindow.style.display = "block";

    const bp_dic = {
        default: `<span class="nowrap-run">When you’re ready to trade, hit <strong>Run.</strong></span>You’ll be able to track your bot’s<br>performance here.`
    };


    // ✅ Function to inject into .bp div
    function updateBpText(key = 'default') {
        const bp = document.querySelector('.bp');
        if (bp && bp_dic[key]) {
            bp.innerHTML = bp_dic[key];
        } else {
            console.warn(`No content found in bp_dic for key: ${key}`);
        }
    }

    // 🔹 Apply default text when DOM is ready and result window is visible
    setTimeout(() => {
        if (isToggled) updateBpText();
    }, 0);

    // 🔄 Toggle logic
    toggleButton.addEventListener("click", function () {
        console.log("Toggle button clicked!"); // Debugging log

        if (!isToggled) {
            // 🔹 Expand blocklyDiv to show result window
            blocklyDiv.style.width = "73vw";
            blocklyDiv.style.transformOrigin = "right center";
            toggleButton.style.transform = "rotate(180deg)";
            resultWindow.style.display = "block";

            // ✅ Inject .bp text again when showing result
            updateBpText();  // or use updateBpText('running'), etc.
        } else {
            // 🔹 Collapse blocklyDiv to hide result window
            blocklyDiv.style.width = "100vw";
            blocklyDiv.style.transformOrigin = "right center";
            toggleButton.style.transform = "rotate(0deg)";
            resultWindow.style.display = "none";
        }

        isToggled = !isToggled;

        // ✅ Resize Blockly canvas to fit the new dimensions
        if (window.workspace) {
            Blockly.svgResize(workspace);
        } else {
            console.warn('Workspace is not initialized yet!');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove "active" class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Activate the clicked button and its content
            this.classList.add("active");
            document.getElementById(this.dataset.tab).classList.add("active");
        });
    });

    // Set the first tab as active by default
    tabButtons[0].classList.add("active");
    tabContents[0].classList.add("active");
});
/*
function createBlocksMenuButton(workspace) {
    const blocksMenuToggleBtn = document.createElement('button');
    blocksMenuToggleBtn.id = 'blockMenuToggle';
    blocksMenuToggleBtn.style = 'display: flex; align-items: center; position: absolute; top: 9vh; left: 1.5vh; background-color: #f1f1f1; color: black; padding: 7px 31px; border: 0px solid #ccc; border-radius: 0px; cursor: pointer; font-size: 12px; font-weight: bold; z-index: 10; height: 6vh; width: 16.1vw;'; //32vh;';

    const buttonContent = document.createElement('div');
    buttonContent.style = 'display: flex; justify-content: space-between; width: 100%;';

    const buttonText = document.createElement('span');
    buttonText.innerText = 'Blocks menu';
    buttonText.style.marginRight = '10px';

    const toggleIcon = document.createElement('img');
    toggleIcon.id = 'toggleIcon';
    toggleIcon.src = '/static/icons/down.png';
    toggleIcon.style = 'width: 15px; height: 15px;';
*/
/*
setTimeout(() => {
  workspace.getAllBlocks().forEach(block => {
    if (block.svgGroup_) {
      if (block.type === 'tradeparameters') {
        block.svgGroup_.classList.add('tradeparameters-block');
      } else if (block.type === 'market') {
        block.svgGroup_.classList.add('market-block');
      }
    }
  });
}, 0);
*/
function attachDragHandler(workspace) {
    let isDragging = false;
    let draggedBlockXml = null;
    let addedBlock = null;

    workspace.addChangeListener((event) => {
        if (event.type === Blockly.Events.BLOCK_DRAG) {
            const block = workspace.getBlockById(event.blockId);
            if (!block) return;

            draggedBlockXml = Blockly.Xml.blockToDom(block);
            let mainBlockXml = document.createElement('xml');
            mainBlockXml.appendChild(draggedBlockXml);

            const initialBlocks = mainWorkspace.getAllBlocks();
            Blockly.Xml.domToWorkspace(mainBlockXml, mainWorkspace);
            isDragging = true;

            block.dispose(false, false);

            const newBlocks = mainWorkspace.getAllBlocks();
            addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

            if (addedBlock) {
                console.log('New block ID:', addedBlock.id);
            }

            modal.style.display = 'none';
        }

        if (isDragging && addedBlock) {
            document.addEventListener('mousemove', (event) => {
                const mouseX = event.clientX;
                const mouseY = event.clientY;

                const screenCoordinates = { x: mouseX, y: mouseY };
                const wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(mainWorkspace, screenCoordinates);

                const currentPos = addedBlock.getRelativeToSurfaceXY();
                const dx = wsCoord.x - currentPos.x;
                const dy = wsCoord.y - currentPos.y;

                try {
                    addedBlock.moveBy(dx, dy, ['drag']);
                    console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());
                } catch (error) {
                    console.error("Error during block move: ", error);
                }

                isDragging = false;
                addedBlock = null;
            }, { once: true });
        }
    });
}

function createBlocksMenuButton(workspace) {
    const blocksMenuToggleBtn = document.createElement('button');
    blocksMenuToggleBtn.id = 'blockMenuToggle';
/*    blocksMenuToggleBtn.style = `
        position: absolute;
        top: 9vh;
        //left: 1.5vh;
        left : 0.7vw;
        height: 7vh;
        width: 16.1vw;
        background-color: #f1f1f1;
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-size: 1.2vw;
        font-weight: bold;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 0;
    `;

    // Centered text span
    const buttonText = document.createElement('span');
    buttonText.innerText = 'Blocks menu';
    buttonText.style = `
        z-index: 1;
    `;
*/
    blocksMenuToggleBtn.style = `
        position: absolute;
        top: 9vh;
        left : 0.7vw;
        height: 7vh;
        width: 16.1vw;
        background-color: #f1f1f1;
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-size: 1.2vw;
        font-weight: bold;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative; /* Required for absolute positioning of children */
        padding: 0;
    `;

    const buttonText = document.createElement('span');
    buttonText.innerText = 'Blocks menu';
    buttonText.style = `
        position: absolute;
        left: 2.7vw;
        z-index: 1;
    `;

    // Left-positioned icon with 1vw gap
    const toggleIcon = document.createElement('img');
    toggleIcon.id = 'toggleIcon';
    toggleIcon.src = '/static/icons/up.png';
    toggleIcon.style = `
        width: 1.5vw;
        height: 3.5vh;
        position: absolute;
        //left: 12.5vw;
        right: 2.5vw;
        top: 50%;
        transform: translateY(-50%);
    `;

    // Append children
    blocksMenuToggleBtn.appendChild(toggleIcon);
    blocksMenuToggleBtn.appendChild(buttonText);

    const wrapper = document.getElementById('blocklyWrapper');
    wrapper.appendChild(blocksMenuToggleBtn);

    // Create the blocks menu container
    const blocksMenuContainer = document.createElement('div');
    blocksMenuContainer.id = 'blocksMenuContainer';
    blocksMenuContainer.style.overflow = 'hidden';
    blocksMenuContainer.style.boxSizing = 'border-box';
    blocksMenuContainer.style.position = 'relative';
    blocksMenuContainer.style.top = '9vh';
    blocksMenuContainer.style.left = '0.7vw';
    blocksMenuContainer.style.width = '16.1vw';
    blocksMenuContainer.style.height = '56.5vh';
    blocksMenuContainer.style.display = 'block';
    blocksMenuContainer.style.backgroundColor = 'white';
    blocksMenuContainer.style.borderLeft = '0.25px solid #ccc';
    blocksMenuContainer.style.borderRight = '0.25px solid #ccc';
    blocksMenuContainer.style.borderBottom = '0.25px solid #ccc';
    blocksMenuContainer.style.borderTop = 'none';
    blocksMenuContainer.style.borderRadius = '2px';
    blocksMenuContainer.style.zIndex = '10';

    // Create the search bar container
    const searchBarContainer = document.createElement('div');
    searchBarContainer.style.padding = '1.3vh';
    searchBarContainer.style.backgroundColor = 'white';
    searchBarContainer.style.position = 'sticky';
    searchBarContainer.style.top = '0';
    searchBarContainer.style.zIndex = '11';
    searchBarContainer.style.width = '14.5vw';
    searchBarContainer.style.height = '5.0vh';
    searchBarContainer.style.display = 'flex';
    searchBarContainer.style.alignItems = 'center';
    searchBarContainer.style.border = '1px solid #ccc';
    searchBarContainer.style.borderRadius = '5px';
    searchBarContainer.style.marginLeft = '0.7vw';
    searchBarContainer.style.marginTop = '2.3vh';
    searchBarContainer.style.marginBottom = '2.3vh';
    searchBarContainer.style.boxSizing = 'border-box';

    // Create the image icon (PNG)
    const searchIcon = document.createElement('img');
    searchIcon.src = '/static/icons/search.png';
    searchIcon.alt = 'Search Icon';
    searchIcon.id = 'search-icon';
    searchIcon.style.width = '2.2vh';
    searchIcon.style.height = '2.2vh';
    searchIcon.style.marginLeft = '0.50vw';
    searchIcon.style.marginRight = '0.2vw';
    searchIcon.style.transition = 'opacity 0.2s ease';

    // Create the outer ring (grey background)
    const spinner = document.createElement('div');
    spinner.id = 'spinner-icon';
    spinner.style.width = '2.2vh';
    spinner.style.height = '2.2vh';
    //spinner.style.borderRadius = '50%';
    spinner.style.marginLeft = '0.5vw';
    spinner.style.marginRight = '1.5vw';
    spinner.style.background = '#e0e0e0'; // Light gray background
    spinner.style.position = 'relative';
    spinner.style.display = 'none';

    // Create the green rotating arc
    const arc = document.createElement('div');
    arc.style.width = '100%';
    arc.style.height = '100%';
    //arc.style.borderRadius = '50%';
    arc.style.marginRight = '0.0vw';
    arc.style.border = '2px solid transparent';
    arc.style.borderTop = '2px solid #4caf50'; // Green arc
    arc.style.position = 'absolute';
    arc.style.top = '0';
    arc.style.left = '0vw';
    arc.style.boxSizing = 'border-box';
    arc.style.animation = 'spinArc 1s linear infinite';

    // Append arc to spinner
    spinner.appendChild(arc);
    document.body.appendChild(spinner); // Or append to any container

    // Add CSS keyframes for spinning animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes spinArc {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `;
    document.head.appendChild(style);

    // Create the search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'blockSearch';
    //searchInput.style.width = '7vw';
    searchInput.placeholder = 'Search';
    searchInput.style.border = 'none';
    searchInput.style.outline = 'none';
    searchInput.style.flex = '1';
    searchInput.style.height = '100%';
    searchInput.style.fontSize = '10px';
    searchInput.style.backgroundColor = 'transparent';
    searchInput.style.paddingLeft = '0.25vw';  // margin already applied by icon


    const createSearchModal = () => {
      const modal = document.createElement('div');
      modal.id = 'searchModal';
      modal.className = 'sectionModal';
      modal.style.cssText = `
        border-radius: 1vh;
        position: fixed;
        top: 23vh;
        left: 20.5vw;
        width: 32vw;
        height: 63vh;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: none;
        z-index: 20;
      `;

      const modalHeader = document.createElement('div');
      modalHeader.id = 'modalHeader';
      modalHeader.style.cssText = `
        flex: 0 0 auto;
        height: 11vh;
        background-color: #eceff0;
        padding: 0 2vw;
        font-weight: bold;
        font-size: 2.7vh;
        color: #444;
      `;

      const modalBody = document.createElement('div');
      modalBody.id = 'modalBody';
      modalBody.className = 'sectionModa'; // 👈 add this class
      modalBody.style.cssText = `
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        //border: 1px solid black;
        //width: 31vw;
        height: 51.5vh;
      `;

      modal.append(modalHeader, modalBody);
      workspace.getParentSvg().parentNode.appendChild(modal);

      return { modal, modalHeader, modalBody };
    };

    const { modal, modalHeader, modalBody } = createSearchModal();

    const blockDat = {
            'tradeparameters': `Trade parameters
        Here is where you define the parameters of your contract.
        Learn more`,

            'durationn': `Trade options
        Define your trade options such as duration and stake. Some options are only applicable for certain trade types.
        Learn more`,

            'multiplierr': `Multiplier trade options
        Define your trade options such as multiplier and stake. This block can only be used with the multipliers trade type. If you select another trade type, this block will be replaced with the Trade options block.
        Learn more`,

            'take_profitt': `Take Profit (Multiplier)
        Your contract is closed automatically when your profit is more than or equals to this amount. This block can only be used with the multipliers trade type.`,

            'stop_losss': `Stop loss (Multiplier)
        Your contract is closed automatically when your loss is more than or equals to this amount. This block can only be used with the multipliers trade type.`,

            'growth_ratee': `Accumulator trade options
        Define your trade options such as accumulator and stake. This block can only be used with the accumulator trade type. If you select another trade type, this block will be replaced with the Trade options block.`,

            'take_profit_aa': `Take Profit (Accumulator)
        Your contract is closed automatically when your profit is more than or equals to this amount. This block can only be used with the accumulator trade type.`,

            'purchase_conditions': `Purchase conditions
        This block is mandatory. Only one copy of this block is allowed. You can place the Purchase block (see below) here as well as conditional blocks to define your purchase conditions.
        Learn more`,

            'purchase': `Purchase
        Use this block to purchase the specific contract you want. You may add multiple Purchase blocks together with conditional blocks to define your purchase conditions. This block can only be used within the Purchase conditions block.`,

            'sell_conditions': `Sell conditions
        Here is where you can decide to sell your contract before it expires. Only one copy of this block is allowed.
        Learn more`,

            'sell_at_market_price': `Sell at market price
        Use this block to sell your contract at the market price.
        Learn more`,

            'restart_trading_conditions': `Restart trading conditions
        Here is where you can decide if your bot should continue trading.
        Learn more`,

            'trade_again': `Trade again
        This block will transfer the control back to the Purchase conditions block, enabling you to purchase another contract.
        Learn more`,

            'run_on_every_tick': `Run on every tick
        The content of this block is called on every tick. Place this block outside of any root block.
        Learn more`,

            'last_tick': `Last tick
        This block gives you the value of the last tick.`,

            'last_digit': `Last Digit
        This block gives you the last digit of the latest tick value.
        Learn more`,

            'current_stat': `Current Stat
        This block gives you the Current Stat value.`,

            'current_stat_list': `Current stat list
        This block gives you a list of the curent stats of the last 1000 tick values.`,

            'tick_list': `Tick list
        This block gives you a list of the last 1000 tick values.`,

            'last_digits_list': `Last Digits List
        This block gives you a list of the last digits of the last 1000 tick values.`,

            'market_direction': `Market direction
        This block is used to determine if the market price moves in the selected direction or not. It gives you a value of “True” or “False”.
        Learn more
        `,

            'is_candle_black_': `Is candle black?
        This block returns “True” if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.
        Learn more`,

            'read_candle_value__1__': `Read candle value (1)
        This block gives you the specified candle value for a selected time interval.
        Learn more
        `,

            'read_candle_value__2_': `Read candle value (2)
        This block gives you the selected candle value.
        Learn more`,

            'create_a_list_of_candle_values__1_': `Create a list of candle values (1)
        This block gives you the selected candle value from a list of candles within the selected time interval.
        Learn more`,

            'create_a_list_of_candle_values__2_': `Create a list of candle values (2)
        This block gives you the selected candle value from a list of candles.
        Learn more`,

            'get_candlee': `Get candle
        This block gives you a specific candle from within the selected time interval.
        Learn more`,

            'get_candle_list': `Get candle list
        This block gives you a list of candles within a selected time interval.
        Learn more`,

            'last_trade_result': `Last trade result
        You can check the result of the last trade with this block.
        Learn more`,

            'contract_details': `Contract details
        This block gives you information about your last contract.
        Learn more`,

            'profit_loss_from_selling': `Profit/loss from selling
        This block gives you the potential profit or loss if you decide to sell your contract.
        Learn more`,

            'can_contract_be_sold_': `Can contract be sold?
        This block helps you check if your contract can be sold. If your contract can be sold, it returns “True”. Otherwise, it returns an empty string.`,

            'potential_payout': `Potential payout
        This block returns the potential payout for the selected trade type. This block can be used only in the "Purchase conditions" root block.`,

            'purchase_price': `Purchase price
        This block returns the purchase price for the selected trade type. This block can be used only in the "Purchase conditions" root block.`,

            'account_balance': `Account balance
        This block gives you the balance of your account either as a number or a string of text.
        Learn more
        `,

            'total_profit_loss': `Total profit/loss
        This block gives you the total profit/loss of your trading strategy since your bot started running. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.`,

            'number_of_runs': `Number of runs
        This block gives you the total number of times your bot has run. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.`,

            'function_1': `Function
        This block creates a function, which is a group of instructions that can be executed at any time. Place other blocks in here to perform any kind of action that you need in your strategy. When all the instructions in a function have been carried out, your bot will continue with the remaining blocks in your strategy. Click the “do something” field to give it a name of your choice. Click the plus icon to send a value (as a named variable) to your function.`,

            'function_that_returns_a_value': `Function that returns a value
        This block is similar to the one above, except that this returns a value. The returned value can be assigned to a variable of your choice.`,

            'conditional_return': `Conditional return
        This block returns a value when a condition is true. Use this block within either of the function blocks above.
        Learn more`,

            'print': `Print
        This block displays a dialog box with a customised message. When the dialog box is displayed, your strategy is paused and will only resume after you click "OK".
        Learn more`,

            'request_an_input': `Request an input
        This block displays a dialog box that uses a customised message to prompt for an input. The input can be either a string of text or a number and can be assigned to a variable. When the dialog box is displayed, your strategy is paused and will only resume after you enter a response and click "OK".
        Learn more`,

            'notify': `Notify
        This block displays a message. You can specify the color of the message and choose from 6 different sound options.`,

            'notify_telegram': `Notify Telegram
        This block sends a message to a Telegram channel.
        Learn more`,

            'second_since_epoch': `Second Since Epoch
        This block returns the number of seconds since January 1st, 1970.
        Learn more`,

            'delayed_run': `Delayed run
        This block delays execution for a given number of seconds. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.`,

            'tick_delayed_run': `Tick Delayed run
        This block delays execution for a given number of ticks. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.`,

            'convert_to_timestamp': `Convert to timestamp
        This block converts a string of text that represents the date and time into seconds since the Unix Epoch (1 January 1970). The time and time zone offset are optional. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825.
        Learn more`,

            'convert_to_date_time': `Convert to date/time
        This block converts the number of seconds since the Unix Epoch (1 January 1970) into a string of text representing the date and time.
        Learn more`,

            'math_number': `Number
        Enter an integer or fractional number into this block. Please use '.' as a decimal separator for fractional numbers.
        `,

            'math_arithmetic': `Arithmetical operations
        This block performs arithmetic operations between two numbers.
        Learn more`,

            'math_single': `Operations on a given number
        This block performs the selected operations to a given number.
        Learn more
        `,

            'math_trig': `Trigonometric functions
        This block performs trigonometric functions.`,

            'math_constant': `Mathematical constants
        This block gives you the selected constant values.`,

            'math_number_p': `Test a number
        This block tests a given number according to the selection and it returns a value of “True” or “False”. Available options: Even, Odd, Prime, Whole, Positive, Negative, Divisible`,

            'change_variable': `Change variable
        This block adds the given number to the selected variable.`,

            'math_on_list': `Aggregate operations
        This block performs the following operations on a given list: sum, minimum, maximum, average, median, mode, antimode, standard deviation, random item.`,

            'math_round': `Rounding operation
        This block rounds a given number according to the selection: round, round up, round down.`,

            'math_modulo': `Remainder after division
        Returns the remainder after the division of the given numbers.`,

            'math_constrain': `Constrain within a range
        This block constrains a given number so that it is within a set range.
        Learn more`,

            'math_random_int': `Random integer
        This block gives you a random number from within a set range.`,

            'math_random_float': `Random fraction number
        This block gives you a random fraction between 0.0 to 1.0.`,

            'dummy_text_block': `Text
        A block that can contain text.`,

            'variables_set': `Text join
        Creates a single text string from combining the text value of each attached item, without spaces in between. The number of items can be added accordingly.`,

            'text_append': `Text Append
        Appends a given text to a variable.`,

            'text_length': `Text String Length
        Returns the number of characters of a given string of text, including numbers, spaces, punctuation marks, and symbols.
        `,

            'text_isempty': `Text Is empty
        Tests whether a string of text is empty. Returns a boolean value (true or false).
        `,

            'purchase_conditions': `Search for string
        Searches through a string of text for a specific occurrence of a given character or word, and returns the position.`,

            'text_charat': `Get character
        Returns the specific character from a given string of text according to the selected option.`,

            'text_getsubstring': `Get substring
        Returns a specific portion of a given string of text.
        `,

            'text_changecase': `Change text case
        Changes the capitalisation of a string of text to Upper case, Lower case, Title case.`,


            'text_trim': `Trim spaces
        Trims the spaces within a given string or text.`,

            'conditional_if': `Conditional block
        This block evaluates a statement and will perform an action only when the statement is true.
        Learn more`,

            'logic_compare': `Compare
        This block compares two values and is used to build a conditional structure.`,

            'logic_operation': `Logic operation
        This block performs the "AND" or the "OR" logic operation.
        Learn more`,

            'logic_negation': `Logic negation
        This block converts the boolean value (true or false) to its opposite.`,

            'logic_boolean': `True-False
        This is a single block that returns a boolean value, either true or false.`,

            'logic_null': `Null
        This block assigns a null value to an item or statement.
        `,

            'logic_ternary': `Test value
        This block tests if a given value is true or false and returns “True” or “False” accordingly.`,

            'variables_set': `Create list
        This block creates a list with strings and numbers.
        `,

            'lists_repeat': `Repeat an item
        Creates a list with a given item repeated for a specific number of times.`,

            'lists_length': `List Length
        This block gives you the total number of items in a given list.
        `,

            'lists_isempty': `Is list empty?
        This block checks if a given list is empty. It returns “True” if the list is empty, “False” if otherwise.`,

            'lists_indexof': `List item position
        This block gives you the position of an item in a given list.
        `,

            'lists_getindex': `Get list item
        This block gives you the value of a specific item in a list, given the position of the item. It can also remove the item from the list.`,

            'lists_setindex': `Set list item
        This block replaces a specific item in a list with another given item. It can also insert the new item in the list at a specific position.`,

            'lists_getsublist': `Get sub-list
        This block creates a list of items from an existing list, using specific item positions.`,

            'lists_split': `Create list from text
        This block creates a list from a given string of text, splitting it with the given delimiter. It can also join items in a list into a string of text.`,

            'lists_sort': `Sort list
        Sorts the items in a given list, by their numeric or alphabetical value, in either ascending or descending order.`,

            'controls_repeat_ext': `Repeat (1)
        This block repeats the instructions contained within for a specific number of times.`,

            'controls_repeat_ext': `Repeat (2)
        This block is similar to the block above, except that the number of times it repeats is determined by a given variable.
        `,

            'controls_whileuntil': `Repeat While/Until
        This block repeats instructions as long as a given condition is true.
        Learn more`,

            'controls_for': `Iterate (1)
        This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.
        Learn more`,

            'controls_foreach': `Iterate (2)
        This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.
        Learn more`,

            'controls_flow_statements': `Break out/continue
        This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.
        Learn more`,

            'loads_from_url': `Loads from URL
        This block allows you to load blocks from a URL if you have them stored on a remote server, and they will be loaded only when your bot runs.`,


            'ignore': `Ignore
        Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.`,

            'console': `Console
        This block displays messages in the developer's console with an input that can be either a string of text, a number, boolean, or an array of data.
        Learn more`,

            'simple_moving_average__sma_': `Simple Moving Average (SMA)
        SMA is a frequently used indicator in technical analysis. It calculates the average market price over a specified period, and is usually used to identify market trend direction: up or down. For example, if the SMA is moving upwards, it means the market trend is up.
        Learn more`,

            'simple_moving_average_array__smaa_': `Simple Moving Average Array (SMAA)
        Similar to SMA, this block gives you the entire SMA line containing a list of all values for a given period.`,

            'bollinger_bands__bb_': `Bollinger Bands (BB)
        BB is a technical analysis indicator that’s commonly used by traders. The idea behind BB is that the market price stays within the upper and lower bands for 95% of the time. The bands are the standard deviations of the market price, while the line in the middle is a simple moving average line. If the price reaches either the upper or lower band, there’s a possibility of a trend reversal.`,

            'bollinger_bands_array__bba_': `Bollinger Bands Array (BBA)
        Similar to BB. This block gives you a choice of returning the values of either the lower band, higher band, or the SMA line in the middle.`,

            'exponential_moving_average__ema_': `Exponential Moving Average (EMA)
        EMA is a type of moving average that places more significance on the most recent data points. It’s also known as the exponentially weighted moving average. EMA is different from SMA in that it reacts more significantly to recent price changes.
        `,

            'exponential_moving_average_array__emaa_': `Exponential Moving Average Array (EMAA)
        This block is similar to EMA, except that it gives you the entire EMA line based on the input list and the given period.`,

            'relative_strength_index__rsi_': `Relative Strength Index (RSI)
        RSI is a technical analysis tool that helps you identify the market trend. It will give you a value from 0 to 100. An RSI value of 70 and above means that the asset is overbought and the current trend may reverse, while a value of 30 and below means that the asset is oversold.`,

            'relative_strength_index_array__rsia_': `Relative Strength Index Array (RSIA)
        Similar to RSI, this block gives you a list of values for each entry in the input list.`,

             'moving_average_convergence_divergence': `Moving Average Convergence Divergence
        MACD is calculated by subtracting the long-term EMA (26 periods) from the short-term EMA (12 periods). If the short-term EMA is greater or lower than the long-term EMA than there’s a possibility of a trend reversal.`,

        // Add more keys and values as needed
    };

    const parser = new DOMParser();
    const llXmlDom = parser.parseFromString(llBlocks, 'text/xml');

    const truncateValue = (val) => val.length > 20 ? `${val.slice(0, 20)}...` : val;

    searchInput.addEventListener('input', () => {
      const value = searchInput.value.trim();
      modalHeader.innerHTML = '';
      modalBody.innerHTML = '';

      if (value === '') {
        modal.style.display = 'none';
        spinner.style.display = 'none';
        searchIcon.style.display = 'inline-block';
        return;
      }

      searchInput.style.paddingLeft = '0.25vw';  // margin already applied by icon
      searchIcon.style.display = 'none';
      spinner.style.display = 'inline-block';
      modal.style.display = 'block';

      const regex = new RegExp(value.split('').join('[\\s\\-_]*'), 'i');
      const matches = Object.entries(blockDat).filter(([_, description]) => regex.test(description));

    const buildHeaderHTML = (count) => `
      <div style="
        height: 11vh;
        background-color: #eceff0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0vw;
        font-weight: bold;
        font-size: 2.5vh;
        color: #444;">

        <div>
          Results for "<strong style="
            display: inline-block;
            max-width: 15vw;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: bottom;
          ">${truncateValue(value)}</strong>"
        </div>

        <div style="color: #3ba3ad; font-weight: bold;">${count} result${count !== 1 ? 's' : ''}</div>
      </div>
    `;

      // Update modal header
      modalHeader.innerHTML = buildHeaderHTML(matches.length);

      // Handle no matches
      if (matches.length === 0 || value.length < 2) {
        modalHeader.innerHTML = buildHeaderHTML(0);
        modalBody.innerHTML = `
          <div style="padding-top: 2vh; padding-left: 1.3vw; font-weight: bold; font-size: 2.3vh; color: #444;">
            No results found
          </div>`;
        return;
      }

      matches.forEach(([key, description]) => {
        const lowerKey = key.toLowerCase().replace(/\s+/g, '_');
        const allBlocks = llXmlDom.getElementsByTagName('block');
        let blockToInject = null;

        for (const block of allBlocks) {
          const type = block.getAttribute('type')?.toLowerCase() || '';
          if (type.includes(lowerKey)) {
            blockToInject = block.cloneNode(true);
            break;
          }
        }

        if (!blockToInject) return;

        // 📏 Measure block size in hidden workspace
        const hiddenDiv = document.createElement('div');
        hiddenDiv.style.cssText = 'position:absolute; visibility:hidden; height:auto; width:auto;';
        document.body.appendChild(hiddenDiv);

        const hiddenWorkspace = Blockly.inject(hiddenDiv, { toolbox: null });
        const tempXml = document.createElement('xml');
        tempXml.appendChild(blockToInject.cloneNode(true));
        Blockly.Xml.domToWorkspace(tempXml, hiddenWorkspace);
        Blockly.svgResize(hiddenWorkspace);

        setTimeout(() => {
          const blockMetrics = hiddenWorkspace.getBlocksBoundingBox();
          const blockWidth = Math.ceil(blockMetrics.right - blockMetrics.left) + 10;
          const blockHeight = Math.ceil(blockMetrics.bottom - blockMetrics.top) + 10;

          hiddenWorkspace.dispose();
          document.body.removeChild(hiddenDiv);

          const searchtextdiv = document.createElement('div');
          searchtextdiv.className = 'searchtextdiv';
          searchtextdiv.style.cssText = `
            padding: 1.5vh 1.3vw;
            font-size: 2.2vh;
            white-space: pre-line;
            color: #222;
            border-bottom: 1px solid #ddd;
          `;
          searchtextdiv.textContent = description;

          const stworkspace = document.createElement('div');
          stworkspace.className = 'stworkspace';
          stworkspace.style.cssText = `
            width: ${blockWidth}px;
            height: ${blockHeight}px;
            border: 1px solid #ccc;
            margin: 1vh 1.3vw 2vh;
            background-color: #fff;
          `;

          modalBody.appendChild(searchtextdiv);
          modalBody.appendChild(stworkspace);

          const previewWs = Blockly.inject(stworkspace, {
            toolbox: null,
            theme: myTheme,
            zoom: {
              controls: false,
              wheel: false,
              startScale: 0.45,
              maxScale: 4,
              minScale: 0.3,
              scaleSpeed: 1.2
            },
            renderer: 'zelos',
            move: { scrollbars: false }
          });

          const finalXml = document.createElement('xml');
          finalXml.appendChild(blockToInject.cloneNode(true));
          Blockly.Xml.domToWorkspace(finalXml, previewWs);
          Blockly.svgResize(previewWs);

          window.addEventListener('resize', () => Blockly.svgResize(previewWs));

          // 🧲 Drag-and-drop handling
          let isDragging = false;
          let addedBlock = null;

          previewWs.addChangeListener((event) => {
            if (event.type === Blockly.Events.BLOCK_DRAG) {
              const dragged = previewWs.getBlockById(event.blockId);
              if (!dragged) return;

              const draggedBlockXml = Blockly.Xml.blockToDom(dragged);
              const mainXml = document.createElement('xml');
              mainXml.appendChild(draggedBlockXml);

              const before = workspace.getAllBlocks();
              Blockly.Xml.domToWorkspace(mainXml, workspace);
              dragged.dispose(false, false);
              const after = workspace.getAllBlocks();
              addedBlock = after.find(b => !before.includes(b));
              isDragging = true;
              modal.style.display = 'none';
            }

            if (isDragging && addedBlock) {
              const moveHandler = (e) => {
                const wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, {
                  x: e.clientX,
                  y: e.clientY
                });

                const current = addedBlock.getRelativeToSurfaceXY();
                try {
                  addedBlock.moveBy(wsCoord.x - current.x, wsCoord.y - current.y);
                } catch (err) {
                  console.error('Move error:', err);
                }

                document.removeEventListener('mousemove', moveHandler);
                isDragging = false;
                addedBlock = null;
              };

              document.addEventListener('mousemove', moveHandler);
            }
          });
        }, 0);
      });
    });

    // Show modal again if user clicks inside input and input has text
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim() !== '') {
        modal.style.display = 'block';
      }
    });

    window.addEventListener('click', (event) => {
        const clickedInsideModal = modal.contains(event.target);
        const clickedInsideInput = searchInput.contains(event.target);

        if (modal.style.display === 'block' && !clickedInsideModal && !clickedInsideInput) {
            modal.style.display = 'none';
        }
    });

    // Add elements to the DOM
    searchBarContainer.appendChild(searchIcon);
    searchBarContainer.appendChild(spinner);
    searchBarContainer.appendChild(searchInput);
    blocksMenuContainer.appendChild(searchBarContainer);
    //document.body.appendChild(blocksMenuContainer);

    const blockSectionsContainer = document.createElement('div');
    blockSectionsContainer.id = 'blockSectionsContainer';
    //blockSectionsContainer.style = 'height: 100%; position: relative;'; //'height: 100%; overflow-y: auto;'; // Make the entire container scrollable

    // Add vertical scroll only, solid outer border, and hide horizontal scroll
    blockSectionsContainer.style = `
        height: 47.5vh;
        /*height: 57.5vh;  /* subtract ~6.5vh for sticky search bar */
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        position: relative;
        /*border: 1px solid #ccc; /* outer solid border */
        //border-top: 1px solid #ccc;       /*none;       /* remove top if needed */
        //border-bottom: 0.1px solid #ccc;       /* none;       /* remove top if needed */
        border-radius: 0px;
        background-color: white;
    `;

    const sections = ['Trade parameters', 'Purchase conditions', 'Sell conditions (optional)', 'Restart trading conditions', 'Analysis', 'Utility'];

    sections.forEach((sectionName) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'blockSection';
        sectionDiv.style = `
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 2vh;
            cursor: pointer;
            height: 6.5vh;
            border-top: 0.1px solid #ccc;
            //border-bottom: 0.1px solid #ccc; /*none; /* remove bottom border to avoid double lines */
            margin: 0;
            padding-top: 0;
            padding-bottom: 0;
            line-height: 1;
            width: 14.8vw;  /* ← added width */
        `;
        //sectionDiv.style.setProperty('height', '6.5vh', 'important');

        const sectionTitle = document.createElement('span');
        sectionTitle.innerText = sectionName;
        sectionTitle.style = 'font-weight: bold; font-size: 2.0vh;';

        const toggleSectionIcon = document.createElement('img');
        toggleSectionIcon.src = '/static/icons/down.png';
        toggleSectionIcon.style = 'width: 3.5vh; height: 3.5vh; margin-left: 18vh;';

        sectionDiv.appendChild(sectionTitle);
        /*if (sectionName === 'Analysis' || sectionName === 'Utility') {
            sectionDiv.appendChild(toggleSectionIcon);
        };*/

        if (sectionName === 'Analysis') {
            toggleSectionIcon.style = 'width: 3.5vh; height: 3.5vh; margin-left: 8.5vw;';
            sectionDiv.appendChild(toggleSectionIcon);
        };

        if (sectionName === 'Utility') {
            toggleSectionIcon.style = 'width: 3.5vh; height: 3.5vh; margin-left: 9.2vw;';
            sectionDiv.style.borderBottom = '0.1px solid #ccc'; // 👈 Add this line
            sectionDiv.appendChild(toggleSectionIcon);
        };
        blockSectionsContainer.appendChild(sectionDiv);
        //blocksMenuContainer.appendChild(sectionDiv);
        // Append the scrollable blockSectionsContainer to the blocksMenuContainer
        blocksMenuContainer.appendChild(blockSectionsContainer);

        const modal = document.createElement('div');
        modal.className = 'sectionModal';
        //modal.style = 'position: fixed; top: 57vh; left: 36.0vw; transform: translate(-50%, -50%); width: 33vw; height: 67vh; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto; overflow-x: hidden;';
        modal.style = 'border-radius: 1.0vh; position: fixed; top: 23vh; left: 20.5vw; width: 32vw; height: 63vh; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto; overflow-x: hidden;';
        if (sectionName === 'Trade parameters' || sectionName === 'Purchase conditions' || sectionName === 'Sell conditions (optional)' || sectionName === 'Restart trading conditions') {
            workspace.getParentSvg().parentNode.appendChild(modal);
        };
        //workspace.getParentSvg().parentNode.appendChild(modal);

        sectionDiv.addEventListener('click', () => {
            modal.innerHTML = '';
            modal.style.display = 'block';

            let sectionBlocksXml;
            switch (sectionName) {
                case 'Trade parameters':
                    sectionBlocksXml = Blockly.utils.xml.textToDom(tradeParametersBlocks);
                    break;
                case 'Purchase conditions':
                    sectionBlocksXml = Blockly.utils.xml.textToDom(purchaseConditionsBlocks);
                    break;
                case 'Sell conditions (optional)':
                    sectionBlocksXml = Blockly.utils.xml.textToDom(sellConditionsBlocks);
                    break;
                case 'Restart trading conditions':
                    sectionBlocksXml = Blockly.utils.xml.textToDom(restartTradingConditionsBlocks);
                    break;
            }

            if (sectionBlocksXml) {
                const blockNodes = Array.from(sectionBlocksXml.children).filter(node => node.tagName === 'block');

                blockNodes.forEach((blockNode, index) => {
                    // Create a temporary hidden div for measuring the block size
                    const hiddenDiv = document.createElement('div');
                    hiddenDiv.style = 'position: absolute; visibility: hidden; height: auto; width: auto;';
                    document.body.appendChild(hiddenDiv);

                    // Create a hidden workspace for size measurement
                    const hiddenWorkspace = Blockly.inject(hiddenDiv, { toolbox: null });
                    const blockXml = document.createElement('xml');
                    blockXml.appendChild(blockNode.cloneNode(true));

                    Blockly.Xml.domToWorkspace(blockXml, hiddenWorkspace);
                    Blockly.svgResize(hiddenWorkspace);

                    // Get block bounding size after rendering
                    setTimeout(() => {
                        const blockMetrics = hiddenWorkspace.getBlocksBoundingBox();
                        const blockWidth = Math.ceil(blockMetrics.right - blockMetrics.left); // +3px padding on both sides
                        const blockHeight = Math.ceil(blockMetrics.bottom - blockMetrics.top) + 6;

                        // Cleanup: Remove hidden workspace
                        hiddenWorkspace.dispose();
                        document.body.removeChild(hiddenDiv);

                        const blockData = {
                            'tradeparameters': `Trade parameters
                        Here is where you define the parameters of your contract.
                        Learn more`,

                            'durationn': `Trade options
                        Define your trade options such as duration and stake. Some options are only applicable for certain trade types.
                        Learn more`,

                            'multiplierr': `Multiplier trade options
                        Define your trade options such as multiplier and stake. This block can only be used with the multipliers trade type. If you select another trade type, this block will be replaced with the Trade options block.
                        Learn more`,

                            'take_profitt': `Take Profit (Multiplier)
                        Your contract is closed automatically when your profit is more than or equals to this amount. This block can only be used with the multipliers trade type.`,

                            'stop_losss': `Stop loss (Multiplier)
                        Your contract is closed automatically when your loss is more than or equals to this amount. This block can only be used with the multipliers trade type.`,

                            'growth_ratee': `Accumulator trade options
                        Define your trade options such as accumulator and stake. This block can only be used with the accumulator trade type. If you select another trade type, this block will be replaced with the Trade options block.`,

                            'take_profit_aa': `Take Profit (Accumulator)
                        Your contract is closed automatically when your profit is more than or equals to this amount. This block can only be used with the accumulator trade type.`,

                            'purchase_conditions': `Purchase conditions
                        This block is mandatory. Only one copy of this block is allowed. You can place the Purchase block (see below) here as well as conditional blocks to define your purchase conditions.
                        Learn more`,

                            'purchase': `Purchase
                        Use this block to purchase the specific contract you want. You may add multiple Purchase blocks together with conditional blocks to define your purchase conditions. This block can only be used within the Purchase conditions block.`,

                            'sell_conditions': `Sell conditions
                        Here is where you can decide to sell your contract before it expires. Only one copy of this block is allowed.
                        Learn more`,

                            'sell_at_market_price': `Sell at market price
                        Use this block to sell your contract at the market price.
                        Learn more`,

                            'restart_trading_conditions': `Restart trading conditions
                        Here is where you can decide if your bot should continue trading.
                        Learn more
                        `,

                            'trade_again': `Trade again
                        This block will transfer the control back to the Purchase conditions block, enabling you to purchase another contract.
                        Learn more`,

                            'Simple_Moving_Average__SMA_': `Simple Moving Average (SMA)
                        SMA is a frequently used indicator in technical analysis. It calculates the average market price over a specified period, and is usually used to identify market trend direction: up or down. For example, if the SMA is moving upwards, it means the market trend is up.
                        Learn more`,

                            'Simple_Moving_Average_Array__SMAA_': `Simple Moving Average Array (SMAA)
                        Similar to SMA, this block gives you the entire SMA line containing a list of all values for a given period.`,

                            'Bollinger_Bands__BB_': `Bollinger Bands (BB)
                        BB is a technical analysis indicator that’s commonly used by traders. The idea behind BB is that the market price stays within the upper and lower bands for 95% of the time. The bands are the standard deviations of the market price, while the line in the middle is a simple moving average line. If the price reaches either the upper or lower band, there’s a possibility of a trend reversal.`,

                            'Bollinger_Bands_Array__BBA_': `Bollinger Bands Array (BBA)
                        Similar to BB. This block gives you a choice of returning the values of either the lower band, higher band, or the SMA line in the middle.`,

                            'Exponential_Moving_Average__EMA_': `Exponential Moving Average (EMA)
                        EMA is a type of moving average that places more significance on the most recent data points. It’s also known as the exponentially weighted moving average. EMA is different from SMA in that it reacts more significantly to recent price changes.
                        `,

                            'Exponential_Moving_Average_Array__EMAA_': `Exponential Moving Average Array (EMAA)
                        This block is similar to EMA, except that it gives you the entire EMA line based on the input list and the given period.`,

                            'Relative_Strength_Index__RSI_': `Relative Strength Index (RSI)
                        RSI is a technical analysis tool that helps you identify the market trend. It will give you a value from 0 to 100. An RSI value of 70 and above means that the asset is overbought and the current trend may reverse, while a value of 30 and below means that the asset is oversold.`,

                            'Relative_Strength_Index_Array__RSIA_': `Relative Strength Index Array (RSIA)
                        Similar to RSI, this block gives you a list of values for each entry in the input list.`,

                             'Moving_Average_Convergence_Divergence': `Moving Average Convergence Divergence
                        MACD is calculated by subtracting the long-term EMA (26 periods) from the short-term EMA (12 periods). If the short-term EMA is greater or lower than the long-term EMA than there’s a possibility of a trend reversal.`,

                            // Add more keys and values as needed
                        };

                        // Create text container for explanation
                        const blockExplanation = document.createElement('div');

                        // Get the block type
                        const blockType = blockNode.getAttribute('type').toLowerCase();

                        // Define fallback explanation text
                        const explanationText = blockData[blockType] || `Explanation for ${blockType}`;

                        // Split into lines
                        const [firstLine, ...restLines] = explanationText.split('\n');

                        // Style the container
                        blockExplanation.style = `
                          text-align: left;
                          margin-top: 2vh;
                          margin-left: 1.3vw;
                          margin-bottom: 0px;
                          color: black;
                        `;

                        // Create and style the first line (bold)
                        const firstLineDiv = document.createElement('div');
                        firstLineDiv.textContent = firstLine.trim();
                        firstLineDiv.style = `
                          font-size: 2.5vh;
                          font-weight: bold;
                          margin-bottom: 4px;
                        `;

                        // Create a container for the rest of the lines
                        const restLinesDiv = document.createElement('div');
                        restLinesDiv.style = `
                          font-size: 13px;
                          font-weight: normal;
                          white-space: pre-line;
                        `;

                        // Process rest lines individually
                        restLines.forEach((line, index) => {
                          const lineDiv = document.createElement('div');
                          const trimmed = line.trim();

                          if (index === restLines.length - 1 && trimmed.toLowerCase() === 'learn more') {
                            // Last line is 'Learn more' → make it red and bold
                            lineDiv.textContent = trimmed;
                            lineDiv.style = `
                              font-weight: bold;
                              color: #e8005a;
                            `;
                          } else {
                            lineDiv.textContent = trimmed;
                          }

                          restLinesDiv.appendChild(lineDiv);
                        });

                        // Append both parts
                        blockExplanation.appendChild(firstLineDiv);
                        blockExplanation.appendChild(restLinesDiv);

                        // Finally, append to modal
                        modal.appendChild(blockExplanation);

                        const tempWorkspaceDiv = document.createElement('div');
                        tempWorkspaceDiv.style = `
                            position: relative;
                            //display: flex;
                            justify-content: center;
                            align-items: center;
                            width: ${blockWidth+1500}px;
                            height: ${blockHeight+5}px;
                            //margin-left: 2vh;
                            //margin-top: 15px;
                            //margin: 0vh;
                            padding-top: -4vh;
                            padding-left: 2vh;
                            background: none;
                            //border-left: 5vh solid white;
                            overflow: hidden;
                            box-sizing: border-box;
                        `;
                        modal.appendChild(tempWorkspaceDiv);

                        // Inject a separate temp workspace for each block
                        const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                            toolbox: null,
                            theme: myTheme,  // Apply the custom theme
                            //horizontalLayout: false,
                            //move: {
                                //scrollbars: { horizontal: false, vertical: true },
                                //drag: true,
                                //wheel: true,
                            //},
                            zoom: {
                                controls: false,   // 🔴 Hide zoom icons
                                wheel: false,       // ✅ Allow scroll/pinch zooming
                                startScale: 0.45,
                                maxScale: 4,
                                minScale: 0.3,
                                scaleSpeed: 1.2
                            },
                            renderer: 'zelos',
                            move: { scrollbars: false }

                        });

                        // Render block in the visible workspace
                        setTimeout(() => {
                            Blockly.Xml.domToWorkspace(blockXml, tempWorkspace);
                            Blockly.svgResize(tempWorkspace);
                        }, 0);

                        // Resize on window resize
                        window.addEventListener('resize', () => Blockly.svgResize(tempWorkspace));

                        let isDragging = false;
                        let draggedBlockXml = null;
                        let addedBlock = null;
                        let mainBlock = null;

                        tempWorkspace.addChangeListener((event) => {
                            if (event.type === Blockly.Events.BLOCK_DRAG) {
                                const block = tempWorkspace.getBlockById(event.blockId);
                                draggedBlockXml = Blockly.Xml.blockToDom(block);

                                // Add block to the main workspace
                                var mainBlockXml = document.createElement('xml');
                                mainBlockXml.appendChild(draggedBlockXml);

                                // Capture all blocks before adding the new one
                                var initialBlocks = workspace.getAllBlocks();
                                Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                isDragging = true;

                                // Dispose of the block from the temp workspace
                                block.dispose(false, false);

                                // Find the newly added block in the main workspace
                                var newBlocks = workspace.getAllBlocks();
                                addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                if (addedBlock) {
                                    var blockId = addedBlock.id;
                                    console.log('New block ID:', blockId);
                                }

                                // Hide the modal
                                modal.style.display = 'none';
                            }

                            if (isDragging) {
                                // Make sure 'addedBlock' exists before continuing
                                if (!addedBlock) return;

                                document.addEventListener('mousemove', (event) => {

                                    // Use the real mouse position from the event
                                    const mouseX = event.clientX;
                                    const mouseY = event.clientY;

                                    // Convert the screen coordinates to workspace coordinates
                                    let screenCoordinates = { x: mouseX, y: mouseY };
                                    let wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                    // Extracting x and y coordinates
                                    let wsX = wsCoord.x;
                                    let wsY = wsCoord.y;

                                    //console.log("X workspace coordinate: ", wsX);
                                    //console.log("Y workspace coordinate: ", wsY);

                                    // Get the current position of the block (relative to the surface)
                                    var currentPos = addedBlock.getRelativeToSurfaceXY();

                                    // Calculate the offset (dx, dy)
                                    var dx = wsX - currentPos.x; // Horizontal offset
                                    var dy = wsY - currentPos.y; // Vertical offset

                                    // Attempt to move the block
                                    try {
                                        console.log('Moving block by:', dx, dy);
                                        addedBlock.moveBy(dx, dy, ['drag']);
                                        //block.dispose(false, false);
                                        console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());

                                        //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move (optional)
                                    } catch (error) {
                                        console.error("Error during block move: ", error);
                                    }
                                    // Move the block by the calculated offset
                                    //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move

                                    isDragging = false; // Set dragging to false after completing
                                    addedBlock = null;
                                });
                            }
                        });

                    }, 0);
                });

                window.addEventListener('click', (event) => {
                    const isClickInsideModal = modal.contains(event.target);
                    const isClickOnBlock = event.target.closest('.blocklyBlockCanvas'); // Check if clicking a block

                    if (modal.style.display === 'block') {
                        if (!isClickInsideModal && event.target !== sectionDiv) {
                            // Clicked outside the modal -> close it
                            modal.style.display = 'none';
                        } else if (isClickOnBlock) {
                            // Clicked on a block inside the modal -> Handle block click
                            console.log('Block clicked inside modal:', isClickOnBlock);

                            handleBlockClick(event, isClickOnBlock);
                        }
                    }
                });
            }
        });

        let subsectionContainer = null;

        if (sectionName === 'Analysis' || sectionName === 'Utility') {
            //sectionDiv.appendChild(toggleSectionIcon);
            const subsectionContainer = document.createElement('div');
            subsectionContainer.className = 'subsection-container';
            //subsectionContainer.style = 'padding-top: 0vh; padding-bottom: 0vh; display: none; padding-left: 0.0vw; font-size: 12px;';

            if (sectionName === 'Analysis') {
                subsectionContainer.style = `
                    //display: flex;
                    display: none;
                    //flex-direction: column;
                    //justify-content: center; /* Vertical centering */
                    //align-items: center;     /* Horizontal centering (optional) */
                    font-size: 1.80vh;
                    background: white;
                    //padding: 0vh;
                    //padding-left: 2vh;
                    //padding-top: 2vh;
                    margin-top: -26vh; //8.5vh;
                    //line-height: 1;
                    //border-bottom: 0.1px solid #ccc;
                    //height: -47.5vh; /* or however tall your container is */
                `;
            };

            if (sectionName === 'Utility') {
                subsectionContainer.style = `
                    //display: flex;
                    display: none;
                    //flex-direction: column;
                    justify-content: center; /* Vertical centering */
                    //align-items: center;     /* Horizontal centering (optional) */
                    font-size: 1.80vh;
                    background: white;
                    //padding: 0vh;
                    //padding-left: 2vh;
                    //padding-top: 2vh;
                    margin-top: -65vh; //7.5vh;
                    color: rgba(0, 0, 0, 0.5); /* softer black */
                    line-height: 1;
                    //border-top: 0.1px solid #ccc;
                    //height: -27.5vh; /* or however tall your container is */
                `;
            };

            const subsections = (sectionName === 'Analysis')
                ? ['Indicator', 'Tick and candle analysis', 'Contract', 'stats']
                : ['Custom Functions', 'Variables' , 'Notifications', 'Time', 'Math', 'Text', 'Logic', 'Lists', 'Loops', 'Miscellaneous'];

            subsections.forEach(subsectionName => {
                const subsectionDiv = document.createElement('div');
                subsectionDiv.className = 'subsection';
                //subsectionDiv.style = ' height: 6.5vh; cursor: pointer;'; // padding: 0vh;
                subsectionDiv.style = `
                    height: 6.5vh;
                    display: flex;
                    align-items: center;         /* Vertical centering */
                    padding-left: 2vh;           /* 2vh space from the left */
                    cursor: pointer;
                `;

                subsectionDiv.innerText = subsectionName;
                subsectionContainer.appendChild(subsectionDiv);

                const modal = document.createElement('div');
                modal.className = 'sectionModal';
                modal.style = 'border-radius: 1.0vh; position: fixed; top: 23vh; left: 20.5vw; width: 32vw; height: 63vh; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;  overflow-x: hidden;';    // transform: translate(-50%, -50%);
                //modal.style = 'position: fixed; top: 37vh; left: 32.5vw; width: 29vw; height: 67vh; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;  overflow: auto;';    // transform: translate(-50%, -50%);
                workspace.getParentSvg().parentNode.appendChild(modal);

                subsectionDiv.addEventListener('click', () => {

                    modal.innerHTML = '';

                    modal.style.display = 'block';

                    let sectionBlockXml;
                    switch (subsectionName) {
                        case 'Indicator':
                            sectionBlockXml = Blockly.utils.xml.textToDom(IndicatorBlocks);
                            break;
                        case 'Tick and candle analysis':
                            sectionBlockXml = Blockly.utils.xml.textToDom(TickandcandleanalysisBlocks);
                            break;
                        case 'Contract':
                            sectionBlockXml = Blockly.utils.xml.textToDom(ContractBlocks);
                            break;
                        case 'stats':
                            sectionBlockXml = Blockly.utils.xml.textToDom(StatsBlocks);
                            break;
                        case 'Custom Functions':
                            sectionBlockXml = Blockly.utils.xml.textToDom(CustomFunctionsBlocks);
                            break;

                        case 'Variables':
                            // Main variable creation container
                            const create_variable = document.createElement('div');
                            create_variable.id = 'create_variable';
                            create_variable.style = `
                                width: 100%;
                                height: 18vh;
                                //border-bottom: 0.1px solid rgba(0, 0, 0, 0.1);
                                position: relative;
                                top: 0;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                padding-left: 1.8vw;
                                gap: 1vh;
                            `;

                            // Input + Button container
                            const inputRow = document.createElement('div');
                            inputRow.style = `
                                display: flex;
                                align-items: center;
                            `;

                            // Styled block-like input container
                            const cre_var = document.createElement('div');
                            cre_var.id = 'cre_var';
                            cre_var.style = `
                                width: 21.25vw;
                                height: 6.5vh;
                                border: 2px solid rgba(0, 0, 0, 0.1);
                                display: flex;
                                align-items: center;
                                background: white;
                                padding: 0;
                            `;

                            // Text input
                            const cre_var_input = document.createElement('input');
                            cre_var_input.id = 'cre_var_input';
                            cre_var_input.placeholder = 'New variable name';
                            cre_var_input.style = `
                                width: 100%;
                                height: 100%;
                                border: 0.1px solid rgba(0, 128, 0, 0.3);
                                border-radius: 5px;
                                font-size: 2.5vh;
                                padding-left: 2vw;
                                outline: none;
                                background: white;
                                color: rgba(0, 0, 0, 0.8);
                                font-weight: 500;
                                box-sizing: border-box;
                            `;

                            cre_var.appendChild(cre_var_input);

                            // Create button
                            const create_button = document.createElement('button');
                            create_button.innerText = 'Create';
                            create_button.style = `
                                width: 5.75vw;
                                height: 6.5vh;
                                background-color: rgb(255, 77, 88);
                                color: white;
                                font-weight: bold;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                            `;

                            // Append input and button in a row
                            inputRow.appendChild(cre_var);
                            inputRow.appendChild(create_button);
                            create_variable.appendChild(inputRow);

                            // Append the input section to the modal
                            modal.appendChild(create_variable);

                            // Log all variables in the workspace
                            const allVariables = workspace.getVariableMap().getAllVariables();

                            console.log('🌐 All variables in workspace:', allVariables);

                            allVariables.forEach((variable) => {
                                console.log(`🔹 Name: ${variable.name}, ID: ${variable.getId()}, Type: ${variable.type}`);
                            });

                            //const allVariables = Blockly.getMainWorkspace().getAllVariables();
                            console.log('🌐 All variables in workspace:', allVariables);

                            if (allVariables.length > 0) {
                                const firstVariable = allVariables[0];
                                const varName = firstVariable.name;

                                // 👇 Create info section only once
                                let infoContainer = document.getElementById('variable_info_text');
                                if (!infoContainer) {
                                    infoContainer = document.createElement('div');
                                    infoContainer.id = 'variable_info_text';
                                    infoContainer.style = `
                                        font-size: 2vh;
                                        color: rgba(0, 0, 0, 0.4);
                                        border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                                        margin-top: 1.5vh;
                                        line-height: 1.5;
                                        width: 100%;
                                        padding-left: 1.8vw;
                                    `;
                                    infoContainer.innerHTML = `
                                        <span style="font-size: 2.4vh; color: rgba(0, 0, 0, 1); margin-bottom: 2.0vh; display: inline-block;"><strong>Set variable</strong></span><br>
                                        <span style="font-size: 2.4vh; color: rgba(0, 0, 0, 0.5);">Assigns a given value to a variable</span><br>
                                        <span style="font-size: 2.0vh; font-weight: bold; color: #e8005a; cursor: pointer;">Learn more</span>
                                    `;
                                    modal.appendChild(infoContainer);

                                    // 👇 SET block using the first variable
                                    const blockSetContainer = document.createElement('div');
                                    blockSetContainer.className = 'variable-set-container';
                                    blockSetContainer.style.cssText = `
                                        width: 700px;
                                        height: 80px;
                                        margin-top: 1vh;
                                        margin-left: 1.8vw;
                                        background: none;
                                    `;
                                    modal.appendChild(blockSetContainer);

                                    const blockSetWorkspace = Blockly.inject(blockSetContainer, {
                                        toolbox: null,
                                        theme: myTheme,
                                        zoom: {
                                            controls: false,
                                            wheel: false,
                                            startScale: 0.62,
                                            maxScale: 3,
                                            minScale: 0.3,
                                            scaleSpeed: 1.2
                                        },
                                        renderer: 'zelos',
                                        move: { scrollbars: false }
                                    });

                                    const varb = `
                                        <xml xmlns="http://www.w3.org/1999/xhtml">
                                            <block type="variables_set" id="setVarBlock" x="10" y="10">
                                                <field name="VAR">${varName}</field>
                                                <value name="VALUE"></value>
                                            </block>
                                        </xml>`;
                                    const varbXml = Blockly.utils.xml.textToDom(varb);
                                    Blockly.Xml.domToWorkspace(varbXml, blockSetWorkspace);
                                    Blockly.svgResize(blockSetWorkspace);


                                    // ✔ Attach BLOCK_DRAG listener to this temp workspace
                                    let isDragging = false;
                                    let draggedBlockXml = null;
                                    let addedBlock = null;

                                    blockSetWorkspace.addChangeListener((event) => {
                                        if (event.type === Blockly.Events.BLOCK_DRAG) {
                                            const block = blockSetWorkspace.getBlockById(event.blockId);
                                            if (!block) return;

                                            draggedBlockXml = Blockly.Xml.blockToDom(block);

                                            // Add to main workspace (make sure `mainWorkspace` is defined globally)
                                            let mainBlockXml = document.createElement('xml');
                                            mainBlockXml.appendChild(draggedBlockXml);

                                            const initialBlocks = workspace.getAllBlocks();
                                            Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                            isDragging = true;

                                            block.dispose(false, false); // remove from temp workspace

                                            const newBlocks = workspace.getAllBlocks();
                                            addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                            if (addedBlock) {
                                                console.log('New block ID:', addedBlock.id);
                                            }

                                            modal.style.display = 'none';
                                        }

                                        if (isDragging && addedBlock) {
                                            document.addEventListener('mousemove', (event) => {
                                                const mouseX = event.clientX;
                                                const mouseY = event.clientY;

                                                const screenCoordinates = { x: mouseX, y: mouseY };
                                                const wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                                const currentPos = addedBlock.getRelativeToSurfaceXY();
                                                const dx = wsCoord.x - currentPos.x;
                                                const dy = wsCoord.y - currentPos.y;

                                                try {
                                                    addedBlock.moveBy(dx, dy, ['drag']);
                                                    console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());
                                                } catch (error) {
                                                    console.error("Error during block move: ", error);
                                                }

                                                isDragging = false;
                                                addedBlock = null;
                                            }); // attach once per drag event
                                        }
                                    });
                                    window.addEventListener('resize', () => Blockly.svgResize(blockSetWorkspace));
                                }

                                // 👇 Label for variable previews
                                let label = document.getElementById('user_defined_label');
                                if (!label) {
                                    label = document.createElement('div');
                                    label.id = 'user_defined_label';
                                    label.textContent = 'User-defined variables';
                                    label.style = `
                                        font-size: 2.4vh;
                                        color: rgba(0, 0, 0, 0.75);
                                        margin-top: 1vh;
                                        margin-left: 1.8vw;
                                    `;
                                    modal.appendChild(label);
                                }

                                // 👇 For each variable, create a separate preview workspace
                                allVariables.forEach((v, index) => {
                                    const container = document.createElement('div');
                                    container.className = 'individual-var-preview';
                                    container.style.cssText = `
                                        width: 700px;
                                        height: 50px;
                                        margin-top: 1vh;
                                        margin-left: 1.8vw;
                                        background: none;
                                    `;
                                    modal.appendChild(container);

                                    const porkspace = Blockly.inject(container, {
                                        toolbox: null,
                                        theme: myTheme,
                                        zoom: {
                                            controls: false,
                                            wheel: false,
                                            startScale: 0.62,
                                            maxScale: 3,
                                            minScale: 0.3,
                                            scaleSpeed: 1.2
                                        },
                                        renderer: 'zelos',
                                        move: { scrollbars: false }
                                    });

                                    const xml = `
                                        <xml xmlns="https://developers.google.com/blockly/xml">
                                            <block type="variables_get" id="get_${v.name}" x="10" y="10">
                                                <field name="VAR">${v.name}</field>
                                            </block>
                                        </xml>`;
                                    const blockXml = Blockly.utils.xml.textToDom(xml);
                                    Blockly.Xml.domToWorkspace(blockXml, porkspace);
                                    Blockly.svgResize(porkspace);


                                    // ✔ Attach BLOCK_DRAG listener to this temp workspace
                                    let isDragging = false;
                                    let draggedBlockXml = null;
                                    let addedBlock = null;

                                    porkspace.addChangeListener((event) => {
                                        if (event.type === Blockly.Events.BLOCK_DRAG) {
                                            const block = porkspace.getBlockById(event.blockId);
                                            if (!block) return;

                                            draggedBlockXml = Blockly.Xml.blockToDom(block);

                                            // Add to main workspace (make sure `mainWorkspace` is defined globally)
                                            let mainBlockXml = document.createElement('xml');
                                            mainBlockXml.appendChild(draggedBlockXml);

                                            const initialBlocks = workspace.getAllBlocks();
                                            Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                            isDragging = true;

                                            block.dispose(false, false); // remove from temp workspace

                                            const newBlocks = workspace.getAllBlocks();
                                            addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                            if (addedBlock) {
                                                console.log('New block ID:', addedBlock.id);
                                            }

                                            modal.style.display = 'none';
                                        }

                                        if (isDragging && addedBlock) {
                                            document.addEventListener('mousemove', (event) => {
                                                const mouseX = event.clientX;
                                                const mouseY = event.clientY;

                                                const screenCoordinates = { x: mouseX, y: mouseY };
                                                const wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                                const currentPos = addedBlock.getRelativeToSurfaceXY();
                                                const dx = wsCoord.x - currentPos.x;
                                                const dy = wsCoord.y - currentPos.y;

                                                try {
                                                    addedBlock.moveBy(dx, dy, ['drag']);
                                                    console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());
                                                } catch (error) {
                                                    console.error("Error during block move: ", error);
                                                }

                                                isDragging = false;
                                                addedBlock = null;
                                            }); // attach once per drag event
                                        }
                                    });
                                    window.addEventListener('resize', () => Blockly.svgResize(porkspace));

                                });
                            }

                            create_button.addEventListener('click', () => {
                                const varName = cre_var_input.value.trim();
                                if (!varName) {
                                    alert('Please enter a variable name');
                                    return;
                                }

                                console.log('Creating new variable block:', varName);

                                // Check if the info container exists
                                let infoContainer = document.getElementById('variable_info_text');
                                if (!infoContainer) {
                                    // Create it if it doesn't exist yet
                                    infoContainer = document.createElement('div');
                                    infoContainer.id = 'variable_info_text';
                                    infoContainer.style = `
                                        font-size: 2vh;
                                        color: rgba(0, 0, 0, 0.4);
                                        border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                                        margin-top: 1.5vh;
                                        line-height: 1.5;
                                        width: 100%;
                                        padding-left: 1.8vw;
                                    `;
                                    infoContainer.innerHTML = `
                                        <span style="font-size: 2.4vh; color: rgba(0, 0, 0, 1); margin-bottom: 2.0vh; display: inline-block;"><strong>Set variable</strong></span><br>
                                        <span style="font-size: 2.4vh; color: rgba(0, 0, 0, 0.5);">Assigns a given value to a variable</span><br>
                                        <span style="font-size: 2.0vh; font-weight: bold; color: #e8005a; cursor: pointer;">Learn more</span>
                                    `;
                                    modal.appendChild(infoContainer);

                                    // 🔻 Insert the new div and Blockly workspace for the `variables_set` block
                                    const blockSetContainer = document.createElement('div');
                                    blockSetContainer.className = 'variable-set-container';
                                    blockSetContainer.style.cssText = `
                                        width: 700px;
                                        height: 80px;
                                        margin-top: 1vh;
                                        margin-left: 1.8vw;
                                        background: none;
                                    `;
                                    modal.appendChild(blockSetContainer);

                                    const blockSetWorkspace = Blockly.inject(blockSetContainer, {
                                        toolbox: null,
                                        theme: myTheme,
                                        zoom: {
                                            controls: false,
                                            wheel: false,
                                            startScale: 0.62,
                                            maxScale: 3,
                                            minScale: 0.3,
                                            scaleSpeed: 1.2
                                        },
                                        renderer: 'zelos',
                                        move: { scrollbars: false }
                                    });

                                    const varb = `
                                        <xml xmlns="http://www.w3.org/1999/xhtml">
                                            <block type="variables_set" id="setVarBlock" x="10" y="10">
                                                <field name="VAR">${varName}</field>
                                                <value name="VALUE"></value>
                                            </block>
                                        </xml>`;
                                    const varbXml = Blockly.utils.xml.textToDom(varb);
                                    Blockly.Xml.domToWorkspace(varbXml, blockSetWorkspace);
                                    Blockly.svgResize(blockSetWorkspace);

                                    // ✔ Attach BLOCK_DRAG listener to this temp workspace
                                    let isDragging = false;
                                    let draggedBlockXml = null;
                                    let addedBlock = null;

                                    blockSetWorkspace.addChangeListener((event) => {
                                        if (event.type === Blockly.Events.BLOCK_DRAG) {
                                            const block = blockSetWorkspace.getBlockById(event.blockId);
                                            if (!block) return;

                                            draggedBlockXml = Blockly.Xml.blockToDom(block);

                                            // Add to main workspace (make sure `mainWorkspace` is defined globally)
                                            let mainBlockXml = document.createElement('xml');
                                            mainBlockXml.appendChild(draggedBlockXml);

                                            const initialBlocks = workspace.getAllBlocks();
                                            Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                            isDragging = true;

                                            block.dispose(false, false); // remove from temp workspace

                                            const newBlocks = workspace.getAllBlocks();
                                            addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                            if (addedBlock) {
                                                console.log('New block ID:', addedBlock.id);
                                            }

                                            modal.style.display = 'none';
                                        }

                                        if (isDragging && addedBlock) {
                                            document.addEventListener('mousemove', (event) => {
                                                const mouseX = event.clientX;
                                                const mouseY = event.clientY;

                                                const screenCoordinates = { x: mouseX, y: mouseY };
                                                const wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                                const currentPos = addedBlock.getRelativeToSurfaceXY();
                                                const dx = wsCoord.x - currentPos.x;
                                                const dy = wsCoord.y - currentPos.y;

                                                try {
                                                    addedBlock.moveBy(dx, dy, ['drag']);
                                                    console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());
                                                } catch (error) {
                                                    console.error("Error during block move: ", error);
                                                }

                                                isDragging = false;
                                                addedBlock = null;
                                            }); // attach once per drag event
                                        }
                                    });
                                    window.addEventListener('resize', () => Blockly.svgResize(blockSetWorkspace));
                                }

                                // Append user-defined variable label only once
                                let label = document.getElementById('user_defined_label');
                                if (!label) {
                                    label = document.createElement('div');
                                    label.id = 'user_defined_label';
                                    label.textContent = 'User-defined variable';
                                    label.style = `
                                        font-size: 2.4vh;
                                        color: rgba(0, 0, 0, 0.75);
                                        margin-top: 1vh;
                                        margin-left: 1.8vw;
                                    `;
                                    modal.appendChild(label);
                                }

                                // Create a new block preview div for each variable
                                const blockPreviewDiv = document.createElement('div');
                                blockPreviewDiv.className = 'variable-preview';
                                blockPreviewDiv.style.cssText = `
                                    position: relative;
                                    justify-content: center;
                                    align-items: center;
                                    width: 700px;
                                    height: 45px;
                                    margin-top: 1vh;
                                    margin-left: 1.8vw;
                                    background: none;
                                    overflow: hidden;
                                    box-sizing: border-box;
                                `;

                                // Insert the preview div right below the user_defined_label
                                label = document.getElementById('user_defined_label');
                                if (label && label.parentNode) {
                                    label.parentNode.insertBefore(blockPreviewDiv, label.nextSibling);
                                }

                                // Inject a new Blockly workspace for the preview
                                const porkspace = Blockly.inject(blockPreviewDiv, {
                                    toolbox: null,
                                    theme: myTheme,
                                    zoom: {
                                        controls: false,
                                        wheel: false,
                                        startScale: 0.62,
                                        maxScale: 3,
                                        minScale: 0.3,
                                        scaleSpeed: 1.2
                                    },
                                    renderer: 'zelos',
                                    move: { scrollbars: false }
                                });

                                const xml = `
                                    <xml xmlns="https://developers.google.com/blockly/xml">
                                        <block type="variables_get" x="10" y="10">
                                            <field name="VAR">${varName}</field>
                                        </block>
                                    </xml>`;
                                const blockXml = Blockly.utils.xml.textToDom(xml);
                                Blockly.Xml.domToWorkspace(blockXml, porkspace);
                                Blockly.svgResize(porkspace);

                                // ✔ Attach BLOCK_DRAG listener to this temp workspace
                                let isDragging = false;
                                let draggedBlockXml = null;
                                let addedBlock = null;

                                porkspace.addChangeListener((event) => {
                                    if (event.type === Blockly.Events.BLOCK_DRAG) {
                                        const block = porkspace.getBlockById(event.blockId);
                                        if (!block) return;

                                        draggedBlockXml = Blockly.Xml.blockToDom(block);

                                        // Add to main workspace (make sure `mainWorkspace` is defined globally)
                                        let mainBlockXml = document.createElement('xml');
                                        mainBlockXml.appendChild(draggedBlockXml);

                                        const initialBlocks = workspace.getAllBlocks();
                                        Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                        isDragging = true;

                                        block.dispose(false, false); // remove from temp workspace

                                        const newBlocks = workspace.getAllBlocks();
                                        addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                        if (addedBlock) {
                                            console.log('New block ID:', addedBlock.id);
                                        }

                                        modal.style.display = 'none';
                                    }

                                    if (isDragging && addedBlock) {
                                        document.addEventListener('mousemove', (event) => {
                                            const mouseX = event.clientX;
                                            const mouseY = event.clientY;

                                            const screenCoordinates = { x: mouseX, y: mouseY };
                                            const wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                            const currentPos = addedBlock.getRelativeToSurfaceXY();
                                            const dx = wsCoord.x - currentPos.x;
                                            const dy = wsCoord.y - currentPos.y;

                                            try {
                                                addedBlock.moveBy(dx, dy, ['drag']);
                                                console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());
                                            } catch (error) {
                                                console.error("Error during block move: ", error);
                                            }

                                            isDragging = false;
                                            addedBlock = null;
                                        }); // attach once per drag event
                                    }
                                });
                                window.addEventListener('resize', () => Blockly.svgResize(porkspace));

                            });


                            window.addEventListener('click', (event) => {
                                if (modal.style.display === 'block' && !modal.contains(event.target) && event.target !== subsectionDiv) {
                                    modal.style.display = 'none';
                                }
                            });

                            sectionBlockXml = Blockly.utils.xml.textToDom(VariablesBlocks);
                            break;
                        case 'Notifications':
                            sectionBlockXml = Blockly.utils.xml.textToDom(NotificationsBlocks);
                            break;
                        case 'Time':
                            sectionBlockXml = Blockly.utils.xml.textToDom(TimeBlocks);
                            break;
                        case 'Math':
                            sectionBlockXml = Blockly.utils.xml.textToDom(MathBlocks);
                            break;
                        case 'Text':
                            sectionBlockXml = Blockly.utils.xml.textToDom(TextBlocks);
                            break;
                        case 'Logic':
                            sectionBlockXml = Blockly.utils.xml.textToDom(LogicBlocks);
                            break;
                        case 'Lists':
                            sectionBlockXml = Blockly.utils.xml.textToDom(ListsBlocks);
                            break;
                        case 'Loops':
                            sectionBlockXml = Blockly.utils.xml.textToDom(LoopsBlocks);
                            break;
                        case 'Miscellaneous':
                            sectionBlockXml = Blockly.utils.xml.textToDom(MiscellaneousBlocks);
                            break;
                    }

                    if (sectionBlockXml) {
                        const blockNodes = Array.from(sectionBlockXml.children).filter(node => node.tagName === 'block');

                        blockNodes.forEach((blockNode, index) => {
                            // Create a temporary hidden div for measuring the block size
                            const hiddenDiv = document.createElement('div');
                            hiddenDiv.style = 'position: absolute; visibility: hidden; height: auto; width: auto;';
                            document.body.appendChild(hiddenDiv);

                            // Create a hidden workspace for size measurement
                            const hiddenWorkspace = Blockly.inject(hiddenDiv, { toolbox: null });
                            const blockXml = document.createElement('xml');
                            blockXml.appendChild(blockNode.cloneNode(true));

                            Blockly.Xml.domToWorkspace(blockXml, hiddenWorkspace);
                            Blockly.svgResize(hiddenWorkspace);

                            // Get block bounding size after rendering
                            setTimeout(() => {
                                const blockMetrics = hiddenWorkspace.getBlocksBoundingBox();
                                const blockWidth = Math.ceil(blockMetrics.right - blockMetrics.left);// + 6; // +3px padding on both sides
                                const blockHeight = Math.ceil(blockMetrics.bottom - blockMetrics.top);// + 6;

                                // Cleanup: Remove hidden workspace
                                hiddenWorkspace.dispose();
                                document.body.removeChild(hiddenDiv);

                                const blockData = {
                                    'run_on_every_tick': `Run on every tick
                                The content of this block is called on every tick. Place this block outside of any root block.
                                Learn more`,

                                    'last_tick': `Last tick
                                This block gives you the value of the last tick.`,

                                    'last_digit': `Last Digit
                                This block gives you the last digit of the latest tick value.
                                Learn more`,

                                    'current_stat': `Current Stat
                                This block gives you the Current Stat value.`,

                                    'current_stat_list': `Current stat list
                                This block gives you a list of the curent stats of the last 1000 tick values.`,

                                    'tick_list': `Tick list
                                This block gives you a list of the last 1000 tick values.`,

                                    'last_digits_list': `Last Digits List
                                This block gives you a list of the last digits of the last 1000 tick values.`,

                                    'market_direction': `Market direction
                                This block is used to determine if the market price moves in the selected direction or not. It gives you a value of “True” or “False”.
                                Learn more
                                `,

                                    'is_candle_black_': `Is candle black?
                                This block returns “True” if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.
                                Learn more`,

                                    'read_candle_value__1__': `Read candle value (1)
                                This block gives you the specified candle value for a selected time interval.
                                Learn more
                                `,

                                    'read_candle_value__2_': `Read candle value (2)
                                This block gives you the selected candle value.
                                Learn more`,

                                    'create_a_list_of_candle_values__1_': `Create a list of candle values (1)
                                This block gives you the selected candle value from a list of candles within the selected time interval.
                                Learn more`,

                                    'create_a_list_of_candle_values__2_': `Create a list of candle values (2)
                                This block gives you the selected candle value from a list of candles.
                                Learn more`,

                                    'get_candlee': `Get candle
                                This block gives you a specific candle from within the selected time interval.
                                Learn more`,

                                    'get_candle_list': `Get candle list
                                This block gives you a list of candles within a selected time interval.
                                Learn more`,

                                    'last_trade_result': `Last trade result
                                You can check the result of the last trade with this block.
                                Learn more`,

                                    'contract_details': `Contract details
                                This block gives you information about your last contract.
                                Learn more`,

                                    'profit_loss_from_selling': `Profit/loss from selling
                                This block gives you the potential profit or loss if you decide to sell your contract.
                                Learn more`,

                                    'can_contract_be_sold_': `Can contract be sold?
                                This block helps you check if your contract can be sold. If your contract can be sold, it returns “True”. Otherwise, it returns an empty string.`,

                                    'potential_payout': `Potential payout
                                This block returns the potential payout for the selected trade type. This block can be used only in the "Purchase conditions" root block.`,

                                    'purchase_price': `Purchase price
                                This block returns the purchase price for the selected trade type. This block can be used only in the "Purchase conditions" root block.`,

                                    'account_balance': `Account balance
                                This block gives you the balance of your account either as a number or a string of text.
                                Learn more
                                `,

                                    'total_profit_loss': `Total profit/loss
                                This block gives you the total profit/loss of your trading strategy since your bot started running. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.`,

                                    'number_of_runs': `Number of runs
                                This block gives you the total number of times your bot has run. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.`,

                                    'function_1': `Function
                                This block creates a function, which is a group of instructions that can be executed at any time. Place other blocks in here to perform any kind of action that you need in your strategy. When all the instructions in a function have been carried out, your bot will continue with the remaining blocks in your strategy. Click the “do something” field to give it a name of your choice. Click the plus icon to send a value (as a named variable) to your function.`,

                                    'function_that_returns_a_value': `Function that returns a value
                                This block is similar to the one above, except that this returns a value. The returned value can be assigned to a variable of your choice.`,

                                    'conditional_return': `Conditional return
                                This block returns a value when a condition is true. Use this block within either of the function blocks above.
                                Learn more`,

                                    'print': `Print
                                This block displays a dialog box with a customised message. When the dialog box is displayed, your strategy is paused and will only resume after you click "OK".
                                Learn more`,

                                    'request_an_input': `Request an input
                                This block displays a dialog box that uses a customised message to prompt for an input. The input can be either a string of text or a number and can be assigned to a variable. When the dialog box is displayed, your strategy is paused and will only resume after you enter a response and click "OK".
                                Learn more`,

                                    'notify': `Notify
                                This block displays a message. You can specify the color of the message and choose from 6 different sound options.`,

                                    'notify_telegram': `Notify Telegram
                                This block sends a message to a Telegram channel.
                                Learn more`,

                                    'second_since_epoch': `Second Since Epoch
                                This block returns the number of seconds since January 1st, 1970.
                                Learn more`,

                                    'delayed_run': `Delayed run
                                This block delays execution for a given number of seconds. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.`,

                                    'tick_delayed_run': `Tick Delayed run
                                This block delays execution for a given number of ticks. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.`,

                                    'convert_to_timestamp': `Convert to timestamp
                                This block converts a string of text that represents the date and time into seconds since the Unix Epoch (1 January 1970). The time and time zone offset are optional. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825.
                                Learn more`,

                                    'convert_to_date_time': `Convert to date/time
                                This block converts the number of seconds since the Unix Epoch (1 January 1970) into a string of text representing the date and time.
                                Learn more`,

                                    'math_number': `Number
                                Enter an integer or fractional number into this block. Please use '.' as a decimal separator for fractional numbers.
                                `,

                                    'math_arithmetic': `Arithmetical operations
                                This block performs arithmetic operations between two numbers.
                                Learn more`,

                                    'math_single': `Operations on a given number
                                This block performs the selected operations to a given number.
                                Learn more
                                `,

                                    'math_trig': `Trigonometric functions
                                This block performs trigonometric functions.`,

                                    'math_constant': `Mathematical constants
                                This block gives you the selected constant values.`,

                                    'math_number_p': `Test a number
                                This block tests a given number according to the selection and it returns a value of “True” or “False”. Available options: Even, Odd, Prime, Whole, Positive, Negative, Divisible`,

                                    'change_variable': `Change variable
                                This block adds the given number to the selected variable.`,

                                    'math_on_list': `Aggregate operations
                                This block performs the following operations on a given list: sum, minimum, maximum, average, median, mode, antimode, standard deviation, random item.`,

                                    'math_round': `Rounding operation
                                This block rounds a given number according to the selection: round, round up, round down.`,

                                    'math_modulo': `Remainder after division
                                Returns the remainder after the division of the given numbers.`,

                                    'math_constrain': `Constrain within a range
                                This block constrains a given number so that it is within a set range.
                                Learn more`,

                                    'math_random_int': `Random integer
                                This block gives you a random number from within a set range.`,

                                    'math_random_float': `Random fraction number
                                This block gives you a random fraction between 0.0 to 1.0.`,

                                    'dummy_text_block': `Text
                                A block that can contain text.`,

                                    'variables_set': `Text join
                                Creates a single text string from combining the text value of each attached item, without spaces in between. The number of items can be added accordingly.`,

                                    'text_append': `Text Append
                                Appends a given text to a variable.`,

                                    'text_length': `Text String Length
                                Returns the number of characters of a given string of text, including numbers, spaces, punctuation marks, and symbols.
                                `,

                                    'text_isempty': `Text Is empty
                                Tests whether a string of text is empty. Returns a boolean value (true or false).
                                `,

                                    'purchase_conditions': `Search for string
                                Searches through a string of text for a specific occurrence of a given character or word, and returns the position.`,

                                    'text_charat': `Get character
                                Returns the specific character from a given string of text according to the selected option.`,

                                    'text_getsubstring': `Get substring
                                Returns a specific portion of a given string of text.
                                `,

                                    'text_changecase': `Change text case
                                Changes the capitalisation of a string of text to Upper case, Lower case, Title case.`,


                                    'text_trim': `Trim spaces
                                Trims the spaces within a given string or text.`,

                                    'conditional_if': `Conditional block
                                This block evaluates a statement and will perform an action only when the statement is true.
                                Learn more`,

                                    'logic_compare': `Compare
                                This block compares two values and is used to build a conditional structure.`,

                                    'logic_operation': `Logic operation
                                This block performs the "AND" or the "OR" logic operation.
                                Learn more`,

                                    'logic_negation': `Logic negation
                                This block converts the boolean value (true or false) to its opposite.`,

                                    'logic_boolean': `True-False
                                This is a single block that returns a boolean value, either true or false.`,

                                    'logic_null': `Null
                                This block assigns a null value to an item or statement.
                                `,

                                    'logic_ternary': `Test value
                                This block tests if a given value is true or false and returns “True” or “False” accordingly.`,

                                    'variables_set': `Create list
                                This block creates a list with strings and numbers.
                                `,

                                    'lists_repeat': `Repeat an item
                                Creates a list with a given item repeated for a specific number of times.`,

                                    'lists_length': `List Length
                                This block gives you the total number of items in a given list.
                                `,

                                    'lists_isempty': `Is list empty?
                                This block checks if a given list is empty. It returns “True” if the list is empty, “False” if otherwise.`,

                                    'lists_indexof': `List item position
                                This block gives you the position of an item in a given list.
                                `,

                                    'lists_getindex': `Get list item
                                This block gives you the value of a specific item in a list, given the position of the item. It can also remove the item from the list.`,

                                    'lists_setindex': `Set list item
                                This block replaces a specific item in a list with another given item. It can also insert the new item in the list at a specific position.`,

                                    'lists_getsublist': `Get sub-list
                                This block creates a list of items from an existing list, using specific item positions.`,

                                    'lists_split': `Create list from text
                                This block creates a list from a given string of text, splitting it with the given delimiter. It can also join items in a list into a string of text.`,

                                    'lists_sort': `Sort list
                                Sorts the items in a given list, by their numeric or alphabetical value, in either ascending or descending order.`,

                                    'controls_repeat_ext': `Repeat (1)
                                This block repeats the instructions contained within for a specific number of times.`,

                                    'controls_repeat_ext': `Repeat (2)
                                This block is similar to the block above, except that the number of times it repeats is determined by a given variable.
                                `,

                                    'controls_whileuntil': `Repeat While/Until
                                This block repeats instructions as long as a given condition is true.
                                Learn more`,

                                    'controls_for': `Iterate (1)
                                This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.
                                Learn more`,

                                    'controls_foreach': `Iterate (2)
                                This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.
                                Learn more`,

                                    'controls_flow_statements': `Break out/continue
                                This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.
                                Learn more`,

                                    'loads_from_url': `Loads from URL
                                This block allows you to load blocks from a URL if you have them stored on a remote server, and they will be loaded only when your bot runs.`,


                                    'ignore': `Ignore
                                Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.`,

                                    'console': `Console
                                This block displays messages in the developer's console with an input that can be either a string of text, a number, boolean, or an array of data.
                                Learn more`,

                                    'simple_moving_average__sma_': `Simple Moving Average (SMA)
                                SMA is a frequently used indicator in technical analysis. It calculates the average market price over a specified period, and is usually used to identify market trend direction: up or down. For example, if the SMA is moving upwards, it means the market trend is up.
                                Learn more`,

                                    'simple_moving_average_array__smaa_': `Simple Moving Average Array (SMAA)
                                Similar to SMA, this block gives you the entire SMA line containing a list of all values for a given period.`,

                                    'bollinger_bands__bb_': `Bollinger Bands (BB)
                                BB is a technical analysis indicator that’s commonly used by traders. The idea behind BB is that the market price stays within the upper and lower bands for 95% of the time. The bands are the standard deviations of the market price, while the line in the middle is a simple moving average line. If the price reaches either the upper or lower band, there’s a possibility of a trend reversal.`,

                                    'bollinger_bands_array__bba_': `Bollinger Bands Array (BBA)
                                Similar to BB. This block gives you a choice of returning the values of either the lower band, higher band, or the SMA line in the middle.`,

                                    'exponential_moving_average__ema_': `Exponential Moving Average (EMA)
                                EMA is a type of moving average that places more significance on the most recent data points. It’s also known as the exponentially weighted moving average. EMA is different from SMA in that it reacts more significantly to recent price changes.
                                `,

                                    'exponential_moving_average_array__emaa_': `Exponential Moving Average Array (EMAA)
                                This block is similar to EMA, except that it gives you the entire EMA line based on the input list and the given period.`,

                                    'relative_strength_index__rsi_': `Relative Strength Index (RSI)
                                RSI is a technical analysis tool that helps you identify the market trend. It will give you a value from 0 to 100. An RSI value of 70 and above means that the asset is overbought and the current trend may reverse, while a value of 30 and below means that the asset is oversold.`,

                                    'relative_strength_index_array__rsia_': `Relative Strength Index Array (RSIA)
                                Similar to RSI, this block gives you a list of values for each entry in the input list.`,

                                     'moving_average_convergence_divergence': `Moving Average Convergence Divergence
                                MACD is calculated by subtracting the long-term EMA (26 periods) from the short-term EMA (12 periods). If the short-term EMA is greater or lower than the long-term EMA than there’s a possibility of a trend reversal.`,

                                    // Add more keys and values as needed
                                };

                                // Create text container for explanation
                                const blockExplanation = document.createElement('div');

                                // Get the block type
                                const blockType = blockNode.getAttribute('type').toLowerCase();

                                // Define fallback explanation text
                                const explanationText = blockData[blockType] || `Explanation for ${blockType}`;

                                // Split into lines
                                const [firstLine, ...restLines] = explanationText.split('\n');

                                // Style the container
                                blockExplanation.style = `
                                  text-align: left;
                                  margin-top: 2vh;
                                  margin-left: 1.3vw;
                                  margin-bottom: 0px;
                                  color: black;
                                `;

                                // Create and style the first line (bold)
                                const firstLineDiv = document.createElement('div');
                                firstLineDiv.textContent = firstLine.trim();
                                firstLineDiv.style = `
                                  font-size: 14px;
                                  font-weight: bold;
                                  margin-bottom: 4px;
                                `;

                                // Create a container for the rest of the lines
                                const restLinesDiv = document.createElement('div');
                                restLinesDiv.style = `
                                  font-size: 13px;
                                  font-weight: normal;
                                  white-space: pre-line;
                                `;

                                // Process rest lines individually
                                restLines.forEach((line, index) => {
                                  const lineDiv = document.createElement('div');
                                  const trimmed = line.trim();

                                  if (index === restLines.length - 1 && trimmed.toLowerCase() === 'learn more') {
                                    // Last line is 'Learn more' → make it red and bold
                                    lineDiv.textContent = trimmed;
                                    lineDiv.style = `
                                      font-weight: bold;
                                      color: #e8005a;
                                    `;
                                  } else {
                                    lineDiv.textContent = trimmed;
                                  }

                                  restLinesDiv.appendChild(lineDiv);
                                });

                                // Append both parts
                                blockExplanation.appendChild(firstLineDiv);
                                blockExplanation.appendChild(restLinesDiv);

                                // Finally, append to modal
                                modal.appendChild(blockExplanation);

                                // Create a new div for each block's temporary workspace
                                const tempWorkspaceDiv = document.createElement('div');
                                tempWorkspaceDiv.style = `
                                    position: relative;
                                    //display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    width: ${blockWidth+1500}px;
                                    height: ${blockHeight+20}px;
                                    //margin-left: 2vh;
                                    //margin-top: 0px;
                                    //margin: 0vh;
                                    top: 0vh;
                                    padding-left: -2vh;
                                    padding-top: -12vh;
                                    background: none;
                                    //border-left: 5vh solid white;
                                    overflow: hidden;
                                    box-sizing: border-box;
                                `;
                                /*tempWorkspaceDiv.style = `
                                    position: relative;
                                    width: ${blockWidth + 1500}px;
                                    height: ${blockHeight + 5}px;
                                    margin-bottom: 100px;
                                    padding-left: 2vh;
                                    background: none;
                                    border: none;
                                    overflow: visible;
                                `;*/
                                modal.appendChild(tempWorkspaceDiv);

                                // Inject a separate temp workspace for each block
                                const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                                    toolbox: null,
                                    theme: myTheme,  // Apply the custom theme
                                    //horizontalLayout: false,
                                    //move: {
                                        //scrollbars: { horizontal: false, vertical: true },
                                        //drag: true,
                                        //wheel: true,
                                    //},
                                    zoom: {
                                        controls: false,   // 🔴 Hide zoom icons
                                        wheel: false,       // ✅ Allow scroll/pinch zooming
                                        startScale: 0.62,
                                        maxScale: 3,
                                        minScale: 0.3,
                                        scaleSpeed: 1.2
                                    },
                                    renderer: 'zelos',
                                    move: { scrollbars: false }

                                });

                                // Render block in the visible workspace
                                setTimeout(() => {
                                    Blockly.Xml.domToWorkspace(blockXml, tempWorkspace);
                                    Blockly.svgResize(tempWorkspace);
                                }, 0);

                                // Resize on window resize
                                window.addEventListener('resize', () => Blockly.svgResize(tempWorkspace));

                                let isDragging = false;
                                let draggedBlockXml = null;
                                let addedBlock = null;
                                let mainBlock = null;

                                tempWorkspace.addChangeListener((event) => {
                                    if (event.type === Blockly.Events.BLOCK_DRAG) {
                                        const block = tempWorkspace.getBlockById(event.blockId);
                                        draggedBlockXml = Blockly.Xml.blockToDom(block);

                                        // Add block to the main workspace
                                        var mainBlockXml = document.createElement('xml');
                                        mainBlockXml.appendChild(draggedBlockXml);

                                        // Capture all blocks before adding the new one
                                        var initialBlocks = workspace.getAllBlocks();
                                        Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                        isDragging = true;

                                        // Dispose of the block from the temp workspace
                                        block.dispose(false, false);

                                        // Find the newly added block in the main workspace
                                        var newBlocks = workspace.getAllBlocks();
                                        addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                        if (addedBlock) {
                                            var blockId = addedBlock.id;
                                            console.log('New block ID:', blockId);
                                        }

                                        // Hide the modal
                                        modal.style.display = 'none';
                                    }

                                    if (isDragging) {
                                        // Make sure 'addedBlock' exists before continuing
                                        if (!addedBlock) return;

                                        document.addEventListener('mousemove', (event) => {

                                            // Use the real mouse position from the event
                                            const mouseX = event.clientX;
                                            const mouseY = event.clientY;

                                            // Convert the screen coordinates to workspace coordinates
                                            let screenCoordinates = { x: mouseX, y: mouseY };
                                            let wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                            // Extracting x and y coordinates
                                            let wsX = wsCoord.x;
                                            let wsY = wsCoord.y;

                                            //console.log("X workspace coordinate: ", wsX);
                                            //console.log("Y workspace coordinate: ", wsY);

                                            // Get the current position of the block (relative to the surface)
                                            var currentPos = addedBlock.getRelativeToSurfaceXY();

                                            // Calculate the offset (dx, dy)
                                            var dx = wsX - currentPos.x; // Horizontal offset
                                            var dy = wsY - currentPos.y; // Vertical offset

                                            // Attempt to move the block
                                            try {
                                                console.log('Moving block by:', dx, dy);
                                                addedBlock.moveBy(dx, dy, ['drag']);
                                                //block.dispose(false, false);
                                                console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());

                                                //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move (optional)
                                            } catch (error) {
                                                console.error("Error during block move: ", error);
                                            }
                                            // Move the block by the calculated offset
                                            //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move

                                            isDragging = false; // Set dragging to false after completing
                                            addedBlock = null;
                                        });
                                    }
                                });

                            }, 0);
                        });
                        window.addEventListener('click', (event) => {
                            if (modal.style.display === 'block' && !modal.contains(event.target) && event.target !== subsectionDiv) {
                                modal.style.display = 'none';
                            }
                        });
                    }
                    // Ensure the modal is appended to the document
                    //workspace.getParentSvg().parentNode.appendChild(modal);
                });

            });
            //sectionDiv.insertAdjacentElement('beforeend', subsectionContainer);
            sectionDiv.insertAdjacentElement('afterend', subsectionContainer);
            //sectionDiv.appendChild(subsectionContainer); // ✅ Best approach

            //blockSectionsContainer.appendChild(subsectionContainer);
            //sectionDiv.appendChild(subsectionContainer);
            //blockSectionsContainer.appendChild(subsectionContainer); // initial append
            //blockSectionsContainer.insertBefore(subsectionContainer, sectionDiv.nextSibling); // reposition it

            sectionDiv.addEventListener('click', () => {
                const isExpanded = subsectionContainer.style.display === 'block';

                // Toggle display of the subsection
                subsectionContainer.style.display = isExpanded ? 'none' : 'block';

                // Toggle the section icon
                toggleSectionIcon.src = isExpanded ? '/static/icons/down.png' : '/static/icons/up.png';

                // Adjust margin-bottom of sectionDiv to accommodate the expanded subsection
                sectionDiv.style.marginBottom = isExpanded ? '0px' : `${subsectionContainer.scrollHeight}px`;

                // Move the border-bottom to the subsection when expanded
                if (isExpanded) {
                    // Restore original border on sectionDiv
                    //sectionDiv.style.borderBottom = '1px solid #ccc';
                    subsectionContainer.style.borderBottom = 'none';
                } else {
                    // Remove border from sectionDiv and move it to the subsection
                    sectionDiv.style.borderBottom = 'none';
                    //subsectionContainer.style.borderBottom = '1px solid #ccc';
                }
            });

        }
    });

    blocksMenuContainer.style.display = 'block'; //'none';
    //workspace.getParentSvg().parentNode.appendChild(blocksMenuContainer);
    //const wrapper = document.getElementById('blocklyWrapper');
    wrapper.appendChild(blocksMenuContainer);

    blocksMenuToggleBtn.addEventListener('click', () => {
        const isMenuOpen = blocksMenuContainer.style.display === 'block';
        blocksMenuContainer.style.display = isMenuOpen ? 'none' : 'block';
        toggleIcon.src = isMenuOpen ? '/static/icons/down.png' : '/static/icons/up.png';
    });
}
