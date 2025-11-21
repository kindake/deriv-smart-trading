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
console.log("⏹ Quick Strategy OFF");
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

    //stratDiv.addEventListener('click', () => handleStrategyClick(sectionOrCat, strat));

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
              console.log("📦 initqscon (parsed):", parsedInit);
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
        console.log("📦 initqscon (parsed):", parsedInit);
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
/*
  // Wire back / load / run events
  backBtn.addEventListener('click', () => {
    // Hide qsw5, show qsw3
    qsw5.style.display = 'none';
    qsw6.style.display = 'none';
    qsw3.style.display = 'block';
    unmarkStep1();
  });
*/
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
          //console.log("💾 Saved Quick Strategy symbol:", symbolObj.symbol);

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
          //console.log("popctdiv called for", fieldDiv && fieldDiv.id);

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
          //console.log("popGrowthRateDiv called for", fieldDiv && fieldDiv.id);

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
          //console.log("popDurationDiv called for", labelDiv && labelDiv.id);

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

          //console.log("Derived durations:", { durationOptions, smallestValues });

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
            //console.log("Accumulator Max stake toggle:", toggleWrapper.classList.contains('active'));
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
        //console.log("⏹ Quick Strategy OFF");
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
                //console.log("⏹ Quick Strategy OFF");
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

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("uploadFromComputerBtn");
    const fileInput = document.getElementById("fileInput");

    if (!btn || !fileInput) {
        console.warn("⚠️ Upload button or file input not found.");
        return;
    }

    btn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const xmlText = reader.result;

                //console.log("📄 XML ready from Dashboard:", xmlText);

                // Save XML to localStorage so Bot Builder can load it
                localStorage.setItem("uploadedBotXml", xmlText);

                // ✅ Redirect to Bot Builder page
                window.location.href = botbuilderUrl;
            } catch (err) {
                alert("❌ Failed to load XML.");
                console.error(err);
            }
        };

        reader.readAsText(file);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const uploadIcon = document.getElementById("uploadIcon");
    const resultWindow = document.getElementById("resultwindow");
    const tb = document.getElementById("tBut");

    const smallIcon = "/static/icons/local.svg";
    const largeIcon = "/static/icons/deriv-icon.svg";
    tb.style.display = "none";   // hide on large screens

    function updateUI() {
        // ✅ Update upload icon
        if (uploadIcon) {
            const shouldBe = window.innerWidth < 700 ? smallIcon : largeIcon;
            if (!uploadIcon.src.includes(shouldBe)) {
                uploadIcon.src = shouldBe;
            }
        }

        // ✅ Update result window visibility
        if (resultWindow) {
            if (window.innerWidth > 700) {
                resultWindow.style.display = "none";   // hide on large screens
                tb.style.display = "none";   // hide on large screens
            } else {
                resultWindow.style.display = "block";  // show on small screens
                tb.style.display = "none";   // hide on large screens
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



document.addEventListener("DOMContentLoaded", () => {
    const qsbbtn = document.getElementById("qsb");

    if (!qsbbtn) {
        console.warn("⚠️ qsbbtn not found.");
        return;
    }
    // ===============================
    // 2. Add a click event listener
    // ===============================
    qsbbtn.addEventListener("click", () => {
        // ✅ Redirect to Bot Builder page
        window.location.href = botbuilderUrl;

        //openQuickStrategyOverlay();  // calls our function
        localStorage.setItem("qson", "true");
        //console.log("🚀 Quick Strategy ON");

        // ✅ Check and set qssymbol
        const currentSymbol = localStorage.getItem("qssymbol");
        if (currentSymbol !== "1HZ10V") {
            localStorage.setItem("qssymbol", "1HZ10V");
            //console.log("✅ qssymbol initialized/updated to 1HZ10V");
        } else {
            console.log("ℹ️ qssymbol already set to 1HZ10V");
        }
    });
});

window.addEventListener("load", function allYourBotsDiv() {
    // 🔹 Find "Your bots:" <h1>
    const yourBotsHeader = Array.from(document.querySelectorAll("h1"))
        .find(el => el.textContent.trim().toLowerCase() === "your bots:");
    if (!yourBotsHeader) return;

    // 🔹 Create main container
    const ybDiv = document.createElement("div");
    ybDiv.id = "ybdiv";
    ybDiv.style.position = "relative";
    ybDiv.style.marginTop = "10px";
    ybDiv.style.borderRadius = "8px";
    ybDiv.style.padding = "0";
    ybDiv.style.boxSizing = "border-box";
    ybDiv.style.maxHeight = "20vh";
    ybDiv.style.overflowY = "scroll";
    ybDiv.style.overflowX = "hidden";
    ybDiv.style.scrollbarWidth = "none";
    ybDiv.style.msOverflowStyle = "none";

    // 🔹 Hide scrollbar (Chrome/Safari/Edge)
    const style = document.createElement("style");
    style.textContent = `
        #ybdiv::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(style);

    // ========================================================
    // 🔹 Handle responsive visibility and width
    // ========================================================
    function adjustVisibilityAndWidth() {
        if (window.innerWidth < 700) {
            // Hide both header and list
            yourBotsHeader.style.display = "none";
            ybDiv.style.display = "none";
        } else {
            // Show both header and list
            yourBotsHeader.style.display = "block";
            ybDiv.style.display = "block";

            // Handle width for desktop layout
            if (window.innerWidth > 700) {
                ybDiv.style.width = "60vw";
            } else {
                ybDiv.style.width = "90vw";
                ybDiv.style.maxWidth = "500px";
            }
        }
    }

    adjustVisibilityAndWidth(); // Run immediately
    window.addEventListener("resize", adjustVisibilityAndWidth);

    // ========================================================
    // 🔹 Titles row
    // ========================================================
    const titlesDiv = document.createElement("div");
    titlesDiv.style.height = "5vh";
    titlesDiv.style.display = "flex";
    titlesDiv.style.alignItems = "center";
    titlesDiv.style.borderBottom = "1px solid grey";
    //titlesDiv.style.backgroundColor = "#f3f3f3";
    titlesDiv.style.position = "sticky";
    titlesDiv.style.top = "0";
    titlesDiv.style.zIndex = "2";
    titlesDiv.style.fontWeight = "700";
    titlesDiv.style.fontSize = "14px";
    titlesDiv.style.color = "rgba(0, 0, 0, 0.75)";

    const titleBot = document.createElement("div");
    titleBot.textContent = "Bot name";
    titleBot.style.marginLeft = "2vw";
    titleBot.style.flex = "0 0 20vw";

    const titleModified = document.createElement("div");
    titleModified.textContent = "Last modified";
    //titleModified.style.marginLeft = "2vw";
    titleModified.style.flex = "0 0 20vw";

    const titleStatus = document.createElement("div");
    titleStatus.textContent = "Status";
    //titleStatus.style.marginLeft = "3vw";
    titleStatus.style.flex = "1";

    titlesDiv.append(titleBot, titleModified, titleStatus);
    ybDiv.appendChild(titlesDiv);

    // ========================================================
    // 🔹 Retrieve or create default bots from localStorage
    // ========================================================
    let botsData = JSON.parse(localStorage.getItem("my_bots") || "{}");
    let botKeys = Object.keys(botsData);

    if (botKeys.length === 0) {
        const now = new Date();
        const formattedDate = now.toLocaleString();
        let defaultXml = "";
        try {
            if (typeof InitialBlocks !== "undefined") {
                defaultXml = InitialBlocks;
            } else {
                const emptyDom = Blockly.Xml.workspaceToDom(new Blockly.Workspace());
                defaultXml = Blockly.Xml.domToText(emptyDom);
            }
        } catch (err) {
            console.warn("⚠️ Could not create default XML:", err);
            defaultXml = "<xml></xml>";
        }

        const defaultBot = {
            bot_name: "Unknown",
            last_modified: formattedDate,
            status: "unsaved",
            xml: defaultXml,
        };

        const defaultKey = `bot_${Date.now()}`;
        botsData[defaultKey] = defaultBot;
        localStorage.setItem("my_bots", JSON.stringify(botsData));
        botKeys = Object.keys(botsData);
    }

    // ========================================================
    // 🔹 Render all bots
    // ========================================================
    if (botKeys.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "No bots available.";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.margin = "10px 0";
        ybDiv.appendChild(emptyMsg);
    } else {
        botKeys.forEach(key => {
            const bot = botsData[key];
            const botDiv = document.createElement("div");
            botDiv.classList.add("m_bots");
            botDiv.style.height = "5vh";
            botDiv.style.display = "flex";
            botDiv.style.alignItems = "center";
            botDiv.style.borderBottom = "1px solid grey";
            botDiv.style.position = "relative";
            botDiv.style.transition = "background 0.2s";
            botDiv.style.fontSize = "12px";
            botDiv.style.fontWeight = "500";
            botDiv.style.color = "rgba(0, 0, 0, 0.5)";

            botDiv.addEventListener("mouseenter", () => botDiv.style.background = "#f9f9f9");
            botDiv.addEventListener("mouseleave", () => botDiv.style.background = "transparent");

            const botName = document.createElement("div");
            botName.textContent = bot.bot_name || "Unknown";
            botName.style.marginLeft = "2vw";
            botName.style.flex = "0 0 20vw";
            //botName.style.fontWeight = "500";
            botName.style.color = "#000";

            const botModified = document.createElement("div");
            botModified.textContent = bot.last_modified || "-";
            //botModified.style.marginLeft = "5vw";
            botModified.style.flex = "0 0 20vw";
            botModified.style.color = "#333";

            const botStatus = document.createElement("div");
            botStatus.textContent = bot.status || "-";
            //botStatus.style.marginLeft = "3vw";
            botStatus.style.flex = "1";
            botStatus.style.color = "#444";

            // Icons (save, delete, edit)
            const iconNames = ["floppydisk.png", "delete.png", "file.png"];
            const iconActions = ["save", "delete", "edit"];
            const iconContainer = document.createElement("div");
            iconContainer.style.position = "absolute";
            iconContainer.style.right = "2vw";
            iconContainer.style.display = "flex";
            iconContainer.style.gap = "1vw";
            iconContainer.style.alignItems = "center";

            iconNames.forEach((icon, index) => {
                const img = document.createElement("img");
                img.src = `/static/icons/${icon}`;
                img.alt = iconActions[index];
                img.style.width = "15px";
                img.style.height = "15px";
                img.style.cursor = "pointer";

                img.addEventListener("click", () => {
                    const action = iconActions[index];
                    //console.log(`${action} bot:`, bot.bot_name || key);

                    if (action === "edit") {
                        try {
                            if (bot.xml) {
                                const xmlDom = Blockly.utils.xml.textToDom(bot.xml);
                                if (window.workspace) {
                                    window.workspace.clear();
                                    Blockly.Xml.domToWorkspace(xmlDom, window.workspace);
                                    //console.log(`🧱 Loaded bot "${bot.bot_name}" into workspace.`);
                                } else {
                                    console.warn("⚠️ No active Blockly workspace found.");
                                }
                            } else {
                                console.warn("⚠️ Bot has no XML to load.");
                            }
                        } catch (err) {
                            console.error("❌ Failed to load bot XML:", err);
                        }
                    }

                    if (action === "save") {
                        try {
                            if (window.workspace) {
                                const xmlText = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(window.workspace));
                                bot.xml = xmlText;
                                bot.last_modified = new Date().toLocaleString();
                                bot.status = "saved";
                                botsData[key] = bot;
                                localStorage.setItem("my_bots", JSON.stringify(botsData));
                                botModified.textContent = bot.last_modified;
                                botStatus.textContent = "saved";
                                //console.log(`💾 Bot "${bot.bot_name}" saved successfully.`);
                            }
                        } catch (err) {
                            console.error("❌ Failed to save bot XML:", err);
                        }
                    }

                    if (action === "delete") {
                        delete botsData[key];
                        localStorage.setItem("my_bots", JSON.stringify(botsData));
                        botDiv.remove();
                        //console.log(`🗑️ Bot "${bot.bot_name}" deleted.`);
                    }
                });

                iconContainer.appendChild(img);
            });

            botDiv.append(botName, botModified, botStatus, iconContainer);
            ybDiv.appendChild(botDiv);
        });
    }

    // 🔹 Insert below “Your bots:” header
    yourBotsHeader.insertAdjacentElement("afterend", ybDiv);
});
