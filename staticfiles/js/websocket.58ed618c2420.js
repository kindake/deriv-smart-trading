// ✅ Load early and avoid flicker
window.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const cachedBalance = localStorage.getItem("cached_balance");
    const authContainer = document.getElementById("authContainer");

    if (!authContainer) return;

    // Always start hidden to prevent flicker
    authContainer.style.display = "none";

    if (isLoggedIn) {
        authContainer.innerHTML = "";

        const balanceContainer = document.createElement("div");
        balanceContainer.id = "acc_balance_but";
        balanceContainer.style.display = "flex";
        balanceContainer.style.alignItems = "center";
        balanceContainer.style.justifyContent = "center";
        balanceContainer.style.gap = "1vh";
        balanceContainer.style.cursor = "pointer";
        balanceContainer.style.height = "6.6vh";
        balanceContainer.style.borderTopRightRadius = "10px";
        balanceContainer.style.borderLeft = "1px solid rgba(0, 0, 0, 0.3)";
        balanceContainer.style.padding = "0 2vh";
        balanceContainer.style.width = "fit-content";

        authContainer.appendChild(balanceContainer);

        if (cachedBalance) {
            const parsed = JSON.parse(cachedBalance);
            console.log("📦 Cached balance object:", parsed);
            console.log("💰 Amount:", parsed.amount);
            console.log("💱 Currency:", parsed.currency);

            updateBalanceUI(parsed.amount, parsed.currency);
        }

        // ✅ Now make visible
        authContainer.style.display = "flex";
    } else {
        // ✅ If not logged in, show login/signup
        authContainer.style.display = "flex";
    }
});

