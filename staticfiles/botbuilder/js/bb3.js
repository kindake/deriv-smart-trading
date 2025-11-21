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

    } catch (error) {
        console.error("Error fetching data:", error);
    }
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

    // Function to update submarket and symbol dropdowns based on selected market
    function updateSubmarketAndSymbol(selectedMarket) {
        const submarkets = Object.keys(marketData[selectedMarket].submarkets).map(submarket => {
            const isClosed = marketData[selectedMarket].submarkets[submarket].status === 'closed';
            return [isClosed ? `${submarket} (closed)` : submarket, submarket];
        });
        submarketDropdown.menuGenerator_ = submarkets;

        const firstSubmarket = submarkets[0][1];
        userSelections.submarket = firstSubmarket;
        submarketDropdown.setValue(firstSubmarket);

        const symbols = marketData[selectedMarket].submarkets[firstSubmarket].symbols.map(symbol => {
            const isClosed = symbol.is_open !== 'open';
            return [isClosed ? `${symbol.display_name} (closed)` : symbol.display_name, symbol.symbol];
        });
        symbolDropdown.menuGenerator_ = symbols;

        const firstSymbol = symbols[0][1];
        userSelections.symbol = firstSymbol;
        symbolDropdown.setValue(firstSymbol);

        // Populate trade type dropdowns based on the selected symbol
        populateTradeTypeDropdowns(firstSymbol, assetData);
    }

    updateSubmarketAndSymbol(selectedMarket);

    // Event listeners to dynamically update dropdowns
    marketDropdown.setValidator(value => {
        userSelections.market = value;
        updateSubmarketAndSymbol(value);
        return value;
    });

    submarketDropdown.setValidator(value => {
        userSelections.submarket = value;
        const symbols = marketData[userSelections.market].submarkets[value].symbols.map(symbol => {
            const isClosed = symbol.is_open !== 'open';
            return [isClosed ? `${symbol.display_name} (closed)` : symbol.display_name, symbol.symbol];
        });
        symbolDropdown.menuGenerator_ = symbols;

        const firstSymbol = symbols[0][1];
        userSelections.symbol = firstSymbol;
        symbolDropdown.setValue(firstSymbol);

        return value;
    });

    symbolDropdown.setValidator(value => {
        userSelections.symbol = value;
        populateTradeTypeDropdowns(value, assetData);
        return value;
    });
}


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
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    tradeTypeDropdown1.setValue(firstDropdownOptions[0][1]);

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

        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(secondDropdownOptions[0][1]);

        // Add event listener to log the selected value
        tradeTypeDropdown2.setValidator(newValue => {
            console.log(`Currently selected option in Second Dropdown: ${newValue}`);
            processContractTypeOptions(newValue);
            return newValue;
        });
    }

    function processContractTypeOptions(optionValue) {
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

        contractTypeDropdown.menuGenerator_ = contractTypeOptions;
        contractTypeDropdown.setValue(contractTypeOptions[0][1]);
    }

    updateSecondDropdown(tradeTypeDropdown1.getValue());

    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory;
    });
}

