window.addEventListener("beforeunload", () => {
    // Check if Quick Strategy is ON
    if (localStorage.getItem("qson") === "true") {
        localStorage.setItem("qson", "false");
    }
});

let blockType = "Duration";
let selectedSymbol = null;
let chart = null;
let series = null;

let pendingFullData = null;       // ← for full candle history
let pendingLiveUpdate = null;     // ← for live candle updates
let liveCandle = null;
let currentCandleEpoch = null;
//const candleInterval = 60; // seconds for 1-minute candles
let candleInterval = 60; // default to 1m
let chartMode = 'candle'; // Default mode is candlestick

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

    } else {
        const interval = map[tf] || 60;

        candleInterval = map[tf] || 60;
        chartMode = 'candle';

        window.candleInterval = interval;
        window.chartMode = 'candle';

        localStorage.setItem('chartMode', 'candle');
        localStorage.setItem('candleInterval', interval.toString());

    }
}

const currentAccount = window.WS_DATA?.currentAccount;

window.addEventListener("accountTypeUpdated", (e) => {
    const accountType = e.detail;
});

window.addEventListener("fullCandleHist", function (event) {
    if (series) {

        series.setData(event.detail);
    } else {
        pendingFullData = event.detail;
    }
});

window.addEventListener("fullCandleHistory", function (event) {
    if (series) {
        series.setData(event.detail);
    } else {
        pendingFullData = event.detail;
    }
});

window.addEventListener("proposalUpdateReceived", function (event) {
    const proposalData = event.detail;
});

window.addEventListener("activeSymbolsUpdated", function (event) {

    if (window.WS_DATA.activeSymbols && window.WS_DATA.assetIndex) {

        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        waitForBlockType();
    }
});

window.addEventListener("assetIndexUpdated", function (event) {

    if (window.WS_DATA.activeSymbols && window.WS_DATA.assetIndex) {
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        waitForBlockType();
    }
});

window.addEventListener("contractDataUpdated", function (event) {
    if (window.WS_DATA.activeSymbols && window.WS_DATA.assetIndex && window.WS_DATA.contractData) {

        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        waitForBlockType();

    }
});

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

        // Populate dropdowns using the fetched data
        populateDropdowns(marketData, assetData);

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
    } catch (error) {
        // Log any errors that occur during fetch or processing
        console.error("Error fetching contracts data:", error);
    }
}

async function waitForMarketBlockAndUpdate(maxRetries = 100, delay = 300) {
    const workspace = Blockly.getMainWorkspace();

    for (let i = 0; i < maxRetries; i++) {
        const marketBlock = workspace.getBlocksByType('market')[0];
        if (marketBlock) {
            updateContractsFromSymbol();  // safe to call now
            return;
        }
        await new Promise(res => setTimeout(res, delay));
    }

    console.warn("⚠️ Market block not found after waiting.");
    // 🐞 Debugging dump: show all blocks currently in workspace
    const allBlocks = workspace.getAllBlocks(false); // false = don't include shadow blocks
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
    }

    const currentSymbol = symbolDropdown.getValue();
    selectedSymbol = currentSymbol;


    // Send WebSocket request to fetch contract data
    window.sendWebSocketMessage({
        event: "get_contract",
        symbol: selectedSymbol,
        api_token: "api_token"
    });
}

// 🔁 Try restoring from localStorage immediately
const storedSelections = localStorage.getItem("savedSelections");
if (storedSelections) {
    try {
        savedSelections = JSON.parse(storedSelections);
    } catch (e) {
        console.warn("⚠️ Failed to parse savedSelections from localStorage", e);
    }
}

// Helper to update and persist selections
function updateSavedSelections(key, value) {
    savedSelections[key] = value;
    localStorage.setItem("savedSelections", JSON.stringify(savedSelections));
}

// ---------------------------------------------------------------------

function populateDropdowns(marketData, assetData) {
    if (!workspaceReady) {
        if (window.workspaceReady) {
            workspaceReady = true;
        } else if (localStorage.getItem("workspace_initialized") === "true") {
            workspaceReady = true;
        }
    }

    if (!workspaceReady) {
        console.warn("⚠️ Blockly workspace is not ready yet. Retrying...");
        setTimeout(() => populateDropdowns(marketData, assetData), 100);
        return;
    }

    if (!workspace) {
        console.warn("🧱 Blockly workspace is not set. Attempting to restore...");
        workspace = window.workspace || Blockly.getMainWorkspace();
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

    // --- Sync userSelections with savedSelections on load ---
    if (savedSelections) {
        userSelections.market = savedSelections.market || userSelections.market;
        userSelections.submarket = savedSelections.submarket || userSelections.submarket;
        userSelections.symbol = savedSelections.symbol || userSelections.symbol;
    }

    // --------------------------------
    // Update markets
    // --------------------------------
    function updateMarkets() {
        const markets = Object.keys(marketData).map(market => {
            const isClosed = marketData[market].status === 'closed';
            return [isClosed ? `${market} (closed)` : market, market];
        });

        marketDropdown.menuGenerator_ = markets;

        if (!userSelections.market || !markets.some(m => m[1] === userSelections.market)) {
            userSelections.market = markets.length > 0 ? markets[0][1] : "";
        }

        marketDropdown.setValue(userSelections.market);
        updateSavedSelections("market", userSelections.market);

        updateSubmarketAndSymbol(userSelections.market);
    }

    // --------------------------------
    // Update submarkets
    // --------------------------------
    function updateSubmarketAndSymbol(selectedMarket) {
        let submarkets = Object.keys(marketData[selectedMarket].submarkets).map(submarket => {
            const isClosed = marketData[selectedMarket].submarkets[submarket].status === 'closed';
            return [isClosed ? `${submarket} (closed)` : submarket, submarket];
        });

        submarkets.sort((a, b) => {
            if (a[1] === "Continuous Indices") return -1;
            if (b[1] === "Continuous Indices") return 1;
            return 0;
        });

        submarketDropdown.menuGenerator_ = submarkets;

        if (!userSelections.submarket || marketDropdown.getValue() !== selectedMarket) {
            userSelections.submarket = submarkets.length > 0 ? submarkets[0][1] : "";
        }

        submarketDropdown.setValue(userSelections.submarket);
        updateSavedSelections("submarket", userSelections.submarket);

        updateSymbols(selectedMarket, userSelections.submarket);
    }

    // --------------------------------
    // Update symbols
    // --------------------------------
    function updateSymbols(selectedMarket, selectedSubmarket) {
        const symbols = marketData[selectedMarket].submarkets[selectedSubmarket].symbols.map(symbol => {
            const isClosed = symbol.is_open !== 'open';
            return [isClosed ? `${symbol.display_name} (closed)` : symbol.display_name, symbol.symbol];
        });

        symbolDropdown.menuGenerator_ = symbols;

        if (!userSelections.symbol || submarketDropdown.getValue() !== selectedSubmarket) {
            userSelections.symbol = symbols.length > 0 ? symbols[0][1] : "";
        }

        selectedSymbol = userSelections.symbol;
        symbolDropdown.setValue(userSelections.symbol);
        updateSavedSelections("symbol", userSelections.symbol);

        waitForMarketBlockAndUpdate();
    }

    // Initialize dropdowns
    updateMarkets();

    // --------------------------------
    // Wait for symbol + assetIndex
    // --------------------------------
    async function waitForSymbolAndAssetIndex() {
        while (
            !window.WS_DATA?.assetIndex ||
            !symbolDropdown?.getValue() ||
            symbolDropdown.getValue() === 'null' ||
            symbolDropdown.getValue() === ''
        ) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        populateTradeTypeDropdowns(symbolDropdown.getValue(), window.WS_DATA.assetIndex);
    }

    // --------------------------------
    // Validators
    // --------------------------------
    marketDropdown.setValidator(value => {
        userSelections.market = value;
        updateSavedSelections("market", value);
        updateSubmarketAndSymbol(value);
        waitForMarketBlockAndUpdate();
        waitForSymbolAndAssetIndex();
        return value;
    });

    submarketDropdown.setValidator(value => {
        userSelections.submarket = value;
        updateSavedSelections("submarket", value);
        updateSymbols(userSelections.market, value);
        waitForMarketBlockAndUpdate();
        waitForSymbolAndAssetIndex();
        return value;
    });

    symbolDropdown.setValidator(value => {
        userSelections.symbol = value;
        updateSavedSelections("symbol", value);

        waitForMarketBlockAndUpdate();
        waitForSymbolAndAssetIndex();

        const lastRequested = localStorage.getItem("onsym");
        if (lastRequested === value) {
            return value;
        }

        window.sendWebSocketMessage({
            event: "get_contracts",
            symbol: value,
            api_token: "api_token"
        });

        localStorage.setItem("onsym", value);

        return value;
    });

    waitForSymbolAndAssetIndex();
}

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

    // Remove wrong block
    if (existingBlock && existingBlock.type !== newBlockType) {
        existingBlock.unplug();
        existingBlock.dispose();
    }

    let newBlock;

    // Insert correct block
    if (!existingBlock || existingBlock.type !== newBlockType) {
        if (!Blockly.Blocks[newBlockType]) {
            console.error(`❌ Invalid block type: ${newBlockType}`);
            return;
        }

        newBlock = workspace.newBlock(newBlockType);
        newBlock.initSvg();
        newBlock.render();

        if (toInput.connection && newBlock.previousConnection) {
            toInput.connection.connect(newBlock.previousConnection);
        } else {
            console.error("❌ Failed to connect: Invalid connection points.");
            return;
        }
    } else {
        newBlock = existingBlock;
    }

    // ======================
    // Helper: add number block
    // ======================
    function addNumberToInput(parentBlock, inputName, defaultValue = 0) {
        const input = parentBlock.getInput(inputName);
        if (!input || input.connection?.targetBlock()) return; // already has something

        const numberBlock = workspace.newBlock("math_number");
        numberBlock.setFieldValue(defaultValue, "NUM");
        numberBlock.initSvg();
        numberBlock.render();

        if (input.connection && numberBlock.outputConnection) {
            input.connection.connect(numberBlock.outputConnection);
        }
    }

    // ======================
    // Auto-nest child blocks
    // ======================
    if (newBlockType === "Multiplier") {

        // Check if already exists
        const existingChildren = newBlock.getDescendants().map(b => b.type);

        let takeProfitBlock, stopLossBlock;

        if (!existingChildren.includes("Take_profitt")) {
            takeProfitBlock = workspace.newBlock("Take_profitt");
            takeProfitBlock.initSvg();
            takeProfitBlock.render();

            const mtsInput = newBlock.getInput("mts");
            if (mtsInput?.connection && takeProfitBlock.previousConnection) {
                mtsInput.connection.connect(takeProfitBlock.previousConnection);
            }

            addNumberToInput(takeProfitBlock, "tpmv", 0);
        } else {
            takeProfitBlock = newBlock.getDescendants().find(b => b.type === "Take_profitt");
        }

        if (!existingChildren.includes("Stop_Losss")) {
            stopLossBlock = workspace.newBlock("Stop_Losss");
            stopLossBlock.initSvg();
            stopLossBlock.render();

            if (takeProfitBlock?.nextConnection && stopLossBlock.previousConnection) {
                takeProfitBlock.nextConnection.connect(stopLossBlock.previousConnection);
            }

            addNumberToInput(stopLossBlock, "slv", 0);
        }

    } else if (newBlockType === "Growth_Rate") {

        const existingChildren = newBlock.getDescendants().map(b => b.type);

        if (!existingChildren.includes("Take_profit_aa")) {
            const takeProfitBlock = workspace.newBlock("Take_profit_aa");
            takeProfitBlock.initSvg();
            takeProfitBlock.render();

            const grsInput = newBlock.getInput("grs");
            if (grsInput?.connection && takeProfitBlock.previousConnection) {
                grsInput.connection.connect(takeProfitBlock.previousConnection);
            }

            addNumberToInput(takeProfitBlock, "tpav", 0);
        }
    }

    // Update dropdowns for this block
    populateBlockDropdowns(newBlockType);

    // Update global tracker
    blockType = newBlockType;
}

