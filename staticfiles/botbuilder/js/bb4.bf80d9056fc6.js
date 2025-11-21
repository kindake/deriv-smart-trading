// Define a global variable for the selected symbol
let selectedSymbol = null;

// Run fetchAllData on page load
document.addEventListener('DOMContentLoaded', fetchAllData);

let userSelections = {
    market: null,
    submarket: null,
    symbol: null,
};

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

        // Log the response data
        console.log("Contracts data received:", contractData);

        // Pass the data to populateBlockDropdowns
        populateBlockDropdowns(contractData);

    } catch (error) {
        // Log any errors that occur during fetch or processing
        console.error("Error fetching contracts data:", error);
    }
    //populateBlockDropdowns(blockType, data);
}

function populateDropdowns(marketData, assetData) {
    const workspace = Blockly.getMainWorkspace();
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
        //populateTradeTypeDropdowns(userSelections.symbol, assetData);
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
            fetchContracts(userSelections.symbol);
        } else {
            // Force update to refresh the display
            const currentValue = userSelections.symbol;
            symbolDropdown.setValue(null); // Clear temporarily
            symbolDropdown.setValue(currentValue); // Reset to refresh

            // Fetch contracts immediately after setting the symbol
            fetchContracts(userSelections.symbol);
        }
    }

    // Initialize submarket and symbol dropdowns
    updateSubmarketAndSymbol(userSelections.market);

    // Add event listeners for manual changes
    marketDropdown.setValidator(value => {
        userSelections.market = value;
        updateSubmarketAndSymbol(value);
        return value;
    });

    submarketDropdown.setValidator(value => {
        userSelections.submarket = value;
        updateSymbols(userSelections.market, value);
        return value;
    });

    symbolDropdown.setValidator(value => {
        userSelections.symbol = value;
        selectedSymbol = value; // Update the global variable
        populateTradeTypeDropdowns(value, assetData);
        return value;
    });
}

let blockType; // Declare it in a higher scope

function manageDynamicBlock(toInput, newBlockType) {
    // Manage the block and decide the block type
    blockType = newBlockType; // Set the blockType
    console.log("Block type set to:", blockType); // Log for debugging

    if (!toInput) {
        console.error('"to" input not found or is invalid.');
        return;
    }

    const workspace = Blockly.getMainWorkspace();
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
        } else {
            console.error("Failed to connect: Invalid connection points.");
        }
    } else {
        console.log(`Block of type ${newBlockType} already exists.`);
    }
}

