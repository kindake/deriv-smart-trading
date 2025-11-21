console.log(Blockly.Python);
let blockType = "Duration";

// Global variable to store dropdown values
/*let dropdownValues = {
    firstDropdown: null,
    secondDropdown: null,
    contractDropdown: null,
};*/

// ✅ Safely access WebSocket data to prevent errors
console.log("💰 Current Balance:", window.WS_DATA?.balance ?? "Not Available");
console.log("📜 Active Symbols:", window.WS_DATA?.activeSymbols ?? "Not Available");
console.log("📊 Asset Index:", window.WS_DATA?.assetIndex ?? "Not Available");
console.log("📜 Contract Data:", window.WS_DATA?.contractData ?? "Not Available");

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
        console.log("🚀 Calling populateDropdowns now!");
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        //populateBlockDropdowns(window.WS_DATA.contractData);

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
        console.log("🚀 Calling populateDropdowns now!");
        populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
        //populateBlockDropdowns(window.WS_DATA.contractData);
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
        console.log("🚀 Calling populateDropdowns now!");
        //populateDropdowns(window.WS_DATA.contractData);
        //(blockType);
        //populateBlockDropdowns(blockType);
        //populateDropdowns(window.WS_DATA.activeSymbols, window.WS_DATA.assetIndex);
    } else {
        console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX & Contracts Data...");
    }
});

window.addEventListener("tickDataUpdated", function (event) {
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
});

// Add an event listener for the login button click
document.getElementById("loginButton").addEventListener("click", function () {
    // Redirect to the Deriv OAuth URL
    const derivOAuthUrl = "https://oauth.deriv.com/oauth2/authorize?app_id=61801&l=EN&signup_device=desktop&redirect_uri=http://127.0.0.1:8001/";
    window.location.href = derivOAuthUrl;
});

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