function populateBlockDropdowns(blockType) {
    const contractData = window.WS_DATA.contractData;
    if (!blockType) {
        console.error("❌ No valid block type provided to populateBlockDropdowns.");
    }
    //const dropdownField = block.getField('NAME'); // Adjust field name as per block definition
    const workspace = window.workspace; // || Blockly.getMainWorkspace();

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

                if (Array.isArray(growthRateRange) && growthRateRange.length > 0) {

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

                    // Pick from savedSelections if valid, else fallback
                    const savedValue = savedSelections.grv;
                    const validSaved = growthRateOptions.find(opt => opt[1] == savedValue);
                    if (validSaved) {
                        GrowthRateDropdown.setValue(savedValue);
                    } else {
                        GrowthRateDropdown.setValue(growthRateOptions[0][1]);
                        updateSavedSelections("grv", growthRateOptions[0][1]);
                    }

                    // ✅ Set validator to update savedSelections on change
                    GrowthRateDropdown.setValidator((newValue) => {
                        updateSavedSelections("grv", newValue);
                        return newValue;
                    });

                    // --- Handle stake (stv) ---
                    const GrowthRateStake = GrowthRateBlock.getField("stv");
                    if (GrowthRateStake) {
                        // Restore saved stake if it exists
                        const savedStake = savedSelections.stv;
                        if (savedStake && !isNaN(savedStake)) {
                            GrowthRateStake.setValue(savedStake);
                        } else {
                            // fallback: keep default 1
                            updateSavedSelections("stv", GrowthRateStake.getValue());
                        }

                        // Save stake whenever changed
                        GrowthRateStake.setValidator(newValue => {
                            updateSavedSelections("stv", newValue);
                            return newValue;
                        });
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

                if (Array.isArray(multiplierRange) && multiplierRange.length > 0) {

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

                    // Pick from savedSelections if valid, else fallback
                    const savedValue = savedSelections.mtpl;
                    const validSaved = multiplierOptions.find(opt => opt[1] == savedValue);
                    if (validSaved) {
                        MultiplierDropdown.setValue(savedValue);
                    } else {
                        MultiplierDropdown.setValue(multiplierOptions[0][1]);
                        updateSavedSelections("mtpl", multiplierOptions[0][1]);
                    }

                    // ✅ Set validator to update savedSelections on change
                    MultiplierDropdown.setValidator((newValue) => {
                        updateSavedSelections("mtpl", newValue);
                        return newValue;
                    });

                    // --- Handle stake (stv) ---
                    const MultiplierStake = MultiplierBlock.getField("stv");
                    if (MultiplierStake) {
                        const savedStake = savedSelections.mtpl_stv; // 👈 new key for Multiplier stake
                        if (savedStake && !isNaN(savedStake)) {
                            MultiplierStake.setValue(savedStake);
                        } else {
                            updateSavedSelections("mtpl_stv", MultiplierStake.getValue());
                        }

                        MultiplierStake.setValidator(newValue => {
                            updateSavedSelections("mtpl_stv", newValue);
                            return newValue;
                        });
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

            const marketBlock = workspace.getBlocksByType('market')[0];
            if (!marketBlock) {
                console.error("Market block not found in workspace.");
                return;
            }

            const symbolDropdown = marketBlock.getField('sl');
            const currentSymbol = symbolDropdown.getValue();

            const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
            const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
            const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

            let ttt1, ttt2;

            if (tradeTypeBlock && contractTypeBlock && purchaseBlock) {
                const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
                const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
                const contractTypeDropdown = contractTypeBlock.getField('ct1');
                const purchaseDropdown = purchaseBlock.getField('Pdd');

                ttt1 = tradeTypeDropdown1.getValue();
                ttt2 = tradeTypeDropdown2.getValue();

            } else {
                console.warn("One or more required blocks not found in the workspace.");
            }

            if (contractData && contractData.data && typeof contractData.data === "object") {
                const firstDropdown = ttt1;
                const secondDropdown = ttt2;

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

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey];
                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    console.error("No contracts found for contractTypeKey:", contractTypeKey);
                    return;
                }

                const durationOptions = [];
                const seenCategories = new Set();

                let smallestValues = { t: null, s: null, m: null, h: null, d: null };
                let minDuration = null;
                let maxDuration = null;

                relevantContracts.forEach((contract) => {
                    const { min_contract_duration, max_contract_duration } = contract;

                    if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                        minDuration = min_contract_duration;
                    }

                    if (maxDuration === null || parseInt(min_contract_duration, 10) > parseInt(maxDuration, 10)) {
                        maxDuration = max_contract_duration;
                    }

                    const numericValue = parseInt(min_contract_duration, 10);

                    if (min_contract_duration.endsWith("t")) {
                        if (!seenCategories.has("Ticks")) {
                            durationOptions.push({ name: "Ticks", value: "t" });
                            seenCategories.add("Ticks");
                        }
                        smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                    }

                    if (min_contract_duration.endsWith("s")) {
                        if (!seenCategories.has("Seconds")) {
                            durationOptions.push({ name: "Seconds", value: "s" });
                            seenCategories.add("Seconds");
                        }
                        smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                    }

                    if (min_contract_duration.endsWith("m")) {
                        if (!seenCategories.has("Minutes")) {
                            durationOptions.push({ name: "Minutes", value: "m" });
                            seenCategories.add("Minutes");
                        }
                        smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                    }

                    if (min_contract_duration.endsWith("h")) {
                        if (!seenCategories.has("Hours")) {
                            durationOptions.push({ name: "Hours", value: "h" });
                            seenCategories.add("Hours");
                        }
                        smallestValues.h = 1;
                    }

                    if (min_contract_duration.endsWith("d")) {
                        if (!seenCategories.has("Days")) {
                            durationOptions.push({ name: "Days", value: "d" });
                            seenCategories.add("Days");
                        }
                        smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                    }
                });

                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d")) {
                    if (!seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        smallestValues.h = 1;
                    }
                }

                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                const DurationBlock = workspace.getBlocksByType("Duration")[0];
                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("drd");
                const DurationValueField = DurationBlock.getField("drv");
                const DurationStakeField = DurationBlock.getField("st");

                if (!DurationDropdown || !DurationValueField || !DurationStakeField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // 🔹 Populate dropdown
                const dropdownMenuOptions = durationOptions.map(opt => [opt.name, opt.value]);
                DurationDropdown.menuGenerator_ = dropdownMenuOptions;

                // 🔹 Restore saved selections
                const savedUnit = savedSelections.duration_unit;
                const validSavedUnit = dropdownMenuOptions.find(opt => opt[1] === savedUnit);
                if (validSavedUnit) {
                    DurationDropdown.setValue(savedUnit);
                } else if (dropdownMenuOptions.length > 0) {
                    DurationDropdown.setValue(dropdownMenuOptions[0][1]);
                    updateSavedSelections("duration_unit", dropdownMenuOptions[0][1]);
                }

                const savedValue = savedSelections.duration_value;
                if (savedValue && !isNaN(savedValue)) {
                    DurationValueField.setValue(savedValue);
                } else {
                    const smallestDurationValue = smallestValues[DurationDropdown.getValue()];
                    if (smallestDurationValue) {
                        DurationValueField.setValue(smallestDurationValue);
                        updateSavedSelections("duration_value", smallestDurationValue);
                    }
                }

                const savedStake = savedSelections.duration_stake;
                if (savedStake && !isNaN(savedStake)) {
                    DurationStakeField.setValue(savedStake);
                } else {
                    updateSavedSelections("duration_stake", DurationStakeField.getValue());
                }

                // 🔹 Validators
                DurationDropdown.setValidator(newValue => {
                    updateSavedSelections("duration_unit", newValue);
                    const smallestDurationValue = smallestValues[newValue];
                    if (smallestDurationValue) {
                        DurationValueField.setValue(smallestDurationValue);
                        updateSavedSelections("duration_value", smallestDurationValue);
                    }
                    return newValue;
                });

                DurationValueField.setValidator(newValue => {
                    updateSavedSelections("duration_value", newValue);
                    return newValue;
                });

                DurationStakeField.setValidator(newValue => {
                    updateSavedSelections("duration_stake", newValue);
                    return newValue;
                });

            } else {
                console.error("Invalid contractData structure for Duration:", contractData);
            }
        } catch (error) {
            console.error("Error processing Duration dropdown:", error);
        }
        break;

case "Duration_HD":
    try {

        const marketBlock = workspace.getBlocksByType('market')[0];
        if (!marketBlock) {
            console.error("Market block not found in workspace.");
            return;
        }

        const symbolDropdown = marketBlock.getField('sl');
        const currentSymbol = symbolDropdown.getValue();

        const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
        const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
        const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

        let ttt1, ttt2;

        if (tradeTypeBlock && contractTypeBlock && purchaseBlock) {
            const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
            const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
            const contractTypeDropdown = contractTypeBlock.getField('ct1');
            const purchaseDropdown = purchaseBlock.getField('Pdd');

            ttt1 = tradeTypeDropdown1.getValue();
            ttt2 = tradeTypeDropdown2.getValue();

        } else {
            console.warn("One or more required blocks not found in the workspace.");
        }

        if (contractData && contractData.data && typeof contractData.data === "object") {
            const firstDropdown = ttt1;
            const secondDropdown = ttt2;

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

            const contractTypeKey = secondDropdownMapping[secondDropdown];
            if (!contractTypeKey) {
                console.error("No mapping found for secondDropdown:", secondDropdown);
                return;
            }

            let relevantContracts = [];
            const categoryData = contractData.data[contractTypeKey];
            if (categoryData && categoryData.contracts) {
                relevantContracts = categoryData.contracts;
            }

            if (relevantContracts.length === 0) {
                console.error("No contracts found for contractTypeKey:", contractTypeKey);
                return;
            }

            const durationOptions = [];
            const seenCategories = new Set();
            let smallestValues = { t: null, s: null, m: null, h: null, d: null };
            let minDuration = null;
            let maxDuration = null;

            relevantContracts.forEach((contract) => {
                const { min_contract_duration, max_contract_duration } = contract;

                if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                    minDuration = min_contract_duration;
                }
                if (maxDuration === null || parseInt(min_contract_duration, 10) > parseInt(maxDuration, 10)) {
                    maxDuration = max_contract_duration;
                }

                const numericValue = parseInt(min_contract_duration, 10);

                if (min_contract_duration.endsWith("t")) {
                    if (!seenCategories.has("Ticks")) {
                        durationOptions.push({ name: "Ticks", value: "t" });
                        seenCategories.add("Ticks");
                    }
                    smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                }

                if (min_contract_duration.endsWith("s")) {
                    if (!seenCategories.has("Seconds")) {
                        durationOptions.push({ name: "Seconds", value: "s" });
                        seenCategories.add("Seconds");
                    }
                    smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                }

                if (min_contract_duration.endsWith("m")) {
                    if (!seenCategories.has("Minutes")) {
                        durationOptions.push({ name: "Minutes", value: "m" });
                        seenCategories.add("Minutes");
                    }
                    smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                }

                if (min_contract_duration.endsWith("h")) {
                    if (!seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        seenCategories.add("Hours");
                    }
                    smallestValues.h = 1;
                }

                if (min_contract_duration.endsWith("d")) {
                    if (!seenCategories.has("Days")) {
                        durationOptions.push({ name: "Days", value: "d" });
                        seenCategories.add("Days");
                    }
                    smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                }
            });

            if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d")) {
                if (!seenCategories.has("Hours")) {
                    durationOptions.push({ name: "Hours", value: "h" });
                    smallestValues.h = 1;
                }
            }

            const unitOrder = ["t", "s", "m", "h", "d"];
            durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

            const DurationBlock = workspace.getBlocksByType("Duration_HD")[0];
            if (!DurationBlock) {
                console.error("Duration_HD block not found in workspace.");
                return;
            }

            const DurationDropdown = DurationBlock.getField("d1");
            const DurationValueField = DurationBlock.getField("dv");
            const DurationStakeField = DurationBlock.getField("stv");
            const DurationPredictionField = DurationBlock.getField("bov"); // 🔮 prediction

            if (!DurationDropdown || !DurationValueField || !DurationStakeField || !DurationPredictionField) {
                console.error("Missing fields in the Duration_HD block.");
                return;
            }

            // 🔹 Populate dropdown
            const dropdownMenuOptions = durationOptions.map(opt => [opt.name, opt.value]);
            DurationDropdown.menuGenerator_ = dropdownMenuOptions;

            // 🔹 Restore saved selections
            const savedUnit = savedSelections.duration_hd_unit;
            const validSavedUnit = dropdownMenuOptions.find(opt => opt[1] === savedUnit);
            if (validSavedUnit) {
                DurationDropdown.setValue(savedUnit);
            } else if (dropdownMenuOptions.length > 0) {
                DurationDropdown.setValue(dropdownMenuOptions[0][1]);
                updateSavedSelections("duration_hd_unit", dropdownMenuOptions[0][1]);
            }

            const savedValue = savedSelections.duration_hd_value;
            if (savedValue && !isNaN(savedValue)) {
                DurationValueField.setValue(savedValue);
            } else {
                const smallestDurationValue = smallestValues[DurationDropdown.getValue()];
                if (smallestDurationValue) {
                    DurationValueField.setValue(smallestDurationValue);
                    updateSavedSelections("duration_hd_value", smallestDurationValue);
                }
            }

            const savedStake = savedSelections.duration_hd_stake;
            if (savedStake && !isNaN(savedStake)) {
                DurationStakeField.setValue(savedStake);
            } else {
                updateSavedSelections("duration_hd_stake", DurationStakeField.getValue());
            }

            const savedBov = savedSelections.duration_hd_bov;
            if (savedBov && !isNaN(savedBov)) {
                DurationPredictionField.setValue(savedBov);
            } else {
                updateSavedSelections("duration_hd_bov", DurationPredictionField.getValue());
            }

            // 🔹 Validators
            DurationDropdown.setValidator(newValue => {
                updateSavedSelections("duration_hd_unit", newValue);
                const smallestDurationValue = smallestValues[newValue];
                if (smallestDurationValue) {
                    DurationValueField.setValue(smallestDurationValue);
                    updateSavedSelections("duration_hd_value", smallestDurationValue);
                }
                return newValue;
            });

            DurationValueField.setValidator(newValue => {
                updateSavedSelections("duration_hd_value", newValue);
                return newValue;
            });

            DurationStakeField.setValidator(newValue => {
                updateSavedSelections("duration_hd_stake", newValue);
                return newValue;
            });

            DurationPredictionField.setValidator(newValue => {
                updateSavedSelections("duration_hd_bov", newValue);
                return newValue;
            });

        } else {
            console.error("Invalid contractData structure for Duration_HD:", contractData);
        }
    } catch (error) {
        console.error("Error processing Duration_HD dropdown:", error);
    }
    break;

    //case "Duration_T":
    case "Duration_T":
        try {

            const marketBlock = workspace.getBlocksByType('market')[0];
            if (!marketBlock) {
                console.error("Market block not found in workspace.");
                return;
            }

            const symbolDropdown = marketBlock.getField('sl');
            const currentSymbol = symbolDropdown.getValue();

            const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
            const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
            const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

            let ttt1, ttt2;

            if (tradeTypeBlock && contractTypeBlock && purchaseBlock) {
                const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
                const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
                const contractTypeDropdown = contractTypeBlock.getField('ct1');
                const purchaseDropdown = purchaseBlock.getField('Pdd');

                ttt1 = tradeTypeDropdown1.getValue();
                ttt2 = tradeTypeDropdown2.getValue();

            } else {
                console.warn("One or more required blocks not found in the workspace.");
            }

            if (contractData && contractData.data && typeof contractData.data === "object") {
                const firstDropdown = ttt1;
                const secondDropdown = ttt2;

                if (!firstDropdown || !secondDropdown) {
                    console.error("Invalid dropdown values:", dropdownValues);
                    return;
                }

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

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey];
                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    console.error("No contracts found for contractTypeKey:", contractTypeKey);
                    return;
                }

                const durationOptions = [];
                const seenCategories = new Set();

                let smallestValues = { t: null, s: null, m: null, h: null, d: null };
                let minDuration = null;
                let maxDuration = null;

                relevantContracts.forEach((contract) => {
                    const { min_contract_duration, max_contract_duration } = contract;
                    if (minDuration === null || parseInt(min_contract_duration, 10) < parseInt(minDuration, 10)) {
                        minDuration = min_contract_duration;
                    }
                    if (maxDuration === null || parseInt(max_contract_duration, 10) > parseInt(maxDuration, 10)) {
                        maxDuration = max_contract_duration;
                    }

                    const numericValue = parseInt(min_contract_duration, 10);

                    if (min_contract_duration.endsWith("t")) {
                        if (!seenCategories.has("Ticks")) {
                            durationOptions.push({ name: "Ticks", value: "t" });
                            seenCategories.add("Ticks");
                        }
                        smallestValues.t = smallestValues.t === null ? numericValue : Math.min(smallestValues.t, numericValue);
                    }
                    if (min_contract_duration.endsWith("s")) {
                        if (!seenCategories.has("Seconds")) {
                            durationOptions.push({ name: "Seconds", value: "s" });
                            seenCategories.add("Seconds");
                        }
                        smallestValues.s = smallestValues.s === null ? numericValue : Math.min(smallestValues.s, numericValue);
                    }
                    if (min_contract_duration.endsWith("m")) {
                        if (!seenCategories.has("Minutes")) {
                            durationOptions.push({ name: "Minutes", value: "m" });
                            seenCategories.add("Minutes");
                        }
                        smallestValues.m = smallestValues.m === null ? numericValue : Math.min(smallestValues.m, numericValue);
                    }
                    if (min_contract_duration.endsWith("h")) {
                        if (!seenCategories.has("Hours")) {
                            durationOptions.push({ name: "Hours", value: "h" });
                            seenCategories.add("Hours");
                        }
                        smallestValues.h = 1;
                    }
                    if (min_contract_duration.endsWith("d")) {
                        if (!seenCategories.has("Days")) {
                            durationOptions.push({ name: "Days", value: "d" });
                            seenCategories.add("Days");
                        }
                        smallestValues.d = smallestValues.d === null ? numericValue : Math.min(smallestValues.d, numericValue);
                    }
                });

                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d")) {
                    if (!seenCategories.has("Hours")) {
                        durationOptions.push({ name: "Hours", value: "h" });
                        seenCategories.add("Hours");
                        smallestValues.h = 1;
                    }
                }

                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                const DurationBlock = workspace.getBlocksByType("Duration_T")[0];
                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("d1");
                const DurationValueField = DurationBlock.getField("dv");
                const BarrierOffsetDropdown = DurationBlock.getField("bod");
                const BarrierValueField = DurationBlock.getField("bov");

                if (!DurationDropdown || !DurationValueField || !BarrierOffsetDropdown || !BarrierValueField) {
                    console.error("Missing fields in the Duration block.");
                    return;
                }

                // --- Restore from savedSelections ---
                if (savedSelections.d1) DurationDropdown.setValue(savedSelections.d1);
                if (savedSelections.dv) DurationValueField.setValue(savedSelections.dv);
                if (savedSelections.bod) BarrierOffsetDropdown.setValue(savedSelections.bod);
                if (savedSelections.bov) BarrierValueField.setValue(savedSelections.bov);

                // --- Populate dropdown menu ---
                const currentValue = DurationDropdown.getValue();
                const dropdownMenuOptions = durationOptions.map((option) => [option.name, option.value]);
                DurationDropdown.menuGenerator_ = dropdownMenuOptions;

                const validValue = dropdownMenuOptions.find(option => option[1] === currentValue);
                if (validValue) {
                    DurationDropdown.setValue(currentValue);
                } else {
                    DurationDropdown.setValue(dropdownMenuOptions[0][1]);
                }

                // --- Validators to persist changes ---
                DurationDropdown.setValidator((newValue) => {
                    savedSelections.d1 = newValue;
                    const smallestDurationValue = smallestValues[newValue];
                    if (smallestDurationValue !== undefined && smallestDurationValue !== null) {
                        DurationValueField.setValue(smallestDurationValue);
                        savedSelections.dv = smallestDurationValue;
                    }
                    updateBarrierOffsetDropdown();
                    return newValue;
                });

                DurationValueField.setValidator((newValue) => {
                    savedSelections.dv = newValue;
                    return newValue;
                });

                BarrierOffsetDropdown.setValidator((newValue) => {
                    savedSelections.bod = newValue;
                    setBarrierOffsetValue();
                    return newValue;
                });

                BarrierValueField.setValidator((newValue) => {
                    savedSelections.bov = newValue;
                    return newValue;
                });

                // --- Barrier offset logic ---
                let previousBodValue = BarrierOffsetDropdown.getValue();

                function updateBarrierOffsetDropdown() {
                    const barrierOffsetOptions = {
                        default: [["Offset +", "OFFSET_PLUS"], ["Offset -", "OFFSET_MINUS"], ["Absolute", "ABSOLUTE"]],
                        days: [["Absolute", "ABSOLUTE"]]
                    };
                    const selectedUnit = DurationDropdown.getValue();
                    const availableOptions = selectedUnit === "d" ? barrierOffsetOptions.days : barrierOffsetOptions.default;
                    BarrierOffsetDropdown.menuGenerator_ = availableOptions;

                    const validBodValue = availableOptions.find(option => option[1] === BarrierOffsetDropdown.getValue());
                    if (validBodValue) {
                        BarrierOffsetDropdown.setValue(validBodValue[1]);
                    } else {
                        BarrierOffsetDropdown.setValue(availableOptions[0][1]);
                    }
                    previousBodValue = BarrierOffsetDropdown.getValue();
                    savedSelections.bod = previousBodValue;
                }

                let absoluteBarrier = null;
                let offsetBarrier = null;
                const allBarrierDetails = [];

                relevantContracts.forEach((contract) => {
                    const { barrier_details, min_contract_duration } = contract;
                    const { barrier, high_barrier, low_barrier } = barrier_details || {};
                    allBarrierDetails.push({
                        min_contract_duration,
                        barrier: barrier !== undefined ? parseFloat(barrier) : null,
                        high_barrier: high_barrier !== undefined ? parseFloat(high_barrier) : null,
                        low_barrier: low_barrier !== undefined ? parseFloat(low_barrier) : null,
                    });
                });

                const validBarriers = allBarrierDetails
                    .map(detail => detail.barrier)
                    .filter(value => value !== null && !isNaN(value))
                    .sort((a, b) => a - b);

                if (validBarriers.length > 0) {
                    absoluteBarrier = validBarriers[validBarriers.length - 1];
                    offsetBarrier = validBarriers[Math.floor(validBarriers.length / 2)];
                }

                function setBarrierOffsetValue() {
                    const barrierOffsetType = BarrierOffsetDropdown.getValue();
                    let barrierValue = null;
                    if (barrierOffsetType === "ABSOLUTE") {
                        barrierValue = absoluteBarrier;
                    } else if (barrierOffsetType === "OFFSET_PLUS" || barrierOffsetType === "OFFSET_MINUS") {
                        barrierValue = offsetBarrier;
                    }
                    if (barrierValue !== null) {
                        BarrierValueField.setValue(barrierValue);
                        savedSelections.bov = barrierValue;
                    }
                }

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

                const contractTypeKey = secondDropdownMapping[secondDropdown];
                if (!contractTypeKey) {
                    console.error("No mapping found for secondDropdown:", secondDropdown);
                    return;
                }

                // Access the relevant contracts using the specific key
                let relevantContracts = [];
                const categoryData = contractData.data[contractTypeKey];

                if (categoryData && categoryData.contracts) {
                    relevantContracts = categoryData.contracts;
                }

                if (relevantContracts.length === 0) {
                    //console.error("No contracts found for contractTypeKey:", contractTypeKey);
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

                // Automatically add "Hours" if "Minutes" exists in the minimum duration and "Days" exists in the maximum duration
                if (maxDuration?.endsWith("h") || maxDuration?.endsWith("d") && !seenCategories.has("Hours")) {
                    durationOptions.push({ name: "Hours", value: "h" });
                    seenCategories.add("Hours");
                    smallestValues.h = 1; // Default to 1 for Hours
                }

                // Sort options from smallest to largest unit
                const unitOrder = ["t", "s", "m", "h", "d"];
                durationOptions.sort((a, b) => unitOrder.indexOf(a.value) - unitOrder.indexOf(b.value));

                //const workspace = Blockly.getMainWorkspace();
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

                // Retain the current selection for the lbod dropdown
                const currentlBodValue = LowerBarrierOffsetDropdown.getValue();

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

                if (!BarrierOffsetDropdown || !LowerBarrierOffsetDropdown) {
                    console.error("Missing dropdown fields.");
                    return;
                }

                let isPopulating = false;

                function handleDropdownLogic(changedDropdown, otherDropdown, newValue, selectedUnit) {

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

                // Determine the values to set for bov and lbov
                let bovValue = null;
                let lbovValue = null;

                if (barrierOffsetType === "ABSOLUTE") {
                    bovValue = absoluteHighBarrier;
                } else if (barrierOffsetType === "OFFSET_PLUS" || barrierOffsetType === "OFFSET_MINUS") {
                    bovValue = offsetHighBarrier;
                }

                if (lowerBarrierOffsetType === "ABSOLUTE") {
                    lbovValue = absoluteLowBarrier;
                } else if (lowerBarrierOffsetType === "OFFSET_PLUS" || lowerBarrierOffsetType === "OFFSET_MINUS") {
                    lbovValue = offsetLowBarrier;
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
                }

                // Ensure values are valid before setting them
                if (bovValue !== null) {
                    BarrierValueField.setValue(bovValue);
                } else {
                    console.error("No valid value found to set for bov.");
                }

                if (lbovValue !== null) {
                    LowerBarrierValueField.setValue(lbovValue);
                } else {
                    console.error("No valid value found to set for lbov.");
                }

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
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    manageDynamicBlock(blockType);
    populateBlockDropdowns(blockType);
}

function populateTradeTypeDropdowns(selectedSymbol, assetData) {
    if (!window.workspace) {
        console.warn("⚠️ populateTradeTypeDropdowns called before workspace is ready.");
        return;
    }

    console.log("🚨 Entering populateTradeTypeDropdowns. Current blocks:",
        window.workspace.getAllBlocks(false).map(b => b.type));

    //assetData = window.WS_DATA.contractData;
    const workspace = window.workspace; // || Blockly.getMainWorkspace();
    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
    const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
    const purchaseBlock = workspace.getBlocksByType('Purchase')[0];

    const allBlocks = workspace.getAllBlocks(false);

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

    // --- Sync userSelections with savedSelections ---
    if (savedSelections) {
        userSelections.tt1 = savedSelections.tt1 || userSelections.tt1;
        userSelections.tt2 = savedSelections.tt2 || userSelections.tt2;
        userSelections.ct1 = savedSelections.ct1 || userSelections.ct1;
        userSelections.Pdd = savedSelections.Pdd || userSelections.Pdd;
    }

    const assetEntry = assetData.find(asset => {
        return asset.symbol === selectedSymbol;
    });


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

    // Update first dropdown options (⚡️Fixed: prefer savedSelections first)
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    const newFirstDropdownValue =
        (savedSelections.tt1 && firstDropdownOptions.find(opt => opt[1] === savedSelections.tt1))
            ? savedSelections.tt1
            : (firstDropdownOptions.find(opt => opt[1] === previousFirstDropdownValue)
                ? previousFirstDropdownValue
                : firstDropdownOptions[0][1]);

    tradeTypeDropdown1.setValue(newFirstDropdownValue);
    updateSavedSelections("tt1", newFirstDropdownValue);

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

        // Preserve previous selection in second dropdown (⚡️Fixed: prefer savedSelections first)
        const newSecondDropdownValue =
            (savedSelections.tt2 && secondDropdownOptions.find(opt => opt[1] === savedSelections.tt2))
                ? savedSelections.tt2
                : (secondDropdownOptions.find(opt => opt[1] === previousSecondDropdownValue)
                    ? previousSecondDropdownValue
                    : secondDropdownOptions[0][1]);

        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(newSecondDropdownValue);
        updateSavedSelections("tt2", newSecondDropdownValue);

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

        // Preserve previous selection in contract dropdown (⚡️Fixed: prefer savedSelections first)
        const newContractDropdownValue =
            (savedSelections.ct1 && contractTypeOptions.find(opt => opt[1] === savedSelections.ct1))
                ? savedSelections.ct1
                : (contractTypeOptions.find(opt => opt[1] === previousContractDropdownValue)
                    ? previousContractDropdownValue
                    : contractTypeOptions[0][1]);

        contractTypeDropdown.menuGenerator_ = contractTypeOptions;
        contractTypeDropdown.setValue(newContractDropdownValue);
        updateSavedSelections("ct1", newContractDropdownValue);

        // Log initial values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        waitForPurchaseOptions();

    }

    async function waitForPurchaseOptions() {
        while (
            !contractTypeDropdown?.menuGenerator_ ||               // Wait for options to be loaded
            !contractTypeDropdown.menuGenerator_.length ||         // Make sure it has items
            !contractTypeDropdown?.getValue() ||                   // Wait for current value
            contractTypeDropdown.getValue() === 'null' ||
            contractTypeDropdown.getValue() === ''
        ) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        const currentValue = contractTypeDropdown.getValue();
        const options = contractTypeDropdown.menuGenerator_;

        updatePurchaseDropdownOptions(currentValue, options);
        waitForBlockType();
    }

    function updatePurchaseDropdownOptions(currentContractValue, contractDropdownOptions) {
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

        // Preserve purchase selection (⚡️Fixed: prefer savedSelections first)
        const newDefaultValue =
            (savedSelections.Pdd && purchaseDropdownOptions.find(opt => opt[1] === savedSelections.Pdd))
                ? savedSelections.Pdd
                : purchaseDropdownOptions[0][1];

        purchaseDropdown.setValue(newDefaultValue);
        updateSavedSelections("Pdd", newDefaultValue);

    }

    // Set a validator to detect changes in the dropdown
    tradeTypeDropdown1.setValidator((newValue) => {

        // Update stored values when the dropdown changes
        dropdownValues.firstDropdown = newValue;
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        updateSavedSelections("tt1", newValue);
        updateSecondDropdown(newValue);

        // Update previous value for the next change detection
        previousFirstDropdownValue = newValue;
        waitForBlockType();

        return newValue; // Allow the change
    });

    updateSecondDropdown(tradeTypeDropdown1.getValue());

    contractTypeDropdown.setValidator(newValue => {

        // Update dropdown tracking values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = newValue;

        updateSavedSelections("ct1", newValue);
        // Update purchase dropdowns or any logic tied to contract type
        updatePurchaseDropdownOptions(newValue, contractTypeDropdown.menuGenerator_);
        waitForBlockType();
        //waitForPurchaseOptions();
        return newValue; // Always return the selected value
    });

    // Set validator with block management logic in tradeTypeDropdown2
    tradeTypeDropdown2.setValidator(newValue => {
        updateSavedSelections("tt2", newValue);
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

        // Log initial values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        waitForBlockType();

        return newValue;
    });
    waitForBlockType();
    //populateTT1();
}

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
    }

    onDrag(e, totalDelta) {
        const delta = this.pixelsToWorkspaceUnits(totalDelta);
        const newLoc = Coordinate.sum(this.startLoc, delta); //Blockly.utils.Coordinate.sum(this.startLoc, delta);

        //const newLoc = Coordinate.sum(this.startLoc, delta);
        this.draggable.drag(newLoc, e); // Move the draggable
    }

    onDragEnd(e) {
        this.draggable.endDrag(e); // End the drag with the event

    }
}