function updateBalanceUI(amount, currency) {
    const balanceContainer = document.getElementById("acc_balance_but");
    if (!balanceContainer) return;

    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    balanceContainer.innerHTML = `
        <strong id="balanceAmount" style="color: rgba(0, 128, 0, 0.5); font-weight: 900; font-size: 14px;">
            ${formatted}
        </strong>
        <span id="balanceCurrency" style="color: rgba(0, 128, 0, 0.5); font-weight: 900; font-size: 14px;">
            ${currency}
        </span>
        <img id="balanceToggleIcon"
            src="/static/icons/down.png"
            alt="Toggle Icon"
            style="width: 3vh; height: 3vh; transform: rotate(180deg); transition: transform 0.3s ease;">
    `;

    const toggleIcon = document.getElementById("balanceToggleIcon");

    balanceContainer.addEventListener("click", () => {
        const isRotatedUp = toggleIcon.style.transform === "rotate(0deg)";
        toggleIcon.style.transform = isRotatedUp ? "rotate(180deg)" : "rotate(0deg)";

        let balWin = document.getElementById("bal_win");

        if (!isRotatedUp) {
            if (!balWin) {
                balWin = document.createElement("div");
                balWin.id = "bal_win";
                balWin.style.cssText = `
                    position: fixed;
                    top: 3.5vw;
                    right: 2vw;
                    z-index: 9999;
                    width: 24vw;
                    background-color: white;
                    //border: 1px solid black;
                    border-radius: 5px 5px 5px 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: flex-start;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: height 0.3s ease;
                `;

                balWin.innerHTML = `
                    <!-- Toggle Buttons -->
                    <div id="balToggleButtons" style="display: flex; width: 100%;">
                        <button id="realBtn" style="
                            flex: 1;
                            background-color: rgba(255, 255, 255, 0.95);
                            border-top-left-radius: 5px;
                            color: black;
                            height: 3.5vw;
                            border: none;
                            font-weight: normal;
                            border-bottom: 2px solid rgba(128, 128, 128, 0.2);
                            cursor: pointer;
                        ">Real</button>
                        <button id="demoBtn" style="
                            flex: 1;
                            background-color: rgba(255, 255, 255, 0.95);
                            border-top-right-radius: 5px;
                            color: black;
                            height: 3.5vw;
                            border: none;
                            font-weight: normal;
                            border-bottom: 2px solid rgba(128, 128, 128, 0.2);
                            cursor: pointer;
                        ">Demo</button>
                    </div>

                    <!-- Deriv Accounts Section -->
                    <div id="dea" style="
                        position: relative;
                        background-color: white;
                        height: 3vw;
                        width: 100%;
                        overflow: hidden;
                        border-bottom: 4px solid rgba(128, 128, 128, 0.2);
                        transition: height 0.3s ease;
                        box-sizing: border-box;
                    ">
                        <span style="
                            position: absolute;
                            top: 50%;
                            left: 2vw;
                            transform: translateY(-50%);
                            font-weight: bold;
                            font-size: 1vw;
                            color: rgba(0, 0, 0, 0.9);
                        ">Deriv accounts</span>
                        <img id="deaIcon" src="/static/icons/down.png" style="
                            position: absolute;
                            top: 50%;
                            right: 2vw;
                            transform: translateY(-50%);
                            width: 1.2vw;
                            height: 1.2vw;
                            cursor: pointer;
                            transition: transform 0.3s ease;
                        ">
                    </div>

                    <!-- Traders Hub Section -->
                    <div id="TH" style="
                        background-color: white;
                        color: rgba(255, 0, 0, 0.7);
                        font-size: 0.8vw;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 3vw;
                        width: 100%;
                        border-bottom: 4px solid rgba(128, 128, 128, 0.2);
                        box-sizing: border-box;
                    ">Looking for CFD accounts? Go to Traders Hub</div>

                    <!-- Log Out Section -->
                    <div id="lo" style="
                        background-color: white;
                        height: 3vw;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        padding-left: 15vw;
                        font-size: 1vw;
                        box-sizing: border-box;
                        border-radius: 0px 0px 5px 5px;
                    ">Logout</div>
                `;

                document.body.appendChild(balWin);

                // Toggle button logic
                const realBtn = document.getElementById("realBtn");
                const demoBtn = document.getElementById("demoBtn");

                function activateButton(activeBtn, inactiveBtn) {
                    activeBtn.style.fontWeight = "bold";
                    activeBtn.style.borderBottom = "2px solid rgba(255, 0, 0, 0.5)";
                    inactiveBtn.style.fontWeight = "normal";
                    inactiveBtn.style.borderBottom = "2px solid rgba(128, 128, 128, 0.2)";
                }

                realBtn.addEventListener("click", () => activateButton(realBtn, demoBtn));
                demoBtn.addEventListener("click", () => activateButton(demoBtn, realBtn));

                // 🔘 1. Initialize selected account (default: demo)
                let selectedAccount = localStorage.getItem("selected_account") || "demo";

                // 🔘 2. Function to update and persist the selection
                function setSelectedAccount(type, token) {
                    selectedAccount = type;
                    localStorage.setItem("selected_account", type);  // ✅ changed to localStorage
                    localStorage.setItem("account_token", token);    // ✅ changed to localStorage

                    ws.send(JSON.stringify({
                        event: type === "real" ? "select_account_real" : "select_account_demo",
                        type: type
                    }));

                    console.log(`🔁 Switched to ${type} account`);
                }

                // 🔘 3. Attach to event listeners
                realBtn.addEventListener("click", () => {
                    const r_token = "M4GEFnoE9BPL6O5";
                    setSelectedAccount("real", r_token);
                });

                demoBtn.addEventListener("click", () => {
                    const d_token = "35PRENRMFkhkik1";
                    setSelectedAccount("demo", d_token);
                });

                // Deriv accounts toggle icon logic
                const deaIcon = document.getElementById("deaIcon");
                const dea = document.getElementById("dea");

                deaIcon.addEventListener("click", () => {
                    const isUp = deaIcon.style.transform === "rotate(180deg)";
                    deaIcon.style.transform = isUp ? "rotate(0deg)" : "rotate(180deg)";
                    dea.style.height = isUp ? "3vw" : "7vw";

                    const deaText = dea.querySelector("span");
                    deaText.style.marginTop = isUp ? "0" : "-1.5vw";
                    deaIcon.style.marginTop = isUp ? "0" : "-2vw";

                    // Remove existing info panel if it exists
                    const oldPanel = dea.querySelector("#accountInfoPanel");
                    if (oldPanel) oldPanel.remove();

                    // If collapsed, stop here
                    if (isUp) return;

                    // Get actual values from the response dictionary
                    //const loginid = responseData?.balance?.balance?.loginid || "UnknownID";
                    const loginid = window.WS_DATA?.currentAccount?.loginid;
                    const actualBalance = responseData?.balance?.balance?.balance || 0;
                    const currency = responseData?.balance?.balance?.currency || "";

                    // Format the balance (e.g., 10000 becomes "10,000.00")
                    const formattedBalance = Number(actualBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });

                    // Determine active account
                    const isDemo = demoBtn.style.fontWeight === "bold";
                    const accountId = loginid;
                    const balance = `${formattedBalance} ${currency}`;

                    // Create account info panel
                    const panel = document.createElement("div");
                    panel.id = "accountInfoPanel";
                    panel.style.cssText = `
                        position: absolute;
                        bottom: 0.2vw;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 3vw;
                        width: calc(100% - 10px);
                        background-color: rgba(200, 200, 200, 0.7);
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 2vw;
                        box-sizing: border-box;
                        font-size: 0.9vw;
                    `;

                    // Left section: label + account ID
                    const left = document.createElement("div");
                    left.innerHTML = `
                        <div style="font-weight: bold;">${isDemo ? "Demo" : "US DOLLAR"}</div>
                        <div>${accountId}</div>
                    `;

                    // Right section: either balance or reset button
                    const right = document.createElement("div");
                    if (isDemo && balance === "10,000.00 USD") {
                        right.innerHTML = `<div style="font-weight: bold; font-size: 0.9vw; color: black;">${balance}</div>`;
                    } else if (isDemo) {
                        right.innerHTML = `<button id="reset-balance-btn" style="
                            border: 0.2px solid black;
                            width: 8vw;
                            height: 1.5vw;
                            cursor: pointer;
                            border-radius: 5px;
                            background-color: rgba(128, 128, 128, 0.2);
                        ">Reset balance</button>`;

                        // ✅ Attach the event listener immediately
                        const resetBtn = right.querySelector("#reset-balance-btn");
                        if (resetBtn) {
                            resetBtn.addEventListener("click", () => {
                                console.log("🔄 Reset balance button clicked");

                                const request = {
                                    event: "reset_virtual_balance",  // <-- 👈 Custom event type
                                    topup_virtual: 1,
                                    req_id: 1
                                };

                                if (ws && ws.readyState === WebSocket.OPEN) {
                                    ws.send(JSON.stringify(request));
                                    console.log("📤 Sent topup_virtual request");
                                } else {
                                    console.error("❌ WebSocket not connected.");
                                }
                            });
                        }
                    } else {
                        right.innerHTML = `<div style="font-weight: bold; color: black;">${balance}</div>`;
                    }

                    // Append to panel
                    panel.appendChild(left);
                    panel.appendChild(right);

                    // Insert inside dea, just after the span text
                    dea.insertBefore(panel, deaIcon); // insert before icon to keep structure neat

                    console.log("Deriv accounts toggled");
                });
            } else {
                balWin.style.display = "flex";
            }
        } else {
            if (balWin) balWin.style.display = "none";
        }
    });
}

//const ws = new WebSocket("ws://localhost:815/ws/ticks/");
window.WS_DATA = {
    balance: null,
    activeSymbols: null,
    assetIndex: null,
    contractData: null,
    tickData: null,
    buyResponse: null,
    openContract: null,
    proposalUpdate: null,  // ✅ Optional but clean!
    all_balances: {},
    currentAccount: null,
    fullCandleHistory: null,
    fullCandleHist:null,
    lastLiveCandle: null,
    lastLiveTick: null, // ✅ Add this
};