/*
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
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    tradeTypeDropdown1.setValue(firstDropdownOptions[0][1]);

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

        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(secondDropdownOptions[0][1]);

        // Populate the Contract_Type dropdown based on the selected option in tradeTypeDropdown2
        processContractTypeOptions();

        console.log(`Second Dropdown Options for ${selectedCategory}:`, secondDropdownOptions);
        console.log(`Currently selected option in Second Dropdown:`, tradeTypeDropdown2.getValue());
    }

    function processContractTypeOptions() {
        const optionValue = tradeTypeDropdown2.getValue();

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

        contractTypeDropdown.menuGenerator_ = contractTypeOptions;
        contractTypeDropdown.setValue(contractTypeOptions[0][1]);
    }

    updateSecondDropdown(tradeTypeDropdown1.getValue());

    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory;
    });

    contractTypeDropdown.setValidator(newValue => {
        console.log("Selected option in Contract Type Dropdown:", newValue);
        return newValue;
    });
}

/*
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
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    tradeTypeDropdown1.setValue(firstDropdownOptions[0][1]);

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

        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(secondDropdownOptions[0][1]);

        // Process and populate the Contract_Type dropdown
        const selectedOption = tradeTypeDropdown2.getValue();
        //const processedOptions = processContractTypeOptions(selectedOption);
        const processedOptions = processContractTypeOptions(tradeTypeDropdown2.getValue());
        contractTypeDropdown.menuGenerator_ = processedOptions;
        contractTypeDropdown.setValue(processedOptions[0][1]);

        console.log(`Second Dropdown Options for ${selectedCategory}:`, secondDropdownOptions);
        console.log(`Currently selected option in Second Dropdown:`, tradeTypeDropdown2.getValue());
    }

    function processContractTypeOptions(optionValue) {
        // Remove the prefix (e.g., 'callput-')
        const cleanOptionValue = optionValue.includes('-') ? optionValue.split('-')[1] : optionValue;

        if (cleanOptionValue.includes('/')) {
            // Split the value around the slash to get individual options
            const [firstPart, secondPart] = cleanOptionValue.split('/');
            return [
                ["Both", "both"],
                [firstPart.trim(), firstPart.trim()],
                [secondPart.trim(), secondPart.trim()]
            ];
        } else {
            return [[cleanOptionValue, cleanOptionValue]];
        }
    }
/*
    function processContractTypeOptions(optionValue) {
        if (optionValue.includes('/')) {
            const [firstPart, secondPart] = optionValue.split('/');
            return [
                ["Both", "both"],
                [firstPart.trim(), firstPart.trim()],
                [secondPart.trim(), secondPart.trim()]
            ];
        } else {
            return [[optionValue, optionValue]];
        }
    }
*/
/*    updateSecondDropdown(tradeTypeDropdown1.getValue());

    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory;
    });

    contractTypeDropdown.setValidator(newValue => {
        console.log("Selected option in Contract Type Dropdown:", newValue);
        return newValue;
    });
}

/*
function populateTradeTypeDropdowns(selectedSymbol, assetData) {
    const workspace = Blockly.getMainWorkspace();
    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];
    const contractTypeBlock = workspace.getBlocksByType('Contract_Type')[0];


    //if (!tradeTypeBlock) {
        //console.error("Trade Type block not found in workspace.");
        //return;
    //}

    if (!tradeTypeBlock || !contractTypeBlock) {
        console.error("Required blocks not found in workspace.");
        return;
    }

    const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1'); // First dropdown for main categories
    const tradeTypeDropdown2 = tradeTypeBlock.getField('NAME'); // Second dropdown for contract types
    const contractTypeDropdown = contractTypeBlock.getField('NAME');

    // Find the asset data entry for the selected symbol
    const assetEntry = assetData.find(asset => asset.symbol === selectedSymbol);
    if (!assetEntry) {
        console.error("No asset data found for the selected symbol:", selectedSymbol)
        return;
    }

    // Define the category mappings
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

    // Define predefined options for specific contract types
    const predefinedOptions = {
        "High/Low Ticks": [
            ["High Ticks/Low Ticks", " High Ticks/Low Ticks"]
        ],
        "Accumulators": [
            ["Buy", "Buy"]
        ],
        "Multipliers": [
            ["Up/Down", "Up/Down"]
        ],
        "Asians": [
            ["Asian Up/Asian Down", "Asian Up/Asian Down"],
        ],
        "Digits": [
            ["Matches/Differs", "Matches/Differs"],
            ["Even/Odd", "Even/Odd"],
            ["Over/Under", "Over/Under"]
        ],
        "callputequal": [
            ["Rise Equals/Fall Equals", "Rise Equals/Fall Equals"]
        ]
    };

    // Helper function to get relevant categories based on the symbol's options
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

    // Get categories based on the selected symbol’s available contract types
    const symbolCategories = getCategoryMappings(assetEntry.options);

    // Populate the first dropdown with categories that have matching options for the symbol
    const firstDropdownOptions = Object.keys(symbolCategories).map(name => [name, name]);
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    tradeTypeDropdown1.setValue(firstDropdownOptions[0][1]); // Default to the first option

    // Function to update the second dropdown based on the selected option in the first dropdown
    function updateSecondDropdown(selectedCategory) {
        let secondDropdownOptions = [];

        // Check if the selected category has both `callput` and `callputequal`
        const hasCallPutEqual = symbolCategories[selectedCategory] &&
            symbolCategories[selectedCategory].some(option => option.contract_type === "callputequal");

        const hasCallPut = symbolCategories[selectedCategory] &&
            symbolCategories[selectedCategory].some(option => option.contract_type === "callput");

        if (hasCallPutEqual || hasCallPut) {
            // Add `callput` if available
            if (hasCallPut) {
                const callPutOptions = symbolCategories[selectedCategory].filter(option => option.contract_type === "callput");
                secondDropdownOptions = callPutOptions.map(option => [
                    option.name, // Display name for `callput`
                    option.contract_type + '-' + option.name
                ]);
            }

            // Add the predefined option for `callputequal`
            if (hasCallPutEqual && predefinedOptions["callputequal"]) {
                secondDropdownOptions.push(predefinedOptions["callputequal"][0]);
            }
        } else if (predefinedOptions[selectedCategory]) {
            // Use predefined options for the category if it exists
            secondDropdownOptions = predefinedOptions[selectedCategory];
        } else {
            // Use contract options from symbolCategories for other categories
            const contractOptions = symbolCategories[selectedCategory] || [];
            secondDropdownOptions = contractOptions.map(option => [
                option.name, // Display name
                option.contract_type + '-' + option.name // Unique identifier
            ]);

            // If no options are available, provide a placeholder
            if (secondDropdownOptions.length === 0) {
                secondDropdownOptions.push(["No options available", "no_option"]);
            }
        }

        // Update the second dropdown with the generated options
        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(secondDropdownOptions[0][1]); // Default to the first option

        // Update Contract_Type dropdown options
        contractTypeDropdown.menuGenerator_ = secondDropdownOptions;
        contractTypeDropdown.setValue(secondDropdownOptions[0][1]);

        console.log(`Second Dropdown Options for ${selectedCategory}:`, secondDropdownOptions);
        console.log(`Currently selected option in Second Dropdown:`, tradeTypeDropdown2.getValue());

    }

    // Initialize the second dropdown based on the initial selection in the first dropdown
    updateSecondDropdown(tradeTypeDropdown1.getValue());

    // Add a validator to update the second dropdown when the first dropdown changes
    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory;
    });

    contractTypeDropdown.setValidator((newValue) => {
        console.log(`Selected option in Contract Type Dropdown:`, newValue);
        return newValue;
    });
}
/*
function populateTradeTypeDropdowns(selectedSymbol, assetData) {
    const workspace = Blockly.getMainWorkspace();
    const tradeTypeBlock = workspace.getBlocksByType('Trade_Type')[0];

    if (!tradeTypeBlock) {
        console.error("Trade Type block not found in workspace.");
        return;
    }

    const tradeTypeDropdown1 = tradeTypeBlock.getField('tt1'); // First dropdown for main categories
    const tradeTypeDropdown2 = tradeTypeBlock.getField('NAME'); // Second dropdown for contract types

    // Find the asset data entry for the selected symbol
    const assetEntry = assetData.find(asset => asset.symbol === selectedSymbol);
    if (!assetEntry) {
        console.error("No asset data found for the selected symbol:", selectedSymbol)
        return;
    }

    // Define the category mappings
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

    // Define predefined options for specific contract types
    const predefinedOptions = {
        "High/Low Ticks": [
            ["High Ticks/Low Ticks", "High/Low Ticks"]
        ],
        "Accumulators": [
            ["Buy", "buy"]
        ],
        "Multipliers": [
            ["Up/Down", "updown"]
        ],
        "Asians": [
            ["Asian Up", "asian_up"],
            ["Asian Down", "asian_down"]
        ],
        "Digits": [
            ["Matches/Differs", "matches_differs"],
            ["Even/Odd", "even_odd"],
            ["Over/Under", "over_under"]
        ],
        "callputequal": [
            ["Rise Equals/Fall Equals", "callputequal"]
        ]
    };

    // Helper function to get relevant categories based on the symbol's options
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

    // Get categories based on the selected symbol’s available contract types
    const symbolCategories = getCategoryMappings(assetEntry.options);

    // Populate the first dropdown with categories that have matching options for the symbol
    const firstDropdownOptions = Object.keys(symbolCategories).map(name => [name, name]);
    tradeTypeDropdown1.menuGenerator_ = firstDropdownOptions;
    tradeTypeDropdown1.setValue(firstDropdownOptions[0][1]); // Default to the first option

    // Function to update the second dropdown based on the selected option in the first dropdown
    function updateSecondDropdown(selectedCategory) {
        let secondDropdownOptions = [];

        // Check if the selected category has both `callput` and `callputequal`
        const hasCallPutEqual = symbolCategories[selectedCategory] &&
            symbolCategories[selectedCategory].some(option => option.contract_type === "callputequal");

        const hasCallPut = symbolCategories[selectedCategory] &&
            symbolCategories[selectedCategory].some(option => option.contract_type === "callput");

        if (hasCallPutEqual || hasCallPut) {
            // Add `callput` if available
            if (hasCallPut) {
                const callPutOptions = symbolCategories[selectedCategory].filter(option => option.contract_type === "callput");
                secondDropdownOptions = callPutOptions.map(option => [
                    option.name, // Display name for `callput`
                    option.contract_type + '-' + option.name
                ]);
            }

            // Add the predefined option for `callputequal`
            if (hasCallPutEqual && predefinedOptions["callputequal"]) {
                secondDropdownOptions.push(predefinedOptions["callputequal"][0]);
            }
        } else if (predefinedOptions[selectedCategory]) {
            // Use predefined options for the category if it exists
            secondDropdownOptions = predefinedOptions[selectedCategory];
        } else {
            // Use contract options from symbolCategories for other categories
            const contractOptions = symbolCategories[selectedCategory] || [];
            secondDropdownOptions = contractOptions.map(option => [
                option.name, // Display name
                option.contract_type + '-' + option.name // Unique identifier
            ]);

            // If no options are available, provide a placeholder
            if (secondDropdownOptions.length === 0) {
                secondDropdownOptions.push(["No options available", "no_option"]);
            }
        }

        // Update the second dropdown with the generated options
        tradeTypeDropdown2.menuGenerator_ = secondDropdownOptions;
        tradeTypeDropdown2.setValue(secondDropdownOptions[0][1]); // Default to the first option
        console.log(`Second Dropdown Options for ${selectedCategory}:`, secondDropdownOptions);
        console.log(`Currently selected option in Second Dropdown:`, tradeTypeDropdown2.getValue());

    }

    // Initialize the second dropdown based on the initial selection in the first dropdown
    updateSecondDropdown(tradeTypeDropdown1.getValue());

    // Add a validator to update the second dropdown when the first dropdown changes
    tradeTypeDropdown1.setValidator(selectedCategory => {
        updateSecondDropdown(selectedCategory);
        return selectedCategory;
    });
}
*/