// Register the custom dragger using Blockly's registry
Blockly.registry.register(Blockly.registry.Type.BLOCK_DRAGGER, 'CUSTOM_BLOCK_DRAGGER', CustomBlockDragger);

// -------------------------------
// Bootstrap, workspace creation and data wait
// -------------------------------

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Ensure global objects exist
    window.WS_DATA = window.WS_DATA || {};
    window.workspaceReady = window.workspaceReady || false;

    const workspaceAlreadyInit = localStorage.getItem("workspace_initialized") === "true";

    if (!workspaceAlreadyInit) {
      // createWorkspace will set window.workspace and return it
      window.workspace = createWorkspace();
      localStorage.setItem("workspace_initialized", "true");
    } else {
      // If window.workspace already exists (e.g. single-page reload), use it.
      // Otherwise create a workspace and set it on window.
      if (!window.workspace) {
        window.workspace = createWorkspace();
      } else {
        // Attach UI controls again (safe if idempotent)
        createQuickStrategyButton(window.workspace);
        createBlocksMenuButton(window.workspace);
      }
    }

    // Mark ready for other modules
    window.workspaceReady = true;

    // Try restore WebSocket cached data
    const cachedActive = localStorage.getItem("activeSymbols");
    const cachedIndex = localStorage.getItem("assetIndex");
    const cachedContracts = localStorage.getItem("contractData");

    if (cachedActive && cachedIndex && cachedContracts) {
      window.WS_DATA.activeSymbols = JSON.parse(cachedActive);
      window.WS_DATA.assetIndex = JSON.parse(cachedIndex);
      window.WS_DATA.contractData = JSON.parse(cachedContracts);
    } else {
      console.log("⏳ No cached WebSocket data; will wait for live data.");
    }

    // Wait for WS data, then populate dropdowns etc.
    await waitForData();

  } catch (err) {
    console.error("Fatal error in DOMContentLoaded bootstrap:", err);
  }
});


function createWorkspace() {
  // Be explicit and local first, then assign to window.workspace at end
  const blocklyDiv = document.getElementById("blocklyDiv");
  if (!blocklyDiv) {
    //console.error("❌ #blocklyDiv not found in DOM. Aborting workspace creation.");
    return null;
  }

  // Create/inject workspace
  const ws = Blockly.inject(blocklyDiv, {
    toolbox: null,
    trashcan: true,
    theme: myTheme,
    renderer: "zelos",
    zoom: {
      controls: false,
      wheel: true,
      startScale: 0.5,
      maxScale: 1.5,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
    grid: {
      spacing: 20,
      length: 0,
      colour: null,
      snap: false,
    },
    move: {
      scrollbars: true,
      drag: true,
    },
  });

// ✅ Set only the workspace background color (not everything)
const mainBg = blocklyDiv.querySelector('.blocklyMainBackground');
if (mainBg && mainBg.tagName === 'rect') {
  mainBg.style.fill = 'var(--workspace-bg)';
}

  // Set global workspace reference (single source of truth)
  window.workspace = ws;

    // Priority: Uploaded bot → Last known → Initial blocks → Empty
    try {
      const uploadedXML = localStorage.getItem("uploadedBotXml");
      const lastKnownXML = localStorage.getItem("last_known_bot");

      if (uploadedXML) {
        const xmlDom = Blockly.utils.xml.textToDom(uploadedXML);
        ws.clear();
        Blockly.Xml.domToWorkspace(xmlDom, ws);
        updateSavedSelectionsFromXml(xmlDom);
        localStorage.removeItem("uploadedBotXml"); // cleanup

      } else if (lastKnownXML) {
        const xmlDom = Blockly.utils.xml.textToDom(lastKnownXML);
        ws.clear();
        Blockly.Xml.domToWorkspace(xmlDom, ws);

      } else if (typeof InitialBlocks !== "undefined") {
        const initialDom = Blockly.utils.xml.textToDom(InitialBlocks);
        Blockly.Xml.domToWorkspace(initialDom, ws);

      } else {
        console.log("ℹ️ No InitialBlocks found; workspace empty.");
      }
    } catch (e) {
      console.error("❌ Failed to parse or load initial XML:", e);
    }

  // Save current state to localStorage immediately (so we have a baseline)
  try {
    const initialXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(ws));
    localStorage.setItem("last_known_bot", initialXML);
  } catch (e) {
    console.warn("Could not save initial workspace to localStorage:", e);
  }

  // Add change listener (use ws variable to avoid accidental global reference confusion)
  ws.addChangeListener(function (event) {
    // Only autosave on meaningful events
    const interesting = [
      Blockly.Events.CHANGE,
      Blockly.Events.CREATE,
      Blockly.Events.DELETE,
      Blockly.Events.MOVE,
      Blockly.Events.VAR_CREATE,
      Blockly.Events.VAR_DELETE,
    ];
    if (interesting.includes(event.type)) {
      try {
        const updatedXML = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(ws));
        localStorage.setItem("last_known_bot", updatedXML);
      } catch (err) {
        console.warn("Autosave failed:", err);
      }
    }
  });

  // Add UI buttons (these should be idempotent; safe to call again)
  try {
    createQuickStrategyButton(ws);
    createBlocksMenuButton(ws);
  } catch (err) {
    console.warn("Could not attach UI buttons:", err);
  }

  // Optional UI cleanup (non-blocking)
  setTimeout(() => {
    document
      .querySelectorAll(".blocklyScrollbarHorizontal, .blocklyScrollbarVertical, .blocklyScrollbarKnob")
      .forEach((el) => {
        el.style.display = "none";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      });
  }, 100);

  return ws;
}

async function waitForData() {
  // Ensure object exists
  window.WS_DATA = window.WS_DATA || {};

  // Try restore from localStorage if not present
  try {
    window.WS_DATA.activeSymbols = window.WS_DATA.activeSymbols || JSON.parse(localStorage.getItem("activeSymbols"));
    window.WS_DATA.assetIndex = window.WS_DATA.assetIndex || JSON.parse(localStorage.getItem("assetIndex"));
    window.WS_DATA.contractData = window.WS_DATA.contractData || JSON.parse(localStorage.getItem("contractData"));
  } catch (err) {
    console.warn("⚠️ Error parsing cached WS data from localStorage:", err);
  }

  const start = Date.now();
  const timeoutMs = 10000; // 10s fallback

  // Wait until all three pieces are available, or until timeout
  while (!window.WS_DATA.activeSymbols || !window.WS_DATA.assetIndex || !window.WS_DATA.contractData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (Date.now() - start > timeoutMs) {
      console.warn("⚠️ Timed out waiting for WebSocket data (10s). Proceeding with whatever data is available.");
      break;
    }
  }

  // Double-check the workspace is available before populating dropdowns
  if (!window.workspace) {
    console.error("❌ Cannot populate dropdowns: window.workspace is not available.");
    return;
  }

  try {
    populateDropdowns(window.WS_DATA.activeSymbols || {}, window.WS_DATA.assetIndex || {});
  } catch (err) {
    console.error("Error calling populateDropdowns:", err);
  }

}

function initializeBlocks(workspace, xmlString) {

    try {
        // Convert the XML string to a DOM
        const xmlDom = Blockly.utils.xml.textToDom(xmlString);

        // Log all block types found in the XML
        const allBlockTypes = Array.from(xmlDom.querySelectorAll('block')).map(block => block.getAttribute('type'));

        // Select specific blocks by their type
        const selectedBlockTypes = ['tradeparameters', 'Conditional_if', 'Take_profit', 'Stop_Loss'];

        selectedBlockTypes.forEach(blockType => {
            const block = xmlDom.querySelector(`block[type="${blockType}"]`);

            if (block) {
                // Clone the block to prevent mutations
                const blockClone = block.cloneNode(true);

                // Add the block to the workspace
                Blockly.Xml.domToWorkspace(blockClone, workspace);
            } else {
                console.warn(`Block type "${blockType}" not found in the XML.`);
            }
        });
    } catch (error) {
        console.error('Error initializing blocks:', error);
    }

    waitForData();  // Call the async function to wait for data
}

window.addEventListener('resize', () => {
    Blockly.svgResize(workspace);
});

function handleBlockClick(event, blockSvg) {
    event.stopPropagation(); // Prevent modal from closing

    const blockType = blockSvg.getAttribute('data-id') || 'unknown_block';

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

function sendCandleRequest(symbol, timeframe) {
    const message = {
        event: "subscribe_candles",
        symbol: symbol,
        timeframe: timeframe
    };

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        alert("WebSocket is not open.");
    }
}