// Globals
let workspace = null;
let workspaceReady = false;

// 🌍 Global Blockly workspace state
window.workspace = null;
window.workspaceReady = false;

const baseGrey = {
  colourPrimary: '#e5e5e5',
  colourSecondary: '#b3b3b3',
  colourTertiary: '#999999',
  hat: '' // Add this to apply rounded top edge (optional)
};

const myTheme = Blockly.Theme.defineTheme('myTheme', {
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

    // Save to global references
    window.workspace = workspace;
    window.workspaceReady = true;

    console.log("🧱 Blockly workspace created and ready");

    // Check for saved XML blocks in localStorage
    const savedWorkspaceXml = localStorage.getItem("workspaceXml");

    if (savedWorkspaceXml) {
        const xmlDom = Blockly.Xml.textToDom(savedWorkspaceXml);
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
        console.log("♻️ Restored workspace from localStorage XML");
    } else {
        // Fallback to InitialBlocks if nothing saved
        const initialDom = Blockly.utils.xml.textToDom(InitialBlocks);
        Blockly.Xml.domToWorkspace(initialDom, workspace);
        console.log("🆕 Loaded InitialBlocks into workspace");
    }

    // Mark workspace as initialized
    localStorage.setItem("workspace_initialized", "true");

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

// 🧠 Step 1: Check if WebSocket is already active
if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {

    // 🧠 Step 2: Only create client ID *inside* first connection
    let clientId = localStorage.getItem("client_id");
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("client_id", clientId);
    }

    console.log("🆕 Creating WebSocket connection...");
    //window.ws = new WebSocket("ws://localhost:825/ws/ticks/");
    // Include clientId in the query string
    window.ws = new WebSocket(`ws://localhost:840/ws/ticks/?client_id=${clientId}`);


    window.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWSMessage(data);  // Your custom message handler
    };
    //TA-Lib @ file:///C:/Users/KINDA-PC/tal/TA_Lib-0.4.24-cp39-cp39-win_amd64.whl
    window.ws.onopen = () => {
        // 🧠 Step 3: Only send 'start_connection' once per session
        if (!localStorage.getItem("ws_connected")) {
            localStorage.setItem("ws_connected", "true");

            window.ws.send(JSON.stringify({
                event: "start_connection",
                symbol: "1HZ10V",  // you can later update from dropdown
                client_id: clientId,
            }));
        } else {
            console.log("🔁 WebSocket reconnected after reload, skipping start_connection");
        }

         // 🔄 Check and restore Blockly workspace state from localStorage
        const storedWorkspace = localStorage.getItem("workspace_initialized");
        if (!storedWorkspace || storedWorkspace !== "true") {
            console.log("🧱 Creating new Blockly workspace...");
            createWorkspace(); // 🔧 Your full Blockly initialization logic
            localStorage.setItem("workspace_initialized", "true");
        } else {
            console.log("🧱 Blockly workspace already initialized, skipping creation");
        }
    };

    window.ws.onclose = () => {
        localStorage.clear();  // 🔥 Clears ALL localStorage keys
        console.warn("🛑 WebSocket closed. LocalStorage cleared.");
    };

    window.ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
    };
} else {
    console.log("✅ Reusing existing WebSocket connection");
}

// 🔌 WebSocket Setup with Reconnect-Safe LocalStorage Handling
/*
// 🧠 Step 1: Check if WebSocket is already active or closed
if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {
    // 🧠 Step 2: Only create client ID *inside* first connection
    let clientId = localStorage.getItem("client_id");
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("client_id", clientId);
    }

    // 🌐 Dynamically detect ws:// or wss:// based on current page protocol
    const useProduction = true; // toggle manually or with environment flags
    const wsProtocol = useProduction ? "wss" : (location.protocol === "https:" ? "wss" : "ws");
    const wsHost = useProduction ? "kkmaina.onrender.com" : location.host;
    const wsUrl = `${wsProtocol}://${wsHost}/ws/ticks/?client_id=${clientId}`;

    console.log("🆕 Creating WebSocket connection to:", wsUrl);
    window.ws = new WebSocket(wsUrl);

    // 📩 Message handler
    window.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWSMessage(data);  // 🧠 Your custom handler
    };

    // 🔓 On connection open
    window.ws.onopen = () => {
        // 🔁 Only send 'start_connection' once per session
        if (!localStorage.getItem("ws_connected")) {
            localStorage.setItem("ws_connected", "true");

            window.ws.send(JSON.stringify({
                event: "start_connection",
                symbol: "1HZ10V",  // default symbol
                client_id: clientId,
            }));
        } else {
            console.log("🔁 WebSocket reconnected, skipping start_connection");
        }

        // 🧱 Blockly workspace check
        const storedWorkspace = localStorage.getItem("workspace_initialized");
        if (!storedWorkspace || storedWorkspace !== "true") {
            console.log("🧱 Creating new Blockly workspace...");
            createWorkspace();  // 🧰 Your Blockly init
            localStorage.setItem("workspace_initialized", "true");
        } else {
            console.log("🧱 Blockly workspace already initialized, skipping");
        }
    };

    // ❌ On close — clear all localStorage keys
    window.ws.onclose = () => {
        localStorage.clear();  // 🔥 You may want to refine this in future
        console.warn("🛑 WebSocket closed. LocalStorage cleared.");
    };

    // ❌ On error
    window.ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
    };
} else {
    console.log("✅ Reusing existing WebSocket connection");
}
*/
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

    // ✅ Use sendWebSocketMessage to auto-inject client_id
    window.sendWebSocketMessage(message);

    console.log("✅ Sent Python Code via WebSocket (with client_id):", message);
}

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const rightG = document.querySelector(".right_g");

