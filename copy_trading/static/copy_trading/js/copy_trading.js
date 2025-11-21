document.addEventListener("DOMContentLoaded", () => {
    const resultWindow = document.getElementById("resultwindow"); // ✅ use shared element

    function updateUI() {
        if (resultWindow) {
            if (window.innerWidth > 700) {
                resultWindow.style.display = "none";
            } else {
                resultWindow.style.display = "block";
            }
        }
    }

    // Run once at page load
    updateUI();

    // Debounced resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateUI, 150);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector("#mac");
    if (!container) {
        console.warn("⚠️ No container found for Copy Trading JS injection.");
        return;
    }

    container.innerHTML = "";

    // ---- Heading ----
    const heading = document.createElement("h2");
    heading.innerText = "Add Copy Trading Tokens";
    Object.assign(heading.style, {
        fontWeight: "bold",
        fontSize: "20px",
        color: "var(--text-color)",      // use theme text color
        textAlign: "center",
        marginTop: "0vh",   // ✅ only 1vh from the top
        marginBottom: "2px" // ✅ creates the 2px gap to subText
    });

    // ---- Subtext ----
    const subText = document.createElement("p");
    subText.innerText = "Developed by Kasier";
    Object.assign(subText.style, {
        fontSize: "10px",
        //color: "rgba(0, 0, 255, 0.25)",
        color: "var(--subtext-color)",   // 👈 theme-based color
        textAlign: "center",
        marginTop: "0",     // ✅ remove extra spacing
        marginBottom: "1vh" // ✅ 1vh gap to coptr
    });

    // ---- Main Copy Trading Div ----
    const coptr = document.createElement("div");
    coptr.id = "coptr";
    Object.assign(coptr.style, {
        height: "auto",
        //backgroundColor: "#e5e5e5",
        backgroundColor: "var(--coptr-bg)",  // 👈 theme-based background
        color: "var(--text-color)",
        margin: "0 auto",   // ✅ center horizontally only
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        paddingBottom: "2vh",
    });

    // Responsive width for coptr
    function setCoptrWidth() {
        if (window.innerWidth <= 700) {
            coptr.style.width = "90%";
            coptr.style.maxWidth = "300px";
        } else {
            coptr.style.width = "30vw";
            coptr.style.maxWidth = "";
        }
    }
    setCoptrWidth();
    window.addEventListener("resize", setCoptrWidth);

    // ---- Outer Token Div ----
    const coptrToken = document.createElement("div");
    coptrToken.id = "coptrtoken";
    Object.assign(coptrToken.style, {
        width: "90%",
        maxWidth: "300px",
        height: "6vh",
        //backgroundColor: "#fff",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        margin: "1vh auto 0 auto",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        //padding: "0 1vw",
        //padding: "0 1vw",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        position: "relative",
        cursor: "text",
        border: "1px solid transparent", // base border invisible
    });

    // ---- Inner Editable Div ----
    const coptrToken1 = document.createElement("div");
    coptrToken1.id = "coptrtoken1";
    coptrToken1.contentEditable = "true";
    coptrToken1.spellcheck = false;
    coptrToken1.innerText = "Type your token"; // placeholder
    Object.assign(coptrToken1.style, {
        width: "90%", // takes 90% of parent
        height: "6vh",
        //color: "#000",
        color: "var(--text-color)",
        marginLeft: "0vw",
        fontWeight: "normal",
        outline: "none",
        border: "none",
    });

    // Hover effect: only when hovering coptrToken1
    coptrToken1.addEventListener("mouseenter", () => {
        coptrToken1.style.border = "1px solid #000";
    });
    coptrToken1.addEventListener("mouseleave", () => {
        coptrToken1.style.border = "1px solid transparent";
    });

    // Clear placeholder when typing
    coptrToken1.addEventListener("focus", () => {
        if (coptrToken1.innerText === "Type your token") {
            coptrToken1.innerText = "";
        }
    });
    coptrToken1.addEventListener("blur", () => {
        if (coptrToken1.innerText.trim() === "") {
            coptrToken1.innerText = "Type your token";
        }
    });

    // ---- + Sign ----
    const plus = document.createElement("span");
    plus.innerText = "+";
    Object.assign(plus.style, {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#11A85C",
        cursor: "pointer",
        transition: "transform 0.2s, color 0.2s",
        marginLeft: "8px",
        marginRight: "1vw", // stays 4px from right
    });

    // Click event
    plus.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent focusing parent
        console.log("+ clicked");
    });

    // Hover effect only for +
    plus.addEventListener("mouseenter", () => {
        plus.style.transform = "scale(1.3)";
        plus.style.color = "#0D7A44";
    });
    plus.addEventListener("mouseleave", () => {
        plus.style.transform = "scale(1)";
        plus.style.color = "#11A85C";
    });

    // ---- Assemble ----
    coptrToken.appendChild(coptrToken1); // left side
    coptrToken.appendChild(plus);        // right side
    coptr.appendChild(coptrToken);

    // ---- Row for Toggle + Sync Button ----
    const toggleRow = document.createElement("div");
    Object.assign(toggleRow.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1vw",
        marginTop: "1vh",
    });

    // ---- Toggle div ----
    const toggleOnOffDiv = document.createElement("div");
    Object.assign(toggleOnOffDiv.style, {
        display: "flex",
        alignItems: "center",
        gap: "0.5vw",
    });

    const toggleWrapper = document.createElement("label");
    toggleWrapper.className = "dc-toggle-switch__label";
    const toggleBtn = document.createElement("span");
    toggleBtn.className = "dc-toggle-switch__button";
    toggleWrapper.appendChild(toggleBtn);

    // ✅ Toggle event listener
    toggleWrapper.addEventListener("click", () => {
        toggleWrapper.classList.toggle("active");
        console.log("Copy Trading toggle:", toggleWrapper.classList.contains("active"));
    });

    const toggleText = document.createElement("span");
    toggleText.innerText = "On/Off";
    Object.assign(toggleText.style, {
        fontSize: "11px",
        //color: "#000",
        color: "var(--text-color)",
    });

    toggleOnOffDiv.appendChild(toggleWrapper);
    toggleOnOffDiv.appendChild(toggleText);

    // ---- Sync Tokens Button ----
    const syncBtn = document.createElement("button");
    syncBtn.innerText = "Sync Tokens";
    Object.assign(syncBtn.style, {
        //backgroundColor: "#fff",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        border: "1px solid #ccc",
        padding: "0.5vh 1vw",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "11px",
    });
    syncBtn.onmouseover = () => { syncBtn.style.backgroundColor = "rgba(17, 168, 92, 0.2)"; }
    syncBtn.onmouseleave = () => { syncBtn.style.backgroundColor = "#fff"; }

    toggleRow.appendChild(toggleOnOffDiv);
    toggleRow.appendChild(syncBtn);

    coptr.appendChild(toggleRow);

    // ---- CREATE TOKEN Button ----
    const createTokenBtn = document.createElement("button");
    createTokenBtn.innerText = "CREATE TOKEN";
    Object.assign(createTokenBtn.style, {
        display: "block",
        margin: "1vh auto 0 auto",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "0.5vh 2vw",
        cursor: "pointer",
        fontSize: "11px",
    });
    createTokenBtn.onmouseover = () => { createTokenBtn.style.backgroundColor = "rgba(17, 168, 92, 0.2)"; }
    createTokenBtn.onmouseleave = () => { createTokenBtn.style.backgroundColor = "#fff"; }

    coptr.appendChild(createTokenBtn);

    // ---- Edit Tokens Button ----
    const editTokensBtn = document.createElement("button");
    Object.assign(editTokensBtn.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5vw",
        margin: "1vh auto 0 auto",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "0.5vh 1vw",
        cursor: "pointer",
        fontSize: "11px",
    });

    const callIcon = document.createElement("img");
    callIcon.src = "/static/icons/pencil.svg";
    callIcon.style.width = "16px";
    callIcon.style.height = "16px";

    const editText = document.createElement("span");
    editText.innerText = "Edit Tokens";

    editTokensBtn.appendChild(callIcon);
    editTokensBtn.appendChild(editText);
    editTokensBtn.onmouseover = () => { editTokensBtn.style.backgroundColor = "rgba(17, 168, 92, 0.2)"; }
    editTokensBtn.onmouseleave = () => { editTokensBtn.style.backgroundColor = "#fff"; }

    coptr.appendChild(editTokensBtn);

    // ---- Watch Video Button ----
    const watchVideoBtn = document.createElement("button");
    Object.assign(watchVideoBtn.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5vw",
        margin: "1vh auto 0 auto",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "0.5vh 1vw",
        cursor: "pointer",
    });

    const videoIcon = document.createElement("img");
    videoIcon.src = "/static/icons/i.svg";
    videoIcon.style.width = "16px";
    videoIcon.style.height = "16px";

    const videoText = document.createElement("span");
    videoText.innerText = "Watch a video on Copy Trading";
    Object.assign(videoText.style, {
        //color: "#000",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        fontSize: "11px",
    });

    watchVideoBtn.appendChild(videoIcon);
    watchVideoBtn.appendChild(videoText);
    watchVideoBtn.onmouseover = () => { watchVideoBtn.style.backgroundColor = "rgba(17, 168, 92, 0.2)"; }
    watchVideoBtn.onmouseleave = () => { watchVideoBtn.style.backgroundColor = "#fff"; }

    coptr.appendChild(watchVideoBtn);

    // ---- Append everything to container ----
    container.appendChild(heading);
    container.appendChild(subText);
    container.appendChild(coptr);
});