function populateBlockDropdowns(contractData) {
    console.log("Contract data received for dropdown population:", contractData);
    console.log("Using block type:", blockType); // Log the blockType being used
    console.log("Current dropdown values:", dropdownValues); // Access global variable

    //const dropdownField = block.getField('NAME'); // Adjust field name as per block definition

    switch (blockType) {

    case "Growth_Rate":
        try {
            // Ensure the required structure exists
            if (
                contractData &&
                contractData.data &&
                contractData.data.accumulator &&
                contractData.data.accumulator.contracts &&
                Array.isArray(contractData.data.accumulator.contracts) &&
                contractData.data.accumulator.contracts.length > 0
            ) {
                // Navigate to the growth_rate_range data
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
                    const GrowthRateDropdown = GrowthRateBlock.getField('grv');

                    if (!GrowthRateDropdown) {
                        console.error("One or more dropdown fields are missing in the GrowthRate block.");
                        return;
                    }

                    const growthRateOptions = growthRateRange.map(rate => [`${rate}%`, rate]);

                    // Populate the dropdown
                    GrowthRateDropdown.menuGenerator_ = growthRateOptions;

                    // Set the default value to the first option
                    GrowthRateDropdown.setValue(growthRateOptions[0][1]);
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
                    const MultiplierDropdown = MultiplierBlock.getField('mv'); // Replace 'mv' with the actual field name for the Multiplier dropdown

                    if (!MultiplierDropdown) {
                        console.error("Dropdown field is missing in the Multiplier block.");
                        return;
                    }

                    // Convert multiplier range data into dropdown options
                    const multiplierOptions = multiplierRange.map(multiplier => [`${multiplier}`, multiplier]);

                    // Populate the dropdown
                    MultiplierDropdown.menuGenerator_ = multiplierOptions;

                    // Set the default value to the first option
                    MultiplierDropdown.setValue(multiplierOptions[0][1]);
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
        case "Duration_HD":
        case "Duration_T":
        case "Duration_I":
            // Handle other block types similarly
            const durationOptions = contractData.duration_options.map(option => [option.name, option.value]);
            dropdownField.menuGenerator_ = durationOptions;
            dropdownField.setValue(durationOptions[0][1]);
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

    if (!tradeTypeBlock || !contractTypeBlock) {
        console.error("Required blocks not found in workspace.");
        return;
    }

    const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
    const tradeTypeDropdown2 = tradeTypeBlock.getField('NAME');
    const contractTypeDropdown = contractTypeBlock.getField('NAME');

    const assetEntry = assetData.find(asset => asset.symbol === selectedSymbol);
    if (!assetEntry) {
        console.error("No asset data fountradeTypeDropdown1d for the selected symbol:", selectedSymbol);
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
    const previousFirstDropdownValue = tradeTypeDropdown1.getValue();
    const previousSecondDropdownValue = tradeTypeDropdown2.getValue();
    const previousContractDropdownValue = contractTypeDropdown.getValue();

    // Update first dropdown options
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    const newFirstDropdownValue = firstDropdownOptions.find(opt => opt[1] === previousFirstDropdownValue)
        ? previousFirstDropdownValue
        : firstDropdownOptions[0][1];
    tradeTypeDropdown1.setValue(newFirstDropdownValue);

    // Print the desired statement
    console.log(`tradeTypeDropdown1.setValue(${newFirstDropdownValue});`);
    //appendTradeBlock(newFirstDropdownValue);

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
    }

    updateSecondDropdown(tradeTypeDropdown1.getValue());
/*
    // Set validator with block management logic
    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);

        // Determine the new block type
        const newBlockType = {
            "Accumulators": "Growth_Rate",
            "Multipliers": "Multiplier",
            "Digits": "Duration_HD",
            "High/Low Ticks": "Duration_HD",
            "Touch/No Touch": "Duration_T",
            "In/Out": "Duration_I",
        }[selectedCategory] || "Duration";

        // Manage blocks in the "to" field
        const tradeParametersBlock = workspace.getBlocksByType('tradeparameters')[0];
        if (tradeParametersBlock) {
            const toInput = tradeParametersBlock.getInput('to');
            manageDynamicBlock(toInput, newBlockType);
        }

        return selectedCategory;
    });

    tradeTypeDropdown2.setValidator(newValue => {
        updateContractTypeOptions(newValue);
        return newValue;
    });*/

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

        // Manage blocks in the "to" field
        const tradeParametersBlock = workspace.getBlocksByType('tradeparameters')[0];
        if (tradeParametersBlock) {
            const toInput = tradeParametersBlock.getInput('to');
            manageDynamicBlock(toInput, newBlockType);
        }

        return newValue;
    });

    // Remove block management logic from tradeTypeDropdown1
    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory; // Retain only dropdown updates
    });

    // Log initial values
    dropdownValues.firstDropdown = tradeTypeDropdown1.getValue();
    dropdownValues.secondDropdown = tradeTypeDropdown2.getValue();
    dropdownValues.contractDropdown = contractTypeDropdown.getValue();
}

async function startDataFetching() {
    await fetchAllData();
    await fetchContracts();
    setTimeout(startDataFetching, 1000);
}
startDataFetching();