// Login button click handler
document.getElementById("loginButton").addEventListener("click", function () {
    const symbol = "1HZ10V";
    const api_token = "M4GEFnoE9BPL6O5"; //"35PRENRMFkhkik1";
    const demo_token = "35PRENRMFkhkik1";

    // Send authentication request
    ws.send(JSON.stringify({
        event: "start_auth",
        symbol: symbol,
        api_token: api_token,
        demo_token: demo_token
    }));

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("api_token", api_token);
    //localStorage.setItem("cached_balance", JSON.stringify({ amount: 0, currency: "USD" }));

    // Clear auth buttons
    const authContainer = document.getElementById("authContainer");
    authContainer.innerHTML = '';

    // Create empty balance container (UI gets filled later)
    const balanceContainer = document.createElement("div");
    balanceContainer.id = "acc_balance_but";
    balanceContainer.style.display = "flex";
    balanceContainer.style.alignItems = "center";
    balanceContainer.style.justifyContent = "center";
    balanceContainer.style.gap = "1vh";
    balanceContainer.style.cursor = "pointer";
    //balanceContainer.style.width = "10vw";
    balanceContainer.style.height = "6.6vh";
    balanceContainer.style.borderTopRightRadius = "10px";
    balanceContainer.style.borderLeft = "1px solid rgba(0, 0, 0, 0.3)";
    balanceContainer.style.padding = "0 2vh"; // top/bottom = 0, left/right = 10px
    balanceContainer.style.width = "fit-content"; // make width adjust to content

    // Append empty container (no placeholders yet)
    authContainer.appendChild(balanceContainer);
});