// Function to send Python code to the backend
function sendPythonCodeToBackend(pythonCode) {
    fetch('/botbuilder/api/run-bot/', { // Replace with your backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Ensure you include the CSRF token for Django
        },
        body: JSON.stringify({ pythonCode }), // Send Python code in the request body
    })
        .then((response) => {
            console.log('Backend response status:', response.status);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to send data to backend');
            }
        })
        .then((data) => {
            console.log('Backend Response:', data);
            alert('Bot started successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to start the bot. Check the console for details.');
        });
}

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
let selectedSymbol = null;

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
        updateContractsFromSymbol();

        /*dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();*/

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

        updateContractsFromSymbol();
        populateTradeTypeDropdowns(value, assetData);

        /*dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();*/

        return value;
    });

    /*// Function to update contracts based on the symbol dropdown value
    function updateContractsFromSymbol() {
        const currentSymbol = symbolDropdown.getValue();
        selectedSymbol = symbolDropdown.getValue();
        if (currentSymbol) {
            console.log("Fetching contracts for symbol:", currentSymbol);
            //fetchContracts(selectedSymbol);
            //populateBlockDropdowns(globalContractData);
            populateBlockDropdowns(window.WS_DATA.contractData);
        } else {
            console.warn("No valid symbol selected in symbol dropdown.");
        }
    }*/
}
/*
//let blockType = null; // Global variable to store the block type
let blockType = null; // Global variable to store the block type

function manageDynamicBlock(newBlockType) {

    const workspace = Blockly.getMainWorkspace();
    const tradeParametersBlock = workspace.getBlocksByType('tradeparameters')[0];

    if (!tradeParametersBlock) {
        console.error("❌ 'tradeparameters' block not found!");
        return;

    }
    const toInput = tradeParametersBlock.getInput('to');

    // Manage the block and decide the block type
    blockType = newBlockType; // Set the blockType
    console.log("Block type set to:", blockType); // Log for debugging

    if (!toInput) {
        console.error('"to" input not found or is invalid.');
        return;
    }

    //const workspace = Blockly.getMainWorkspace();
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

        //fetchContracts(selectedSymbol);

        // Connect the new block to the "to" input
        if (toInput.connection && newBlock.previousConnection) {
            toInput.connection.connect(newBlock.previousConnection);
            console.log(`Connected new block of type: ${newBlockType}`);
        } else {
            console.error("Failed to connect: Invalid connection points.");
        }
    } else {
        console.log(`Block of type ${newBlockType} already exists.`);
    }
}
*/

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

            if (
                contractData &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                const { firstDropdown, secondDropdown } = dropdownValues;

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

            if (
                contractData &&
                //contractData.success &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                const { firstDropdown, secondDropdown } = dropdownValues;

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
        /*let dropdownValues = {
            firstDropdown: "Touch/No Touch",
            secondDropdown: "touchnotouch-Touch/No Touch",
            contractDropdown: null,
        };*/

        try {
            console.log("Current dropdown values---------------------------------------------:", dropdownValues); // Debugging
            console.log("Received contractData:", contractData); // Debugging

            if (
                contractData &&
                //contractData.success &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                const { firstDropdown, secondDropdown, thirdDropdown } = dropdownValues;

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
                const DurationBlock = workspace.getBlocksByType("Duration_T")[0];

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                const DurationDropdown = DurationBlock.getField("d1");
                const DurationValueField = DurationBlock.getField("dv");
                const BarrierOffsetDropdown = DurationBlock.getField("bodt");
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

                if (!DurationBlock) {
                    console.error("Duration block not found in workspace.");
                    return;
                }

                //const DurationDropdown = DurationBlock.getField("d1");
                //const BarrierOffsetDropdown = DurationBlock.getField("bodt");
                //const BarrierValueField = DurationBlock.getField("bov");

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

                // Restore the previous selection if it still exists, otherwise default to the first option
                /*const validBodValue = availableOptions.find(option => option[1] === currentBodValue);
                if (validBodValue) {
                    BarrierOffsetDropdown.setValue(currentBodValue);
                } else {
                    BarrierOffsetDropdown.setValue(availableOptions[0][1]);
                }*/

                let previousBodValue = BarrierOffsetDropdown.getValue(); // Store initial value

                function updateBarrierOffsetDropdown() {
                    const currentBodValue = BarrierOffsetDropdown.getValue(); // Get current value
                    const validBodValue = availableOptions.find(option => option[1] === currentBodValue);

                    if (validBodValue) {
                        BarrierOffsetDropdown.setValue(currentBodValue);
                    } else {
                        BarrierOffsetDropdown.setValue(availableOptions[0][1]);
                    }

                    const newBodValue = BarrierOffsetDropdown.getValue(); // Get updated value

                    // Check if value changed
                    if (previousBodValue !== newBodValue) {
                        console.log(`BOD dropdown changes from ${previousBodValue} to ${newBodValue}`);
                    }

                    // Update previous value
                    previousBodValue = newBodValue;
                }

                //updateBarrierOffsetDropdown();

                /*// Attach event listener to track dropdown changes
                BarrierOffsetDropdown.setValidator((newValue) => {
                    if (newValue !== previousBodValue) {
                        console.log(`BOD dropdown changes from ${previousBodValue} to ${newValue}`);
                    }
                    setBarrierOffsetValue(); // Call the function when dropdown changes
                    previousBodValue = newValue; // Update stored value
                    return newValue; // Allow change
                });*/


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
                    let barrierOffsetType = BarrierOffsetDropdown.getValue();
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

                // Determine the barrier value to set based on the dropdown type
                /*let barrierValue = null;
                barrierOffsetType = BarrierOffsetDropdown.getValue();
                console.log("barrierOffsetType??????????????????????????????????????????????????????????????????? kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk:", barrierOffsetType);
                if (barrierOffsetType === "ABSOLUTE") {
                    barrierValue = absoluteBarrier;
                    console.log("Using Absolute Barrier:", barrierValue);
                } else if (barrierOffsetType === "OFFSET_PLUS" || barrierOffsetType === "OFFSET_MINUS") {
                    barrierValue = offsetBarrier;
                    console.log("Using Offset Barrier:", barrierValue);
                }

                // Ensure barrierValue is valid before setting it
                if (barrierValue !== null) {
                    BarrierValueField.setValue(barrierValue);
                    console.log(`Barrier value set to: ${barrierValue} for type: ${barrierOffsetType}`);
                } else {
                    console.log("Using Absolute Barrier:", absoluteBarrier);
                    console.log("Using Offset Barrier:", offsetBarrier);
                    console.error("No valid barrier value found to set.");
                }

                console.log(`Final absoluteBarrier: ${absoluteBarrier}`);
                console.log(`Final offsetBarrier: ${offsetBarrier}`);*/

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

            if (
                contractData &&
                //contractData.success &&
                contractData.data &&
                typeof contractData.data === "object"
            ) {
                const { firstDropdown, secondDropdown } = dropdownValues;

                if (!firstDropdown || !secondDropdown) {
                    console.error("Invalid dropdown values:", dropdownValues);
                    return;
                }

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

function populateTradeTypeDropdowns(selectedSymbol, assetData) {
    const workspace = Blockly.getMainWorkspace();
    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
    const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];
    const purchaseBlock = workspace.getBlocksByType('Purchase')[0];
    console.log("Using Offset aelectd ssyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyymbol:", selectedSymbol);
    console.log("Using Offset aseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet:", assetData);

    if (!tradeTypeBlock || !contractTypeBlock) {
        console.error("Required blocks not found in workspace.");

        //return;
    }

    if (!purchaseBlock) {
        console.error("purchaseBlock blocks not found in workspace.");
        //return;
    }

    if (!tradeTypeBlock) {
        console.error("tradeTypeBlock blocks not found in workspace.");
        //return;
    }

    if (!contractTypeBlock) {
        console.error("contractTypeBlock blocks not found in workspace.");
        //return;
    }
    const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
    const tradeTypeDropdown2 = tradeTypeBlock.getField('tt2');
    const contractTypeDropdown = contractTypeBlock.getField('ct1');
    const purchaseDropdown = purchaseBlock.getField('Pdd');

    const assetEntry = assetData.find(asset => asset.symbol === selectedSymbol);
    if (!assetEntry) {
        console.error("No asset data found tradeTypeDropdown1d for the selected symbol:", selectedSymbol);
        return;
    }

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
    //appendTradeBlock(newFirstDropdownValue);

    // Store the previous value for comparison
    //let previousFirstDropdownValue = tradeTypeDropdown1.getValue();

    // Set a validator to detect changes in the dropdown
    /*tradeTypeDropdown1.setValidator((newValue) => {
        if (newValue !== previousFirstDropdownValue) {
            console.log(`tradeTypeDropdown1 changed fromMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ${previousFirstDropdownValue} to ${newValue}`);

            // Update stored values when the dropdown changes
            dropdownValues.firstDropdown = newValue;
            dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
            dropdownValues.contractDropdown = contractTypeDropdown.getValue();

            // Log the updated dropdownValues
            //console.log("Updated dropdownValues:", dropdownValues);
            console.log("%c Updated dropdownValues:", "font-weight: bold; color: blue;", dropdownValues);
        }

        // Update previous value for the next change detection
        previousFirstDropdownValue = newValue;

        return newValue; // Allow the change
    });*/

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

        // Print the desired statement
        //console.log(`tradeTypeDropdown2.setValue(${newSecondDropdownValue});`);

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

        updatePurchaseDropdownOptions (newContractDropdownValue, contractTypeOptions);

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

    updateSecondDropdown(tradeTypeDropdown1.getValue());

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
        manageDynamicBlock(newBlockType);
        //fetchContracts(selectedSymbol);
        populateBlockDropdowns(newBlockType);

        return newValue;
    });

    // Remove block management logic from tradeTypeDropdown1
    /*tradeTypeDropdown1.setValidator(selectedCategory => {
        //fetchContracts(selectedSymbol);
        //populateBlockDropdowns(window.WS_DATA.contractData);
        updateSecondDropdown(selectedCategory);

        // Log initial values
        dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
        dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
        dropdownValues.contractDropdown = contractTypeDropdown.getValue();

        console.log("%c Updated dropdownValues:", "font-weight: bold; color: red;", dropdownValues);

        return selectedCategory; // Retain only dropdown updates
    });*/

    // Set a validator to detect changes in the dropdown
    tradeTypeDropdown1.setValidator((newValue) => {
        if (newValue !== previousFirstDropdownValue) {
            console.log(`tradeTypeDropdown1 changed fromMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM ${previousFirstDropdownValue} to ${newValue}`);

            updateSecondDropdown(newValue);

            // Update stored values when the dropdown changes
            dropdownValues.firstDropdown = newValue;
            dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
            dropdownValues.contractDropdown = contractTypeDropdown.getValue();

            // Log the updated dropdownValues
            //console.log("Updated dropdownValues:", dropdownValues);
            console.log("%c Updated dropdownValues:", "font-weight: bold; color: blue;", dropdownValues);
        }

        // Update previous value for the next change detection
        previousFirstDropdownValue = newValue;

        return newValue; // Allow the change
    });

    // Log initial values
    dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
    dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
    dropdownValues.contractDropdown = contractTypeDropdown.getValue();
/*
    updateSecondDropdown(tradeTypeDropdown1.getValue());

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

        //manageDynamicBlock(toInput, newBlockType);
        manageDynamicBlock(newBlockType);
        //fetchContracts(selectedSymbol);
        populateBlockDropdowns(window.WS_DATA.contractData);

        // Manage blocks in the "to" field
        //const tradeParametersBlock = workspace.getBlocksByType('tradeparameters')[0];
        //if (tradeParametersBlock) {
            //const toInput = tradeParametersBlock.getInput('to');
            //manageDynamicBlock(toInput, newBlockType);
        //}

        return newValue;
    });

    // Remove block management logic from tradeTypeDropdown1
    tradeTypeDropdown1.setValidator(selectedCategory => {
        //fetchContracts(selectedSymbol);
        //populateBlockDropdowns(window.WS_DATA.contractData);
        updateSecondDropdown(selectedCategory);
        return selectedCategory; // Retain only dropdown updates
    });

    // Log initial values
    dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
    dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
    dropdownValues.contractDropdown = contractTypeDropdown.getValue();*/
/*
    // Update second dropdown based on first dropdown's value
    updateSecondDropdown(tradeTypeDropdown1.getValue());

    // Set validator for tradeTypeDropdown2 with block management logic
    tradeTypeDropdown2.setValidator(newValue => {
        updateContractTypeOptions(newValue);

        // Map newValue to corresponding block type
        const blockMapping = {
            "Buy": "Growth_Rate",
            "Up/Down": "Multiplier",
            "callput-Higher/Lower": "Duration_T",
            "Matches/Differs": "Duration_HD",
            "Over/Under": "Duration_HD",
            "High Ticks/Low Ticks": "Duration_HD",
            "touchnotouch-Touch/No Touch": "Duration_T",
            "endsinout-Ends Between/Ends Outside": "Duration_I",
            "staysinout-Stays Between/Goes Outside": "Duration_I",
        };

        const newBlockType = blockMapping[newValue] || "Duration";
        blockType = newBlockType;

        console.log("Block type set to:", blockType);

        // Manage dynamic block based on newBlockType
        manageDynamicBlock(newBlockType);

        return newValue; // Ensures that newValue is retained
    });

    // Remove block management logic from tradeTypeDropdown1
    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory; // Retain only dropdown updates
    });

    // Log initial dropdown values (global variables)
    dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
    dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
    dropdownValues.contractDropdown = contractTypeDropdown.getValue();

    // Populate block dropdowns globally (executed outside the validator functions)

*/
}
/*
async function startDataFetching() {
    await fetchAllData();
    await fetchContracts(selectedSymbol);
    setTimeout(startDataFetching, 1000);
}
startDataFetching();
*/

console.log(typeof tradeParametersBlocks); // Output should be "object"

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

let workspaceReady = false;
document.addEventListener('DOMContentLoaded', function () {
    createWorkspace();
    workspaceReady = true;
    console.log("✅ Blockly workspace initialized.");
});

function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    const workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,  // Apply the custom theme
        renderer: 'zelos',  // Use the 'zelos' renderer
        zoom: {
            controls: false,
            //wheel: true,
            startScale: 0.5,  // Increases the size of the blocks
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,    // Set grid spacing for snapping (can be any number)
            length: 0,      // This effectively hides the grid lines
            colour: null,   // No grid line color to make it invisible
            snap: false     // Don't snap blocks to the invisible grid
        },
        //scrollbars: true,  // Enable scrollbars for panning the workspace
        move: {
            //scrollbars: true,  // Allows the user to drag the workspace to hidden parts
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

    // Add selected blocks from IndicatorBlocks XML to the workspace
    initializeBlocks(workspace, InitialBlocks);
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
}

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
function createQuickStrategyButton(workspace) {
    // Create the options container div (left panel)
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    optionsDiv.style = `
        position: absolute;
        top: 0;
        left: 0; /* Aligns it to the extreme left */
        width: 16vw; /* Adjusted width */
        height: 100%;
        background-color: white; /*rgba(0, 0, 0, 0.1); /* Slight background to differentiate */
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
        background-color: red;
        color: white;
        padding: 10px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        height: 6vh; /*calc(100vh - 21vh); /* Adjusting for header/footer */
        width: 32vh; /*130px; /* Fit within the 35vh div */
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
        top: 0; /* Aligns it to the extreme top */
        left: 16vw; /* Starts from the right edge of optionsDiv */
        width: 31.5vw; /* Specified width */
        height: 9vh; /* Specified height */
        background-color: white; /*rgba(0, 0, 255, 0.1); /* Slight blue background to differentiate */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        /*border: 1px solid #ccc;*/
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
        top: 0; /* Aligns it to the extreme top */
        left: 0vh; /* Starts from the right edge of optionsDiv */
        width: 31vw; /* Specified width */
        height: 6vh; /* Specified height */
        margin-top: 1.5vh;
        margin-bottom: 1.5vw;
        background-color: white; /*rgba(0, 0, 255, 0.1); /* Slight blue background to differentiate */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

    secondOptionsDiv.appendChild(sODiv);

}


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
    blocklyDiv.style.width = "76vw";
    blocklyDiv.style.transformOrigin = "right center";
    toggleButton.style.transform = "rotate(180deg)";

    // Show result window by default
    resultWindow.style.display = "block";

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

function createBlocksMenuButton(workspace) {
    const blocksMenuToggleBtn = document.createElement('button');
    blocksMenuToggleBtn.id = 'blockMenuToggle';
    blocksMenuToggleBtn.style = 'display: flex; align-items: center; position: absolute; top: 9vh; left: 1.5vh; background-color: #f1f1f1; color: black; padding: 7px 31px; border: 0px solid #ccc; border-radius: 0px; cursor: pointer; font-size: 12px; font-weight: bold; z-index: 10; height: 6vh; width: 32vh;';

    const buttonContent = document.createElement('div');
    buttonContent.style = 'display: flex; justify-content: space-between; width: 100%;';

    const buttonText = document.createElement('span');
    buttonText.innerText = 'Blocks menu';
    buttonText.style.marginRight = '10px';

    const toggleIcon = document.createElement('img');
    toggleIcon.id = 'toggleIcon';
    toggleIcon.src = '/static/icons/up.png';
    toggleIcon.style = 'width: 15px; height: 15px;';

    buttonContent.appendChild(buttonText);
    buttonContent.appendChild(toggleIcon);
    blocksMenuToggleBtn.appendChild(buttonContent);
    workspace.getParentSvg().parentNode.appendChild(blocksMenuToggleBtn);

    const blocksMenuContainer = document.createElement('div');
    blocksMenuContainer.id = 'blocksMenuContainer';
    blocksMenuContainer.style = 'overflow-y: auto; overflow-x: hidden; position: relative; top: 15vh; left: 1.5vh; width: 31.5vh; display: block; background-color: white; border: 0.25px solid #ccc; border-radius: 2px; z-index: 10; height: 60.5vh;'; //  height: 400px; overflow-y:

    const searchBarContainer = document.createElement('div');
    searchBarContainer.style = 'padding: 1.3vh; background-color: white; position: sticky; top: 0; z-index: 11; width: 28.6vh; height: 6vh; border-bottom: 0.5px solid #ccc;';  // Make the search bar sticky
    //searchBarContainer.style.padding = '10px';

    const searchInput = document.createElement('input');
    searchInput.type = 'text'
    searchInput.id = 'blockSearch';
    searchInput.placeholder = 'Search blocks...';
    searchInput.style = 'width: 28vh; padding: 1.5px; border: 1px solid #ccc; border-radius: 10px; height: 4.5vh;';

    searchBarContainer.appendChild(searchInput);
    blocksMenuContainer.appendChild(searchBarContainer);

    const blockSectionsContainer = document.createElement('div');
    blockSectionsContainer.id = 'blockSectionsContainer';
    blockSectionsContainer.style = 'height: 100%; position: relative;'; //'height: 100%; overflow-y: auto;'; // Make the entire container scrollable

    const sections = ['Trade parameters', 'Purchase conditions', 'Sell conditions (optional)', 'Restart trading conditions', 'Analysis', 'Utility'];

    sections.forEach((sectionName) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'blockSection';
        sectionDiv.style = 'padding-left: 2vh; padding-top: 1vh; padding-bottom: 1vh; border-bottom: 1px solid #ccc; cursor: pointer; height: 3.5vh; align-items: center;'; //

        const sectionTitle = document.createElement('span');
        sectionTitle.innerText = sectionName;
        sectionTitle.style = 'font-weight: bold; font-size: 12px;';

        const toggleSectionIcon = document.createElement('img');
        toggleSectionIcon.src = '/static/icons/down.png';
        toggleSectionIcon.style = 'width: 10px; height: 10px; margin-left: 10px;';

        sectionDiv.appendChild(sectionTitle);
        if (sectionName === 'Analysis' || sectionName === 'Utility') {
            sectionDiv.appendChild(toggleSectionIcon);
        };
        blockSectionsContainer.appendChild(sectionDiv);
        //blocksMenuContainer.appendChild(sectionDiv);
        // Append the scrollable blockSectionsContainer to the blocksMenuContainer
        blocksMenuContainer.appendChild(blockSectionsContainer);

        const modal = document.createElement('div');
        modal.className = 'sectionModal';
        modal.style = 'position: fixed; top: 37vh; left: 32.5vw; transform: translate(-50%, -50%); width: 29vw; height: 67vh; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto; overflow-x: hidden;';
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
                        const blockWidth = Math.ceil(blockMetrics.right - blockMetrics.left);// + 6; // +3px padding on both sides
                        const blockHeight = Math.ceil(blockMetrics.bottom - blockMetrics.top);// + 6;

                        // Cleanup: Remove hidden workspace
                        hiddenWorkspace.dispose();
                        document.body.removeChild(hiddenDiv);

                        // Create text container for explanation
                        const blockExplanation = document.createElement('div');
                        blockExplanation.textContent = `Explanation for ${blockNode.getAttribute('type')}`;
                        blockExplanation.style = `
                            text-align: center;
                            font-size: 14px;
                            font-weight: bold;
                            margin-bottom: 5px;
                            color: black; /* Adjust color as needed */
                        `;
                        modal.appendChild(blockExplanation); // Add the text above the block

                        // Create a new div for each block's temporary workspace
                        const tempWorkspaceDiv = document.createElement('div');
                        tempWorkspaceDiv.style = `
                            position: relative;
                            width: ${blockWidth}px;
                            height: ${blockHeight}px;
                            margin-bottom: 40px;
                            padding: 0;
                            background: none;
                            border: none;
                            overflow: visible;
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

        if (sectionName === 'Analysis' || sectionName === 'Utility') {
            const subsectionContainer = document.createElement('div');
            subsectionContainer.style = 'padding-top: 1vh; padding-bottom: 1vh; display: none; padding-left: 0.5vw; font-size: 12px;';

            const subsections = (sectionName === 'Analysis')
                ? ['Indicator', 'Tick and candle analysis', 'Contract', 'stats']
                : ['Custom Functions', 'Variables' , 'Notifications', 'Time', 'Math', 'Text', 'Logic', 'Lists', 'Loops', 'Miscellaneous'];

            subsections.forEach(subsectionName => {
                const subsectionDiv = document.createElement('div');
                subsectionDiv.className = 'subsection';
                subsectionDiv.style = 'padding: 1vh; cursor: pointer;';
                subsectionDiv.innerText = subsectionName;
                subsectionContainer.appendChild(subsectionDiv);

                const modal = document.createElement('div');
                modal.className = 'sectionModal';
                modal.style = 'position: fixed; top: 37vh; left: 32.5vw; transform: translate(-50%, -50%); width: 29vw; height: 67vh; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;  overflow: auto;';
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
                                blockExplanation.textContent = `Explanation for ${blockNode.getAttribute('type')}`;
                                blockExplanation.style = `
                                    text-align: center;
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-bottom: 5px;
                                    color: black; /* Adjust color as needed */
                                `;
                                modal.appendChild(blockExplanation); // Add the text above the block

                                // Create a new div for each block's temporary workspace
                                const tempWorkspaceDiv = document.createElement('div');
                                tempWorkspaceDiv.style = `
                                    position: relative;
                                    width: ${blockWidth}px;
                                    height: ${blockHeight}px;
                                    margin-bottom: 40px;
                                    padding: 0;
                                    background: none;
                                    border: none;
                                    overflow: visible;
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
            sectionDiv.appendChild(subsectionContainer);

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
                    sectionDiv.style.borderBottom = '1px solid #ccc';
                    subsectionContainer.style.borderBottom = 'none';
                } else {
                    // Remove border from sectionDiv and move it to the subsection
                    sectionDiv.style.borderBottom = 'none';
                    subsectionContainer.style.borderBottom = '1px solid #ccc';
                }
            });
/*
            sectionDiv.addEventListener('click', () => {
                const isExpanded = subsectionContainer.style.display === 'block';

                // Toggle display of the subsection
                subsectionContainer.style.display = isExpanded ? 'none' : 'block';

                // Toggle the section icon
                toggleSectionIcon.src = isExpanded ? '/static/icons/down.png' : '/static/icons/up.png';

                // Adjust margin-bottom of sectionDiv to accommodate the expanded subsection
                sectionDiv.style.marginBottom = isExpanded ? '0px' : `${subsectionContainer.scrollHeight}px`;
            });

/*
            sectionDiv.addEventListener('click', () => {
                const isExpanded = subsectionContainer.style.display === 'block';
                subsectionContainer.style.display = isExpanded ? 'none' : 'block';
                toggleSectionIcon.src = isExpanded ? '/static/icons/down.png' : '/static/icons/up.png';
            });*/
        }
    });

    blocksMenuContainer.style.display = 'block'; //'none';
    workspace.getParentSvg().parentNode.appendChild(blocksMenuContainer);

    blocksMenuToggleBtn.addEventListener('click', () => {
        const isMenuOpen = blocksMenuContainer.style.display === 'block';
        blocksMenuContainer.style.display = isMenuOpen ? 'none' : 'block';
        toggleIcon.src = isMenuOpen ? '/static/icons/down.png' : '/static/icons/up.png';
    });
}

/*

  <block type="variables_change" id="m12" x="10" y="10">
    <field name="VAR">item</field>
    <field name="DELTA">1</field>
  </block>

  <block type="aggregate_operations" id="agg1" x="10" y="20">
    <field name="AGGREGATE_OP">SUM</field>
  </block>