async function startDataFetching() {
    await fetchAllData();
    //await fetchAssetData();
    setTimeout(startDataFetching, 1000);
}
startDataFetching();

/*
async function startDataFetching() {
    await fetchAllData();
    setInterval(fetchAllData, 1000); // Avoid recursive calls with setInterval
}
startDataFetching();
*/
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
    'workspaceBackgroundColour': '#f4f4f4',  // Optional workspace background color
    'scrollbarColour': '#888'  // Optional scrollbar color
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

/*document.addEventListener('DOMContentLoaded', function () {
    createWorkspace();
});*/

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Blockly workspace, toolbox, and blocks here
    // For example:
    createWorkspace();
    Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox')
    });

    // Apply styles every time a Blockly workspace is rendered
    Blockly.svgResize(Blockly.mainWorkspace);

    // Mutation observer to detect dropdown field changes and apply styles
    const observer = new MutationObserver(() => {
        const dropdownFields = document.querySelectorAll(".blocklyText.blocklyDropdownText");

        dropdownFields.forEach(dropdown => {
            dropdown.style.backgroundColor = "#ffffff";  // White background
            dropdown.style.color = "#000000";            // Black text
            dropdown.style.fontSize = "10px";            // Smaller font size
            dropdown.style.padding = "5px 10px";         // Padding for oval effect
            dropdown.style.borderRadius = "15px";        // Oval shape
            dropdown.style.lineHeight = "1.2";           // Adjust line height

            // Adjusting parent element if necessary for an oval appearance
            const parent = dropdown.closest(".blocklyFieldDropdown");
            if (parent) {
                parent.style.backgroundColor = "#ffffff";
                parent.style.borderRadius = "15px";
            }
        });
    });

    // Start observing the workspace for changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });
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