//ws.onmessage = function (event) {
function handleWSMessage(response) {
    //const response = JSON.parse(event.data);
    //console.log("📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️📥✅⚠️ Raw WebSocket Data:", response);  // ✅ SEE WHAT IS ACTUALLY COMING

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;

    // ✅ Handle account type event
    if (response.event === "acc_type") {
        const accountType = responseData.acc_type;
        // Save to global memory
        window.WS_DATA.currentAccount = accountType;
        // ✅ Save to localStorage for persistence
        localStorage.setItem("accountType", accountType);
        // Dispatch event for listeners (optional)
        window.dispatchEvent(new CustomEvent("accountTypeUpdated", { detail: accountType }));
        console.log("🔐 Current account type received:", accountType);
    }

    // ✅ Handle account type event
    /*if (response.event === "acc_type") {
        window.WS_DATA.currentAccount = responseData.acc_type;
        window.dispatchEvent(new CustomEvent("accountTypeUpdated", { detail: responseData.acc_type }));
        console.log("🔐 Current account type received:", responseData.acc_type);
    }*/
/*
    if (response.event === "t") {
        const formatted = response
        window.WS_DATA.fullCandleHist = formatted;

        window.dispatchEvent(new CustomEvent("fullCandleHist", {
            detail: formatted,
        }));
        console.log("📊 Dispatched Full Candle History:", formatted);
    }*/
/*    // ✅ Full history
    if (response.event === "candles") {
        const formatted = response.candles.map(c => ({
            time: c.epoch,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
        }));
        window.WS_DATA.fullCandleHistory = formatted;

        window.dispatchEvent(new CustomEvent("fullCandleHistory", {
            detail: formatted,
        }));
        console.log("📊 Dispatched Full Candle History:", formatted);
    }
    if (response.event === "t") {
        const formatted = response.ticks;  // ✅ Just the array
        window.WS_DATA.fullCandleHist = formatted;

        window.dispatchEvent(new CustomEvent("fullCandleHist", {
            detail: formatted,
        }));
        console.log("📊 Dispatched Full Candle History:", formatted);
    }
*/
    // ✅ Full history (candles)
    if (response.event === "candles") {
        const formatted = response.candles.map(c => ({
            time: c.epoch,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
        }));

        // Save to global memory
        window.WS_DATA.fullCandleHistory = formatted;

        // ✅ Save to localStorage
        localStorage.setItem("LCandleHistory", JSON.stringify(formatted));

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent("fullCandleHistory", {
            detail: formatted,
        }));

        console.log("📊 Dispatched Full Candle History (candles):", formatted);
    }

    // ✅ Tick history (t)
    if (response.event === "t") {
        const formatted = response.ticks;

        // Save to global memory
        window.WS_DATA.fullCandleHist = formatted;

        // ✅ Save to localStorage
        localStorage.setItem("LCandleHist", JSON.stringify(formatted));

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent("fullCandleHist", {
            detail: formatted,
        }));

        console.log("📊 Dispatched Full Candle History (ticks):", formatted);
    }

    // ✅ Live updates
    if (response.event === "new_candle") {
        const c = response.candle;
        const liveCandle = {
            time: c.epoch,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close),
        };

        window.WS_DATA.lastLiveCandle = c;

        window.dispatchEvent(new CustomEvent("liveCandleUpdate", {
            detail: liveCandle,
        }));
        console.log("🔥 Dispatched Live Candle Update:", liveCandle);
    }

    // ✅ Handle all_balances
    if (response.event === "all_balances") {
        window.WS_DATA.all_balances = responseData;  // ✅ Overwrites or updates
        window.dispatchEvent(new CustomEvent("allBalancesUpdated", { detail: responseData }));
        console.log("📦 All Balances Received:", responseData);
    }

    if (response.event === "balance" || response.event === "all_balances") {
        const loginid = window.WS_DATA?.currentAccount?.loginid;

        // Get full all_balances dictionary
        const allBalances = window.WS_DATA?.all_balances;

        if (!loginid) {
            console.warn("❗ Missing loginid or balance data for this account:", loginid);
            //return;
        }
        if (!loginid || !allBalances) {
            console.warn("❗ Missing loginid or balance data for this account:", loginid);
            //return;
        }
        if (!loginid || !allBalances || !allBalances[loginid]) {
            console.warn("❗ Missing loginid or balance data for this account:", loginid);
            //return;
        }
        const accountData = allBalances[loginid];
        const actualBalance = accountData.balance;
        const currency = accountData.currency;
        const reqId = accountData.req_id;

        localStorage.setItem("acct-bal", actualBalance);
        localStorage.setItem("curr-currency", currency);

        console.log("💾 Saved to localStorage → acct-bal:", actualBalance, "| curr-currency:", currency);

        const balanceContainer = document.getElementById("acc_balance_but");

        if (balanceContainer && typeof actualBalance === "number" && currency) {
            const formattedBalance = actualBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            balanceContainer.innerHTML = `
                <strong id="balanceAmount" style="color: rgba(0, 128, 0, 0.5); font-weight: 900; font-size: 14px;">
                    ${formattedBalance}
                </strong>
                <span id="balanceCurrency" style="color: rgba(0, 128, 0, 0.5); font-weight: 900; font-size: 14px;">
                    ${currency}
                </span>
                <img id="balanceToggleIcon"
                    src="/static/icons/down.png"
                    alt="Toggle Icon"
                    style="width: 3vh; height: 3vh; transform: rotate(180deg); transition: transform 0.3s ease;">
            `;

            const toggleIcon = document.getElementById("balanceToggleIcon");

            balanceContainer.addEventListener("click", () => {
                const isRotatedUp = toggleIcon.style.transform === "rotate(0deg)";
                toggleIcon.style.transform = isRotatedUp ? "rotate(180deg)" : "rotate(0deg)";

                let balWin = document.getElementById("bal_win");

                if (!isRotatedUp) {
                    if (!balWin) {
                        balWin = document.createElement("div");
                        balWin.id = "bal_win";
                        balWin.style.cssText = `
                            position: fixed;
                            top: 3.5vw;
                            right: 2vw;
                            z-index: 9999;
                            width: 24vw;
                            background-color: white;
                            //border: 1px solid black;
                            border-radius: 5px 5px 5px 5px;
                            display: flex;
                            flex-direction: column;
                            align-items: stretch;
                            justify-content: flex-start;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                            transition: height 0.3s ease;
                        `;

                        balWin.innerHTML = `
                            <!-- Toggle Buttons -->
                            <div id="balToggleButtons" style="display: flex; width: 100%;">
                                <button id="realBtn" style="
                                    flex: 1;
                                    background-color: rgba(255, 255, 255, 0.95);
                                    border-top-left-radius: 5px;
                                    color: black;
                                    height: 3.5vw;
                                    border: none;
                                    font-weight: normal;
                                    border-bottom: 2px solid rgba(128, 128, 128, 0.2);
                                    cursor: pointer;
                                ">Real</button>
                                <button id="demoBtn" style="
                                    flex: 1;
                                    background-color: rgba(255, 255, 255, 0.95);
                                    border-top-right-radius: 5px;
                                    color: black;
                                    height: 3.5vw;
                                    border: none;
                                    font-weight: normal;
                                    border-bottom: 2px solid rgba(128, 128, 128, 0.2);
                                    cursor: pointer;
                                ">Demo</button>
                            </div>

                            <!-- Deriv Accounts Section -->
                            <div id="dea" style="
                                position: relative;
                                background-color: white;
                                height: 3vw;
                                width: 100%;
                                overflow: hidden;
                                border-bottom: 4px solid rgba(128, 128, 128, 0.2);
                                transition: height 0.3s ease;
                                box-sizing: border-box;
                            ">
                                <span style="
                                    position: absolute;
                                    top: 50%;
                                    left: 2vw;
                                    transform: translateY(-50%);
                                    font-weight: bold;
                                    font-size: 1vw;
                                    color: rgba(0, 0, 0, 0.9);
                                ">Deriv accounts</span>
                                <img id="deaIcon" src="/static/icons/down.png" style="
                                    position: absolute;
                                    top: 50%;
                                    right: 2vw;
                                    transform: translateY(-50%);
                                    width: 1.2vw;
                                    height: 1.2vw;
                                    cursor: pointer;
                                    transition: transform 0.3s ease;
                                ">
                            </div>

                            <!-- Traders Hub Section -->
                            <div id="TH" style="
                                background-color: white;
                                color: rgba(255, 0, 0, 0.7);
                                font-size: 0.8vw;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 3vw;
                                width: 100%;
                                border-bottom: 4px solid rgba(128, 128, 128, 0.2);
                                box-sizing: border-box;
                            ">Looking for CFD accounts? Go to Traders Hub</div>

                            <!-- Log Out Section -->
                            <div id="lo" style="
                                background-color: white;
                                height: 3vw;
                                width: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                padding-left: 15vw;
                                font-size: 1vw;
                                box-sizing: border-box;
                                border-radius: 0px 0px 5px 5px;
                            ">Logout</div>
                        `;

                        document.body.appendChild(balWin);

                        // Toggle button logic
                        const realBtn = document.getElementById("realBtn");
                        const demoBtn = document.getElementById("demoBtn");

                        function activateButton(activeBtn, inactiveBtn) {
                            activeBtn.style.fontWeight = "bold";
                            activeBtn.style.borderBottom = "2px solid rgba(255, 0, 0, 0.5)";
                            inactiveBtn.style.fontWeight = "normal";
                            inactiveBtn.style.borderBottom = "2px solid rgba(128, 128, 128, 0.2)";
                        }

                        realBtn.addEventListener("click", () => activateButton(realBtn, demoBtn));
                        demoBtn.addEventListener("click", () => activateButton(demoBtn, realBtn));

                        // 🔘 1. Initialize selected account (default: demo)
                        let selectedAccount = localStorage.getItem("selected_account") || "demo";

                        // 🔘 2. Function to update and persist the selection
                        function setSelectedAccount(type, token) {
                            selectedAccount = type;
                            localStorage.setItem("selected_account", type);  // ✅ changed to localStorage
                            localStorage.setItem("account_token", token);    // ✅ changed to localStorage

                            ws.send(JSON.stringify({
                                event: type === "real" ? "select_account_real" : "select_account_demo",
                                type: type
                            }));

                            console.log(`🔁 Switched to ${type} account`);
                        }

                        // 🔘 3. Attach to event listeners
                        realBtn.addEventListener("click", () => {
                            const r_token = "M4GEFnoE9BPL6O5";
                            setSelectedAccount("real", r_token);
                        });

                        demoBtn.addEventListener("click", () => {
                            const d_token = "35PRENRMFkhkik1";
                            setSelectedAccount("demo", d_token);
                        });

                        // Deriv accounts toggle icon logic
                        const deaIcon = document.getElementById("deaIcon");
                        const dea = document.getElementById("dea");

                        deaIcon.addEventListener("click", () => {
                            const isUp = deaIcon.style.transform === "rotate(180deg)";
                            deaIcon.style.transform = isUp ? "rotate(0deg)" : "rotate(180deg)";
                            dea.style.height = isUp ? "3vw" : "7vw";

                            const deaText = dea.querySelector("span");
                            deaText.style.marginTop = isUp ? "0" : "-1.5vw";
                            deaIcon.style.marginTop = isUp ? "0" : "-2vw";

                            // Remove existing info panel if it exists
                            const oldPanel = dea.querySelector("#accountInfoPanel");
                            if (oldPanel) oldPanel.remove();

                            // If collapsed, stop here
                            if (isUp) return;

                            // Get actual values from the response dictionary
                            //const loginid = responseData?.balance?.balance?.loginid || "UnknownID";
                            const loginid = window.WS_DATA?.currentAccount?.loginid;
                            const actualBalance = responseData?.balance?.balance?.balance || 0;
                            const currency = responseData?.balance?.balance?.currency || "";

                            // Format the balance (e.g., 10000 becomes "10,000.00")
                            const formattedBalance = Number(actualBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            });

                            // Determine active account
                            const isDemo = demoBtn.style.fontWeight === "bold";
                            const accountId = loginid;
                            const balance = `${formattedBalance} ${currency}`;

                            // Create account info panel
                            const panel = document.createElement("div");
                            panel.id = "accountInfoPanel";
                            panel.style.cssText = `
                                position: absolute;
                                bottom: 0.2vw;
                                left: 50%;
                                transform: translateX(-50%);
                                height: 3vw;
                                width: calc(100% - 10px);
                                background-color: rgba(200, 200, 200, 0.7);
                                border-radius: 5px;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                padding: 0 2vw;
                                box-sizing: border-box;
                                font-size: 0.9vw;
                            `;

                            // Left section: label + account ID
                            const left = document.createElement("div");
                            left.innerHTML = `
                                <div style="font-weight: bold;">${isDemo ? "Demo" : "US DOLLAR"}</div>
                                <div>${accountId}</div>
                            `;

                            // Right section: either balance or reset button
                            const right = document.createElement("div");
                            if (isDemo && balance === "10,000.00 USD") {
                                right.innerHTML = `<div style="font-weight: bold; font-size: 0.9vw; color: black;">${balance}</div>`;
                            } else if (isDemo) {
                                right.innerHTML = `<button id="reset-balance-btn" style="
                                    border: 0.2px solid black;
                                    width: 8vw;
                                    height: 1.5vw;
                                    cursor: pointer;
                                    border-radius: 5px;
                                    background-color: rgba(128, 128, 128, 0.2);
                                ">Reset balance</button>`;

                                // ✅ Attach the event listener immediately
                                const resetBtn = right.querySelector("#reset-balance-btn");
                                if (resetBtn) {
                                    resetBtn.addEventListener("click", () => {
                                        console.log("🔄 Reset balance button clicked");

                                        const request = {
                                            event: "reset_virtual_balance",  // <-- 👈 Custom event type
                                            topup_virtual: 1,
                                            req_id: 1,
                                        };

                                        if (ws && ws.readyState === WebSocket.OPEN) {
                                            ws.send(JSON.stringify(request));
                                            console.log("📤 Sent topup_virtual request");
                                        } else {
                                            console.error("❌ WebSocket not connected.");
                                        }
                                    });
                                }
                            } else {
                                right.innerHTML = `<div style="font-weight: bold; color: black;">${balance}</div>`;
                            }

                            // Append to panel
                            panel.appendChild(left);
                            panel.appendChild(right);

                            // Insert inside dea, just after the span text
                            dea.insertBefore(panel, deaIcon); // insert before icon to keep structure neat

                            console.log("Deriv accounts toggled");
                        });
                    } else {
                        balWin.style.display = "flex";
                    }
                } else {
                    if (balWin) balWin.style.display = "none";
                }
            });

            // ✅ Update cache
            localStorage.setItem(
                "cached_balance",
                JSON.stringify({ amount: actualBalance, currency })
            );
            window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: actualBalance }));
        }
    }

    if (response.event === "balance") {
        window.WS_DATA.balance = responseData.balance;
        window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: responseData.balance }));
        console.log("📩 balance balancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalance Update Received:", responseData);

    } else if (response.event === "active_symbols") {
        window.WS_DATA.activeSymbols = responseData;
        window.dispatchEvent(new CustomEvent("activeSymbolsUpdated", { detail: responseData }));
        //sessionStorage.setItem("activeSymbols", JSON.stringify(responseData));
        localStorage.setItem("activeSymbols", JSON.stringify(responseData)); // ✅ changed to localStorage

    } else if (response.event === "asset_index") {
        window.WS_DATA.assetIndex = responseData;
        window.dispatchEvent(new CustomEvent("assetIndexUpdated", { detail: responseData }));
        //sessionStorage.setItem("assetIndex", JSON.stringify(responseData));
        localStorage.setItem("assetIndex", JSON.stringify(responseData)); // ✅ changed to localStorage

    } else if (response.event === "contracts_for") {
        window.WS_DATA.contractData = response;
        window.dispatchEvent(new CustomEvent("contractDataUpdated", { detail: response }));
        //sessionStorage.setItem("contractData", JSON.stringify(response));
        localStorage.setItem("contractData", JSON.stringify(response)); // ✅ changed to localStorage

    } else if ("quote" in response) {
        console.log("📈 Tick Data:", response);
        window.WS_DATA.tickData = response;
        window.dispatchEvent(new CustomEvent("tickDataUpdated", { detail: response }));
    }/*
     } else if ("quote" in response) {
        console.log("📈 Tick Data:", response);

        const liveTick = {
            time: response.quote.epoch,
            value: parseFloat(response.quote.quote),
        };

        window.WS_DATA.tickData = response;
        window.WS_DATA.lastLiveTick = response;  // ✅ ADD THIS LINE

        window.dispatchEvent(new CustomEvent("tickDataUpdated", { detail: liveTick })); // ✅ Update the event to send formatted tick
    }*/else if (response.event === "buy_response") {
        window.WS_DATA.buyResponse = responseData;  // ✅ Store globally
        //console.log("📩 buy Response Update Received:", responseData);
        window.dispatchEvent(new CustomEvent("buyResponseUpdated", { detail: responseData }));

    } else if (response.event === "open_contract_update") {
        window.WS_DATA.openContract = responseData;  // ✅ Store globally
        //console.log("📩 Open Contract Update Received:", responseData);
        window.dispatchEvent(new CustomEvent("openContractUpdated", { detail: responseData }));
    } else if (response.event === "run_bot_response") {
        if (response.status === "started") {
            //alert("✅ Bot started successfully!");
            console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀", response.message); // or do anything else here (like show a toast, spinner, etc.)
                // ✅ Send custom event to frontend listeners (like in botbuilder.js)

            window.dispatchEvent(new CustomEvent("botStarted", {
                detail: response.message  // Or response if you want to send more data
            }));
        } else {
            //alert("❌ Failed to start the bot: " + response.error);
        }
    } else if (response.event === "b_proposal_update") {
        window.WS_DATA.proposalUpdate = response.data;
        console.log("📩💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰 Received b_proposal_update:", response.data);

        window.dispatchEvent(new CustomEvent("proposalUpdateReceived", {
            detail: response.data
        }));
    } else {
        console.log("🔄 Other Data:", responseData);
    }
};

