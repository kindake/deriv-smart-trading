// Get or generate client_id once
let clientId = localStorage.getItem("client_id");
if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("client_id", clientId);
}

// Safe send wrapper with auto-injected client_id
window.sendWebSocketMessage = function (data) {
    // Inject client_id if not already present
    if (!data.client_id) {
        data.client_id = clientId;
    }

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.log("⚠️ WebSocket is not open.");
    }
};