const tradeparameters = {
  init: function() {
    this.appendDummyInput('tpd')
      .appendField(new Blockly.FieldLabelSerializable('1.Trade parameters                 '), 'tpl');
    this.appendStatementInput('tp');
    this.appendDummyInput('rod')
      .appendField(new Blockly.FieldLabelSerializable('Run once at start:'), 'roatl');
    this.appendStatementInput('roat');
    this.appendDummyInput('tod')
      .appendField(new Blockly.FieldLabelSerializable('Trade options:'), 'tol');
    this.appendStatementInput('to');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({tradeparameters: tradeparameters});

const market = {
  init: function() {
    this.appendDummyInput('mk')
      .appendField(new Blockly.FieldLabelSerializable('market:  '), 'mkt')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'mkts')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'value:')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'sbmkts')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'smbl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'sl');

    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({market: market});

const Trade_Type = {
  init: function() {
    this.appendDummyInput('tt')
      .appendField(new Blockly.FieldLabelSerializable('Trade Type:  '), 't_t')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'tt1')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'value:')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Trade_Type: Trade_Type});

const Contract_Type = {
  init: function() {
    this.appendDummyInput('ct')
      .appendField(new Blockly.FieldLabelSerializable('Contract Type:  '), 'ct')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Contract_Type: Contract_Type});

const Default_Candle_Interval = {
  init: function() {
    this.appendDummyInput('dci')
      .appendField(new Blockly.FieldLabelSerializable('Default Candle Interval:  '), 'd_c_i')
      .appendField(new Blockly.FieldDropdown([
          ['1 minute', '1m'],
          ['2 minutes', '2m'],
          ['3 minutes', '3m'],
          ['5 minutes', '5m'],
          ['10 minutes', '10m'],
          ['15 minutes', '15m'],
          ['30 minutes', '30m'],
          ['1 hour', '1h'],
          ['2 hour', '2h'],
          ['4 hour', '4h'],
          ['8 hour', '8h'],
          ['1 day', '1d'],
        ]), 'dciv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Default_Candle_Interval: Default_Candle_Interval});

const Restart_buy_sell = {
  init: function() {
    this.appendDummyInput('rbs')
      .appendField(new Blockly.FieldLabelSerializable('Restart buy/sell (disable for better perfomance): '), 'rb/s')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Restart_buy_sell: Restart_buy_sell});


const Restart_last_trade_on_error = {
  init: function() {
    this.appendDummyInput('rltoe')
      .appendField(new Blockly.FieldLabelSerializable('Restart last trade on error (bot ignores the unsuccesful trade):'), 'rltoebitut')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'NAME');
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Restart_last_trade_on_error: Restart_last_trade_on_error});

const Duration = {
  init: function() {
    this.appendDummyInput('dr')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
        ]), 'drd')
      .appendField(new Blockly.FieldNumber(0), 'drv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'lst')
      .appendField(new Blockly.FieldNumber(1, 0.35, 50000), 'st')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000)'), 'lstl');
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration: Duration});