// ✅ Ensure clientId is available from localStorage
window.clientId = localStorage.getItem("clientId");

// ✅ Safe send wrapper with auto-injected client_id
window.sendWebSocketMessage = function (data) {
    // Inject client_id if not already present
    if (!data.client_id) {
        data.client_id = window.clientId;
    }

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.log("⚠️ WebSocket is not open.");
    }
};

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
/*const ws = new WebSocket("ws://localhost:8001/ws/ticks/");

// 🟢 Initialize global variables to store the latest data
let BALANCE = null;
let ACTIVE_SYMBOLS = null;
let ASSET_INDEX = null;
//let globalContractData = null;
let TICK_DATA = null;
window.globalContractData = null;  // Attach to the window object

ws.onopen = function () {
    console.log("✅ WebSocket Connecteddddddddddddddddddddddddddddddd");
    ws.send(JSON.stringify({ symbol: "1HZ10V", api_token: "35PRENRMFkhkik1" }));
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data);

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;

    if (response.event == "balance") {
        BALANCE = responseData.balance;
        console.log("💰 Balance Data:", BALANCE);
    } else if (response.event == "active_symbols") {
        ACTIVE_SYMBOLS = responseData;
        console.log("📜 Active Symbols Data:", ACTIVE_SYMBOLS);
        //console.log("📜 Active Symbols Data:", responseData);

        if (ACTIVE_SYMBOLS && ASSET_INDEX) {
            console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
            console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
            console.log("ASSET_INDEX:", ASSET_INDEX);
            console.log("🚀 Calling populateDropdowns now!");
            populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
        } else {
            console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
        }

    } else if (response.event == "asset_index") {
        ASSET_INDEX = responseData;
        console.log("📊 Asset Index Data:", ASSET_INDEX);
        if (ACTIVE_SYMBOLS && ASSET_INDEX) {
            console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
            console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
            console.log("ASSET_INDEX:", ASSET_INDEX);
            console.log("🚀 Calling populateDropdowns now!");
            populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
        } else {
            console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
        }
    } else if (response.event == "contracts_for") {
        globalContractData = response
        console.log("📜 Contracts Data:", globalContractData);

        if (ACTIVE_SYMBOLS && ASSET_INDEX && globalContractData) {
            console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
            console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
            console.log("ASSET_INDEX:", ASSET_INDEX);
            console.log("🚀 Calling populateDropdowns now!");
            console.log("📜 Contracts Data:", globalContractData);
            // populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
            populateBlockDropdowns(globalContractData);
        } else {
            console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX & globalContractData...");
        }

    } else if ("quote" in response) {
        console.log("📈 Tick Dataaaaaaaaaaaaaaa:", response);
    } else {
        console.log("🔄 Other Data:", responseData);
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
//let globalContractData = null;
let TICK_DATA = null;
window.globalContractData = null;  // Attach to the window object

ws.onopen = function () {
    console.log("✅ WebSocket Connecteddddddddddddddddddddddddddddddd");
    ws.send(JSON.stringify({ symbol: "1HZ10V", api_token: "35PRENRMFkhkik1" }));
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data);

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;

    if (response.event == "balance") {
        BALANCE = responseData.balance;
        console.log("💰 Balance Data:", BALANCE);
    } else if (response.event == "active_symbols") {
        ACTIVE_SYMBOLS = responseData;
        console.log("📜 Active Symbols Data:", ACTIVE_SYMBOLS);
        //console.log("📜 Active Symbols Data:", responseData);

        if (ACTIVE_SYMBOLS && ASSET_INDEX) {
            console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
            console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
            console.log("ASSET_INDEX:", ASSET_INDEX);
            console.log("🚀 Calling populateDropdowns now!");
            populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
        } else {
            console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
        }

    } else if (response.event == "asset_index") {
        ASSET_INDEX = responseData;
        console.log("📊 Asset Index Data:", ASSET_INDEX);
        if (ACTIVE_SYMBOLS && ASSET_INDEX) {
            console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
            console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
            console.log("ASSET_INDEX:", ASSET_INDEX);
            console.log("🚀 Calling populateDropdowns now!");
            populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
        } else {
            console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX...");
        }
    } else if (response.event == "contracts_for") {
        globalContractData = response
        console.log("📜 Contracts Data:", globalContractData);

        if (ACTIVE_SYMBOLS && ASSET_INDEX && globalContractData) {
            console.log("🔍 Checking if ACTIVE_SYMBOLS and ASSET_INDEX are ready...");
            console.log("ACTIVE_SYMBOLS:", ACTIVE_SYMBOLS);
            console.log("ASSET_INDEX:", ASSET_INDEX);
            console.log("🚀 Calling populateDropdowns now!");
            console.log("📜 Contracts Data:", globalContractData);
            // populateDropdowns(ACTIVE_SYMBOLS, ASSET_INDEX);
            populateBlockDropdowns(globalContractData);
        } else {
            console.log("⏳ Waiting for both ACTIVE_SYMBOLS & ASSET_INDEX & globalContractData...");
        }

    } else if ("quote" in response) {
        console.log("📈 Tick Dataaaaaaaaaaaaaaa:", response);
    } else {
        console.log("🔄 Other Data:", responseData);
    }
};

ws.onclose = function(event) {
    console.log("🔴 WebSocket connection closed.");
};
*/
/*
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

ws.onopen = function () {
    console.log("✅ WebSocket Connecteddddddddddddddddddddddddddddddd");
    ws.send(JSON.stringify({ symbol: "1HZ10V", api_token: "35PRENRMFkhkik1" }));
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data);

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    const responseData = response.data;

    if (response.event == "balance") {
        console.log("💰 Balance Data:", responseData.balance);
    } else if (response.event == "active_symbols") {
        console.log("📜 Active Symbols Data:", responseData);

        // 🟢 Call populateDropdowns() with active symbols data
        if (typeof populateDropdowns === "function") {
            populateDropdowns(responseData, null);
        } else {
            console.error("❌ populateDropdowns() is not defined!");
        }

    } else if (response.event == "asset_index") {
        console.log("📊 Asset Index Data:", responseData);

        // 🟢 Call populateDropdowns() with asset index data
        if (typeof populateDropdowns === "function") {
            populateDropdowns(null, responseData);
        } else {
            console.error("❌ populateDropdowns() is not defined!");
        }

    } else if (response.event == "contracts_for") {
        console.log("📜 Contracts Data:", responseData);
    } else if ("quote" in response) {
        console.log("📈 Tick Dataaaaaaaaaaaaaaa:", response);
    } else {
        console.log("🔄 Other Data:", responseData);
    }
};


/*
const ws = new WebSocket("ws://localhost:8001/ws/ticks/");

ws.onopen = function () {
    console.log("✅ WebSocket Connecteddddddddddddddddddddddddddddddd");
    //ws.send(JSON.stringify({ symbol: "1HZ10V" }));  // Example symbol selection
    ws.send(JSON.stringify({symbol: "1HZ10V", api_token: "35PRENRMFkhkik1"}));  // Example symbol selection
};

ws.onmessage = function (event) {
    const response = JSON.parse(event.data); // Convert string to JSON object
    const responseData = response.data; // Extract the actual data

    if (!response) {
        console.log("⚠️ No data found:", response);
        return;
    }

    // Handle different types of data
    if (response.event == "balance") {
        console.log("💰 Balance Data:", responseData.balance);
    } else if (response.event == "active_symbols") {
        console.log("📜 Active Symbols Data:", responseData);
    } else if (response.event == "asset_index") {
        console.log("📊 Asset Index Data:", responseData);
    } else if (response.event == "contracts_for") {
        console.log("📜 Contracts Data:", responseData);
    } else if ("quote" in response) {
        console.log("📈 Tick Dataaaaaaaaaaaaaaa:", response);
    } else {
        console.log("🔄 Other Data:", responseData);
    }
};
*/