function initChart(containerId = 'tv_chart_container', chartType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear container if reinitializing

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

    // 🗃️ Load full history
    if (chartType === 'candlestick') {
        if (window.WS_DATA?.fullCandleHistory) {
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
        // For line or area chart
        if (window.WS_DATA?.fullCandleHist?.ticks?.length) {
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
            background: white;
            color: #00B386;
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

        // ✅ Function to apply responsive width
        function applyModalWidth() {
            if (window.innerWidth < 700) {
                modal.style.width = "70vw";
            } else {
                modal.style.width = "29.5vw";
            }
        }

        // Apply immediately and on resize
        applyModalWidth();
        window.addEventListener("resize", applyModalWidth);

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
            right: 18vh;
            height: 6vh;
            width: 12.4vh;
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
            //width: 5vw;
            width: 8vh;
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

        let activeTab = null;

        // ✅ Tab data (desktop values)
        const tabData = [
            { text: 'Recent', desktopWidth: '6vw', mobileWidth: '20vw' },
            { text: 'Local', desktopWidth: '7vw', mobileWidth: '25vw' },
            { text: 'Google Drive', desktopWidth: '10vw', mobileWidth: '35vw' }
        ];

        // ✅ Move this BEFORE the tab loop
        const contentArea = document.createElement('div');
        contentArea.style.position = 'relative';
        modal.appendChild(contentArea);

        // ✅ Function to apply widths depending on screen size
        function applyTabWidths() {
            const isSmall = window.innerWidth < 700;
            tabData.forEach((tabObj, i) => {
                const tabEl = tabContainer.children[i];
                if (tabEl) {
                    tabEl.style.width = isSmall ? tabObj.mobileWidth : tabObj.desktopWidth;
                }
            });
        }

        // ✅ Create tabs from tabData (NOT tabs)
        tabData.forEach(({ text }, index) => {
            const tab = document.createElement('div');
            tab.textContent = text;
            Object.assign(tab.style, {
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

                // ✅ Render content per tab
                if (text === 'Recent') showRecentContent();
                if (text === 'Local') showLocalContent(overlay);
                if (text === 'Google Drive') showGoogleDriveContent();
            });

            // ✅ Default active tab
            if (index === 0) {
                tab.style.borderBottom = '2px solid rgba(255, 66, 66, 0.8)';
                tab.style.fontWeight = 'bold';
                activeTab = tab;
                showRecentContent(); // Initial load
            }

            tabContainer.appendChild(tab);
        });

        // ✅ Apply widths now & on resize
        applyTabWidths();
        window.addEventListener('resize', applyTabWidths);

        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(tabContainer);
        modal.appendChild(contentArea); // ✅ This keeps the top layout safe

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
            icon.src = '/static/icons/deriv-icon.svg';
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

            function updateSavedSelectionsFromXml(xmlDom) {
                // Get all <field> tags from XML
                const fields = xmlDom.getElementsByTagName("field");

                for (let field of fields) {
                    const name = field.getAttribute("name");
                    const value = field.textContent.trim();

                    switch (name) {
                        case "mkts":   // market
                            savedSelections.market = value;
                            break;
                        case "sbmkts": // submarket
                            savedSelections.submarket = value;
                            break;
                        case "sl":     // symbol
                            savedSelections.symbol = value;
                            break;
                        case "tt1":    // trade type level 1
                            savedSelections.tt1 = value;
                            break;
                        case "tt2":    // trade type level 2
                            savedSelections.tt2 = value;
                            break;
                        case "ct1":    // contract type
                            savedSelections.ct1 = value;
                            break;
                        case "Pdd":    // purchase direction
                            savedSelections.Pdd = value;
                            break;
                        // 👉 add more mappings here for stake, duration, etc.
                    }
                }

            }

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


                        const xmlDom = Blockly.utils.xml.textToDom(xmlText);

                        // ✅ Update dictionary before loading
                        updateSavedSelectionsFromXml(xmlDom);

                        // ✅ Clear workspace before loading
                        workspace.clear();

                        Blockly.Xml.domToWorkspace(xmlDom, workspace);

                        // ✅ Delay lets Blockly finish inserting blocks
                        setTimeout(() => {
                          waitForData();
                        }, 100);

                        alert(`✅ Successfully loaded "${file.name}"`);

                        // ✅ Close modal or overlay
                        overlay.remove();

                    } catch (err) {
                        alert('❌ Failed to load XML. Make sure it’s a valid Blockly file.');
                        console.error(err);
                    }
                };

                reader.readAsText(file);
            });
        }

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
            icon.src = '/static/icons/google_drive.svg';
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
            marginLeft: '10%',
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
            width: '90%',   // relative to modal’s width
            height: '5vh',
            border: '1px solid rgba(187, 187, 187, 0.5)',
            margin: '0 auto',   // centers it horizontally
            borderRadius: '5px',
            position: 'relative',
            zIndex: 1,
            padding: '0.5vh 1vw',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box' // ensures padding doesn’t break width
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
            //width: '18.5vw',
            width: '90%',
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
        localImg.src = '/static/icons/deriv-icon.svg'; // Make sure this path is correct
        localImg.style.width = '3vw';
        localImg.style.height = 'auto';
        // ✅ Give IDs so we can find them later
        localImg.id = "localImg";

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
        driveImg.src = '/static/icons/google_drive.svg'; // Make sure this path is correct
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

        // Append buttons
        bottomBar.appendChild(cancelBtn);
        bottomBar.appendChild(saveBtn);


        // Add bottom bar to modal
        modal.appendChild(bottomBar);

        overlay.appendChild(modal);

        // ✅ Function to apply responsive width
        function applyModalWidth() {
            if (window.innerWidth < 700) {
                modal.style.width = "70vw";
            } else {
                modal.style.width = "20vw";
            }
        }

        // Apply immediately and on resize
        applyModalWidth();
        window.addEventListener("resize", applyModalWidth);

        document.body.appendChild(overlay);

        function updateSaveOptionsLayout() {
            const localImg = document.getElementById("localImg");

            if (!localImg) return;

            if (window.innerWidth <= 700) {
                // Mobile → change icon
                localImg.src = "/static/icons/local.svg";
            } else {
                // Desktop → default icon
                localImg.src = "/static/icons/deriv-icon.svg";
            }
        }

        // Run once on load
        updateSaveOptionsLayout();

        // Run on window resize
        window.addEventListener("resize", updateSaveOptionsLayout);

    }

    function sortBlocksVertically() {
        const blocks = workspace.getTopBlocks(true); // Top-level blocks only
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
        'sort.svg': sortBlocksCustom,
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

        icon.style.cursor = 'pointer';

        // Initial size
        function resizeIconStyle() {
            icon.style.width = '2.5vh';
            icon.style.height = '2.5vh';
            //icon.style.marginRight = window.innerWidth < 700 ? '12px' : '1.9vw';
        }

        resizeIconStyle(); // initial call
        window.addEventListener('resize', resizeIconStyle); // responsive

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
        O_0: ['recycle.png', 'folderopen.png', 'floppydisk.png', 'sort.svg'],
        //O_1: ['chart.png', 'linechart.png'],
        O_2: ['undo.png', 'redo.png'],
        O_3: ['zoomin1.png', 'zoomout.png']
    };

    // Create optionsDiv
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 54.5vw;
        height: 8vh;
        //background-color: white;
        background-color: var(--bg-color);
        display: flex;
        flex-wrap: nowrap; /* Keep children in one row */
        align-items: center; /* vertical centering */
        justify-content: flex-start; /* start from the left */
        //padding-top: 10px;
        z-index: 10;
        //border: 1px solid #ccc;
    `;

    // Hide scrollbar with CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .hide-scrollbar {
            -ms-overflow-style: none; /* IE & Edge */
            scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
        }
    `;
    document.head.appendChild(style);

    // Quick Strategy Button
    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick Strategy';
    quickStrategyBtn.style = `
        background-color: #ff4d4d;
        color: white;
        //padding: 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 2.2vh;
        font-weight: bold;
        height: 6vh;
        width: 16.1vw;
        text-align: center;
        z-index: 10;
        position: relative;
        left: 0.7vw;
    `;
    optionsDiv.appendChild(quickStrategyBtn);

    // ===============================
    // 2. Add a click event listener
    // ===============================
    quickStrategyBtn.addEventListener("click", () => {
        openQuickStrategyOverlay();  // calls our function
        localStorage.setItem("qson", "true");

        // ✅ Check and set qssymbol
        const currentSymbol = localStorage.getItem("qssymbol");
        if (currentSymbol !== "1HZ10V") {
            localStorage.setItem("qssymbol", "1HZ10V");
        }
    });

    // ===============================
    // 3. Function to build overlay + modal
    // ===============================
    function openQuickStrategyOverlay() {
      // Prevent duplicate overlays
      if (document.getElementById('qswOverlay')) return;

      const isQSon = localStorage.getItem("qson") === "true";

      // ===== Overlay (dark background) =====
      const overlay = document.createElement('div');
      overlay.id = 'qswOverlay';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.6)', // adjust alpha 0→1 to tune darkness
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10000',
      });

      // ===== Modal window (qsw) =====
      const qsw = document.createElement('div');
      qsw.id = 'qsw';
      Object.assign(qsw.style, {
        width: '50vw',               // change if you want 70vw etc.
        height: '85vh',              // change if you want 70vh etc.
        borderRadius: '5px',
        display: 'flex',
        backgroundColor: 'transparent',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      });

        // ===== Left side (qsw1) =====
        const qsw1 = document.createElement('div');
        qsw1.id = 'qsw1';
        Object.assign(qsw1.style, {
          width: '30vw',
          height: '100%',
          backgroundColor: '#e5e5e5',
          borderTopLeftRadius: '5px',
          borderBottomLeftRadius: '5px',
          padding: '20px',
          boxSizing: 'border-box',
        });

        // Left text area
        const title = document.createElement('div');
        title.innerText = 'Quick Strategy';
        Object.assign(title.style, {
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '1vh',
          fontSize: '1.0rem',
        });

        const desc = document.createElement('div');
        desc.innerText = 'Choose a template below and set your trade parameters.';
        Object.assign(desc.style, {
          color: '#000',
          marginBottom: '1vh',
          fontSize: '14px', // user requested 10px
        });

        // ===== STEP CONTAINER =====
        const stepContainer = document.createElement('div');
        stepContainer.style.display = 'flex';
        stepContainer.style.flexDirection = 'column';
        stepContainer.style.position = 'relative';
        stepContainer.style.marginTop = '1.5vh';

        // STEP 1: Strategy template
        const step1 = document.createElement('div');
        step1.style.display = 'flex';
        step1.style.alignItems = 'center';
        step1.style.position = 'relative';
        step1.style.marginBottom = '2px';

        // Circle for step 1
        const circle1 = document.createElement('div');
        circle1.id = 'circle1';
        Object.assign(circle1.style, {
          width: '16px',
          height: '16px',
          border: '2px solid black',
          borderRadius: '50%',
          backgroundColor: '#e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '10px'
        });

        // Text for step 1
        const templateText = document.createElement('div');
        templateText.innerText = 'Strategy template';
        Object.assign(templateText.style, {
          fontWeight: 'bold',
          color: '#000',
          fontSize: '14px',
        });

        // Append step1
        step1.appendChild(circle1);
        step1.appendChild(templateText);

        // Connector line
        const line = document.createElement('div');
        Object.assign(line.style, {
          width: '2px',
          height: '15px',
          backgroundColor: 'black',
          marginLeft: '8px'
        });

        // STEP 2: Trade parameters
        const step2 = document.createElement('div');
        step2.style.display = 'flex';
        step2.style.alignItems = 'center';
        step2.style.position = 'relative';
        step2.style.marginTop = '2px';

        // Circle for step 2
        const circle2 = document.createElement('div');
        circle2.id = 'circle2';
        Object.assign(circle2.style, {
          width: '16px',
          height: '16px',
          border: '2px solid black',
          borderRadius: '50%',
          backgroundColor: '#e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '10px'
        });

        // Text for step 2
        const paramsText = document.createElement('div');
        paramsText.innerText = 'Trade parameters';
        Object.assign(paramsText.style, {
          fontWeight: 'bold',
          color: '#000',
          fontSize: '14px',
        });

        // Append step2
        step2.appendChild(circle2);
        step2.appendChild(paramsText);

        // Build step container
        stepContainer.appendChild(step1);
        stepContainer.appendChild(line);
        stepContainer.appendChild(step2);

        // Final append to qsw1
        qsw1.appendChild(title);
        qsw1.appendChild(desc);
        qsw1.appendChild(stepContainer);

        function markStep1() {
          circle1.style.backgroundColor = 'black';
          circle1.innerHTML = '<img src="/static/icons/k1.svg" width="12" height="12" alt="done">';
          circle1.style.borderColor = 'black'; // makes border blend in
        }

        function unmarkStep1() {
          circle1.style.backgroundColor = '#e5e5e5';
          circle1.innerHTML = '';
          circle1.style.borderColor = 'black'; // reset border
        }

      // ===== Right side (qsw2) =====
      const qsw2 = document.createElement('div');
      qsw2.id = 'qsw2';
      Object.assign(qsw2.style, {
        width: '40vw',
        height: '100%',
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
        backgroundColor: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      });

        // Cancel bar (top of right side)
        const cancelDiv = document.createElement('div');
        cancelDiv.id = 'cancelDiv';
        Object.assign(cancelDiv.style, {
            height: '8vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            boxSizing: 'border-box',
            paddingRight: '2vw',
        });

        // Check screen size for mobile vs desktop
        if (window.innerWidth < 700) {
            // Mobile style: thicker split border
            Object.assign(cancelDiv.style, {
                borderBottom: '0.4vh solid transparent',
                borderImage: 'linear-gradient(to right, rgba(255,0,0,0.8) 50%, rgba(229,229,229,1) 50%) 1',
                //borderImage: 'linear-gradient(to right, rgba(229,229,229,1) 50%, rgba(255,0,0,0.8) 50%) 1',
            });

            // Step text
            const stepText = document.createElement('span');
            stepText.innerHTML = '<b>Step 1/2: choose your strategy</b>';
            Object.assign(stepText.style, {
                fontSize: '14px',
                color: '#000',
                marginLeft: '1vw',
            });
            cancelDiv.appendChild(stepText);
        } else {
            // Desktop style
            cancelDiv.style.borderBottom = '1px solid #e5e5e5';
        }

        // Cancel button (X)
        const cancelBtn = document.createElement('div');
        cancelBtn.innerText = 'X';
        Object.assign(cancelBtn.style, {
            fontSize: '22px',
            color: '#000',
            cursor: 'pointer',
            position: 'absolute',
            right: '2vw',
            top: '50%',
            transform: 'translateY(-50%)'
        });

        cancelBtn.addEventListener("click", () => {
          const isMobile = window.innerWidth < 700;

          // ===== Desktop: remove overlay if present =====
          const overlay = document.getElementById("qswOverlay");
          if (!isMobile && overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }

          // ===== Mobile: cleanup and restore rub + rstool + resultWindow =====
          if (isMobile) {
            const rub = document.getElementById("rub");
            if (rub) {
              // 1) Remove outerqsw2 if present
              const outer = document.getElementById("outerqsw2");
              if (outer && outer.parentNode) outer.parentNode.removeChild(outer);

              // 2) Collapse rub
              rub.style.height = "7vh";

              // 3) Remove any stray rstool and recreate a clean one
              const oldRstool = document.getElementById("rstool");
              if (oldRstool && oldRstool.parentNode) oldRstool.parentNode.removeChild(oldRstool);

              const rstool = document.createElement("div");
              rstool.id = "rstool";
              Object.assign(rstool.style, {
                width: "100%",
                height: "6vh",
                position: "absolute",
                top: "0",
                left: "0",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "3px solid #e5e5e5",
                cursor: "pointer",
                zIndex: "1000000"
              });

              const toggleIcon = document.createElement("img");
              toggleIcon.src = "/static/icons/up.png";
              Object.assign(toggleIcon.style, {
                width: "16px",
                height: "16px"
              });
              rstool.appendChild(toggleIcon);

              // Insert rstool at top of rub
              // If rub had children, insert as first child so rstool sits at the top
              if (rub.firstChild) rub.insertBefore(rstool, rub.firstChild);
              else rub.appendChild(rstool);

              // 4) Ensure resultWindow is placed inside rub and styled for mobile
              const resultWindow = document.getElementById("resultwindow");
              if (resultWindow && resultWindow.parentNode !== rub) {
                rub.appendChild(resultWindow);
              }

              if (resultWindow) {
                // sits just below rstool when rub expands
                resultWindow.style.marginTop = "0vh";
                resultWindow.style.width = "100%";
                resultWindow.style.height = "calc(82vh - 6vh)"; // full area when expanded
                resultWindow.style.boxSizing = "border-box";
                // initially hidden because rub is collapsed
                resultWindow.style.display = "none";
              }

              // 5) Add toggle behavior to rstool (expand/collapse rub + show/hide resultWindow)
              // Use a fresh `isExpanded` local to this rstool so state is consistent
              let isExpanded = false;
              rstool.addEventListener("click", () => {
                if (isExpanded) {
                  // collapse
                  rub.style.height = "7vh";
                  toggleIcon.src = "/static/icons/up.png";
                  if (resultWindow) resultWindow.style.display = "none";
                } else {
                  // expand
                  rub.style.height = "82vh";
                  toggleIcon.src = "/static/icons/down.png";
                  if (resultWindow) resultWindow.style.display = "block";
                }
                isExpanded = !isExpanded;
              });
            }
          }

          // Reset Quick Strategy state
          localStorage.setItem("qson", "false");
        });


        cancelDiv.appendChild(cancelBtn);
        qsw2.appendChild(cancelDiv);

      // ===== Content wrapper (so bottom bar sticks to bottom) =====
      const contentWrap = document.createElement('div');
      contentWrap.style = 'flex:1; display:flex; flex-direction:column; overflow:hidden;';

      // ===== New scrollable section (qsw3) =====
      const qsw3 = document.createElement('div');
      qsw3.id = 'qsw3';
      Object.assign(qsw3.style, {
        height: '60vh',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden', // disable horizontal scroll
        padding: '10px 0 10px 0',
        boxSizing: 'border-box',
      });

      // Thin scrollbar CSS (scoped by IDs)
      const scrollStyle = document.createElement('style');
      scrollStyle.type = 'text/css';
      scrollStyle.innerHTML = `
        #qsw3, #qsw5 { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
        #qsw3::-webkit-scrollbar, #qsw5::-webkit-scrollbar { width: 5px; height:5px; }
        #qsw3::-webkit-scrollbar-track, #qsw5::-webkit-scrollbar-track { background: #f1f1f1; }
        #qsw3::-webkit-scrollbar-thumb, #qsw5::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        #qsw3::-webkit-scrollbar-thumb:hover, #qsw5::-webkit-scrollbar-thumb:hover { background: #555; }
        .qsw-cat-btn { padding: 6px 12px; border-radius: 10px; cursor: pointer; border: 1px solid #ccc; background: #fff; color: #000; }
        .qsw-cat-btn.active { background: #000; color: #fff; }
      `;
      document.head.appendChild(scrollStyle);

        // ===== Search bar (ssach div) =====
        const ssachDiv = document.createElement('div');
        ssachDiv.id = 'ssachDiv';
        Object.assign(ssachDiv.style, {
            width: '80%',
            maxWidth: '300px',
            height: '5vh',
            borderRadius: '5px',
            marginTop: '2vh',
            marginBottom: '2vh',
            marginLeft: '1vw',
            backgroundColor: 'rgba(200,200,200,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '10px',
            fontSize: '14px',
            color: '#333',
            boxSizing: 'border-box',
        });

        // Add search image
        const searchImg = document.createElement('img');
        searchImg.src = '/static/icons/search.png';
        searchImg.alt = 'Search';
        Object.assign(searchImg.style, {
          width: '18px',
          height: '18px',
          marginRight: '8px',
        });
        ssachDiv.appendChild(searchImg);

        // Make search div editable
        ssachDiv.contentEditable = "true";
        ssachDiv.spellcheck = false;
        ssachDiv.dataset.placeholder = "Search";
        ssachDiv.innerText = ssachDiv.dataset.placeholder;
        ssachDiv.style.color = 'rgba(100,100,100,0.7)';

        // Placeholder handling
        ssachDiv.addEventListener("focus", () => {
            if (ssachDiv.innerText === ssachDiv.dataset.placeholder) {
                ssachDiv.innerText = "";
                ssachDiv.style.color = "#333";
            }
        });
        ssachDiv.addEventListener("blur", () => {
            if (ssachDiv.innerText.trim() === "") {
                ssachDiv.innerText = ssachDiv.dataset.placeholder;
                ssachDiv.style.color = 'rgba(100,100,100,0.7)';
            }
        });

        // ===== Filter strategies as user types =====
        function filterStrategies(text) {
            const activeCategory = document.querySelector(".qsw-cat-btn.active")?.dataset.cat || "All";
            let filtered = [];

            if (activeCategory === "All") {
                Object.values(strategies).forEach(arr => filtered.push(...arr));
            } else {
                filtered = strategies[activeCategory] || [];
            }

            if (text && text !== ssachDiv.dataset.placeholder) {
                const lowerText = text.toLowerCase();
                filtered = filtered.filter(s => s.toLowerCase().includes(lowerText));
            }

            // Instead of raw divs, use render logic
            renderFilteredStrategies(activeCategory, filtered);
        }

        // ===== Render strategies but allow filtered input =====
        function renderFilteredStrategies(sectionOrCat, strategyArray) {
            strategyListDiv.innerHTML = '';

            // Optional section title
            if (sectionOrCat !== "All") {
                const titleEl = document.createElement('div');
                titleEl.innerText = sectionOrCat;
                Object.assign(titleEl.style, {
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    margin: '1vh 0'
                });
                strategyListDiv.appendChild(titleEl);
            }

            // Render items (same style as renderStrategies)
            strategyArray.forEach(strat => {
                const stratDiv = document.createElement('div');
                Object.assign(stratDiv.style, {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '7vh',
                    padding: '0 0.5vw',
                    borderBottom: '1px solid #e5e5e5',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                });

                const nameSpan = document.createElement('div');
                nameSpan.innerText = strat;

                const arrow = document.createElement('img');
                arrow.src = '/static/icons/rightarrow.svg';
                arrow.alt = '→';
                Object.assign(arrow.style, {
                    width: '16px',
                    height: '16px',
                    marginLeft: '2vw'
                });

                stratDiv.appendChild(nameSpan);
                stratDiv.appendChild(arrow);

                strategyListDiv.appendChild(stratDiv);
            });
        }

        ssachDiv.addEventListener("input", () => {
            console.log("🟢 itafute manually ama uache ikae");
        });

        // Append to container
        qsw3.appendChild(ssachDiv);

        // Initial render
        //filterStrategies("");

      // ===== Buttons row =====
      const buttonRow = document.createElement('div');
      Object.assign(buttonRow.style, {
        display: 'flex',
        gap: '1vw',
        marginTop: '10px',
        marginLeft: '1vw', // All button 3vw from left as requested
        marginBottom: '3vh'
      });

      const categories = ['All', 'Accumulators', 'Options'];
      const catButtons = {}; // keep refs

      categories.forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.className = 'qsw-cat-btn';
        btn.innerText = cat;
        btn.dataset.cat = cat;
        // Default: All active
        if (idx === 0) btn.classList.add('active');
        buttonRow.appendChild(btn);
        catButtons[cat] = btn;
      });

      qsw3.appendChild(buttonRow);

      // ===== Strategies data & strategy list container =====
      const strategies = {
        'Accumulators': [
          'Martingale',
          'Martingale on Stat Reset',
          'D’Alembert',
          "D'Alembert on Stat Reset",
          'Reverse Martingale',
          'Reverse Martingale on Stat Reset',
          'Reverse D\'Alembert',
          'Reverse D\'Alembert on Stat Reset',
        ],
        'Options': [
          'Martingale',
          'D’Alembert',
          'Reverse Martingale',
          'Reverse D’Alembert',
          'Oscar’s Grind',
          '1-3-2-6',
        ],
      };

      const strategyListDiv = document.createElement('div');
      strategyListDiv.id = 'strategyListDiv';
      Object.assign(strategyListDiv.style, {
        marginTop: '0.5vh', // space after buttons (user wanted 3vh below buttons — but we use smaller spacing and keep layout neat)
        marginLeft: '1vw',
        marginRight: '1vw',
      });
      qsw3.appendChild(strategyListDiv);

      // Function to render strategies for a given selected category
      function renderStrategies(selected) {
        strategyListDiv.innerHTML = '';

        // decide sections to show
        const sectionsToShow = selected === 'All' ? Object.keys(strategies) : [selected];

        sectionsToShow.forEach(section => {
          // Section title (bold)
          const titleEl = document.createElement('div');
          titleEl.innerText = section;
          Object.assign(titleEl.style, {
            fontWeight: 'bold',
            fontSize: '0.8rem',
            margin: '1vh 0'
          });
          strategyListDiv.appendChild(titleEl);

          // list items
          strategies[section].forEach(strat => {
            const stratDiv = document.createElement('div');
            Object.assign(stratDiv.style, {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '7vh', // user requested 7vh
              padding: '0 0.5vw',
              borderBottom: '1px solid #e5e5e5',
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxSizing: 'border-box',
            });

            const nameSpan = document.createElement('div');
            nameSpan.innerText = strat;
            Object.assign(nameSpan.style, {
              fontWeight: 'normal'
            });

            // Arrow icon to the right (2vw from right)
            const arrow = document.createElement('img');
            arrow.src = '/static/icons/rightarrow.svg';
            arrow.alt = '→';
            Object.assign(arrow.style, {
              width: '16px',
              height: '16px',
              marginLeft: '2vw'
            });

            stratDiv.appendChild(nameSpan);
            stratDiv.appendChild(arrow);

            //stratDiv.addEventListener('click', () => handleStrategyClick(sectionOrCat, strat));

            // click -> open detail view (qsw5)
            stratDiv.addEventListener('click', () => {
              // 🔎 Access initqscon from localStorage
              const initqscon = localStorage.getItem("initqscon");
              if (initqscon) {
                try {
                  const parsedInit = JSON.parse(initqscon);
                } catch (err) {
                  console.warn("⚠️ Failed to parse initqscon:", err, initqscon);
                }
              } else {
                console.log("❌ No initqscon found in localStorage.");
              }
              qsw2.appendChild(qsw6);        // bottom bar

              if (window.innerWidth > 700) {
                // 🖥️ Desktop: normal behavior
                markStep1();
              } else {
                // 📱 Mobile: full red border + update text
                const cancelDiv = document.getElementById("cancelDiv");
                if (cancelDiv) {
                  // 🔴 Full red border
                  cancelDiv.style.borderBottom = "0.4vh solid red";
                  cancelDiv.style.borderImage = ""; // clear gradient if any

                  // Find or create the step text span
                  let stepText = cancelDiv.querySelector("span");
                  if (!stepText) {
                    stepText = document.createElement("span");
                    cancelDiv.insertBefore(stepText, cancelDiv.firstChild);
                  }
                  stepText.innerHTML = "<b>Step 2/2: choose your strategy</b>";
                  Object.assign(stepText.style, {
                    fontSize: "14px",
                    color: "#000",
                    marginLeft: "1vw",
                  });
                }
              }

              showDetailForStrategy(section, strat);
            });
            strategyListDiv.appendChild(stratDiv);
          });
        });
      }

      // Initial rendering: All
      renderStrategies('All');

        function handleStrategyClick(section, strat) {
            const initqscon = localStorage.getItem("initqscon");
            if (initqscon) {
                try {
                    const parsedInit = JSON.parse(initqscon);
                } catch (err) {
                    console.warn("⚠️ Failed to parse initqscon:", err, initqscon);
                }
            } else {
                console.log("❌ No initqscon found in localStorage.");
            }

            qsw2.appendChild(qsw6); // bottom bar

            if (window.innerWidth > 700) {
                markStep1();
            } else {
                const cancelDiv = document.getElementById("cancelDiv");
                if (cancelDiv) {
                    cancelDiv.style.borderBottom = "0.4vh solid red";
                    cancelDiv.style.borderImage = "";
                    let stepText = cancelDiv.querySelector("span");
                    if (!stepText) {
                        stepText = document.createElement("span");
                        cancelDiv.insertBefore(stepText, cancelDiv.firstChild);
                    }
                    stepText.innerHTML = "<b>Step 2/2: choose your strategy</b>";
                    Object.assign(stepText.style, {
                        fontSize: "14px",
                        color: "#000",
                        marginLeft: "1vw",
                    });
                }
            }

            showDetailForStrategy(section, strat);
        }

      // Hook category buttons to toggle styles + render
      Object.values(catButtons).forEach(btn => {
        btn.addEventListener('click', () => {
          // reset all
          Object.values(catButtons).forEach(b => b.classList.remove('active'));
          // set active
          btn.classList.add('active');
          // render for category
          renderStrategies(btn.dataset.cat);
        });
      });

      // Append qsw3 into content container
      contentWrap.appendChild(qsw3);

      // ===== qsw5: detail pane (hidden initially) =====
      const qsw5 = document.createElement('div');
      qsw5.id = 'qsw5';
      Object.assign(qsw5.style, {
        display: 'none',      // hidden initially
        height: '60vh',
        width: '100%',
        overflowY: 'auto',
        padding: '10px',
        boxSizing: 'border-box',
        backgroundColor: '#fff'
      });

      // Add header for selected strategy detail
      const qsw5Header = document.createElement('div');
      Object.assign(qsw5Header.style, {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '10px'
      });
      qsw5.appendChild(qsw5Header);

      // Add placeholder content area in qsw5
      const qsw5Content = document.createElement('div');
      qsw5Content.innerHTML = '<div style="color:#444">Strategy details will appear here. You can populate with parameters, examples, or form controls.</div>';
      qsw5.appendChild(qsw5Content);

      contentWrap.appendChild(qsw5);

      // ===== qsw6: bottom action bar =====
      const qsw6 = document.createElement('div');
      qsw6.id = 'qsw6';
      Object.assign(qsw6.style, {
        height: '10vh',
        width: '100%',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        paddingLeft: '2vw',
        paddingRight: '2vw',
        backgroundColor: '#fff'
      });

      // Back button (left)
      const backBtn = document.createElement('button');
      backBtn.innerText = 'Back';
      Object.assign(backBtn.style, {
        background: 'transparent',
        border: 'none',
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginLeft: '2vw'
      });

      // Right area containing Load and Run
      const rightButtonsWrap = document.createElement('div');
      Object.assign(rightButtonsWrap.style, {
        display: 'flex',
        gap: '1vw',
        alignItems: 'center',
        marginRight: '2vw'
      });

      // Load button (white, black bold text)
      const loadBtn = document.createElement('button');
      loadBtn.innerText = 'Load';
      Object.assign(loadBtn.style, {
        background: '#fff',
        border: '1px solid #000',
        color: '#000',
        fontWeight: 'bold',
        padding: '8px 14px',
        borderRadius: '5px',
        cursor: 'pointer'
      });

      // Run button (red background, white bold text, black 1px border)
      const runBtn = document.createElement('button');
      runBtn.innerText = 'Run';
      Object.assign(runBtn.style, {
        background: '#ff4d4d',
        color: '#fff',
        fontWeight: 'bold',
        padding: '8px 14px',
        borderRadius: '5px',
        cursor: 'pointer'
      });

      rightButtonsWrap.appendChild(loadBtn);
      rightButtonsWrap.appendChild(runBtn);

      qsw6.appendChild(backBtn);
      qsw6.appendChild(rightButtonsWrap);

    // Wire back / load / run events
    backBtn.addEventListener('click', () => {
      // Hide qsw5, show qsw3
      qsw5.style.display = 'none';
      qsw6.style.display = 'none';
      qsw3.style.display = 'block';

      if (window.innerWidth > 700) {
        // 🖥️ Desktop: revert normally
        unmarkStep1();
      } else {
        // 📱 Mobile: reset to step 1 and half-red border
        const cancelDiv = document.getElementById("cancelDiv");
        if (cancelDiv) {
          cancelDiv.style.borderBottom = "0.4vh solid transparent";
          cancelDiv.style.borderImage =
            "linear-gradient(to right, rgba(255,0,0,0.8) 50%, rgba(229,229,229,1) 50%) 1";

          // Reset step text
          let stepText = cancelDiv.querySelector("span");
          if (!stepText) {
            stepText = document.createElement("span");
            cancelDiv.insertBefore(stepText, cancelDiv.firstChild);
          }
          stepText.innerHTML = "<b>Step 1/2: choose your strategy</b>";
          Object.assign(stepText.style, {
            fontSize: "14px",
            color: "#000",
            marginLeft: "1vw",
          });
        }
      }
    });

      loadBtn.addEventListener('click', () => {
        console.log('Load clicked for strategy:', qsw5Header.innerText);
        // TODO: implement actual load behavior
      });

      runBtn.addEventListener('click', () => {
        console.log('Run clicked for strategy:', qsw5Header.innerText);
        // TODO: implement run behavior
      });

        // Rewritten showDetailForStrategy with expanded UI sections (Initial stake, Growth rate, Profit threshold, Loss threshold, Size/Unit, Sell conditions, Max stake)
        // Drop this into the same scope where qsw3, qsw5, qsw6, qsw, qsw1, qsw2, contentWrap, overlay etc. already exist.
        function showDetailForStrategy(category, strategy) {
          qsw3.style.display = 'none';
          qsw5.style.display = 'block';
          qsw6.style.display = 'flex';
          qsw5.innerHTML = ''; // clear

          // Load asset data
          window.WS_DATA = window.WS_DATA || {};
          window.WS_DATA.activeSymbols = window.WS_DATA.activeSymbols || JSON.parse(localStorage.getItem("activeSymbols") || '{}');
          const activeSymbols = window.WS_DATA.activeSymbols || {};

          // Helper: create icon image (keeps 2vw inner icon padding by default)
          function createIcon(symbol) {
            const img = document.createElement('img');
            img.src = `/static/icons/${symbol}.svg`;
            Object.assign(img.style, {
              width: '20px',
              height: '20px',
              paddingLeft: '2vw',
              boxSizing: 'content-box'
            });
            return img;
          }

          // Helper: create small info icon used in labels
          function createInfoIcon() {
            const img = document.createElement('img');
            img.src = '/static/icons/i.svg';
            Object.assign(img.style, { width: '12px', height: '12px' });
            return img;
          }

          // Utility: build symbol row for popup (icon + label, clickable)
          function buildSymbolRow(symbolObj, sq2Assets, toggleIcon, popup) {
            const row = document.createElement('div');
            Object.assign(row.style, {
              display: 'flex',
              alignItems: 'center',
              height: '6vh',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
              padding: '0.5vh 1vw',
              boxSizing: 'border-box'
            });

            const left = document.createElement('div');
            Object.assign(left.style, { display: 'flex', alignItems: 'center', gap: '2vw' });

            const icon = createIcon(symbolObj.symbol);
            icon.style.marginLeft = '0vw';
            icon.style.flexShrink = '0';

            const name = document.createElement('span');
            name.innerText = symbolObj.display_name;
            Object.assign(name.style, { fontSize: '12px', color: '#000', fontWeight: '600' });

            left.appendChild(icon);
            left.appendChild(name);
            row.appendChild(left);

            row.addEventListener('click', () => {
              renderCurrentSymbol(sq2Assets, symbolObj, toggleIcon, popup);
              popup.style.display = 'none';
              toggleIcon.src = '/static/icons/down.png';

              // Save the chosen symbol in localStorage
              localStorage.setItem("qssymbol", symbolObj.symbol);

              // Send request
              window.sendWebSocketMessage({
                event: "get_contracts",
                symbol: symbolObj.symbol,
                api_token: "api_token"
              });
            });

            return row;
          }

          // Utility: render current selection in sq2Assets
          function renderCurrentSymbol(sq2Assets, symbolObj, toggleIcon, popup) {
            sq2Assets.innerHTML = ''; // clear

            // left container holds icon + name together
            const leftContainer = document.createElement('div');
            Object.assign(leftContainer.style, {
              display: 'flex',
              alignItems: 'center',
              gap: '2vw', // space between icon and name -> with icon padding 2vw this makes name appear ~6vw from left edge
              marginLeft: '0vw'
            });

            const leftIcon = createIcon(symbolObj.symbol);
            leftIcon.style.marginLeft = '0vw';
            leftIcon.style.flexShrink = '0';

            const center = document.createElement('span');
            center.innerText = symbolObj.display_name;
            Object.assign(center.style, {
              fontSize: '14px',
              fontWeight: '700',
              color: '#000'
            });

            leftContainer.appendChild(leftIcon);
            leftContainer.appendChild(center);

            // Right toggle icon
            toggleIcon.src = '/static/icons/down.png';
            Object.assign(toggleIcon.style, {
              width: '14px',
              height: '14px',
              paddingRight: '3vw',
              cursor: 'pointer'
            });

            toggleIcon.onclick = () => {
              const isHidden = popup.style.display === 'none';
              popup.style.display = isHidden ? 'block' : 'none';
              toggleIcon.src = isHidden ? '/static/icons/up.png' : '/static/icons/down.png';
            };

            // Layout: leftContainer + spacer + toggleIcon
            // use a container with space-between to keep toggle on the far right
            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            });

            wrapper.appendChild(leftContainer);
            wrapper.appendChild(toggleIcon);

            sq2Assets.appendChild(wrapper);
          }

            // =========================
            // 🔧 Populate Contract Type div with grouped rows + icons
            // =========================
            function popctdiv(fieldDiv) {

              // Load contract payloads
              const initqscon = JSON.parse(localStorage.getItem("initqscon") || "null");
              const subqscon  = JSON.parse(localStorage.getItem("subqscon")  || "null");
              const currentSymbol = localStorage.getItem("qssymbol") || "1HZ10V";

              let source = currentSymbol === "1HZ10V" ? initqscon : subqscon;
              if (!source || !source.data || typeof source.data !== "object") {
                console.warn("⚠️ popctdiv: no contracts data available", { currentSymbol, initqscon, subqscon });
                return;
              }
              const data = source.data;

              // ========================
              // Helpers
              // ========================

              const makeTitle = (txt) => {
                const d = document.createElement("div");
                d.innerText = txt;
                Object.assign(d.style, {
                  fontWeight: "700",
                  color: "red",
                  textAlign: "center",
                  margin: "8px 0",
                  padding: "0 6px"
                });
                return d;
              };

              const makeRow = (icons, label) => {
                const row = document.createElement("div");
                Object.assign(row.style, {
                  padding: "8px 10px",
                  borderBottom: "1px solid #ccc",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                });

                // Add icons
                icons.forEach((src, idx) => {
                  const img = document.createElement("img");
                  img.src = `/static/icons/${src}`;
                  Object.assign(img.style, {
                    width: "20px",
                    height: "20px",
                    marginRight: idx === icons.length - 1 ? "2vw" : "0.5vw"
                  });
                  row.appendChild(img);
                });

                // Add text label
                const span = document.createElement("span");
                span.innerText = label;
                row.appendChild(span);

                // Event: update ct main div
                row.addEventListener("click", (ev) => {
                  ev.stopPropagation();
                  updateMainDisplay(icons, label);
                  popup.style.display = "none";
                  toggleIcon.src = "/static/icons/down.png";
                });

                return row;
              };

              const updateMainDisplay = (icons, label) => {
                fieldDiv.innerHTML = ""; // clear
                fieldDiv.style.position = "relative";
                fieldDiv.style.display = "flex";
                fieldDiv.style.alignItems = "center";
                fieldDiv.style.cursor = "pointer";

                // Add icons
                icons.forEach((src, idx) => {
                  const img = document.createElement("img");
                  img.src = `/static/icons/${src}`;
                  Object.assign(img.style, {
                    width: "20px",
                    height: "20px",
                    marginLeft: idx === 0 ? "1.5vw" : "0.2vw",
                    marginRight: idx === icons.length - 1 ? "1vw" : "0vw",
                    display: "inline-block"
                  });
                  fieldDiv.appendChild(img);
                });

                // Label
                const span = document.createElement("span");
                span.innerText = label;
                span.style.fontSize = "14px";
                span.style.fontWeight = "700";
                span.style.color = "black";
                span.style.marginRight = "3vw";
                fieldDiv.appendChild(span);

                // Down arrow
                toggleIcon = document.createElement("img");
                toggleIcon.src = "/static/icons/down.png";
                Object.assign(toggleIcon.style, {
                  position: "absolute",
                  right: "3vw",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "14px",
                  height: "14px",
                  cursor: "pointer"
                });
                fieldDiv.appendChild(toggleIcon);

                toggleIcon.addEventListener("click", (e) => {
                  e.stopPropagation();
                  togglePopup();
                });

                // 🔑 Whenever ct changes, refresh pcs
                const pcsDiv = document.getElementById("pcs");
                if (pcsDiv) {
                  poppcs(pcsDiv);
                }
              };

            // ========================
            // Build popup
            // ========================
            const popupId = `ctpopup_${fieldDiv.id || Math.random().toString(36).slice(2,6)}`;
            const existing = document.getElementById(popupId);
            if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

            const popup = document.createElement("div");
            popup.id = popupId;
            Object.assign(popup.style, {
              width: "28vw",
              maxHeight: "40vh",
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              position: "absolute",
              zIndex: "10000",
              display: "none",
              boxSizing: "border-box",
              paddingBottom: "6px"
            });

            // thin scrollbar
            popup.style.scrollbarWidth = "thin";
            popup.style.scrollbarColor = "#999 transparent";

            // WebKit scrollbar
            popup.innerHTML += `
              <style>
                #${popupId}::-webkit-scrollbar { width: 0.4vw; }
                #${popupId}::-webkit-scrollbar-thumb { background: #999; border-radius: 10px; }
                #${popupId}::-webkit-scrollbar-track { background: transparent; }
              </style>
            `;

            // ========================
            // Populate sections in order
            // ========================
            if (data.callput) {
              popup.appendChild(makeTitle("Up/Down"));
              popup.appendChild(makeRow(["CALL.svg","PUT.svg"], "Rise/Fall"));
            }
            if (data.callputequal) {
              popup.appendChild(makeRow(["CALLE.svg","PUTE.svg"], "Rise Equals/Falls Equals"));
            }
            if (data.asian) {
              popup.appendChild(makeTitle("Asians"));
              popup.appendChild(makeRow(["ASIANU.svg","ASIAND.svg"], "Asian Up/Asian Down"));
            }
            if (data.digits) {
              popup.appendChild(makeTitle("Digits"));
              popup.appendChild(makeRow(["DIGITMATCH.svg","DIGITDIFF.svg"], "Matches/Differs"));
              popup.appendChild(makeRow(["DIGITEVEN.svg","DIGITODD.svg"], "Even/Odd"));
              popup.appendChild(makeRow(["DIGITOVER.svg","DIGITUNDER.svg"], "Over/Under"));
            }
            if (data.reset) {
              popup.appendChild(makeTitle("Reset Call/Put"));
              popup.appendChild(makeRow(["RESETCALL.svg","RESETPUT.svg"], "Reset Call/Reset Put"));
            }
            if (data.runs) {
              popup.appendChild(makeTitle("Only Ups/Only Downs"));
              popup.appendChild(makeRow(["RUNHIGH.svg","RUNLOW.svg"], "Only Ups/Only Downs"));
            }

            // ✅ Append popup to sq2 instead of ct
            const sq2 = document.getElementById("sq2");
            sq2.style.position = "relative";  // ensure absolute child works
            sq2.appendChild(popup);

            // ✅ Position popup 1vh below ct
            popup.style.top  = (fieldDiv.offsetTop + fieldDiv.offsetHeight + window.innerHeight * 0.01) + "px";
            popup.style.left = fieldDiv.offsetLeft + "px";

              // ========================
              // Default display (Rise/Fall if available)
              // ========================
              let toggleIcon;
              if (data.callput) {
                updateMainDisplay(["CALL.svg","PUT.svg"], "Rise/Fall");
              } else {
                updateMainDisplay([], "Select Contract");
              }

              // ========================
              // Toggle logic
              // ========================
              let outsideHandler = null;
              const openPopup = () => {
                popup.style.display = "block";
                toggleIcon.src = "/static/icons/up.png";
                outsideHandler = (ev) => {
                  if (!popup.contains(ev.target) && !fieldDiv.contains(ev.target)) {
                    closePopup();
                  }
                };
                setTimeout(() => document.addEventListener("click", outsideHandler), 0);
              };

              const closePopup = () => {
                popup.style.display = "none";
                toggleIcon.src = "/static/icons/down.png";
                if (outsideHandler) {
                  document.removeEventListener("click", outsideHandler);
                  outsideHandler = null;
                }
              };

              const togglePopup = () => {
                if (popup.style.display === "none") openPopup();
                else closePopup();
              };

              fieldDiv.addEventListener("click", togglePopup);
              const pcsDiv = document.getElementById("pcs");
                if (pcsDiv) {
                  poppcs(pcsDiv);
                }
            }

            function poppcs(pcsDiv) {
              const ctDiv = document.getElementById("ct");
              if (!ctDiv) return;

              const ctText = ctDiv.innerText.trim();
              if (!ctText.includes("/")) {
                pcsDiv.innerText = ctText;
                return;
              }

              const [firstOpt, secondOpt] = ctText.split("/").map(s => s.trim());

              pcsDiv.innerHTML = "";
              pcsDiv.style.position = "relative";

              const textSpan = document.createElement("span");
              textSpan.style.marginLeft = "2vw";
              textSpan.innerText = firstOpt;
              pcsDiv.appendChild(textSpan);

              const toggleIcon = document.createElement("img");
              toggleIcon.src = "/static/icons/down.png";
              Object.assign(toggleIcon.style, {
                position: "absolute",
                right: "3vw",
                top: "50%",
                transform: "translateY(-50%)",
                width: "14px",
                height: "14px",
                cursor: "pointer"
              });
              pcsDiv.appendChild(toggleIcon);

              // 🔑 State
              let isPopupOpen = false;
              let popup = null;

              function closePopup() {
                if (popup) {
                  popup.remove();
                  popup = null;
                }
                toggleIcon.src = "/static/icons/down.png";
                isPopupOpen = false;
                document.removeEventListener("click", handleOutsideClick);
              }

              function handleOutsideClick(e) {
                if (popup && !popup.contains(e.target) && !pcsDiv.contains(e.target)) {
                  closePopup();
                }
              }

              function createOption(text) {
                const opt = document.createElement("div");
                opt.innerText = text;
                Object.assign(opt.style, {
                  width: "26vw",
                  textAlign: "left",
                  padding: "2vh 0 2vh 2vw", // left padding
                  fontSize: "13px",
                  cursor: "pointer",
                  backgroundColor: text === textSpan.innerText ? "rgba(0,0,0,0.07)" : "#fff"
                });

                // Hover effect
                opt.onmouseenter = () => {
                  if (text === textSpan.innerText) {
                    opt.style.backgroundColor = "rgba(0,0,0,0.15)"; // darker if selected
                  } else {
                    opt.style.backgroundColor = "rgba(0,0,0,0.25)"; // light grey if not selected
                  }
                };
                opt.onmouseleave = () => {
                  opt.style.backgroundColor = text === textSpan.innerText ? "rgba(0,0,0,0.07)" : "#fff";
                };

                opt.onclick = () => {
                  textSpan.innerText = text;
                  closePopup();
                };

                return opt;
              }

              function openPopup() {
                closePopup(); // clean slate
                popup = document.createElement("div");
                popup.id = "pcspopup";
                Object.assign(popup.style, {
                  position: "absolute",
                  top: pcsDiv.offsetTop + pcsDiv.offsetHeight + 5 + "px",
                  left: pcsDiv.offsetLeft + "px",
                  width: "28vw",
                  height: "12vh",
                  backgroundColor: "#fff",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  zIndex: "999"
                });

                popup.appendChild(createOption(firstOpt));
                popup.appendChild(createOption(secondOpt));

                pcsDiv.parentNode.insertBefore(popup, pcsDiv.nextSibling);

                toggleIcon.src = "/static/icons/up.png";
                isPopupOpen = true;

                // 📌 listen for outside clicks
                document.addEventListener("click", handleOutsideClick);
              }

              // Toggle on click
              pcsDiv.onclick = () => {
                if (isPopupOpen) closePopup();
                else openPopup();
              };
            }

            function popInitProfLoss(fieldDiv, withUSD = true) {
              fieldDiv.innerHTML = "";

              // Wrapper (relative so children can be absolute)
              Object.assign(fieldDiv.style, {
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                cursor: "pointer",
                transition: "border 0.1s ease",
                height: "7vh" // fix height for proper centering
              });

              // Hover effect
              fieldDiv.addEventListener("mouseenter", () => {
                fieldDiv.style.border = "1px solid black";
              });
              fieldDiv.addEventListener("mouseleave", () => {
                fieldDiv.style.border = "none";
              });

              // (-) button (absolute left)
              const minusBtn = document.createElement("button");
              minusBtn.innerText = "-";
              Object.assign(minusBtn.style, {
                position: "absolute",
                left: "0.5vw",
                border: "none",
                background: "transparent",
                fontSize: "16px",
                cursor: "pointer"
              });

              // Numeric value (absolute center)
              const numberSpan = document.createElement("span");
              numberSpan.innerText = "1";
              Object.assign(numberSpan.style, {
                fontSize: "12px",
                textAlign: "center",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                outline: "none"
              });
              numberSpan.contentEditable = true;

              // Right-side wrapper (absolute right)
              const rightWrapper = document.createElement("div");
              Object.assign(rightWrapper.style, {
                position: "absolute",
                right: "0.5vw",
                display: "flex",
                alignItems: "center",
                gap: "0.5vw"
              });

              // USD label
              const usdLabel = document.createElement("span");
              usdLabel.innerText = withUSD ? "USD" : "";
              Object.assign(usdLabel.style, {
                fontSize: "12px",
                fontWeight: "600"
              });

              // (+) button
              const plusBtn = document.createElement("button");
              plusBtn.innerText = "+";
              Object.assign(plusBtn.style, {
                border: "none",
                background: "transparent",
                fontSize: "16px",
                cursor: "pointer"
              });

              // Events
              plusBtn.addEventListener("click", () => {
                let val = parseInt(numberSpan.innerText) || 0;
                numberSpan.innerText = val + 1;
              });

              minusBtn.addEventListener("click", () => {
                let val = parseInt(numberSpan.innerText) || 0;
                if (val > 0) numberSpan.innerText = val - 1;
              });

              // Build structure
              rightWrapper.appendChild(usdLabel);
              rightWrapper.appendChild(plusBtn);

              fieldDiv.appendChild(minusBtn);
              fieldDiv.appendChild(numberSpan);
              fieldDiv.appendChild(rightWrapper);
            }

            function setupSellConditions(scField, sc2Field) {
              // === initial state
              let currentOption = "Take Profit";
              let popup = null;

              // Clear children
              scField.innerHTML = '';
              sc2Field.innerHTML = '';

              // Style scField
              Object.assign(scField.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              });

              // Label (left side)
              const scLabel = document.createElement('span');
              scLabel.innerText = currentOption;
              Object.assign(scLabel.style, {
                fontWeight: '700',
                fontSize: '12px',
                marginLeft: '2vw'
              });

              // Icon (right side)
              const scIcon = document.createElement('img');
              scIcon.src = '/static/icons/down.png';  // ✅ correct path
              Object.assign(scIcon.style, {
                width: '12px',
                height: '12px',
                marginRight: '2vw'
              });

              scField.appendChild(scLabel);
              scField.appendChild(scIcon);

              // === Popup (hidden by default, created once)
              popup = document.createElement('div');
              Object.assign(popup.style, {
                position: 'absolute',
                width: '28vw',
                height: '12vh',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                display: 'none',
                flexDirection: 'column',
                zIndex: 1000
              });

              // Options
              function makeOption(text, withUSD) {
                const opt = document.createElement('div');
                opt.innerText = text;
                Object.assign(opt.style, {
                  padding: '1vh 1vw',
                  cursor: 'pointer',
                  fontSize: '12px'
                });
                opt.addEventListener('click', () => {
                  currentOption = text;
                  scLabel.innerText = text;
                  popup.style.display = 'none';
                  scIcon.src = '/static/icons/down.png';
                  updateSC2(withUSD);
                });
                return opt;
              }

              popup.appendChild(makeOption("Take Profit", true));
              popup.appendChild(makeOption("Tick Count", false));

              // Append popup into sq3 (not scField)
              const sq3 = document.getElementById('sq3');
              sq3.appendChild(popup);

              // Reposition popup under scField
              function positionPopup() {
                const rect = scField.getBoundingClientRect();
                const parentRect = sq3.getBoundingClientRect();
                popup.style.top = `${rect.bottom - parentRect.top + 5}px`; // 5px gap
                popup.style.left = `${rect.left - parentRect.left}px`;
              }

              // Toggle popup on scField click
              scField.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = popup.style.display === 'block';
                if (!isOpen) positionPopup();
                popup.style.display = isOpen ? 'none' : 'block';
                scIcon.src = isOpen ? '/static/icons/down.png' : '/static/icons/up.png';
              });

              // Click outside closes popup
              document.addEventListener('click', (e) => {
                if (popup.style.display === 'block' && !scField.contains(e.target) && !popup.contains(e.target)) {
                  popup.style.display = 'none';
                  scIcon.src = '/static/icons/down.png';
                }
              });

              // === Update sc2 depending on selection
              function updateSC2(withUSD) {
                sc2Field.innerHTML = '';
                popInitProfLoss(sc2Field, withUSD);
              }

              // Initialize sc2
              updateSC2(true); // default Take Profit → with USD
            }

            function popGrowthRateDiv(fieldDiv) {

              // Load contract payloads
              const initqscon = JSON.parse(localStorage.getItem("initqscon") || "null");
              const subqscon  = JSON.parse(localStorage.getItem("subqscon")  || "null");
              const currentSymbol = localStorage.getItem("qssymbol") || "1HZ10V";

              let source = currentSymbol === "1HZ10V" ? initqscon : subqscon;
              if (!source || !source.data || !source.data.accumulator || !source.data.accumulator.contracts) {
                console.warn("⚠️ popGrowthRateDiv: no contracts data available", { currentSymbol, initqscon, subqscon });
                return;
              }

              const contracts = source.data.accumulator.contracts;
              if (!Array.isArray(contracts) || contracts.length === 0) {
                console.warn("⚠️ popGrowthRateDiv: contracts missing or empty");
                return;
              }

              const growthRateRange = contracts[0].growth_rate_range;
              if (!Array.isArray(growthRateRange) || growthRateRange.length === 0) {
                console.warn("⚠️ popGrowthRateDiv: growthRateRange missing or empty", growthRateRange);
                return;
              }

              // Convert to percentage strings
              const growthRateOptions = growthRateRange.map(rate => [`${rate * 100}%`, rate]);

              // Clear main div
              fieldDiv.innerHTML = "";
              fieldDiv.style.position = "relative";
              fieldDiv.style.display = "flex";
              fieldDiv.style.alignItems = "center";
              fieldDiv.style.cursor = "pointer";

              // Label (2vw left)
              const label = document.createElement("span");
              Object.assign(label.style, {
                fontWeight: "700",
                fontSize: "12px",
                marginLeft: "2vw",
                flexGrow: "1"
              });

              // Load saved selection or fallback to first
              const savedValue = localStorage.getItem("growthRateSelected");
              const validSaved = growthRateOptions.find(opt => opt[1] == savedValue);
              let currentValue = validSaved ? validSaved[1] : growthRateOptions[0][1];
              label.innerText = `${currentValue * 100}%`;

              // Down arrow (2vw right)
              let toggleIcon = document.createElement("img");
              toggleIcon.src = "/static/icons/down.png";
              Object.assign(toggleIcon.style, {
                width: "14px",
                height: "14px",
                marginRight: "2vw"
              });

              fieldDiv.appendChild(label);
              fieldDiv.appendChild(toggleIcon);

              // === Popup ===
              const popupId = `growthRatePopup_${fieldDiv.id || Math.random().toString(36).slice(2,6)}`;
              const existing = document.getElementById(popupId);
              if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

              const popup = document.createElement("div");
              popup.id = popupId;
              Object.assign(popup.style, {
                width: "28vw",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                position: "absolute",
                zIndex: "10000",
                display: "none",
                flexDirection: "column",
                boxSizing: "border-box"
              });

              // Add options
              growthRateOptions.forEach(([txt, val]) => {
                const opt = document.createElement("div");
                opt.innerText = txt;
                Object.assign(opt.style, {
                  height: "5vh",
                  lineHeight: "5vh",
                  padding: "0 1vw",
                  fontSize: "12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                });
                opt.addEventListener("click", (e) => {
                  e.stopPropagation();
                  currentValue = val;
                  label.innerText = txt;
                  localStorage.setItem("growthRateSelected", val); // save
                  closePopup();
                });
                popup.appendChild(opt);
              });

              // Append popup to parent container (sq2 or sq3)
              const sq2 = document.getElementById("sq2");
              if (sq2) {
                sq2.style.position = "relative";
                sq2.appendChild(popup);
              }

              // Position popup below fieldDiv
              popup.style.top  = (fieldDiv.offsetTop + fieldDiv.offsetHeight + window.innerHeight * 0.01) + "px";
              popup.style.left = fieldDiv.offsetLeft + "px";

              // Toggle popup
              let outsideHandler = null;
              const openPopup = () => {
                popup.style.display = "flex";
                toggleIcon.src = "/static/icons/up.png";
                outsideHandler = (ev) => {
                  if (!popup.contains(ev.target) && !fieldDiv.contains(ev.target)) {
                    closePopup();
                  }
                };
                setTimeout(() => document.addEventListener("click", outsideHandler), 0);
              };

              const closePopup = () => {
                popup.style.display = "none";
                toggleIcon.src = "/static/icons/down.png";
                if (outsideHandler) {
                  document.removeEventListener("click", outsideHandler);
                  outsideHandler = null;
                }
              };

              const togglePopup = () => {
                if (popup.style.display === "none") openPopup();
                else closePopup();
              };

              fieldDiv.addEventListener("click", togglePopup);
            }

            function popDurationDiv(labelDiv, numericDiv) {

              // 1) Load contracts from localStorage
              const initqscon = JSON.parse(localStorage.getItem("initqscon") || "null");
              const subqscon  = JSON.parse(localStorage.getItem("subqscon")  || "null");
              const currentSymbol = localStorage.getItem("qssymbol") || "1HZ10V";

              const source = currentSymbol === "1HZ10V" ? initqscon : subqscon;
              if (!source || !source.data) {
                console.warn("⚠️ popDurationDiv: no contracts data available", { currentSymbol, initqscon, subqscon });
                return;
              }

              // 2) Read selected contract type from #ct
              const ctDiv = document.getElementById("ct");
              if (!ctDiv) {
                console.warn("⚠️ popDurationDiv: #ct div not found");
                return;
              }
              const ctText = ctDiv.innerText.trim();

              // 3) Map ct text -> contract category key
              const mapping = {
                "Rise/Fall": "callput",
                "Rise/Fall Equal": "callputequal",
                "Higher/Lower": "callput", // add other mappings as needed
                "Asians": "asian"
                // extend this with all categories you support
              };

              const categoryKey = mapping[ctText];
              if (!categoryKey || !source.data[categoryKey]) {
                console.warn("⚠️ popDurationDiv: unsupported ctText or missing category", { ctText, categoryKey });
                return;
              }

              const contracts = source.data[categoryKey].contracts || [];
              if (contracts.length === 0) {
                console.warn("⚠️ popDurationDiv: no contracts in category", categoryKey);
                return;
              }

              // 4) Collect duration ranges from contracts
              const durationOptions = [];
              const smallestValues = { t: null, s: null, m: null, h: null, d: null };
              const seen = new Set();

              contracts.forEach(c => {
                if (!c.min_contract_duration || !c.max_contract_duration) return;

                // Deriv durations are like "365d", "1d"
                const minUnit = c.min_contract_duration.slice(-1); // d/h/m/s/t
                const minVal  = parseInt(c.min_contract_duration, 10);

                if (!seen.has(minUnit)) {
                  durationOptions.push({ name: minUnit.toUpperCase(), value: minUnit });
                  seen.add(minUnit);
                }

                if (smallestValues[minUnit] === null || minVal < smallestValues[minUnit]) {
                  smallestValues[minUnit] = minVal;
                }
              });

              if (durationOptions.length === 0) {
                console.warn("⚠️ popDurationDiv: no valid duration options", contracts);
                return;
              }

              // 5) Setup label UI
              labelDiv.innerHTML = "";
              labelDiv.style.position = "relative";
              labelDiv.style.display = "flex";
              labelDiv.style.alignItems = "center";
              labelDiv.style.cursor = "pointer";

              const label = document.createElement("span");
              Object.assign(label.style, {
                fontWeight: "700",
                fontSize: "12px",
                marginLeft: "2vw",
                flexGrow: "1"
              });

              const savedUnit = localStorage.getItem("duration_unit");
              const validSaved = durationOptions.find(opt => opt.value === savedUnit);
              let currentUnit = validSaved ? savedUnit : durationOptions[0].value;
              label.innerText = durationOptions.find(opt => opt.value === currentUnit).name;

              const toggleIcon = document.createElement("img");
              toggleIcon.src = "/static/icons/down.png";
              Object.assign(toggleIcon.style, {
                width: "14px",
                height: "14px",
                marginRight: "2vw"
              });

              labelDiv.appendChild(label);
              labelDiv.appendChild(toggleIcon);

              // 6) Popup
              const popup = document.createElement("div");
              Object.assign(popup.style, {
                width: "28vw",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                position: "absolute",
                top: "100%",
                left: "0",
                marginTop: "1vh",
                zIndex: "1000",
                display: "none",
                flexDirection: "column",
                boxSizing: "border-box"
              });

              durationOptions.forEach(opt => {
                const item = document.createElement("div");
                item.innerText = opt.name;
                Object.assign(item.style, {
                  height: "5vh",
                  lineHeight: "5vh",
                  padding: "0 1vw",
                  fontSize: "12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                });
                item.addEventListener("click", e => {
                  e.stopPropagation();
                  currentUnit = opt.value;
                  label.innerText = opt.name;
                  localStorage.setItem("duration_unit", currentUnit);
                  updateNumericField(currentUnit);
                  closePopup();
                });
                popup.appendChild(item);
              });

              labelDiv.appendChild(popup);

              // 7) Toggle popup
              let outsideHandler = null;
              const openPopup = () => {
                popup.style.display = "flex";
                toggleIcon.src = "/static/icons/up.png";
                outsideHandler = ev => {
                  if (!popup.contains(ev.target) && !labelDiv.contains(ev.target)) {
                    closePopup();
                  }
                };
                setTimeout(() => document.addEventListener("click", outsideHandler), 0);
              };
              const closePopup = () => {
                popup.style.display = "none";
                toggleIcon.src = "/static/icons/down.png";
                if (outsideHandler) {
                  document.removeEventListener("click", outsideHandler);
                  outsideHandler = null;
                }
              };
              labelDiv.addEventListener("click", () => {
                if (popup.style.display === "none") openPopup();
                else closePopup();
              });

                // 8) Numeric field
                function updateNumericField(unit) {
                  numericDiv.innerHTML = "";

                  // Wrapper flexbox
                  Object.assign(numericDiv.style, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 0.5vw",  // ⬅️ buttons will be 0.5vw from edges
                    boxSizing: "border-box",
                    position: "relative"
                  });

                  // Hover effect
                  numericDiv.addEventListener("mouseenter", () => {
                    numericDiv.style.border = "1px solid black";
                  });
                  numericDiv.addEventListener("mouseleave", () => {
                    numericDiv.style.border = "none";
                  });

                  // (-) button
                  const minusBtn = document.createElement("button");
                  minusBtn.innerText = "-";
                  Object.assign(minusBtn.style, {
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",    // match the other function
                    cursor: "pointer"
                  });

                  // Number input
                  const input = document.createElement("input");
                  Object.assign(input.style, {
                    textAlign: "center",
                    fontSize: "12px",    // ⬅️ smaller (like you asked for)
                    border: "none",
                    outline: "none",
                    width: "40px",       // fixed width keeps it centered nicely
                    margin: "0 0.5vw"    // balanced spacing between buttons
                  });
                  input.type = "number";

                  // Default/saved value
                  const savedValue = localStorage.getItem("duration_value");
                  if (savedValue && !isNaN(savedValue)) {
                    input.value = savedValue;
                  } else {
                    input.value = smallestValues[unit] || 1;
                  }

                  // Save on typing
                  input.addEventListener("input", () => {
                    localStorage.setItem("duration_value", input.value);
                  });

                  // (+) button
                  const plusBtn = document.createElement("button");
                  plusBtn.innerText = "+";
                  Object.assign(plusBtn.style, {
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    cursor: "pointer"
                  });

                  // Event listeners for +/- clicks
                  plusBtn.addEventListener("click", () => {
                    let val = parseInt(input.value) || 0;
                    input.value = val + 1;
                    localStorage.setItem("duration_value", input.value);
                  });

                  minusBtn.addEventListener("click", () => {
                    let val = parseInt(input.value) || 0;
                    if (val > 1) {  // prevent going below 1
                      input.value = val - 1;
                      localStorage.setItem("duration_value", input.value);
                    }
                  });

                  // Build structure
                  numericDiv.appendChild(minusBtn);
                  numericDiv.appendChild(input);
                  numericDiv.appendChild(plusBtn);
                }

                // initialize with current unit
                updateNumericField(currentUnit);

            }

            // helper to create a label (with i.svg) and a following field div
            function createLabelAndField(parent, labelText, fieldId, opts = {}) {
              const { bold = true, iconLeft = true, iconAfter = false, optionalText = '' } = opts;

              const isMobile = window.innerWidth < 700;

              // Label row
              const labelRow = document.createElement('div');
              Object.assign(labelRow.style, {
                display: 'flex',
                alignItems: 'center',
                gap: '0.6vw',
                marginTop: '1vh',
                marginLeft: isMobile ? '1%' : '0',   // ✅ only apply margin on small screens
                fontSize: '12px',
                fontWeight: bold ? '700' : '400',
                color: '#000',
                width: '98%'                           // ✅ always 95% width
              });

              const textSpan = document.createElement('span');
              textSpan.innerHTML = `${labelText}${optionalText ? ' <span style="font-weight:400">' + optionalText + '</span>' : ''}`;
              labelRow.appendChild(textSpan);

              if (iconLeft) {
                labelRow.appendChild(createInfoIcon());
              }

              if (iconAfter) {
                const afterIcon = createInfoIcon();
                afterIcon.style.marginLeft = '0.6vw';
                labelRow.appendChild(afterIcon);
              }

              parent.appendChild(labelRow);

              // Field div
              const fieldDiv = document.createElement('div');
              fieldDiv.id = fieldId;
              Object.assign(fieldDiv.style, {
                marginTop: '0.6vh',
                marginLeft: isMobile ? '1%' : '0',   // ✅ only margin on small screens
                width: '98%',                          // ✅ always 95% width
                height: '8vh',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxSizing: 'border-box',
                padding: '0.6vh 0vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              });

              parent.appendChild(fieldDiv);

              // special population rules
              if (labelText === "Contract type" && fieldId === "ct") {
                popctdiv(fieldDiv);
              }

              if (labelText === "Purchase conditions" && fieldId === "pcs") {
                poppcs(fieldDiv);
              }

              if (fieldId === "initStake" || fieldId === "profitThresh" || fieldId === "lossThresh") {
                popInitProfLoss(fieldDiv, true); // with USD
              }

              if (fieldId === "sizeOrUnit" || fieldId === "size" || fieldId === "unit") {
                popInitProfLoss(fieldDiv, false); // no USD
              }

              if (labelText === "Growth rate" && fieldId === "growthRate") {
                popGrowthRateDiv(fieldDiv);
              }

              return fieldDiv;
            }

            // sq1 (summary)
            const sq1 = document.createElement('div');
            Object.assign(sq1.style, {
              marginTop: '3vh',
              width: window.innerWidth < 700 ? '100%' : '30vw',  // responsive
              height: '10vh',
              backgroundColor: '#e5e5e5',
              padding: '1vh 1vw',
              boxSizing: 'border-box'
            });

            sq1.innerHTML = `
              <div style="display:flex; justify-content:space-between; font-size:14px; width:${window.innerWidth < 700 ? '90%' : '100%'};">
                <span style="margin-left:1vw;">Trade type</span>
                <span style="font-weight:bold; color:#000;">${category}</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:1vh; width:${window.innerWidth < 700 ? '90%' : '100%'};">
                <span style="margin-left:1vw;">Strategy</span>
                <span style="font-weight:bold; color:#000;">${strategy}</span>
              </div>`;

            qsw5.appendChild(sq1);

            // sq2 (assets + extra fields)
            const sq2 = document.createElement('div');
            sq2.id = "sq2";

            const isMobile = window.innerWidth < 700;

            Object.assign(sq2.style, {
              marginTop: '3vh',
              width: isMobile ? '100%' : '30vw',
              height: 'auto',
              backgroundColor: '#e5e5e5',
              padding: '1vh 1vw',
              boxSizing: 'border-box',
              position: 'relative'
            });

            // Assets label
            const assetsLabelRow = document.createElement('div');
            Object.assign(assetsLabelRow.style, {
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              fontWeight: '700',
              width: isMobile ? '95%' : '100%',
              marginLeft: isMobile ? '2vw' : '0'   // ✅ only mobile gets margin
            });
            const assetsLabel = document.createElement('span');
            assetsLabel.innerText = 'Assets';
            const infoIcon = createInfoIcon();
            infoIcon.style.marginLeft = '0.5vw';
            assetsLabelRow.appendChild(assetsLabel);
            assetsLabelRow.appendChild(infoIcon);
            sq2.appendChild(assetsLabelRow);

            // sq2Assets
            const sq2Assets = document.createElement('div');
            Object.assign(sq2Assets.style, {
              marginTop: '1vh',
              width: '98%', //isMobile ? '95%' : '28vw',
              height: '8vh',
              backgroundColor: '#fff',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              overflow: 'hidden',
              marginLeft: isMobile ? '1%' : '0'   // ✅ only mobile gets margin
            });
            sq2.appendChild(sq2Assets);

            qsw5.appendChild(sq2);

            // Popup container
            const popupId = `sq2Assets_popup_${Math.random().toString(36).slice(2, 8)}`;
            const sq2Assets_popup = document.createElement('div');
            sq2Assets_popup.id = popupId;
            Object.assign(sq2Assets_popup.style, {
              display: 'none',
              position: 'absolute',
              top: '13vh',
              width: '94%', //isMobile ? '90%' : '27.6vw',
              paddingLeft: '0vw',
              maxHeight: '35vh',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '5px',
              overflowY: 'auto',
              zIndex: '100',
              marginLeft: isMobile ? '1%': '0'   // ✅ only mobile gets margin
            });
            sq2.appendChild(sq2Assets_popup);

            // sq3
            const sq3 = document.createElement('div');
            sq3.id = "sq3";
            Object.assign(sq3.style, {
              marginTop: '3vh',
              width: isMobile ? '100%' : '30vw',
              height: 'auto',
              backgroundColor: '#e5e5e5',
              padding: '1vh 1vw',
              boxSizing: 'border-box'
            });
            qsw5.appendChild(sq3);

          // --- Populate Data ---
          let submarketsToShow = [];
          if (category === 'Accumulators') {
            submarketsToShow = [ { market: 'Derived', sub: 'Continuous Indices' } ];
          } else if (category === 'Options') {
            submarketsToShow = [
              // Derived
              { market: 'Derived', sub: 'Continuous Indices' },
              { market: 'Derived', sub: 'Forex Basket' },
              { market: 'Derived', sub: 'Commodities Basket' },
              { market: 'Derived', sub: 'Jump Indices' },
              { market: 'Derived', sub: 'Range Break Indices' },
              { market: 'Derived', sub: 'Crash/Boom Indices' },
              { market: 'Derived', sub: 'Step Indices' },
              { market: 'Derived', sub: 'Daily Reset Indices' },

              // Forex
              { market: 'Forex', sub: 'Major Pairs' },
              { market: 'Forex', sub: 'Minor Pairs' },

              // Stock Indices
              { market: 'Stock Indices', sub: 'Asian indices' },
              { market: 'Stock Indices', sub: 'European indices' },
              { market: 'Stock Indices', sub: 'American indices' },

              // Commodities
              { market: 'Commodities', sub: 'Metals' },

              // Crypto
              { market: 'Cryptocurrencies', sub: 'Cryptocurrencies' }
            ];
          }

          const toggleIcon = document.createElement('img');

          // Default: first symbol from first submarket
          let defaultSymbol = null;
          for (const { market, sub } of submarketsToShow) {
            const symbols = activeSymbols?.[market]?.submarkets?.[sub]?.symbols || [];
            if (symbols.length > 0) {
              defaultSymbol = symbols[0];
              break;
            }
          }

          if (defaultSymbol) {
            renderCurrentSymbol(sq2Assets, defaultSymbol, toggleIcon, sq2Assets_popup);
          }

          // Build popup content
          submarketsToShow.forEach(({ market, sub }) => {
            const subHeader = document.createElement('div');
            subHeader.innerText = sub;
            Object.assign(subHeader.style, {
              fontWeight: 'bold',
              fontSize: '13px',
              padding: '5px 10px',
              textAlign: 'center',
              color: 'rgba(255, 0, 0, 0.7)',
              height: '3vh'
            });
            sq2Assets_popup.appendChild(subHeader);

            const symbols = activeSymbols?.[market]?.submarkets?.[sub]?.symbols || [];
            symbols.forEach((sym) => {
              sq2Assets_popup.appendChild(buildSymbolRow(sym, sq2Assets, toggleIcon, sq2Assets_popup));
            });
          });

          // --- Additional fields for Accumulators & strategy-specific layout ---
          const martingaleSet = new Set([
            'Martingale',
            'Martingale on Stat Reset',
            'Reverse Martingale',
            'Reverse Martingale on Stat Reset'
          ]);
          const dAlembertSet = new Set([
            "D’Alembert",
            "D'Alembert on Stat Reset",
            "Reverse D'Alembert",
            "Reverse D'Alembert on Stat Reset"
          ]);

            // If category is Accumulators and strategy is in either set, add the fields
            if (category === 'Accumulators' && (martingaleSet.has(strategy) || dAlembertSet.has(strategy))) {
              // 1) Under sq2: Initial stake, Growth rate
              createLabelAndField(sq2, 'Initial stake', 'initStake');
              createLabelAndField(sq2, 'Growth rate', 'growthRate');

              // 2) In sq3: Profit threshold -> Loss threshold -> Size/Unit -> Sell conditions (two fields) -> Max stake (optional)
              sq3.innerHTML = ''; // clear default

              createLabelAndField(sq3, 'Profit threshold', 'profitThresh');
              createLabelAndField(sq3, 'Loss threshold', 'lossThresh');

              // Size vs Unit
              const sizeLabel = dAlembertSet.has(strategy) ? 'Unit' : 'Size';
              createLabelAndField(sq3, sizeLabel, 'sizeOrUnit');

            // Sell conditions: two separate divs
            const sellLabel = document.createElement('div');
            Object.assign(sellLabel.style, {
              display: 'flex',
              alignItems: 'center',
              gap: '0.6vw',
              marginTop: '1vh',
              fontSize: '12px',
              fontWeight: '700'
            });

            const sellText = document.createElement('span');
            sellText.innerText = 'Sell conditions';
            sellLabel.appendChild(sellText);
            sellLabel.appendChild(createInfoIcon());

            // ✅ Responsive margin-left for label
            if (window.innerWidth < 700) {
              sellLabel.style.marginLeft = '1%';
            }

            sq3.appendChild(sellLabel);

            // sc and sc2 fields
            const scField = document.createElement('div');
            scField.id = 'sc';
            Object.assign(scField.style, {
              marginTop: '0.6vh',
              width: window.innerWidth < 700 ? '98%' : '28vw',
              height: '8vh',
              backgroundColor: '#fff',
              borderRadius: '5px',
              boxSizing: 'border-box',
              padding: '0.6vh 1vw'
            });

            // ✅ Responsive margin-left
            if (window.innerWidth < 700) {
              scField.style.marginLeft = '1%';
            }

            sq3.appendChild(scField);

            const sc2Field = document.createElement('div');
            sc2Field.id = 'sc2';
            Object.assign(sc2Field.style, {
              marginTop: '1vh',
              width: window.innerWidth < 700 ? '98%' : '28vw',
              height: '8vh',
              backgroundColor: '#fff',
              borderRadius: '5px',
              boxSizing: 'border-box',
              padding: '0.6vh 1vw'
            });

            // ✅ Responsive margin-left
            if (window.innerWidth < 700) {
              sc2Field.style.marginLeft = '1%';
            }

            sq3.appendChild(sc2Field);

            // ✅ Now hook up the behavior
            setupSellConditions(scField, sc2Field);

            // === Max stake row with toggle ===
            const maxLabelRow = document.createElement('div');
            Object.assign(maxLabelRow.style, {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // push toggle right
              marginTop: '1vh',
              fontSize: '12px',
              width: window.innerWidth < 700 ? '98%' : '28vw'
            });

            // ✅ Responsive margin-left
            if (window.innerWidth < 700) {
              maxLabelRow.style.marginLeft = '1%';
            }

            // Left group (label + optional + info)
            const leftGroup = document.createElement('div');
            Object.assign(leftGroup.style, {
              display: 'flex',
              alignItems: 'center',
              gap: '0.6vw'
            });

            const maxBold = document.createElement('span');
            maxBold.style.fontWeight = '700';
            maxBold.innerText = 'Max stake';

            const optionalSpan = document.createElement('span');
            optionalSpan.style.fontWeight = '400';
            optionalSpan.style.marginLeft = '0.4vw';
            optionalSpan.innerText = '(optional)';

            const maxIcon = createInfoIcon();

            leftGroup.appendChild(maxBold);
            leftGroup.appendChild(optionalSpan);
            leftGroup.appendChild(maxIcon);

            // Right group (toggle switch)
            const toggleWrapper = document.createElement('label');
            toggleWrapper.className = 'dc-toggle-switch__label';

            const toggleBtn = document.createElement('span');
            toggleBtn.className = 'dc-toggle-switch__button';

            toggleWrapper.appendChild(toggleBtn);

            // Put left + right inside row
            maxLabelRow.appendChild(leftGroup);
            maxLabelRow.appendChild(toggleWrapper);

            sq3.appendChild(maxLabelRow);

              // Max stake input field
              const maxField = document.createElement('div');
              maxField.id = 'maxStake';
              Object.assign(maxField.style, {
                marginTop: '0.6vh',
                width: '28vw',
                height: '8vh',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxSizing: 'border-box',
                padding: '0.6vh 1vw'
              });
              //sq3.appendChild(maxField);

              // Toggle event listener
              toggleWrapper.addEventListener('click', () => {
                toggleWrapper.classList.toggle('active');
              });
            }

          // === final assembly (if not already assembled elsewhere) ===
          // Note: original code appended qsw5 etc outside the function; keep same behavior.

            // === Category Handling ===
            if (category === 'Options') {
              // Under sq2
              createLabelAndField(sq2, 'Contract type', 'ct');
              createLabelAndField(sq2, 'Purchase conditions', 'pcs');
              createLabelAndField(sq2, 'Initial stake', 'initStake');

            // Sell conditions: two separate divs
            const isMobile = window.innerWidth < 700;

            // Label row
            const durationLabe = document.createElement('div');
            Object.assign(durationLabe.style, {
              display: 'flex',
              alignItems: 'center',
              gap: '0.6vw',
              marginTop: '1vh',
              fontSize: '12px',
              fontWeight: '700',
              marginLeft: isMobile ? '1%' : '0',   // ✅ shift inside only on mobile
              width: isMobile ? '98%' : '100%'     // keep consistent
            });
            const durationLabeText = document.createElement('span');
            durationLabeText.innerText = 'Duration';
            durationLabe.appendChild(durationLabeText);
            durationLabe.appendChild(createInfoIcon());
            sq2.appendChild(durationLabe);

            // First field
            const durationLabel = document.createElement('div');
            durationLabel.id = 'durationLabel';
            Object.assign(durationLabel.style, {
              marginTop: '1vh',
              width: isMobile ? '98%' : '28vw',
              height: '8vh',
              backgroundColor: '#fff',
              borderRadius: '5px',
              paddingLeft: '1vw',
              boxSizing: 'border-box',
              marginLeft: isMobile ? '1%' : '0'   // ✅ shift inside only on mobile
            });
            sq2.appendChild(durationLabel);

            // Second field
            const d1 = document.createElement('div');
            d1.id = 'd1';
            Object.assign(d1.style, {
              marginTop: '1vh',
              width: isMobile ? '98%' : '28vw',
              height: '8vh',
              backgroundColor: '#fff',
              borderRadius: '5px',
              paddingLeft: '1vw',
              boxSizing: 'border-box',
              marginLeft: isMobile ? '1%' : '0'   // ✅ shift inside only on mobile
            });
            sq2.appendChild(d1);

            popDurationDiv(durationLabel, d1);

              const d2 = document.createElement('div');
              d2.id = 'd2';
              Object.assign(d2.style, {
                marginTop: '1vh',
                width: '28vw',
                height: '8vh',
                backgroundColor: '#fff',
                borderRadius: '5px',
                paddingLeft: '1vw',
                boxSizing: 'border-box'
              });
              //sq2.appendChild(d2);

              // In sq3
              createLabelAndField(sq3, 'Profit threshold', 'profitThresh');
              createLabelAndField(sq3, 'Loss threshold', 'lossThresh');

              const martingaleSet = new Set(['Martingale', 'Reverse Martingale']);
              const dAlembertSet = new Set(["D’Alembert", "Reverse D’Alembert"]);
              const oscarsGrind = "Oscar’s Grind";
              const oneThreeTwoSix = "1-3-2-6";

              if (martingaleSet.has(strategy)) {
                createLabelAndField(sq3, 'Size', 'size');
              } else if (dAlembertSet.has(strategy)) {
                createLabelAndField(sq3, 'Unit', 'unit');
              }

              if (strategy !== oneThreeTwoSix) {
                // Max stake row with optional span + info icon + toggle switch
                const maxLabelRow = document.createElement('div');
                Object.assign(maxLabelRow.style, {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // text left, toggle right
                  marginTop: '1vh',
                  fontSize: '12px',
                  width: window.innerWidth < 700 ? '98%' : '28vw'
                });

                // Left side group (text + optional + info)
                const leftGroup = document.createElement('div');
                Object.assign(leftGroup.style, {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6vw'
                });

                const maxBold = document.createElement('span');
                maxBold.style.fontWeight = '700';
                maxBold.innerText = 'Max stake';

                // ✅ apply margin-left only if <700px
                if (window.innerWidth < 700) {
                  maxBold.style.marginLeft = '1%';
                }

                const optionalSpan = document.createElement('span');
                optionalSpan.style.fontWeight = '400';
                optionalSpan.style.marginLeft = '0.4vw';
                optionalSpan.innerText = '(optional)';

                const infoIcon = createInfoIcon();

                leftGroup.appendChild(maxBold);
                leftGroup.appendChild(optionalSpan);
                leftGroup.appendChild(infoIcon);

                // Right side: toggle switch
                const toggleWrapper = document.createElement('label');
                toggleWrapper.className = 'dc-toggle-switch__label';

                const toggleBtn = document.createElement('span');
                toggleBtn.className = 'dc-toggle-switch__button';
                toggleWrapper.appendChild(toggleBtn);

                // Append both groups into row
                maxLabelRow.appendChild(leftGroup);
                maxLabelRow.appendChild(toggleWrapper);

                sq3.appendChild(maxLabelRow);

                // Toggle behavior
                toggleWrapper.addEventListener('click', () => {
                  toggleWrapper.classList.toggle('active');
                  console.log(
                    "Max stake toggle:",
                    toggleWrapper.classList.contains('active')
                  );
                });

              }
            }
        }

        if (window.innerWidth >= 700) {
            // ===== Desktop: overlay =====
            qsw.appendChild(qsw1);
            qsw2.appendChild(contentWrap); // contains qsw3 + qsw5
            //qsw2.appendChild(qsw6);        // bottom bar
            qsw.appendChild(qsw2);
            overlay.appendChild(qsw);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    localStorage.setItem("qson", "false");
                }
            });
        } else {
            // ===== Mobile: directly inside rub =====
            let rub = document.getElementById("rub");
            if (!rub) return;

            // ✅ Force rub height
            rub.style.height = "82vh";

            // ✅ Remove rstool if present
            let rstool = document.getElementById("rstool");
            if (rstool && rub.contains(rstool)) {
                rub.removeChild(rstool);
            }

            // Ensure outer wrapper exists
            let outer = document.getElementById("outerqsw2");
            if (!outer) {
                outer = document.createElement("div");
                outer.id = "outerqsw2";
                rub.appendChild(outer);
            }

            // Clear previous content
            outer.innerHTML = "";

            // Append child elements inside qsw2
            qsw2.appendChild(contentWrap); // contains qsw3 + qsw5
            //qsw2.appendChild(qsw6);        // bottom bar

            // Now append qsw2 into outer
            outer.appendChild(qsw2);

            // ✅ Style outer wrapper for full-width top panel
            Object.assign(outer.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "82vh",
                backgroundColor: "#fff",
                overflow: "auto",
                padding: "1vh",
                zIndex: "5000",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                borderRadius: "0",
                boxShadow: "none"
            });

            // Style qsw2 to take full width of outer
            Object.assign(qsw2.style, {
                width: "100%",
                margin: "0 auto",
                display: "block"
            });

            // Hide result window if present
            if (resultWindow && rub.contains(resultWindow)) {
                resultWindow.style.display = "none";
            }
        }

        function placeQuickStrategy() {
            const rub = document.getElementById("rub");
            if (!rub || !isQSon) return;

            const currentWidth = window.innerWidth;

            if (currentWidth < 700) {
                // 📱 MOBILE: outer container + qsw2
                let outer = document.getElementById("outerqsw2");
                if (!outer) {
                    outer = document.createElement("div");
                    outer.id = "outerqsw2";
                    rub.appendChild(outer);
                }

                // Style outerqsw2
                const outerWidth = Math.min(400, currentWidth);
                Object.assign(outer.style, {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: outerWidth + "px",
                    maxWidth: "100vw",
                    height: "73vh",
                    backgroundColor: "#fff",
                    overflow: "auto",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    zIndex: "5000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                });

                // Add qsw2 inside outer, full width
                let qsw2 = document.getElementById("qsw2");
                if (!qsw2) {
                    qsw2 = document.createElement("div");
                    qsw2.id = "qsw2";
                    qsw2.innerHTML = "<div style='padding:12px'>Quick Strategy 2 (loading...)</div>";
                }

                outer.innerHTML = "";
                outer.appendChild(qsw2);
                Object.assign(qsw2.style, {
                    width: "100%",
                    height: "100%",
                    display: "block",
                });

                // Hide resultWindow if present
                if (resultWindow && rub.contains(resultWindow)) {
                    resultWindow.style.display = "none";
                }

                // Remove any desktop overlay
                const overlay = document.getElementById("qswOverlay");
                if (overlay) overlay.remove();

            } else {
                // 🖥️ DESKTOP: overlay with qsw
                const outer = document.getElementById("outerqsw2");
                if (outer) outer.remove(); // remove mobile container

                let overlay = document.getElementById("qswOverlay");
                if (!overlay) {
                    overlay = document.createElement("div");
                    overlay.id = "qswOverlay";
                    Object.assign(overlay.style, {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "10000",
                    });
                    document.body.appendChild(overlay);

                    overlay.addEventListener("click", (e) => {
                        if (e.target === overlay) {
                            overlay.remove();
                            localStorage.setItem("qson", "false");
                        }
                    });
                }

                // Ensure qsw exists
                let qsw = document.getElementById("qsw");
                if (!qsw) {
                    qsw = document.createElement("div");
                    qsw.id = "qsw";
                    qsw.innerHTML = "<div style='padding:12px'>Quick Strategy (loading...)</div>";
                }

                overlay.innerHTML = "";
                overlay.appendChild(qsw);

                Object.assign(qsw.style, {
                    width: "400px",
                    maxWidth: "90vw",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                });
            }
        }
    }
    // Second Options Div
    const secondOptionsDiv = document.createElement('div');
    secondOptionsDiv.id = 'secondOptionsDiv';
    secondOptionsDiv.style = `
        //position: absolute;
        position: relative;
        width: 36.2vw;
        height: 9vh;
        //background-color: white;
        background-color: var(--bg-color);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        top: 0vh;
    `;

    // sODiv inside secondOptionsDiv
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
        //width: 28.8vw;
        border-radius: 4px;
        position: relative;
        z-index: 10;
    `;
    secondOptionsDiv.appendChild(sODiv);
    optionsDiv.appendChild(secondOptionsDiv);

    // Responsive Icon Groups
    Object.entries(iconGroups).forEach(([id, icons], index) => {
        const groupDiv = document.createElement('div');
        groupDiv.id = id;

        const widths = ['50%', '25%', '25%']; //, '20%'];
        const borderLeft = index > 0 ? 'border-left: 0.5px solid rgba(128, 128, 128, 0.5);' : '';
        groupDiv.classList.add('icon-group');
        groupDiv.style.cssText = `
            display: flex;
            align-items: center;
            //justify-content: flex-start;
            justify-content: space-evenly; /* 👈 Evenly space icons */
            width: ${widths[index]};
            height: 5vh;
            ${borderLeft}
            box-sizing: border-box;
        `;

        icons.forEach(iconName => groupDiv.appendChild(createIcon(iconName)));
        sODiv.appendChild(groupDiv);
    });

    // Append optionsDiv to wrapper
    const wrapper = document.getElementById('blocklyWrapper');
    wrapper.appendChild(optionsDiv);

    function updateLayout() {
        if (window.innerWidth < 700) {
            // Enable scroll
            optionsDiv.style.overflowX = 'auto';
            optionsDiv.style.overflowY = 'hidden';
            optionsDiv.style.width = '100%';
            optionsDiv.classList.add('hide-scrollbar');

            [...optionsDiv.children].forEach(child => {
                child.style.flexShrink = '0';
            });

            // Quick Strategy Button
            quickStrategyBtn.style.width = '100px';
            quickStrategyBtn.style.left = '0px';

            // Second Options Div
            secondOptionsDiv.style.width = '289px';
            secondOptionsDiv.style.marginLeft = '10px'; // <-- gap for small screens

            // sODiv width
            sODiv.style.width = '289px';

        } else {
            // Disable scroll
            optionsDiv.style.overflowX = 'hidden';
            optionsDiv.style.overflowY = 'hidden';
            optionsDiv.style.width = '54.5vw';
            optionsDiv.classList.remove('hide-scrollbar');

            quickStrategyBtn.style.width = '16.1vw';
            quickStrategyBtn.style.left = '0.7vw';

            secondOptionsDiv.style.width = '36.2vw';
            secondOptionsDiv.style.marginLeft = '1.45vw'; // <-- gap for large screens

            sODiv.style.width = '36.2vw';
        }
    }

    // Listen for resize + run once
    window.addEventListener('resize', updateLayout);
    updateLayout();

}

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

document.addEventListener("DOMContentLoaded", function () {
    if (typeof initResultWindowToggle === "function") {
        initResultWindowToggle();
    }
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
                } catch (error) {
                    console.error("Error during block move: ", error);
                }

                isDragging = false;
                addedBlock = null;
            }, { once: true });
        }
    });
}

const blockData = {
    'tradeparameters': `Trade parameters
Here is where you define the parameters of your contract.
Learn more`,

    'virtual_hook': `Virtual Hook
Virtual Hook is an innovative trading tool designed to enhance the trading experience by allowing users to engage in virtual trades alongside live trading activities. This unique feature aims to minimize potential losses by offering the option to take partial virtual trades instead of committing fully to live trades.`,

    'authorize_your_vh_token': `Custom VH token authorizer
This block is used to set and authorize your own custom VH token.`,

    'enable_disable_vh': `Virtual Hook Enabler
This block displays Enable and Disable Virtual Hook.`,

    'virtualhook_status': `Virtual Hook Status
This block returns if virtual hook is active or not.`,

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

    // Add more keys and values as needed
};



const blockDat = {
    'tradeparameters': `Trade parameters
Here is where you define the parameters of your contract.
Learn more`,

    'virtual_hook': `Virtual Hook
Virtual Hook is an innovative trading tool designed to enhance the trading experience by allowing users to engage in virtual trades alongside live trading activities. This unique feature aims to minimize potential losses by offering the option to take partial virtual trades instead of committing fully to live trades.`,

    'authorize_your_vh_token': `Custom VH token authorizer
This block is used to set and authorize your own custom VH token.`,

    'enable_disable_vh': `Virtual Hook Enabler
This block displays Enable and Disable Virtual Hook.`,

    'virtualhook_status': `Virtual Hook Status
This block returns if virtual hook is active or not.`,

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

    // Add more keys and values as needed
};

function createBlocksMenuButton(workspace) {
    // Get the same container
    const wrapper = document.getElementById('blocklyWrapper');

    // Create the new div
    const myDiv = document.createElement('div');
    myDiv.style.position = 'absolute';
    myDiv.style.top = '8vh';
    myDiv.style.left = '0vw';
    myDiv.style.height = '67.4vh';
    //myDiv.style.height = '100%';               // Full height
    myDiv.style.width = '17.5vw';
    myDiv.style.backgroundColor = 'var(--bg-color)'; // white background
    //myDiv.style.backgroundColor = '#ffffff'; // white background
    //myDiv.style.border = '1px solid blue';   // blue solid border
    myDiv.style.color = 'var(--text-color)'; // ✅ Use theme text color
    myDiv.style.borderRadius = '0';
    myDiv.style.cursor = 'pointer';
    myDiv.style.fontSize = '2.3vh';
    myDiv.style.fontWeight = 'bold';
    myDiv.style.zIndex = '10';                 // lower z-index
    myDiv.style.display = 'flex';
    myDiv.style.alignItems = 'center';
    myDiv.style.justifyContent = 'center';
    myDiv.style.padding = '0';

    // Add some text or content
    myDiv.textContent = 'kaiser\'s Div';

    // Append the new div
    wrapper.appendChild(myDiv);

    // Function to toggle visibility based on width
    function updateDivVisibility() {
        if (window.innerWidth < 700) {
            myDiv.style.display = 'none'; // Hide on small screens
        } else {
            myDiv.style.display = 'flex'; // Show on larger screens
        }
    }

    // Run on load
    updateDivVisibility();

    // Run on resize
    window.addEventListener('resize', updateDivVisibility);

    const blocksMenuToggleBtn = document.createElement('button');
    blocksMenuToggleBtn.id = 'blockMenuToggle';
    blocksMenuToggleBtn.style = `
        position: absolute;
        top: 9vh;
        left: 0.7vw;
        //left: 0.7%;
        height: 7vh;
        width: 16.1vw;
        //width: 92%;
        background-Color: var(--tmenu-color); // background from theme
        color: var(--text-color); /* ✅ Use theme text color */
        //background-color: #f1f1f1;
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-size: 2.3vh;
        font-weight: bold;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 0;
    `;

    const buttonText = document.createElement('span');
    buttonText.innerText = 'Blocks menu';
    buttonText.style = `
        position: absolute;
        left: 2.7vw;
        z-index: 1;
        color: var(--text-color);
    `;

    // 🔹 Inline SVG icon (instead of static image)
    const toggleIcon = document.createElement('div');
    toggleIcon.id = 'toggleIcon';
    Object.assign(toggleIcon.style, {
        width: '3vh',
        height: '3.0vh',
        position: 'absolute',
        right: '2.5vw',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    // ✅ SVG markup (inherits theme color)
    toggleIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="20"
            height="22"
            fill="var(--text-general)"
            style="transition: transform 0.3s ease;">
            <path fill-rule="evenodd" clip-rule="evenodd"
            d="M31.775 21.291a1.5 1.5 0 0 1-2.066.483L16 13.266l-13.709 8.51a1.5 1.5 0 0 1-1.582-2.55l14.5-9a1.5 1.5 0 0 1 1.582 0l14.5 9a1.5 1.5 0 0 1 .483 2.066"/>
        </svg>
    `;

    const svgElement = toggleIcon.querySelector('svg');

    // Append elements
    blocksMenuToggleBtn.appendChild(toggleIcon);
    blocksMenuToggleBtn.appendChild(buttonText);
    wrapper.appendChild(blocksMenuToggleBtn);
    // ✅ Responsive function
    function updateBlocksMenuStyles() {
        if (window.innerWidth < 700) {
            blocksMenuToggleBtn.style.width = '100px';
            blocksMenuToggleBtn.style.left = '0px';
            blocksMenuToggleBtn.style.fontsize = '12px';
            buttonText.style.left = '4px';
            toggleIcon.style.right = '4px';
        } else {
            blocksMenuToggleBtn.style.width = '16.1vw';
            blocksMenuToggleBtn.style.left = '0.7vw';
            //blocksMenuToggleBtn.style.left = '0px';
            blocksMenuToggleBtn.style.fontsize = '2.3vh';
            buttonText.style.left = '2.2vw';
            toggleIcon.style.right = '2.0vw';
        }
    }

    // Run on load
    updateBlocksMenuStyles();

    // Listen for window resize
    window.addEventListener('resize', updateBlocksMenuStyles);

    const blocksMenuContainer = document.createElement('div');
    blocksMenuContainer.id = 'blocksMenuContainer';
    blocksMenuContainer.classList.add('blocks-menu-container');

    // Set initial left (default)
    blocksMenuContainer.style.left = '0.7vw';
    blocksMenuContainer.style.backgroundColor = 'var(--bg-color)';//'transparent';

    // Function to update left based on window width
    function updateBlocksMenuLeft() {
        if (window.innerWidth < 700) {
            blocksMenuContainer.style.left = '0px';
        } else {
            blocksMenuContainer.style.left = '0.7vw'; // default for larger screens
        }
    }

    // Run on page load
    updateBlocksMenuLeft();

    // Run on resize
    window.addEventListener('resize', updateBlocksMenuLeft);

    const searchBarContainer = document.createElement('div');
    searchBarContainer.classList.add('search-bar-container');

    // ✅ Use theme-based background and styling
    Object.assign(searchBarContainer.style, {
        backgroundColor: 'var(--bg-color)',   // ✅ theme background color
        //border: '1px solid var(--accent-border-color)', // optional theme border
        //color: 'var(--text-color)',           // ✅ theme text color
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    });

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
    spinner.style.background = "var(--spinner-b-color)"; //'#e0e0e0'; // Light gray background
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
    searchInput.style.width = '7vw';
    searchInput.placeholder = 'Search';
    searchInput.style.border = 'none';
    searchInput.style.outline = 'none';
    searchInput.style.flex = '1';
    searchInput.style.height = '100%';
    searchInput.style.fontSize = '10px';
    //searchInput.style.border = '1px solid red';
    searchInput.style.backgroundColor = 'var(--bg-color)';//'transparent';
    searchInput.style.paddingLeft = '0.25vw';  // margin already applied by icon
    searchInput.style.color = 'var(--text-color)'; //'transparent';

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
        //background-color: #fff;
        border: 1px solid var(--s-b-color);
        background-color: var(--bg-color);
        //border: 1px solid var(--accent-border-color);
        box-shadow: 0 2px 10px var(--shadow-color); //rgba(0, 0, 0, 0.2);
        display: none;
        z-index: 20;
      `;

      const modalHeader = document.createElement('div');
      modalHeader.id = 'modalHeader';
      modalHeader.style.cssText = `
        flex: 0 0 auto;
        height: 11vh;
        //background-color: #eceff0;
        background-color: var(--hmodal-color);
        padding: 0 2vw;
        font-weight: bold;
        font-size: 2.7vh;
        //color: #444;
        color: var(--text-color);
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

        function updateModalStyles() {
          if (window.innerWidth < 700) {
            // Mobile
            modal.style.width = '80vw';
            modal.style.left = '';       // clear desktop style
            modal.style.right = '2vw';   // stick to right with margin
          } else {
            // Desktop
            modal.style.width = '32vw';
            modal.style.right = '';      // clear mobile style
            modal.style.left = '20.5vw';
          }
        }

      // Run on load
      updateModalStyles();

      // Run on resize
      window.addEventListener('resize', updateModalStyles);

      return { modal, modalHeader, modalBody };
    };

    const { modal, modalHeader, modalBody } = createSearchModal();

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
      const matches = Object.entries(blockData).filter(([_, description]) => regex.test(description));

    const buildHeaderHTML = (count) => `
      <div style="
        height: 11vh;
        //background-color: #eceff0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0vw;
        font-weight: bold;
        font-size: 2.5vh;
        background-color: var(--hmodal-color);
        color: var(--header-text-color);
        //color: #444;
        ">

        <div>
          Results for "<strong style="
            display: inline-block;
            max-width: 18vw;
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
            //color: #222;
            //border-bottom: 1px solid #ddd;
            color: var(--search-text-color);
            //border-bottom: 1px solid var(--search-border-color);
          `;
          searchtextdiv.textContent = description;

          const stworkspace = document.createElement('div');
          stworkspace.className = 'stworkspace';
          stworkspace.style.cssText = `
            width: ${blockWidth}px;
            height: ${blockHeight}px;
            //border: 1px solid #ccc;
            border: none;          /* 🔥 remove border */
            box-shadow: none;      /* 🔥 ensure no shadow */
            margin: 1vh 1.3vw 2vh;
            //background-color: #fff;
            background-color: var(--workspace-bg);
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

          // 🚫 Remove background border from preview workspace
          const bg = stworkspace.querySelector('.blocklyMainBackground');
          if (bg) {
            bg.style.stroke = 'none';
            bg.style.boxShadow = 'none';
          }

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

              // ✅ If screen width < 700px → also close the blocks menu and reset icon
              if (window.innerWidth < 700) {
                blocksMenuContainer.style.display = 'none';
                toggleIcon.src = '/static/icons/down.png';
              }
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
        border-radius: 0px;
        //background-color: white;
        background-color: var(--bg-color);
    `;

    // Function to update height
    function updateBlockSectionsHeight() {
        if (window.innerHeight < 700) {
            blockSectionsContainer.style.height = '40vh';
        } else {
            blockSectionsContainer.style.height = '47.5vh';
        }
    }

    // Run once on load
    updateBlockSectionsHeight();

    // Update on resize
    window.addEventListener('resize', updateBlockSectionsHeight);

    const sections = ['Trade parameters', 'Purchase conditions', 'Sell conditions (optional)', 'Restart trading conditions', 'Analysis', 'Utility', 'Virtual-Hook'];

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
            //border-top: 0.1px solid #ccc;
            border-top: 0.1px solid var(--s-b-color);
            margin: 0;
            padding-top: 0;
            padding-bottom: 0;
            line-height: 1;
            width: 92%;
        `;

        const sectionTitle = document.createElement('span');
        sectionTitle.innerText = sectionName;
        sectionTitle.style = 'font-weight: bold; font-size: 2.0vh; color: var(--text-color);';
        // ✅ Create inline SVG toggle arrow
        const toggleSectionIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        toggleSectionIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        toggleSectionIcon.setAttribute("viewBox", "0 0 32 32");
        toggleSectionIcon.setAttribute("width", "12");
        toggleSectionIcon.setAttribute("height", "18");
        toggleSectionIcon.style.transition = "transform 0.3s ease";
        toggleSectionIcon.style.fill = "var(--text-general)";
        toggleSectionIcon.style.marginLeft = "auto";

        // Add SVG path
        const togglePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        togglePath.setAttribute("fill-rule", "evenodd");
        togglePath.setAttribute("clip-rule", "evenodd");
        togglePath.setAttribute(
          "d",
          "M31.775 21.291a1.5 1.5 0 0 1-2.066.483L16 13.266l-13.709 8.51a1.5 1.5 0 0 1-1.582-2.55l14.5-9a1.5 1.5 0 0 1 1.582 0l14.5 9a1.5 1.5 0 0 1 .483 2.066"
        );
        toggleSectionIcon.appendChild(togglePath);

        // Function to set responsive margins
        function setIconMargin() {
            const isSmallScreen = window.innerWidth < 700;
            if (sectionName === 'Analysis') {
                toggleSectionIcon.style.marginRight = isSmallScreen ? '10px' : '2.5vw';
            } else if (sectionName === 'Utility') {
                toggleSectionIcon.style.marginRight = isSmallScreen ? '20px' : '3.5vw';
            }
        }

        // Initial margin setup
        setIconMargin();

        // Update on screen resize
        window.addEventListener('resize', setIconMargin);

        sectionDiv.appendChild(sectionTitle);

        // Append icon and optional extra style rules
        if (sectionName === 'Analysis') {
            sectionDiv.appendChild(toggleSectionIcon);
        }

        if (sectionName === 'Utility') {
            sectionDiv.style.borderBottom = '0.1px solid #ccc';
            sectionDiv.appendChild(toggleSectionIcon);
        }

        blockSectionsContainer.appendChild(sectionDiv);
        blocksMenuContainer.appendChild(blockSectionsContainer);

        const modal = document.createElement('div');
        modal.className = 'sectionModal';
        modal.style = 'border-radius: 1.0vh; position: fixed; top: 23vh; left: 20.5vw; width: 32vw; height: 63vh; background-color: var(--bg-color); border: 1px solid var(--s-b-color); box-shadow: 0 2px 10px var(--shadow-color); display: none; z-index: 20; overflow-y: auto;  overflow-x: hidden;';    // transform: translate(-50%, -50%);   background-color: #fff;  #ccc  rgba(0, 0, 0, 0.2)

        const allowedSections = [
          'Trade parameters',
          'Purchase conditions',
          'Sell conditions (optional)',
          'Restart trading conditions',
          'Virtual-Hook'
        ];

        if (allowedSections.includes(sectionName)) {
          if (window.innerWidth < 700) {
            // 📱 Mobile → force append to body
            document.body.appendChild(modal);
          } else {
            // 🖥️ Desktop → keep inside Blockly area
            workspace.getParentSvg().parentNode.appendChild(modal);
          }
        }

        function updateModalStyles() {
          if (window.innerWidth < 700) {
            // 📱 Mobile
            modal.style.width = '80vw';
            modal.style.left = 'auto';        // remove desktop 'left'
            modal.style.right = '2vw';    // align with right edge

          } else {
            // 🖥️ Desktop
            modal.style.width = '32vw';
            modal.style.right = 'auto';       // remove mobile 'right'
            modal.style.left = '20.5vw';  // align with left edge
          }
        }

        // Run immediately on load
        updateModalStyles();
        //applyModalSize();

        // Also run whenever the window resizes
        //window.addEventListener('resize', updateModalStyles);
        // Also run whenever the window resizes
        window.addEventListener('resize', () => {
          updateModalStyles();
        });

        sectionDiv.addEventListener('click', () => {
            modal.innerHTML = '';

            // 🔑 Recalculate styles right before showing
            updateModalStyles();
            //applyModalSize();

            modal.style.display = 'block';
            modal.style.zIndex = '999999'; // force on top
            modal.style.position = 'fixed'; // force absolute positioning relative to window

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
                case 'Virtual-Hook':
                    sectionBlocksXml = Blockly.utils.xml.textToDom(vhBlocks);
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
                          color: var(--text-color);
                          //color: black;
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

                        // 🚫 Remove background & border from preview workspace (inline JS fix)
                        const bg = tempWorkspace.getParentSvg().querySelector('.blocklyMainBackground');
                        if (bg) {
                          bg.style.fill = 'none';     // no background
                          bg.style.stroke = 'none';   // no border line
                          bg.style.boxShadow = 'none';// no shadow
                        }

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

                                    // Get the current position of the block (relative to the surface)
                                    var currentPos = addedBlock.getRelativeToSurfaceXY();

                                    // Calculate the offset (dx, dy)
                                    var dx = wsX - currentPos.x; // Horizontal offset
                                    var dy = wsY - currentPos.y; // Vertical offset

                                    // Attempt to move the block
                                    try {
                                        addedBlock.moveBy(dx, dy, ['drag']);

                                        //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move (optional)
                                    } catch (error) {
                                        console.error("Error during block move: ", error);
                                    }

                                    isDragging = false; // Set dragging to false after completing
                                    addedBlock = null;
                                });
                            }
                        });

                    }, 0);
                });

                window.addEventListener('click', (event) => {
                    const clickedInsideModal = modal.contains(event.target);
                    const clickedInsideSection = sectionDiv.contains(event.target);
                    const clickedInsideSubsection = (typeof subsectionDiv !== 'undefined' && subsectionDiv)
                        ? subsectionDiv.contains(event.target)
                        : false;

                    if (modal.style.display === 'block') {
                        if (!clickedInsideModal && !clickedInsideSection && !clickedInsideSubsection) {
                            //console.log("✅ Closing modal (clicked outside all safe zones)");
                            modal.style.display = 'none';
                        } else {
                            console.log("⏩ Click ignored (inside modal or section/subsection)");
                        }
                    } else {
                        console.log("⚠️ Modal not open, ignoring click.");
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
                subsectionContainer.style =`
                    //display: flex;
                    display: none;
                    font-size: 1.80vh;
                    //background: white;
                    margin-top: -26vh; //8.5vh;
                    background: var(--bg-color);
                    color: var(--text-color);
                `;
            };

            if (sectionName === 'Utility') {
                subsectionContainer.style = `
                    display: none;
                    justify-content: center; /* Vertical centering */
                    font-size: 1.80vh;
                    //background: white;
                    margin-top: -65vh; //7.5vh;
                    //color: rgba(0, 0, 0, 0.5); /* softer black */
                    line-height: 1;
                    background: var(--bg-color);
                    color: var(--text-color);
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
                modal.style = 'border-radius: 1.0vh; position: fixed; top: 23vh; left: 20.5vw; width: 32vw; height: 63vh; background-color: var(--bg-color); border: 1px solid var(--s-b-color); box-shadow: 0 2px 10px var(--shadow-color); display: none; z-index: 20; overflow-y: auto;  overflow-x: hidden;';    // transform: translate(-50%, -50%);   background-color: #fff;  #ccc  rgba(0, 0, 0, 0.2)
                workspace.getParentSvg().parentNode.appendChild(modal);

                // Function to apply responsive sizing
                function applyModalSize() {
                    if (window.innerWidth <= 700) {
                        modal.style.width = "80vw";
                        modal.style.left = "auto";       // reset left
                        modal.style.right = "2vw";       // stick to right side
                    } else {
                        modal.style.width = "32vw";
                        modal.style.left = "20.5vw";
                        modal.style.right = "auto";      // reset right
                    }
                }

                // Apply size on creation
                applyModalSize();

                subsectionDiv.addEventListener('click', () => {

                    modal.innerHTML = '';

                    modal.style.display = 'block';

                    applyModalSize(); // ensure correct size even on open

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
                                width: 90%;           /* take 90% of parent width */
                                max-width: 600px;     /* don't stretch too far */
                                gap: 1vw;
                            `;

                            // Input container (flexible)
                            const cre_var = document.createElement('div');
                            cre_var.id = 'cre_var';
                            cre_var.style = `
                                flex: 1; /* let this grow and fill remaining space */
                                height: 6.5vh;
                                border: 2px solid rgba(0, 0, 0, 0.1);
                                //border: 1px solid var(--text-color);
                                display: flex;
                                align-items: center;
                                background: var(--menu-bg);
                                box-sizing: border-box;
                                /*border-radius: 0px;*/
                            `;

                            // Text input (fills its parent)
                            const cre_var_input = document.createElement('input');
                            cre_var_input.id = 'cre_var_input';
                            cre_var_input.placeholder = 'New variable name';
                            cre_var_input.style = `
                                width: 100%;
                                height: 100%;
                                /*border: none;*/
                                border-radius: 5px;
                                font-size: 2.3vh;
                                padding-left: 1vw;
                                outline: none;
                                background: inherit;
                                border: 0.1px solid rgba(0, 128, 0, 0.3);
                                border-radius: 5px;
                                color: var(--text-color);
                                font-weight: 500;
                                box-sizing: border-box;
                            `;
                            cre_var.appendChild(cre_var_input);

                            // Create button (fixed but non-shrinking)
                            const create_button = document.createElement('button');
                            create_button.innerText = 'Create';
                            create_button.style = `
                                flex-shrink: 0;         /* never shrink */
                                width: 6.5vw;           /* reasonable width on large screens */
                                /*min-width: 100px;       /* minimum size for small screens */
                                height: 6.5vh;
                                background-color: rgb(255, 77, 88);
                                color: white;
                                max-width: 70px;     /* ✅ will shrink down but stay readable */
                                min-width: 60px;
                                font-weight: bold;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                            `;

                            inputRow.appendChild(cre_var);
                            inputRow.appendChild(create_button);

                            // Then append to your modal
                            create_variable.appendChild(inputRow);
                            modal.appendChild(create_variable);

                            // Log all variables in the workspace
                            const allVariables = workspace.getVariableMap().getAllVariables();

                            allVariables.forEach((variable) => {
                                console.log(`🔹 Name: ${variable.name}, ID: ${variable.getId()}, Type: ${variable.type}`);
                            });

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
                                        //color: rgba(0, 0, 0, 0.4);
                                        color: var(--text-color);
                                        //border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                                        margin-top: 1.5vh;
                                        line-height: 1.5;
                                        width: 100%;
                                        padding-left: 1.8vw;
                                    `;
                                    infoContainer.innerHTML = `
                                        <span style="font-size: 2.4vh; color: var(--text-color); margin-bottom: 2.0vh; display: inline-block;"><strong>Set variable</strong></span><br>
                                        <span style="font-size: 2.4vh; color: var(--text-color);">Assigns a given value to a variable</span><br>
                                        <span style="font-size: 2.0vh; font-weight: bold; color: #e8005a; cursor: pointer;">Learn more</span>
                                    `;
                                    modal.appendChild(infoContainer);    // color: rgba(0, 0, 0, 1);   //  color: rgba(0, 0, 0, 0.5);

                                    // 👇 SET block using the first variable
                                    const blockSetContainer = document.createElement('div');
                                    blockSetContainer.className = 'variable-set-container';
                                    blockSetContainer.style.cssText = `
                                        width: 700px;
                                        height: 80px;
                                        margin-top: 1vh;
                                        margin-left: 1.8vw;
                                        background: none;
                                        border: none;
                                        box-shadow: none;
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

                                    // 🚫 Remove background, border, and shadow from the workspace (clean look)
                                    const bg = blockSetWorkspace.getParentSvg().querySelector('.blocklyMainBackground');
                                    if (bg) {
                                      bg.style.fill = 'none';        // remove fill color
                                      bg.style.stroke = 'none';      // remove border line
                                      bg.style.boxShadow = 'none';   // remove shadow
                                    }

                                    // (optional) also remove the workspace grid lines if any
                                    const gridPattern = blockSetWorkspace.getParentSvg().querySelector('pattern');
                                    if (gridPattern) gridPattern.remove();

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
                                        //color: rgba(0, 0, 0, 0.75);
                                        color: var(--text-color);
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

                                    // 🚫 Remove background, border, and shadow for each variable workspace
                                    const bg = porkspace.getParentSvg().querySelector('.blocklyMainBackground');
                                    if (bg) {
                                        bg.style.fill = 'none';        // transparent background
                                        bg.style.stroke = 'none';      // no border line
                                        bg.style.boxShadow = 'none';   // no shadow
                                    }

                                    // 🧹 Optional: also remove the faint Blockly grid pattern if any
                                    const gridPattern = porkspace.getParentSvg().querySelector('pattern');
                                    if (gridPattern) gridPattern.remove();

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

                                // ✅ Ensure the variable exists in the main workspace
                                let existingVar = workspace.getVariable(varName);
                                if (!existingVar) {
                                    workspace.createVariable(varName);
                                }

                                // Check if the info container exists
                                let infoContainer = document.getElementById('variable_info_text');
                                if (!infoContainer) {
                                    // Create it if it doesn't exist yet
                                    infoContainer = document.createElement('div');
                                    infoContainer.id = 'variable_info_text';
                                    infoContainer.style = `
                                        font-size: 2vh;
                                        //color: rgba(0, 0, 0, 0.4);
                                        color: var(--text-color);
                                        //border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                                        margin-top: 1.5vh;
                                        line-height: 1.5;
                                        width: 100%;
                                        padding-left: 1.8vw;
                                    `;
                                    infoContainer.innerHTML = `
                                        <span style="font-size: 2.4vh; color: var(--text-color); margin-bottom: 2.0vh; display: inline-block;"><strong>Set variable</strong></span><br>
                                        <span style="font-size: 2.4vh; color: var(--text-color);">Assigns a given value to a variable</span><br>
                                        <span style="font-size: 2.0vh; font-weight: bold; color: #e8005a; cursor: pointer;">Learn more</span>
                                    `;
                                    modal.appendChild(infoContainer);  //  color: rgba(0, 0, 0, 0.5); // color: rgba(0, 0, 0, 1);

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

                                    // 🚫 Remove background + border + shadow from this preview workspace
                                    const bg = blockSetWorkspace.getParentSvg().querySelector('.blocklyMainBackground');
                                    if (bg) {
                                        bg.style.fill = 'none';     // remove background fill
                                        bg.style.stroke = 'none';   // remove border line
                                        bg.style.boxShadow = 'none';// remove any shadow
                                    }

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
                                        }      if (isDragging && addedBlock) {
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
                                        //color: rgba(0, 0, 0, 0.75);
                                        color: var(--text-color);
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

                                // ✅ Append to a dedicated preview list container (so each variable stays separate)
                                let previewsContainer = document.getElementById('variables_preview_container');
                                if (!previewsContainer) {
                                    previewsContainer = document.createElement('div');
                                    previewsContainer.id = 'variables_preview_container';
                                    previewsContainer.style = `
                                        display: flex;
                                        flex-direction: column;
                                        gap: 1vh;
                                        margin-left: 1.8vw;
                                    `;
                                    modal.appendChild(previewsContainer);
                                }

                                previewsContainer.appendChild(blockPreviewDiv);

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

                                // 🚫 Remove background + border + shadow from this preview workspace
                                const bg = porkspace.getParentSvg().querySelector('.blocklyMainBackground');
                                if (bg) {
                                    bg.style.fill = 'none';     // remove background fill
                                    bg.style.stroke = 'none';   // remove border line
                                    bg.style.boxShadow = 'none';// remove any shadow
                                }

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
                                  //color: black;
                                  color: var(--text-color);
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
                                    justify-content: center;
                                    align-items: center;
                                    width: ${blockWidth+1500}px;
                                    height: ${blockHeight+20}px;
                                    top: 0vh;
                                    padding-left: -2vh;
                                    padding-top: -12vh;
                                    background: none;
                                    overflow: hidden;
                                    box-sizing: border-box;
                                `;

                                modal.appendChild(tempWorkspaceDiv);

                                // Inject a separate temp workspace for each block
                                const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                                    toolbox: null,
                                    theme: myTheme,  // Apply the custom theme
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

                                // 🚫 Remove background + border + shadow from this temp workspace
                                const bg = tempWorkspace.getParentSvg().querySelector('.blocklyMainBackground');
                                if (bg) {
                                    bg.style.fill = 'none';     // remove background fill
                                    bg.style.stroke = 'none';   // remove border line
                                    bg.style.boxShadow = 'none';// remove any shadow
                                }

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

                                            // Get the current position of the block (relative to the surface)
                                            var currentPos = addedBlock.getRelativeToSurfaceXY();

                                            // Calculate the offset (dx, dy)
                                            var dx = wsX - currentPos.x; // Horizontal offset
                                            var dy = wsY - currentPos.y; // Vertical offset

                                            // Attempt to move the block
                                            try {
                                                addedBlock.moveBy(dx, dy, ['drag']);

                                                //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move (optional)
                                            } catch (error) {
                                                console.error("Error during block move: ", error);
                                            }

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
                });

            });
            //sectionDiv.insertAdjacentElement('beforeend', subsectionContainer);
            sectionDiv.insertAdjacentElement('afterend', subsectionContainer);

            sectionDiv.addEventListener('click', () => {
                const isExpanded = subsectionContainer.style.display === 'block';

                // Toggle display of the subsection
                subsectionContainer.style.display = isExpanded ? 'none' : 'block';

                // Toggle the section icon
                //toggleSectionIcon.src = isExpanded ? '/static/icons/down.png' : '/static/icons/up.png';
                // Toggle SVG rotation
                if (isExpanded) {
                    toggleSectionIcon.style.transform = "rotate(0deg)";
                } else {
                    toggleSectionIcon.style.transform = "rotate(180deg)";
                }

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
    wrapper.appendChild(blocksMenuContainer);

    blocksMenuToggleBtn.addEventListener('click', () => {
        const isMenuOpen = blocksMenuContainer.style.display === 'block';
        blocksMenuContainer.style.display = isMenuOpen ? 'none' : 'block';
        //toggleIcon.src = isMenuOpen ? '/static/icons/down.png' : '/static/icons/up.png';
        // 🔹 Rotate the SVG toggle icon (smooth animation)
        toggleIcon.style.transition = 'transform 0.3s ease';
        toggleIcon.style.transform = isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });
}