const Multiplier = {
  init: function() {
    this.appendDummyInput('Multiplier')
      .appendField(new Blockly.FieldLabelSerializable('Multiplier:'), 'mt')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'mv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv');
    this.appendStatementInput('NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Multiplier: Multiplier});

const Take_profit = {
  init: function() {
    this.appendDummyInput('tpm')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpm')
      .appendField(new Blockly.FieldNumber(0), 'tpv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profit: Take_profit});

const Stop_Loss = {
  init: function() {
    this.appendDummyInput('slm')
      .appendField(new Blockly.FieldLabelSerializable('Stop Loss : USD'), 'slm')
      .appendField(new Blockly.FieldNumber(0), 'slv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Stop_Loss: Stop_Loss});

const Growth_Rate = {
  init: function() {
    this.appendDummyInput('Growth Rate')
      .appendField(new Blockly.FieldLabelSerializable('Growth Rate:'), 'gr')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'grv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv');
    this.appendStatementInput('NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Growth_Rate: Growth_Rate});

const Take_profit_a = {
  init: function() {
    this.appendDummyInput('tpa')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpu')
      .appendField(new Blockly.FieldNumber(0), 'tpv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profit_a: Take_profit_a});

const Duration_T = {
  init: function() {
    this.appendDummyInput('dr1')
      .appendField(new Blockly.FieldLabelSerializable('Duration: '), 'dr1')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'd1')
      .appendField(new Blockly.FieldNumber(5), 'dv')
      .appendField(new Blockly.FieldLabelSerializable('Stake : USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stuv')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Barrier Offset'), 'bo')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'bod')
      .appendField(new Blockly.FieldNumber(0), 'bov');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_T: Duration_T});

const Duration_I = {
  init: function() {
    this.appendDummyInput('dr1')
      .appendField(new Blockly.FieldLabelSerializable('Duration: '), 'dr1')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'd1')
      .appendField(new Blockly.FieldNumber(5), 'dv')
      .appendField(new Blockly.FieldLabelSerializable('Stake : USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stuv')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Barrier Offset'), 'bo')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'bod')
      .appendField(new Blockly.FieldNumber(0), 'bov')
      .appendField(new Blockly.FieldLabelSerializable('Low barrier Offset'), 'NAME')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'lbod')
      .appendField(new Blockly.FieldNumber(0), 'lbov');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_I: Duration_I});

const Duration_HD = {
  init: function() {
    this.appendDummyInput('dr1')
      .appendField(new Blockly.FieldLabelSerializable('Duration: '), 'dr1')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'd1')
      .appendField(new Blockly.FieldNumber(5), 'dv')
      .appendField(new Blockly.FieldLabelSerializable('Stake : USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stuv')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Prediction:'), 'bo')
      .appendField(new Blockly.FieldNumber(1), 'bov');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_HD: Duration_HD});

console.log(typeof tradeParameters); // Should output "string"

const IndicatorBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="10" y="10">
        <statement name="tp">
          <block type="market">
            <next>
              <block type="Trade_Type">
                <next>
                  <block type="Contract_Type">
                    <next>
                      <block type="Default_Candle_Interval">
                        <next>
                          <block type="Restart_buy_sell">
                            <next>
                              <block type="Restart_last_trade_on_error"></block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
        <statement name="to">
            <block type="Duration"></block>
        </statement>
      </block>
      <block id="trade_param_2" type="Duration" x="10" y="550"></block>
      <block id="trade_param_3" type="Multiplier" x="10" y="650"></block>
      <block id="trade_param_4" type="Take_profit" x="10" y="950"></block>
      <block id="trade_param_5" type="Stop_Loss" x="10" y="1050"></block>
      <block id="trade_param_6" type="Growth_Rate" x="10" y="1150"></block>
      <block id="trade_param_7" type="Take_profit_a" x="10" y="1550"></block>

    </xml>
`;

/*
const tradeParametersBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="tradeparameters" x="10" y="420"></block>
      <block id="trade_param_2" type="market" x="10" y="90"></block>
      <block id="trade_param_2" type="Trade_Type" x="10" y="20"></block>
      <block id="trade_param_2" type="Contract_Type" x="10" y="120"></block>
      <block id="trade_param_2" type="Default_Candle_Interval" x="10" y="170"></block>
    </xml>
`;
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

document.addEventListener('DOMContentLoaded', function () {
    createWorkspace();
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
        }
    });

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
}

// Attach the event listener to the workspace
/*document.addEventListener('DOMContentLoaded', () => {
    Blockly.getMainWorkspace().addChangeListener(handleDropdownChange);
});
*/
function createQuickStrategyButton(workspace) {
    const quickStrategyBtn = document.createElement('button');
    quickStrategyBtn.id = 'quickStrategy';
    quickStrategyBtn.innerText = 'Quick strategy';
    quickStrategyBtn.style = 'position: absolute; top: 5px; left: 5px; background-color: red; color: white; padding: 10px 45px; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: bold; z-index: 10;';
    workspace.getParentSvg().parentNode.appendChild(quickStrategyBtn);
}

function createBlocksMenuButton(workspace) {
    const blocksMenuToggleBtn = document.createElement('button');
    blocksMenuToggleBtn.id = 'blockMenuToggle';
    blocksMenuToggleBtn.style = 'display: flex; align-items: center; position: absolute; top: 45px; left: 5px; background-color: #f1f1f1; color: black; padding: 7px 31px; border: 1px solid #ccc; border-radius: 2px; cursor: pointer; font-size: 12px; font-weight: bold; z-index: 10;';

    const buttonContent = document.createElement('div');
    buttonContent.style = 'display: flex; justify-content: space-between; width: 100%;';

    const buttonText = document.createElement('span');
    buttonText.innerText = 'Blocks menu';
    buttonText.style.marginRight = '10px';

    const toggleIcon = document.createElement('img');
    toggleIcon.id = 'toggleIcon';
    toggleIcon.src = '/static/icons/down.png';
    toggleIcon.style = 'width: 15px; height: 15px;';

    buttonContent.appendChild(buttonText);
    buttonContent.appendChild(toggleIcon);
    blocksMenuToggleBtn.appendChild(buttonContent);
    workspace.getParentSvg().parentNode.appendChild(blocksMenuToggleBtn);

    const blocksMenuContainer = document.createElement('div');
    blocksMenuContainer.id = 'blocksMenuContainer';
    blocksMenuContainer.style = 'position: absolute; top: 78.5px; left: 5px; width: 170px; display: block; background-color: #f1f1f1; border: 1px solid #ccc; border-radius: 2px; z-index: 10; height: 350px;'; //  height: 400px; overflow-y:

    const searchBarContainer = document.createElement('div');
    searchBarContainer.style = 'padding: 10px; background-color: #f1f1f1; position: sticky; top: 0; z-index: 11;';  // Make the search bar sticky
    //searchBarContainer.style.padding = '10px';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'blockSearch';
    searchInput.placeholder = 'Search blocks...';
    searchInput.style = 'width: 100%; padding: 2px; border: 1px solid #ccc; border-radius: 3px;';

    searchBarContainer.appendChild(searchInput);
    blocksMenuContainer.appendChild(searchBarContainer);

    const blockSectionsContainer = document.createElement('div');
    blockSectionsContainer.id = 'blockSectionsContainer';
    blockSectionsContainer.style = 'height: 100%; overflow-y: auto;'; //'height: 100%; overflow-y: auto;'; // Make the entire container scrollable

    const sections = ['Trade parameters', 'Purchase conditions', 'Sell conditions (optional)', 'Restart trading conditions', 'Analysis', 'Utility'];

    sections.forEach((sectionName) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'blockSection';
        sectionDiv.style = 'padding: 10px; border-bottom: 1px solid #ccc; cursor: pointer;';

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
        modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 370px; height: 370px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto; overflow-x: hidden;';
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
                const tempWorkspaceDiv = document.createElement('div');
                tempWorkspaceDiv.style = 'width: 370px; height: 870px;'; // "width: 100%; height: 100%; overflow: hidden;" //

                modal.appendChild(tempWorkspaceDiv);
                const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                    toolbox: null,
                    horizontalLayout: false,
                    move: {
                        scrollbars: {
                          horizontal: false,
                          vertical: true
                        },
                        drag: true,
                        wheel: true,
                    },
                    renderer: 'zelos'  // Use the 'zelos' renderer
                });

                // Resize the workspace when the modal is opened
                const resizeWorkspace = () => {
                    Blockly.svgResize(tempWorkspace);
                };

                tempWorkspace.resize();
                setTimeout(() => {
                    Blockly.Xml.domToWorkspace(sectionBlocksXml, tempWorkspace);
                    tempWorkspace.resize();
                }, 0);

                // Optional: Resize the workspace when the window is resized or on modal interactions
                window.addEventListener('resize', resizeWorkspace);

                let isDragging = false;
                let draggedBlockXml = null;
                let addedBlock = null;
                let mainBlock = null;

                let mouseLocation = { x: 0, y: 0 }; // Declare this variable outside the scope to capture globally

                // Add a click event listener to record mouse position when clicked
                document.addEventListener('click', (event) => {
                    mouseLocation = {
                        x: event.clientX, // mouse x position
                        y: event.clientY  // mouse y position
                    };
                    console.log('Mouse Location on click:', mouseLocation);
                });

                tempWorkspace.addChangeListener((event) => {
                    if (event.type === Blockly.Events.BLOCK_DRAG && event.isStart) {
                        const block = tempWorkspace.getBlockById(event.blockId);
                        draggedBlockXml = Blockly.Xml.blockToDom(block);

                        // Convert block position in temp workspace to main workspace
                        let blockPosition = block.getRelativeToSurfaceXY();
                        let screenPosition = Blockly.utils.svgMath.wsToScreenCoordinates(tempWorkspace, blockPosition)
                        //let screenPosition = Blockly.utils.svgMath.workspaceToScreenCoordinates(tempWorkspace, blockPosition);

                        console.log('Block position in workspace coordinates:', blockPosition);

                        console.log('Block position in screen coordinates:', screenPosition);

                        // Dispose the block in the temp workspace
                        block.dispose(false, false);

                        // Hide modal
                        modal.style.display = 'none';

                        console.log('Mouse Location on drag start:', mouseLocation);

                        // Add block to the main workspace
                        var mainBlockXml = document.createElement('xml');
                        mainBlockXml.appendChild(draggedBlockXml);
                        Blockly.Xml.domToWorkspace(mainBlockXml, workspace);

                        // Find the newly added block in the main workspace
                        var newBlock = workspace.getBlockById(event.blockId);

                        // Step 2: Convert mouse screen coordinates to workspace coordinates
                        let workspacePosition = Blockly.utils.svgMath.screenToWsCoordinates(workspace, mouseLocation);

                        // Move the block to the mouse location in the main workspace
                        if (!isNaN(workspacePosition.x) && !isNaN(workspacePosition.y)) {
                            newBlock.moveBy(screenPosition.x, screenPosition.y);
                        } else {
                            console.error('Invalid coordinates for block movement:', workspacePosition);
                        }

                        console.log('Block moved to:', workspacePosition);

                    }
                });


                window.addEventListener('click', (event) => {
                    if (modal.style.display === 'block' && !modal.contains(event.target) && event.target !== sectionDiv) {
                        modal.style.display = 'none';
                    }
                });
            }
        });

        if (sectionName === 'Analysis' || sectionName === 'Utility') {
            const subsectionContainer = document.createElement('div');
            subsectionContainer.style = 'display: none; padding-left: 2px;';

            const subsections = (sectionName === 'Analysis')
                ? ['Indicator', 'Tick and candle analysis', 'Contract', 'stats']
                : ['Custom Functions', 'Variables' , 'Notifications', 'Time', 'Math', 'Text', 'Logic', 'Lists', 'Loops', 'Miscellaneous'];

            subsections.forEach(subsectionName => {
                const subsectionDiv = document.createElement('div');
                subsectionDiv.className = 'subsection';
                subsectionDiv.style = 'padding: 5px 0; cursor: pointer;';
                subsectionDiv.innerText = subsectionName;
                subsectionContainer.appendChild(subsectionDiv);

                const modal = document.createElement('div');
                modal.className = 'sectionModal';
                modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 370px; height: 370px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;  overflow: auto;';
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
                        case 'starts':
                            sectionBlockXml = Blockly.utils.xml.textToDom(StartsBlocks);
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
                        const tempWorkspaceDiv = document.createElement('div');
                        tempWorkspaceDiv.style = 'width: 370px; height: 370px;';

                        modal.appendChild(tempWorkspaceDiv);
                        const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                            toolbox: null,
                            horizontalLayout: false,
                            theme: myTheme,  // Apply the custom theme
                            renderer: 'zelos',  // Use the 'zelos' renderer
                            move: {
                                scrollbars: {
                                  horizontal: false,
                                  vertical: true
                                },
                                drag: true,
                                wheel: true,
                            },
                        });

                        // Resize the workspace when the modal is opened
                        const resizeWorkspace = () => {
                            Blockly.svgResize(tempWorkspace);
                        };

                        tempWorkspace.resize();

                        setTimeout(() => {
                            Blockly.Xml.domToWorkspace(sectionBlockXml, tempWorkspace);
                            tempWorkspace.resize();
                        }, 0);

                        let isDragging = false;
                        let draggedBlockXml = null;
                        let addedBlock = null;
                        let mainBlock = null;

                        tempWorkspace.addChangeListener((event) => {
                            if (event.type === Blockly.Events.BLOCK_DRAG) {
                                const block = tempWorkspace.getBlockById(event.blockId);
                                draggedBlockXml = Blockly.Xml.blockToDom(block);
                                const mainBlockXml = document.createElement('xml');
                                mainBlockXml.appendChild(draggedBlockXml);

                                // Capture all blocks before adding the new one
                                var initialBlocks = workspace.getAllBlocks();
                                //block.dispose(false, false);

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
                subsectionContainer.style.display = isExpanded ? 'none' : 'block';
                toggleSectionIcon.src = isExpanded ? '/static/icons/down.png' : '/static/icons/up.png';
            });
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

why is the last nested statement not changing when the first dropdown named tt1 upate t something elese like accumulators or multippliers?  (
function populateTradeTypeDropdowns(selectedSymbol, assetData) {
    const workspace = Blockly.getMainWorkspace();
    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
    const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];

    if (!tradeTypeBlock || !contractTypeBlock) {
        console.error("Required blocks not found in workspace.");
        return;
    }

    const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1');
    const tradeTypeDropdown2 = tradeTypeBlock.getField('NAME');
    const contractTypeDropdown = contractTypeBlock.getField('NAME');

    const assetEntry = assetData.find(asset => asset.symbol === selectedSymbol);
    if (!assetEntry) {
        console.error("No asset data found for the selected symbol:", selectedSymbol);
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
    const previousFirstDropdownValue = tradeTypeDropdown1.getValue();
    const previousSecondDropdownValue = tradeTypeDropdown2.getValue();
    const previousContractDropdownValue = contractTypeDropdown.getValue();

    // Update first dropdown options
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    const newFirstDropdownValue = firstDropdownOptions.find(opt => opt[1] === previousFirstDropdownValue)
        ? previousFirstDropdownValue
        : firstDropdownOptions[0][1];
    tradeTypeDropdown1.setValue(newFirstDropdownValue);

    // Print the desired statement
    console.log(`tradeTypeDropdown1.setValue(${newFirstDropdownValue});`);
    //appendTradeBlock(newFirstDropdownValue);

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
    }

    updateSecondDropdown(tradeTypeDropdown1.getValue());

    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory;
    });

    tradeTypeDropdown2.setValidator(newValue => {
        updateContractTypeOptions(newValue);
        return newValue;
    });
}

async function startDataFetching() {
    await fetchAllData();
    //await fetchAssetData();
    setTimeout(startDataFetching, 1000);
}
startDataFetching();


const tradeparameters = {
  init: function() {
    this.appendDummyInput('tpd')
      .appendField(new Blockly.FieldLabelSerializable('1.Trade parameters                 '), 'tpl');
    this.appendStatementInput('tp');
    this.appendDummyInput('rod')
      .appendField(new Blockly.FieldLabelSerializable('Run once at start:'), 'roatl');
    this.appendStatementInput('roat');
    this.appendDummyInput('tod')
      .appendField(new Blockly.FieldLabelSerializable('Trade options:'), 'tol');
    this.appendStatementInput('to');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({tradeparameters: tradeparameters});

const Trade_Type = {
  init: function() {
    this.appendDummyInput('tt')
      .appendField(new Blockly.FieldLabelSerializable('Trade Type:  '), 't_t')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'tt1')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'value:')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Trade_Type: Trade_Type});

const Contract_Type = {
  init: function() {
    this.appendDummyInput('ct')
      .appendField(new Blockly.FieldLabelSerializable('Contract Type:  '), 'ct')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Contract_Type: Contract_Type});

const Duration = {
  init: function() {
    this.appendDummyInput('dr')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
        ]), 'drd')
      .appendField(new Blockly.FieldNumber(0), 'drv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'lst')
      .appendField(new Blockly.FieldNumber(1, 0.35, 50000), 'st')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000)'), 'lstl');
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration: Duration});

const Multiplier = {
  init: function() {
    this.appendDummyInput('Multiplier')
      .appendField(new Blockly.FieldLabelSerializable('Multiplier:'), 'mt')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'mv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv');
    this.appendStatementInput('NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Multiplier: Multiplier});

const Take_profit = {
  init: function() {
    this.appendDummyInput('tpm')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpm')
      .appendField(new Blockly.FieldNumber(0), 'tpv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profit: Take_profit});

const Growth_Rate = {
  init: function() {
    this.appendDummyInput('Growth Rate')
      .appendField(new Blockly.FieldLabelSerializable('Growth Rate:'), 'gr')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'grv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv');
    this.appendStatementInput('NAME');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Growth_Rate: Growth_Rate});

const IndicatorBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="10" y="10">
        <statement name="tp">
          <block type="market">
            <next>
              <block type="Trade_Type">
                <next>
                  <block type="Contract_Type">
                    <next>
                      <block type="Default_Candle_Interval">
                        <next>
                          <block type="Restart_buy_sell">
                            <next>
                              <block type="Restart_last_trade_on_error"></block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
        <statement name="to">
            <block type="Duration"></block>
        </statement>
      </block>
      <block id="trade_param_2" type="Duration" x="10" y="550"></block>
      <block id="trade_param_3" type="Multiplier" x="10" y="650"></block>
      <block id="trade_param_4" type="Take_profit" x="10" y="950"></block>
      <block id="trade_param_5" type="Stop_Loss" x="10" y="1050"></block>
      <block id="trade_param_6" type="Growth_Rate" x="10" y="1150"></block>
      <block id="trade_param_7" type="Take_profit_a" x="10" y="1550"></block>

    </xml>
`;

document.addEventListener('DOMContentLoaded', function () {
    createWorkspace();
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
        }
    });

    createQuickStrategyButton(workspace);
    createBlocksMenuButton(workspace);
}

// Function to handle dynamic changes in the nested block
function handleDropdownChange(event) {
    // Ensure the event is for a field change and the block is the desired one
    if (event.type === Blockly.Events.CHANGE && event.element === 'field' && event.name === 'tt1') {
        const block = Blockly.getMainWorkspace().getBlockById(event.blockId);

        if (block && block.type === 'Trade_Type') {
            // Get the new value of the first dropdown
            const newFirstDropdownValue = event.newValue;

            // Get the parent block (in this case, "tradeparameters")
            const parentBlock = block.getParent();
            if (!parentBlock || parentBlock.type !== 'tradeparameters') return;

            // Get the `to` statement field
            const statementConnection = parentBlock.getInputTargetBlock('to');

            // Remove the existing block in the "to" field, if any
            if (statementConnection) {
                statementConnection.dispose();
            }

            // Determine the new block type based on the dropdown value
            let newBlockType = 'Duration'; // Default block
            if (newFirstDropdownValue === 'Accumulations') {
                newBlockType = 'Growth_Rate';
            } else if (newFirstDropdownValue === 'Multipliers') {
                newBlockType = 'Multiplier';
            }

            // Create the new block and connect it
            const newBlock = Blockly.getMainWorkspace().newBlock(newBlockType);
            newBlock.initSvg();
            newBlock.render();

            // Connect the new block to the "to" field
            const toInput = parentBlock.getInput('to');
            if (toInput) {
                newBlock.outputConnection.connect(toInput.connection);
            }

            // Print the desired statement (for debugging)
            console.log(`Changed nested block to: ${newBlockType}`);
        }
    }
}

// Attach the event listener to the workspace
Blockly.getMainWorkspace().addChangeListener(handleDropdownChange); )

*/