/*

                        // ✅ Add the event listener immediately after inserting the button
                        setTimeout(() => {
                            const resetBtn = document.getElementById("reset-balance-btn");
                            if (resetBtn) {
                                resetBtn.addEventListener("click", () => {
                                    console.log("🔄 Reset balance button clicked");

                                    const request = {
                                        topup_virtual: 1,
                                        req_id: 1
                                    };

                                    if (ws && ws.readyState === WebSocket.OPEN) {
                                        ws.send(JSON.stringify(request));
                                        console.log("📤 Sent topup_virtual request");
                                    } else {
                                        console.error("❌ WebSocket not connected.");
                                    }
                                });
                            }
                        }, 0); // Small delay to ensure the DOM update completes
*/

/*
// ✅ Always create WebSocket if window.ws is gone (due to reload)
if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {
    console.log("🆕 Creating new WebSocket connection...");
    window.ws = new WebSocket("ws://localhost:822/ws/ticks/");

    window.ws.onopen = () => {
        if (!localStorage.getItem("ws_connected")) {
            localStorage.setItem("ws_connected", "true");
            console.log("✅ WebSocket Connected (first time)");
            window.ws.send(JSON.stringify({ event: "start_connection", symbol: "1HZ10V" }));
        } else {
            console.log("🔁 WebSocket reconnected after reload, skipping start_connection");
        }
    };

    window.ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        handleWSMessage(response);
    };

    window.ws.onclose = () => {
        console.warn("🛑 WebSocket closed.");
        localStorage.clear(); // Or removeItem("account_token") etc.
        localStorage.removeItem("ws_connected"); // ✅ Allow reconnect on next load
    };

    window.ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
    };
} else {
    console.log("🔁 Reusing existing WebSocket");
}
*/