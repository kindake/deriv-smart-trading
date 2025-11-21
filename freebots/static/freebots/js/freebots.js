document.addEventListener("DOMContentLoaded", () => {
    const resultWindow = document.getElementById("resultwindow");

    function updateUI() {
        // ✅ Update result window visibility
        if (resultWindow) {
            if (window.innerWidth > 700) {
                resultWindow.style.display = "none";   // hide on large screens
            } else {
                resultWindow.style.display = "block";  // show on small screens
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


// freebots.js
document.addEventListener("DOMContentLoaded", () => {
  const mac = document.getElementById("mac");
  if (!mac) return;

  // Clear old content
  mac.innerHTML = "";

    // --- Header (fixed at top) ---
    const header = document.createElement("div");
    header.innerHTML = `
      <h2 style="margin: 0; margin-bottom: 0.5vh; fontsize: 12px;">Load or build your bot</h2>
      <p style="margin: 0;">Empower your trading journey 🚀 with the elite performance of the market's finest bots 🤖,
      crafted to provide you with an unparalleled competitive advantage.</p>
    `;

    Object.assign(header.style, {
      position: "sticky",
      top: "0",
      //background: "#fff",
      background: "var(--load-color)",   // use theme background
      color: "var(--text-color)",      // use theme text color
      padding: "0vh 1vw",
      zIndex: "10",
      margin: "0",
      textAlign: "center", // optional - makes it look cleaner
    });

    mac.appendChild(header);

  // --- Scrollable Bot Container ---
  const freebotdiv = document.createElement("div");
  freebotdiv.id = "freebotdiv";
  Object.assign(freebotdiv.style, {
    marginTop: "0vh",
    //maxHeight: "60vh",
    overflowY: "auto",
    padding: "1vh",
    //border: "1px solid black",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // ✅ Soft subtle shadow
  });
  mac.appendChild(freebotdiv);

  // --- Inject CSS for grid layout and bot cards ---
  const style = document.createElement("style");
  style.textContent = `
    #freebotdiv {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* desktop: 3 in a row */
      gap: 1.5vh 1.5vw;
    }

    .freebot-item {
      height: 10vh;
      /*min-height: 80px;*/
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
      transition: background 0.2s ease, transform 0.1s ease;
      text-align: center;
      padding: 0 10px;
    }

    .freebot-item:hover {
      background: linear-gradient(135deg, #19a44b 0%, #0d7a32 100%);
      transform: translateY(-2px);
    }

    /* Scrollbar styling */
    #freebotdiv::-webkit-scrollbar {
      width: 6px;
    }
    #freebotdiv::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.4);
      border-radius: 3px;
    }
    #freebotdiv::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.1);
    }

    #freebotdiv {
      max-height: 60vh;
    }

    /* Responsive: stack vertically on mobile */
    @media (max-width: 700px) {
      #freebotdiv {
        grid-template-columns: 1fr; /* 1 per row */
        max-height: 40vh;
      }
    }
  `;
  document.head.appendChild(style);

  // --- Bot names ---
  const bots = [
    { id: "v1", label: "V1 bot" },
    { id: "dx", label: "D–X Bot [Over 1 Smart Bot]" },
    { id: "oddeven", label: "OddEvenXcel™" },
    { id: "over1", label: "Over 1 ⏱" },
    { id: "over2", label: "Over 2 📈" },
    { id: "over4", label: "Over 4 🚀📊" },
    { id: "rise", label: "RISEFALL AI PRO 🤖📉" }
  ];

  function loadBotToWorkspace(xmlText) {
      try {
          // Save XML to localStorage so Bot Builder can load it
          localStorage.setItem("uploadedBotXml", xmlText);

          //console.log("📄 Bot XML saved to localStorage, redirecting to Bot Builder...");

          // Redirect to Bot Builder page
          window.location.href = botbuilderUrl; // make sure botbuilderUrl is defined
      } catch (err) {
          alert("❌ Failed to save bot XML.");
          console.error(err);
      }
  }

  bots.forEach(bot => {
    const card = document.createElement("div");
    card.className = "freebot-item";
    card.innerText = bot.label;

    card.addEventListener("click", async () => {
      try {
      // Fetch XML from server
        const response = await fetch(`/static/bots/${bot.id}.xml`);
        if (!response.ok) throw new Error("Failed to load bot XML");

        const xmlText = await response.text();

      // Call your function to load XML into workspace
        loadBotToWorkspace(xmlText);

        //console.log(`Loaded ${bot.label} into workspace!`);
      } catch (err) {
        console.error("Error loading bot:", err);
      }
    });

    freebotdiv.appendChild(card);
  });

});
