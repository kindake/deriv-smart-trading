const ws = new WebSocket("ws://localhost:8000/ws/ticks/");

// 🟢 Initialize global variables to store the latest data
let BALANCE = null;
let ACTIVE_SYMBOLS = null;
let ASSET_INDEX = null;
let CONTRACTS = null;
let TICK_DATA = null;

ws.onopen = function () {
    console.log("✅ WebSocket Connected!");
    ws.send(JSON.stringify({ symbol: "1HZ10V", api_token: "35PRENRMFkhkik1" }));
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data);

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;
    console.log("🟢 Received response event:", response.event, responseData);

    if (response.event === "balance") {
        BALANCE = responseData.balance;
        console.log("💰 Balance Updated:", BALANCE);
    }

    if (response.event === "active_symbols") {
        ACTIVE_SYMBOLS = responseData;
        console.log("📜 Active Symbols Updated:", ACTIVE_SYMBOLS);
        checkAndPopulateDropdowns();  // Check after update
    }

    if (response.event === "asset_index") {
        ASSET_INDEX = responseData;
        console.log("📊 Asset Index Updated:", ASSET_INDEX);
        checkAndPopulateDropdowns();  // Check after update
    }

    if (response.event === "contracts_for") {
        CONTRACTS = responseData;
        console.log("📜 Contracts Updated:", CONTRACTS);
    }

    if ("quote" in response) {
        TICK_DATA = responseData;
        console.log("📈 Tick Data Updated:", TICK_DATA);
    }
};


ws.onclose = function(event) {
    console.log("🔴 WebSocket connection closed.");
};

console.log("⏳ yyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhhhhhhhhhhhhy29780205...");

function checkAndPopulateDropdowns() {
    console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
    console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
    console.log("ASSET_INDEX:", ASSET_INDEX);

    if (ACTIVE_SYMBOLS && ASSET_INDEX) {
        console.log("🚀 Calling populateDropdowns now!");
        populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
    } else {
        console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
    }
}

/*
const ws = new WebSocket("ws://localhost:8001/ws/ticks/");

// 🟢 Initialize global variables to store the latest data
let BALANCE = null;
let ACTIVE_SYMBOLS = null;
let ASSET_INDEX = null;
let CONTRACTS = null;
let TICK_DATA = null;

ws.onopen = function () {
    console.log("✅ WebSocket Connected!");
    ws.send(JSON.stringify({ symbol: "1HZ10V", api_token: "35PRENRMFkhkik1" }));
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data);

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;

    if (response.event === "balance") {
        BALANCE = responseData.balance;  // 🟢 Update BALANCE variable
        console.log("💰 Balance Updated:", BALANCE);

    }
    if (response.event === "active_symbols") {
        ACTIVE_SYMBOLS = responseData;  // 🟢 Update ACTIVE_SYMBOLS variable
        console.log("📜 Active Symbols Updated:", ACTIVE_SYMBOLS);

    }
    if (response.event === "asset_index") {
        ASSET_INDEX = responseData;  // 🟢 Update ASSET_INDEX variable
        console.log("📊 Asset Index Updated:", ASSET_INDEX);

    }
    if (response.event === "contracts_for") {
        CONTRACTS = response;  // 🟢 Update CONTRACTS variable
        console.log("📜 Contracts Updated:", CONTRACTS);

    }
    if ("quote" in response) {
        TICK_DATA = response;  // 🟢 Update TICK_DATA variable
        console.log("📈 Tick Data Updated:", TICK_DATA);

    }

    // ✅ Only call populateDropdowns when both ACTIVE_SYMBOLS & ASSET_INDEX are available
    if (ACTIVE_SYMBOLS && ASSET_INDEX) {
        console.log("🚀 Calling populateDropdowns now!");
        populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
    }
};

ws.onclose = function(event) {
    console.log("🔴 WebSocket connection closed.");
};


/*
const ws = new WebSocket("ws://localhost:8001/ws/ticks/");

// 🟢 Initialize global variables to store the latest data
let BALANCE = null;
let ACTIVE_SYMBOLS = null;
let ASSET_INDEX = null;
let CONTRACTS = null;
let TICK_DATA = null;

ws.onopen = function () {
    console.log("✅ WebSocket Connected!");
    ws.send(JSON.stringify({ symbol: "1HZ10V", api_token: "35PRENRMFkhkik1" }));
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data);

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;

    if (response.event === "balance") {
        BALANCE = responseData.balance;  // 🟢 Update BALANCE variable
        console.log("💰 Balance Updated:", BALANCE);

    } else if (response.event === "active_symbols") {
        ACTIVE_SYMBOLS = response;  // 🟢 Update ACTIVE_SYMBOLS variable
        console.log("📜 Active Symbols Updated:", ACTIVE_SYMBOLS);

    } else if (response.event === "asset_index") {
        ASSET_INDEX = response;  // 🟢 Update ASSET_INDEX variable
        console.log("📊 Asset Index Updated:", ASSET_INDEX);

    } else if (response.event === "contracts_for") {
        CONTRACTS = response;  // 🟢 Update CONTRACTS variable
        console.log("📜 Contracts Updated:", CONTRACTS);

    } else if ("quote" in response) {
        TICK_DATA = response;  // 🟢 Update TICK_DATA variable
        console.log("📈 Tick Data Updated:", TICK_DATA);

    } else {
        console.log("🔄 Other Data:", responseData);
    }

};

ws.onclose = function(event) {
    console.log("🔴 WebSocket connection closed.");
};

// Ensure neither is null before calling populateDropdowns
if (ACTIVE_SYMBOLS && ASSET_INDEX) {
    populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
}
*/