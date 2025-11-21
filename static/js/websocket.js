
function updateSecondaryNavScroll() {
    const nav = document.querySelector('.secondary-nav');
    if (!nav) return;

    if (window.innerWidth <= 500) {
        nav.style.overflowX = 'auto';
        nav.style.whiteSpace = 'nowrap';
    } else {
        nav.style.overflowX = 'visible';
        nav.style.whiteSpace = 'normal';
    }
}

// Run on page load
window.addEventListener('DOMContentLoaded', updateSecondaryNavScroll);

// Run on resize
window.addEventListener('resize', updateSecondaryNavScroll);

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

                  // Read current theme colors from CSS variables
                  //const styles = getComputedStyle(document.documentElement);
                  //const bgColor = styles.getPropertyValue("--bg-color").trim();
                  //const borderColor = styles.getPropertyValue("--accent-border-color").trim();

                  Object.assign(rstool.style, {
                    width: "100%",
                    height: "6vh",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    //backgroundColor: bgColor,
                    backgroundColor: 'var(--bg-color)',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    //borderBottom: "3px solid #e5e5e5",
                    borderBottom: "3px solid var(--bg-color)",
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
              //console.log("⏹ Quick Strategy OFF");
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
                  //console.log("📦 initqscon (parsed):", parsedInit);
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
                    //console.log("📦 initqscon (parsed):", parsedInit);
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
      width: "100%",
      textAlign: "left",
      padding: "1vh 0 1vh 2vw", // left padding
      fontSize: "12px",
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
      width: pcsDiv.offsetWidth + "px", // match width of pcsDiv
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




// 🌍 Global saved selections (shared across all blocks)
let savedSelections = {
    market: "",
    submarket: "",
    symbol: "",
    tt1: "",
    tt2: "",
    ct1: "",
    Pdd: "",
    grv: "",    // Growth Rate selection
    mtpl: "",   // Multiplier selection
    stv: 1,     // Stake value (default = 1)

    // ⏳ Duration_T persistence
    duration_unit: "",    // "s", "m", "h", "d", "t"
    duration_value: "",   // numeric duration value
    bod: "ABSOLUTE",      // Barrier Offset type
    bov: 1,               // Barrier Offset Value

    // 🎯 Risk controls
    tp: 0,   // Take Profit
    sl: 0,   // Stop Loss

    // 🔮 Duration_HD persistence
    duration_hd_unit: "",
    duration_hd_value: "",
    duration_hd_stake: 1,
    duration_hd_bov: 1   // Prediction value
};

// ====================
// GLOBAL SETUP
// ====================

// Footer reference
const footer = document.querySelector("footer");

// #run-stop-trade button handling
const runStopTrade = document.getElementById("run-stop-trade");
let originalRunStopParent = runStopTrade ? runStopTrade.parentElement : null;

// #resultwindow handling
const resultWindow = document.getElementById("resultwindow");
let originalResultParent = resultWindow ? resultWindow.parentElement : null;

// ====================
// BP TEXT HANDLING
// ====================
/*
const bp_dic = {
    default: `<span class="nowrap-run">When you’re ready to trade, hit <strong>Run.</strong></span>
              You’ll be able to track your bot’s<br>performance here.`
};
*/
const bp_dic = {
    default: `
        <span class="bp-text">
            When you’re ready to trade, hit <strong>Run.</strong>
            You’ll be able to track your bot’s performance here.
        </span>
    `
};

function updateBpText(key = "default") {
    const bp = document.querySelector(".bp");
    if (bp && bp_dic[key]) {
        bp.innerHTML = bp_dic[key];
    } else {
        setTimeout(() => updateBpText(key), 200); // retry if not ready
    }
}

// ================================
// 🔹 THEME HELPER (Global access)
// ================================
function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    bgColor: styles.getPropertyValue("--bg-color").trim(),
    borderColor: styles.getPropertyValue("--accent-border-color").trim(),
    textColor: styles.getPropertyValue("--text-color").trim(),
    navBg: styles.getPropertyValue("--nav-bg-color").trim(),
    workspaceBg: styles.getPropertyValue("--workspace-bg").trim()
  };
}

// ====================
// MOBILE TOGGLE UI
// ====================
function createMobileToggleUI() {
    if (document.getElementById("rub")) return; // Already exists

    // Get theme-based colors once
    //const { bgColor, borderColor } = getThemeColors();

    const rub = document.createElement("div");
    rub.id = "rub";

    // Base styles
    Object.assign(rub.style, {
        width: "100%",
        position: "fixed",
        bottom: "9.9vh",   // sits above ruv4
        left: "0",
        zIndex: "999999",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //backgroundColor: "white",
        //border: "1px solid #e5e5e5",
        //backgroundColor: bgColor,
        //border: `1px solid ${borderColor}`,
        backgroundColor: "var(--bg-color)",
        border: "1px solid var(--accent-border-color)",
        borderRadius: "5px",
        transition: "height 0.3s ease"
    });

    // Track expansion state globally for rub
    let isExpanded = false;

    // --- Check screen + qs ---
    const qsOn = localStorage.getItem("qson") === "true";

    if (window.innerWidth < 700 && qsOn) {
        // ✅ Always expanded, no rstool
        rub.style.height = "82vh";
        isExpanded = true;
    } else {
        // ✅ Normal behavior (collapsed at start)
        rub.style.height = "7vh";

        // Create rstool only in this case
        const rstool = document.createElement("div");
        rstool.id = "rstool";
        Object.assign(rstool.style, {
            width: "100%",
            height: "6vh",
            position: "absolute",
            top: "0",
            left: "0",
            //backgroundColor: "white",
            //backgroundColor: bgColor,
            //borderBottom: `3px solid ${borderColor}`,
            backgroundColor: "var(--bg-color)",
            borderBottom: "3px solid var(--accent-border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            //borderBottom: "3px solid #e5e5e5",
            cursor: "pointer",
            zIndex: "1000000"
        });

        // 🔹 Inline SVG (UP arrow)
        const toggleIcon = document.createElement("div");
        toggleIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="20"
                height="20"
                fill="var(--text-general)"
                style="transition: transform 0.3s ease;">
                <path fill-rule="evenodd" clip-rule="evenodd"
                d="M31.775 21.291a1.5 1.5 0 0 1-2.066.483L16 13.266l-13.709 8.51a1.5 1.5 0 0 1-1.582-2.55l14.5-9a1.5 1.5 0 0 1 1.582 0l14.5 9a1.5 1.5 0 0 1 .483 2.066"/>
            </svg>
        `;
        const svgElement = toggleIcon.querySelector("svg");
        rstool.appendChild(toggleIcon);
        rub.appendChild(rstool);

        // 🔄 Toggle behavior
        rstool.addEventListener("click", () => {
            isExpanded = !isExpanded;
            rub.style.height = isExpanded ? "82vh" : "7vh";
            svgElement.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
        });
    }

    //document.body.appendChild(rub);

    // ruv4 (new bottom bar container)
    const ruv4 = document.createElement("div");
    ruv4.id = "ruv4";
    Object.assign(ruv4.style, {
        width: "100vw",
        height: "10vh",
        position: "fixed",
        bottom: "0",
        left: "0",
        //backgroundColor: "white",
        //backgroundColor: bgColor,
        backgroundColor: "var(--bg-color)",
        //border: "1px solid black",
        zIndex: "1000001", // ⬅️ HIGHER than rub
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    });

    // rub2 (control area goes inside ruv4)
    const rub2 = document.createElement("div");
    rub2.id = "rub2";
    Object.assign(rub2.style, {
        width: "90%",
        height: "8vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        //border: "1px solid black"
    });

    // Append structure
    //rub.appendChild(rstool);
    // Append structure
    if (typeof rstool !== "undefined") {
        rub.appendChild(rstool);
    }
    document.body.appendChild(rub);

    document.body.appendChild(rub);

    ruv4.appendChild(rub2);
    document.body.appendChild(ruv4);

    // Move #run-stop-trade into rub2
    if (runStopTrade && !rub2.contains(runStopTrade)) {
        rub2.appendChild(runStopTrade);
        runStopTrade.style.display = "flex"; // ✅ Show it inside rub2
    }
}

/*
// ====================
// MOBILE TOGGLE UI
// ====================
function createMobileToggleUI() {
    if (document.getElementById("rub")) return; // Already exists

    // Get theme-based colors once
    //const { bgColor, borderColor } = getThemeColors();

    const rub = document.createElement("div");
    rub.id = "rub";

    // Base styles
    Object.assign(rub.style, {
        width: "100%",
        position: "fixed",
        bottom: "9.9vh",   // sits above ruv4
        left: "0",
        zIndex: "999999",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //backgroundColor: "white",
        //border: "1px solid #e5e5e5",
        //backgroundColor: bgColor,
        //border: `1px solid ${borderColor}`,
        backgroundColor: "var(--bg-color)",
        border: "1px solid var(--accent-border-color)",
        borderRadius: "5px",
        transition: "height 0.3s ease"
    });

    // Track expansion state globally for rub
    let isExpanded = false;

    // --- Check screen + qs ---
    const qsOn = localStorage.getItem("qson") === "true";

    if (window.innerWidth < 700 && qsOn) {
        // ✅ Always expanded, no rstool
        rub.style.height = "82vh";
        isExpanded = true;
    } else {
        // ✅ Normal behavior (collapsed at start)
        rub.style.height = "7vh";

        // Create rstool only in this case
        const rstool = document.createElement("div");
        rstool.id = "rstool";
        Object.assign(rstool.style, {
            width: "100%",
            height: "6vh",
            position: "absolute",
            top: "0",
            left: "0",
            //backgroundColor: "white",
            //backgroundColor: bgColor,
            //borderBottom: `3px solid ${borderColor}`,
            backgroundColor: "var(--bg-color)",
            borderBottom: "3px solid var(--accent-border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            //borderBottom: "3px solid #e5e5e5",
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
        rub.appendChild(rstool);

        // Toggle behavior
        rstool.addEventListener("click", () => {
            if (isExpanded) {
                rub.style.height = "82vh";
                toggleIcon.src = "/static/icons/up.png";
            } else {
                rub.style.height = "7vh";
                toggleIcon.src = "/static/icons/down.png";
            }
            isExpanded = !isExpanded;
        });
    }

    //document.body.appendChild(rub);

    // ruv4 (new bottom bar container)
    const ruv4 = document.createElement("div");
    ruv4.id = "ruv4";
    Object.assign(ruv4.style, {
        width: "100vw",
        height: "10vh",
        position: "fixed",
        bottom: "0",
        left: "0",
        //backgroundColor: "white",
        //backgroundColor: bgColor,
        backgroundColor: "var(--bg-color)",
        //border: "1px solid black",
        zIndex: "1000001", // ⬅️ HIGHER than rub
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    });

    // rub2 (control area goes inside ruv4)
    const rub2 = document.createElement("div");
    rub2.id = "rub2";
    Object.assign(rub2.style, {
        width: "90%",
        height: "8vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        //border: "1px solid black"
    });

    // Append structure
    //rub.appendChild(rstool);
    // Append structure
    if (typeof rstool !== "undefined") {
        rub.appendChild(rstool);
    }
    document.body.appendChild(rub);

    document.body.appendChild(rub);

    ruv4.appendChild(rub2);
    document.body.appendChild(ruv4);

    // Move #run-stop-trade into rub2
    if (runStopTrade && !rub2.contains(runStopTrade)) {
        rub2.appendChild(runStopTrade);
        runStopTrade.style.display = "flex"; // ✅ Show it inside rub2
    }
}
*/

function removeMobileToggleUI() {
    const rub = document.getElementById("rub");
    const ruv4 = document.getElementById("ruv4");

    // Put runStopTrade back to its original parent
    if ((rub || ruv4) && runStopTrade && originalRunStopParent && !originalRunStopParent.contains(runStopTrade)) {
        originalRunStopParent.appendChild(runStopTrade);
        runStopTrade.style.display = "flex"; // ✅ Show it again in the nav
    }

    // Remove rub
    if (rub) rub.remove();

    // Remove ruv4
    if (ruv4) ruv4.remove();
}

// ====================
// RESULT WINDOW TOGGLE
// ====================

function initResultWindowToggle() {
    const blocklyDiv = document.getElementById("blocklyDiv");
    const toggleButton = document.getElementById("tBut");

    /*if (!blocklyDiv || !toggleButton || !resultWindow) {
        console.error("Missing blocklyDiv, tBut, or resultwindow");
        return;
    }*/
    if (!toggleButton || !resultWindow) {
        console.error("Missing blocklyDiv, tBut, or resultwindow");
        //return;
    }
    // Load saved state
    let isToggled = localStorage.getItem("isToggled") === "false" ? false : true;

    // ✅ helper to apply widths & heights for mobile
    function applyMobileWidths() {
        const fullWidthEls = [
            ".r_heading",
            "#summary",
            "#transaction",
            "#journal",
            "#reseti",
            "#rid_heading"   // added
        ];
        const ninetyFiveEls = [
            ".bp",
            ".bpd",
            ".dowview",
            ".typeee",
            ".box",
            ".dow-filt",
            ".jonco",
            ".reset-button",
        ];

        // Full width sections
        fullWidthEls.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                el.style.width = "100vw";
                el.style.boxSizing = "border-box";
            }
        });

        // 95vw elements (but you gave them 100vw before, so keep consistent)
        ninetyFiveEls.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                el.style.width = "100vw";   // ✅ changed to 95vw
                el.style.boxSizing = "border-box";
            }
        });

        // ✅ Custom heights
        const ridHeading = document.getElementById("rid_heading");
        if (ridHeading) {
            //ridHeading.style.height = "15vh";
        }

        const bpdEls = document.querySelectorAll(".bpd");
        bpdEls.forEach(el => {
            el.style.width = "100vw";   // ensure width is full
            el.style.height = "30vh";   // custom height
            //el.style.boxSizing = "border-box";
        });

        const bp = document.querySelector(".bp");
        if (bp) {
            //bpd.style.marginTop = "0vh"; // push down from top
            bp.style.height = "30vh";
        }
    }

    // ✅ reset widths & heights for desktop
    function resetWidths() {
        const selectors = [
            ".r_heading",
            "#summary",
            "#transaction",
            "#journal",
            "#reseti",
            "#rid_heading",
            ".bp",
            ".bpd",
            ".dowview",
            ".typeee",
            ".box",
            ".dow-filt",
            ".jonco",
            ".reset-button",
            "#resultwindow"
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.width = "";
                el.style.height = "";
                el.style.marginTop = "";
                el.style.boxSizing = "";
                el.style.position = "";
                el.style.top = "";
                el.style.right = "";
                el.style.borderRight = "";
                el.style.borderBottom = "";
            });
        });

        // If you want a fixed desktop width for resultwindow:
        const rw = document.querySelector("#resultwindow");
        if (rw) rw.style.width = "27vw";
    }

    function applyDesktopState() {
        if (isToggled) {
            blocklyDiv.style.width = "73vw";
            toggleButton.style.transform = "rotate(180deg)";
            resultWindow.classList.add("active");
            updateBpText();
        } else {
            blocklyDiv.style.width = "100vw";
            toggleButton.style.transform = "rotate(0deg)";
            resultWindow.classList.remove("active");
        }

        // ✅ Restore borders in desktop
        resultWindow.style.borderRight = "2.4vh solid #e5e5e5";
        resultWindow.style.borderBottom = "2.4vh solid #e5e5e5";

        // ✅ Reset widths in desktop
        resetWidths();
    }

    let lastWidth = window.innerWidth;

    function applyMobileState() {
        isToggled = false;
        resultWindow.classList.add("active");

        const rub = document.getElementById("rub");
        if (!rub) return;

        let qson = localStorage.getItem("qson") === "true";
        const currentWidth = window.innerWidth;

        // Auto-turn QS off if resizing from mobile -> desktop
        if (lastWidth < 700 && currentWidth >= 700) {
            qson = false;
            localStorage.setItem("qson", "false");
        }
        lastWidth = currentWidth;

        // Ensure toggle panel is open if collapsed
        const rstool = document.getElementById("rstool");
        try {
            const computedHeight = parseFloat(window.getComputedStyle(rub).height || 0);
            const collapsedThreshold = Math.min(window.innerHeight * 0.25, 120);
            const isCollapsed = computedHeight < collapsedThreshold;
            if (rstool && isCollapsed) rstool.click();
        } catch (e) {}

        if (currentWidth < 700) {
            // ===== MOBILE =====
            if (qson) {
                // Only show mobile QS if qsw2 exists
                let qsw2 = document.getElementById("qsw2");
                if (!qsw2) {
                    // If qsw2 doesn't exist, treat QS as OFF
                    qson = false;
                    localStorage.setItem("qson", "false");

                    // Execute QS OFF behavior
                    const outer = document.getElementById("outerqsw2");
                    if (outer) outer.remove();

                    const overlay = document.getElementById("qswOverlay");
                    if (overlay) overlay.remove();

                    if (resultWindow && !rub.contains(resultWindow)) {
                        rub.appendChild(resultWindow);
                        Object.assign(resultWindow.style, {
                            position: "absolute",
                            top: "8vh",
                            right: "0",
                            width: "100vw",
                            height: "73vh",
                            borderRight: "none",
                            borderBottom: "none",
                            display: ""
                        });
                    }
                } else {
                    // QS mobile panel exists → show normally
                    let outer = document.getElementById("outerqsw2");
                    if (!outer) {
                        outer = document.createElement("div");
                        outer.id = "outerqsw2";
                        rub.appendChild(outer);
                    }

                    outer.innerHTML = "";
                    outer.appendChild(qsw2);

                    let outerWidth = Math.min(400, window.innerWidth * 0.9);
                    if (window.innerWidth < 400) outerWidth = window.innerWidth;

                    Object.assign(outer.style, {
                        position: "absolute",
                        top: "0vh",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: `${outerWidth}px`,
                        height: "73vh",
                        backgroundColor: "#fff",
                        //borderRadius: "6px",
                        //boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        overflow: "auto",
                        //padding: "1vh",
                        zIndex: "5000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    });

                    Object.assign(qsw2.style, {
                        width: "100%",
                        margin: "0 auto",
                        display: "block"
                    });

                    const overlay = document.getElementById("qswOverlay");
                    if (overlay) overlay.remove();

                    if (resultWindow && rub.contains(resultWindow)) resultWindow.style.display = "none";
                }

            } else {
                // QS off: restore resultWindow
                const outer = document.getElementById("outerqsw2");
                if (outer) outer.remove();

                const overlay = document.getElementById("qswOverlay");
                if (overlay) overlay.remove();

                if (resultWindow && !rub.contains(resultWindow)) {
                    rub.appendChild(resultWindow);
                    Object.assign(resultWindow.style, {
                        position: "absolute",
                        top: "8vh",
                        right: "0",
                        width: "100vw",
                        height: "73vh",
                        borderRight: "none",
                        borderBottom: "none",
                        display: ""
                    });
                }
            }

        } else if (currentWidth >= 700 && qson) {
            // ===== DESKTOP =====
            const outer = document.getElementById("outerqsw2");
            if (outer) outer.remove();

            let qsw = document.getElementById("qsw");
            if (!qsw) {
                qsw = document.createElement("div");
                qsw.id = "qsw";
            }

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
                    zIndex: "10000"
                });
                document.body.appendChild(overlay);

                overlay.addEventListener("click", (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                        localStorage.setItem("qson", "false");
                    }
                });
            }

            overlay.innerHTML = "";
            overlay.appendChild(qsw);

            Object.assign(qsw.style, {
                width: "400px",
                maxWidth: "90vw",
                height: "auto",
                position: "relative",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                backgroundColor: "#fff"
            });

        } else {
            // ===== QS OFF =====
            const outer = document.getElementById("outerqsw2");
            if (outer) outer.remove();

            const overlay = document.getElementById("qswOverlay");
            if (overlay) overlay.remove();

            if (resultWindow && !rub.contains(resultWindow)) {
                rub.appendChild(resultWindow);
                Object.assign(resultWindow.style, {
                    position: "absolute",
                    top: "8vh",
                    right: "0",
                    width: "100vw",
                    height: "73vh",
                    borderRight: "none",
                    borderBottom: "none",
                    display: ""
                });
            }
        }

        applyMobileWidths();
        updateBpText();
    }

    // Initial call
    applyMobileState();

    // Track last known width to detect direction of resize
    //let lastWidth = window.innerWidth;

    function applyState() {
        const currentWidth = window.innerWidth;

        // ================================
        // 🔹 Detect transition MOBILE → DESKTOP
        // ================================
        if (lastWidth < 700 && currentWidth >= 700) {
            //console.log("Switched to desktop mode");

            // Force toggle ON when entering desktop
            isToggled = true;
            localStorage.setItem("isToggled", "true");
        }

        // ================================
        // 🔹 Handle layouts
        // ================================
        if (currentWidth <= 700) {
            // ===== MOBILE MODE =====
            createMobileToggleUI();

            if (footer) footer.style.display = "none";
            toggleButton.style.display = "none";

            blocklyDiv.style.width = "100vw";
            applyMobileState();

        } else {
            // ===== DESKTOP MODE =====
            removeMobileToggleUI();

            if (footer) footer.style.display = "";

            // Restore the result window to its original parent
            if (originalResultParent && !originalResultParent.contains(resultWindow)) {
                originalResultParent.appendChild(resultWindow);

                Object.assign(resultWindow.style, {
                    position: "",
                    top: "",
                    right: "",
                    width: "",
                    height: ""
                });
            }

            toggleButton.style.display = "block";

            // Apply proper desktop layout (uses isToggled = true now)
            applyDesktopState();
        }

        // Always remember the current width
        lastWidth = currentWidth;
    }

    // ================================
    // ✅ Run on load and on resize
    // ================================
    applyState();

    // Debounced resize listener (optional, prevents flicker)
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(applyState, 100);
    });

    // Toggle button
    toggleButton.addEventListener("click", () => {
        if (window.innerWidth > 700) {
            isToggled = !isToggled;
            applyDesktopState();
        } else {
            // Mobile: just force text update
            updateBpText();
        }

        localStorage.setItem("isToggled", isToggled);
        if (window.workspace) Blockly.svgResize(workspace);
    });
}

// Expose globally
window.initResultWindowToggle = initResultWindowToggle;

// ====================
// INIT
// ====================

window.addEventListener("load", () => {
    initResultWindowToggle();
});

// Expose globally
window.initResultWindowToggle = initResultWindowToggle;

// ====================
// INIT
// ====================

window.addEventListener("load", () => {
    initResultWindowToggle();
});

// ===========================
// 🔹 Define reusable user/account icon + balance initializer
// ===========================
function onloadUserDicon() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const cachedBalance = localStorage.getItem("cached_balance");
    const authContainer = document.getElementById("authContainer");

    if (!authContainer) return;

    // Hide initially to prevent flicker
    authContainer.style.display = "none";

    if (isLoggedIn) {
        let accountType = localStorage.getItem("account_logged") || "real";
        localStorage.setItem("account_logged", accountType);

        authContainer.innerHTML = "";

        // ====== 🔴 Deposit button ======
        const depositBtn = document.createElement("button");
        depositBtn.id = "depositButton";
        depositBtn.textContent = "Deposit";
        depositBtn.style.height = "5vh";
        depositBtn.style.backgroundColor = "rgba(255, 0, 0, 0.8)"; // red but not too bright
        depositBtn.style.color = "white";
        depositBtn.style.fontWeight = "700";
        depositBtn.style.border = "none";
        depositBtn.style.borderRadius = "6px";
        depositBtn.style.cursor = "pointer";
        depositBtn.style.padding = "0 1.5vw";
        depositBtn.style.marginRight = "1vw";
        depositBtn.style.transition = "background-color 0.2s ease"; // ✅ fix transition target

        // Hover effects
        depositBtn.addEventListener("mouseenter", () => {
            depositBtn.style.backgroundColor = "rgba(255, 0, 0, 0.8)"; // darker red
        });
        depositBtn.addEventListener("mouseleave", () => {
            depositBtn.style.backgroundColor = "rgba(255, 0, 0, 0.8)"; // revert
        });

        // Click (only log, no color change)
        depositBtn.addEventListener("click", () => {
            console.log("Deposit button clicked");
        });

        // ====== Account type icon ======
        const accountIcon = document.createElement("img");
        accountIcon.id = "accountIcon";
        accountIcon.src = accountType === "real"
            ? "/static/icons/united-kingdom.png"
            : "/static/icons/d-icon.svg";
        accountIcon.alt = accountType === "real" ? "Real Account" : "Demo Account";
        accountIcon.style.height = "4vh";
        //accountIcon.style.marginRight = "0vw";
        accountIcon.style.cursor = "pointer";
        accountIcon.style.marginRight = "-2vw";

        // ====== Balance container ======
        const balanceContainer = document.createElement("div");
        balanceContainer.id = "acc_balance_but";
        balanceContainer.style.display = "flex";
        balanceContainer.style.alignItems = "center";
        balanceContainer.style.justifyContent = "center";
        balanceContainer.style.cursor = "pointer";
        balanceContainer.style.height = "7vh";
        //balanceContainer.style.padding = "0 0vw";
        balanceContainer.style.width = "fit-content";
        balanceContainer.style.fontSize = "12px";
        balanceContainer.style.marginRight = "-2vw";

        // ====== User icon ======
        const userIcon = document.createElement("img");
        userIcon.id = "userIcon";
        userIcon.src = "/static/icons/user.png";
        userIcon.alt = "User";
        userIcon.style.height = "4vh";
        //userIcon.style.marginLeft = "2vw";
        userIcon.style.cursor = "pointer";
        userIcon.style.marginRight = "2vw";

        // Append icons left → right
        // (Deposit button → Account icon → Balance container → User icon)
        authContainer.appendChild(depositBtn);
        authContainer.appendChild(accountIcon);
        authContainer.appendChild(balanceContainer);
        authContainer.appendChild(userIcon);

        // Show cached balance if available
        if (cachedBalance) {
            const parsed = JSON.parse(cachedBalance);
            updateBalanceUI(parsed.amount, parsed.currency);
        }

        // Save references globally
        window.accountIcon = accountIcon;
        window.userIcon = userIcon;

        // Show container
        authContainer.style.display = "flex";
        authContainer.style.alignItems = "center";
    } else {
        // Not logged in yet
        localStorage.setItem("account_logged", "real");
        authContainer.style.display = "flex";
    }

    // ---- Insert/replace your applyResponsiveHeader with this enhanced version ----
    function applyResponsiveHeader() {
        const leftGroup = document.querySelector(".left-g");
        if (!leftGroup) return;

        const userIcon = document.getElementById("userIcon");
        const balanceContainer = document.getElementById("acc_balance_but");
        const depositBtn = document.getElementById("depositButton");

        // Add CSS for menu if not already present
        if (!document.getElementById("mobileMenuStyles")) {
            const style = document.createElement("style");
            style.id = "mobileMenuStyles";
            style.innerHTML = `
                /* container */
                #menudiv {
                    position: fixed;
                    top: 7.5vh;
                    left: 0;
                    width: 90vw;
                    max-width: 200px;
                    height: 75vh;
                    /*background: #ffffff;*/
                    background: var(--menu-bg);
                    color: var(--text-color);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    border-radius: 6px;
                    z-index: 9999;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                /* header inside menudiv */
                #menudiv .menu1div {
                    height: 7vh;
                    min-height: 40px;
                    /*border-bottom: 1px solid rgba(0,0,0,0.06);*/
                    border-bottom: 1px solid var(--menu-divider);
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                #menudiv .close-icon {
                    position: absolute;
                    left: 4%;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 3vh;
                    line-height: 1;
                    cursor: pointer;
                    user-select: none;
                }
                #menudiv .menu-title {
                    position: absolute;
                    left: 30%;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 12px;
                    font-weight: 700;
                    /*color: rgba(0,0,0,0.85);*/
                    color: var(--text-color);
                }
                #menudiv .lang-block {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 10%;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-weight: 600;
                    /*color: rgba(0,0,0,0.85);*/
                    color: var(--text-color);
                }
                #menudiv .lang-block img.flag {
                    width: 18px;
                    height: 12px;
                    object-fit: cover;
                    margin-right: 5px;
                }
                /* body with menu items */
                #menudiv .menu2div {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding-top: 6px;
                    overflow-y: auto;
                }
                #menudiv .menu-row {
                    height: 7vh;
                    /*min-height: 18px;*/
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    user-select: none;
                    position: relative;
                    padding-right: 6%;
                }
                #menudiv .menu-row:hover {
                    background: rgba(0,0,0,0.03);
                }
                #menudiv .menu-row img.row-icon {
                    margin-left: 2%;
                    width: 3vh;
                    height: 3vh;
                    object-fit: contain;
                }
                #menudiv .menu-row .row-text {
                    margin-left: 4%;
                    font-size: 14px;
                    /*color: rgba(0,0,0,0.9);*/
                    color: var(--text-color);
                }

                /* ✅ Toggle switch inside Dark theme row */
                .theme-toggle {
                  position: absolute;        /* so "right" actually takes effect */
                  right: 4px;                /* <-- 4px from the right edge */
                  top: 50%;                  /* vertically center */
                  transform: translateY(-50%);
                  width: 38px;
                  height: 20px;
                  border-radius: 20px;
                  background: rgba(0, 0, 0, 0.2);
                  cursor: pointer;
                  transition: background 0.3s;
                }

                .theme-toggle .toggle-knob {
                  position: absolute;
                  top: 2px;
                  left: 2px;
                  width: 16px;
                  height: 16px;
                  background: #fff;
                  border-radius: 50%;
                  transition: left 0.3s;
                }

                .theme-toggle.active {
                  background: rgba(0, 200, 0, 0.5);
                }

                .theme-toggle.active .toggle-knob {
                  left: 20px; /* stays inside the switch */
                }

                /* Simple dark theme */
                body.dark-theme {
                    background-color: #121212 !important;
                    color: #eaeaea !important;
                }

                body.dark-theme #menudiv {
                    background-color: #1c1c1c !important;
                }

                body.dark-theme #menudiv .row-text,
                body.dark-theme #menudiv .menu-title,
                body.dark-theme #menudiv .lang-block {
                    color: rgba(255,255,255,0.9) !important;
                }
            `;
            document.head.appendChild(style);
        }

        // --- Find existing elements ---
        const existingMenuIcon = leftGroup.querySelector(".menu-icon");
        const existingDashboardLink = leftGroup.querySelector(".dashboard-btn")?.closest("a");

        // helper to create/show the menudiv
        function createAndShowMenu() {
            // if already exists, don't recreate
            if (document.getElementById("menudiv")) return;
            const menudiv = document.createElement("div");
            menudiv.id = "menudiv";
            menudiv.setAttribute("role", "dialog");
            menudiv.setAttribute("aria-modal", "true");

            // menu1div (header)
            const menu1div = document.createElement("div");
            menu1div.className = "menu1div";

            const closeIcon = document.createElement("span");
            closeIcon.className = "close-icon";
            closeIcon.innerHTML = "✕"; // accessible X icon
            closeIcon.title = "Close menu";
            closeIcon.addEventListener("click", (e) => {
                e.stopPropagation();
                removeMenu();
            });

            const menuTitle = document.createElement("div");
            menuTitle.className = "menu-title";
            menuTitle.textContent = "Menu";

            // language + flag block at right
            const langBlock = document.createElement("div");
            langBlock.className = "lang-block";

            const lang = (localStorage.getItem("lang") || "english").toLowerCase();
            let flagSrc = "";
            if (lang === "english" || lang.startsWith("en")) {
                flagSrc = window.STATIC_ICONS?.['united-kingdom'] || "/static/icons/united-kingdom.png";
            } else {
                // fallback or other flag logic - use a generic globe icon if you want
                flagSrc = window.STATIC_ICONS?.['globe'] || "/static/icons/united-kingdom.png";
            }

            const flagImg = document.createElement("img");
            flagImg.className = "flag";
            flagImg.src = flagSrc;
            flagImg.alt = `${lang} flag`;

            const langText = document.createElement("span");
            langText.textContent = lang === "english" ? "English" : lang;

            // append lang components (flag left of language text; flag 5% to left of text achieved via right-pos in CSS)
            langBlock.appendChild(flagImg);
            langBlock.appendChild(langText);

            menu1div.appendChild(closeIcon);
            menu1div.appendChild(menuTitle);
            menu1div.appendChild(langBlock);

            menudiv.appendChild(menu1div);

            // menu2div (rows)
            const menu2div = document.createElement("div");
            menu2div.className = "menu2div";

            // row builder helper
            function createMenuRow(iconSrc, text, clickHandler) {
                const row = document.createElement("div");
                row.className = "menu-row";

                const iconContainer = document.createElement("div");
                iconContainer.className = "row-icon";

                // --- Inline SVG if it's the menu.svg ---
                if (!iconSrc || iconSrc.includes("menu.svg")) {
                    iconContainer.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 16 16"
                             width="16"
                             height="16"
                             fill="var(--text-general)">
                            <path d="M13.539 12c.254 0 .461.224.461.5s-.207.5-.461.5H2.462C2.207 13 2 12.776 2 12.5s.207-.5.462-.5zm0-4.5c.254 0 .461.224.461.5s-.207.5-.461.5H2.462C2.207 8.5 2 8.276 2 8s.207-.5.462-.5zm0-4.5c.254 0 .461.224.461.5s-.207.5-.461.5H2.462C2.207 4 2 3.776 2 3.5s.207-.5.462-.5z"/>
                        </svg>
                    `;
                } else {
                    // --- Fallback to normal image if a custom src is provided ---
                    const icon = document.createElement("img");
                    icon.src = iconSrc;
                    icon.alt = text + " icon";
                    iconContainer.appendChild(icon);
                }

                const label = document.createElement("div");
                label.className = "row-text";
                label.textContent = text;

                row.appendChild(iconContainer);
                row.appendChild(label);

                row.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (typeof clickHandler === "function") clickHandler(e);
                    removeMenu();
                });

                return row;
            }

            // ===============================
            // 🎨 Theme-Adaptive SVG Icon System
            // ===============================

            // Define SVG markup that uses CSS variables for color
            const cashierIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="var(--text-general)">
              <path d="M1.5 6a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zM15 1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2v1h1.5A1.5 1.5 0 0 1 16 6.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-7A1.5 1.5 0 0 1 1.5 5H2V3h5v2h5V4h-2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm0 10H1v1h14zm-1.5-2h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-5 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m11-2h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-5 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M6 4H3v1h3zm9-2h-5v1h5z"></path>
            </svg>
            `;

            const darkIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="var(--text-general)">
              <g><path d="M8 15A7 7 0 1 0 8 1v14m0 1a7.98 7.98 0 0 1-6.1-2.823A8 8 0 1 1 8 16"></path></g>
            </svg>
            `;

            const whatsappIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="var(--text-general)">
              <path fill-rule="evenodd" d="M13.667 2.337A7.93 7.93 0 0 0 8.034 0C3.643 0 .073 3.574.07 7.962c0 1.405.366 2.772 1.061 3.983L0 16l4.223-1.035a8 8 0 0 0 3.808.97h.003c4.388 0 7.962-3.574 7.966-7.966a7.91 7.91 0 0 0-2.333-5.632M8.034 14.591a6.6 6.6 0 0 1-3.371-.924l-.241-.145-2.505.656.668-2.443-.156-.252a6.6 6.6 0 0 1-1.012-3.521c0-3.65 2.97-6.618 6.621-6.618a6.6 6.6 0 0 1 4.682 1.94 6.59 6.59 0 0 1 1.936 4.682c-.004 3.654-2.975 6.625-6.622 6.625m3.632-4.96c-.199-.1-1.176-.58-1.36-.65-.183-.065-.316-.099-.446.1-.134.198-.516.649-.63.779-.115.133-.233.149-.432.05-.198-.1-.84-.31-1.6-.99-.592-.527-.989-1.18-1.107-1.378-.115-.199-.012-.306.088-.405.087-.088.198-.233.297-.347.1-.115.134-.2.199-.333s.034-.248-.015-.347c-.05-.1-.447-1.08-.615-1.478-.16-.39-.325-.336-.447-.34-.114-.008-.248-.008-.382-.008a.73.73 0 0 0-.53.249c-.184.198-.696.68-.696 1.66 0 .982.715 1.925.814 2.059.1.134 1.401 2.142 3.398 3.005.474.207.844.329 1.135.42.477.153.908.13 1.252.08.382-.057 1.176-.48 1.344-.947.164-.465.164-.863.115-.947-.05-.084-.184-.133-.382-.232" clip-rule="evenodd"></path>
            </svg>
            `;


            // ===============================
            // 📦 Create Icon Elements
            // ===============================
            function createInlineSVGIcon(svgMarkup) {
                const div = document.createElement("div");
                div.innerHTML = svgMarkup.trim();
                const svg = div.firstChild;
                svg.classList.add("menu-icon-inline");
                return svg;
            }

            // Example usage when creating menu rows:
            function createMenuRow(iconMarkup, text, clickHandler) {
                const row = document.createElement("div");
                row.className = "menu-row";

                const icon = createInlineSVGIcon(iconMarkup);
                const label = document.createElement("div");
                label.className = "row-text";
                label.textContent = text;

                row.appendChild(icon);
                row.appendChild(label);

                row.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (typeof clickHandler === "function") clickHandler(e);
                    removeMenu();
                });

                return row;
            }

            // Example of menu rows creation:
            const cashierRow = createMenuRow(cashierIcon, "Cashier", () => openCashier());
            const themeRow = createMenuRow(darkIcon, "Toggle Theme", () => toggleTheme());
            const whatsappRow = createMenuRow(whatsappIcon, "Support", () => openWhatsApp());

            // --- 1️⃣ Cashier Row ---
            const row1 = createMenuRow(cashierIcon, "Cashier", () => {
                console.log("Navigating to Cashier");
            });

            // --- 2️⃣ Dark Theme Row (Aligned with CSS Variables) ---
            const row2 = createMenuRow(darkIcon, "Dark Theme");

            // Add toggle switch element inside row2
            const toggle = document.createElement("div");
            toggle.className = "theme-toggle";
            const knob = document.createElement("div");
            knob.className = "toggle-knob";
            toggle.appendChild(knob);

            // ✅ Restore theme from localStorage on load
            //const savedTheme = localStorage.getItem("theme") || "light";

            // ✅ Check localStorage or default to light
            let savedTheme = localStorage.getItem("theme");

            // If no theme saved, explicitly set light as default
            if (!savedTheme) {
                savedTheme = "light";
                localStorage.setItem("theme", "light");
            }

            document.documentElement.setAttribute("data-theme", savedTheme);

            //if (savedTheme === "dark") {
              //  toggle.classList.add("active");
            //}

            // ✅ Update toggle UI
            if (savedTheme === "dark") {
                toggle.classList.add("active");
            } else {
                toggle.classList.remove("active");
            }

            // ✅ Toggle click listener
            toggle.addEventListener("click", (e) => {
                e.stopPropagation(); // prevent closing menu
                toggle.classList.toggle("active");

                const isDarkNow = toggle.classList.contains("active");
                const newTheme = isDarkNow ? "dark" : "light";

                document.documentElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("theme", newTheme);

                //console.log(newTheme === "dark" ? "🌙 Dark theme enabled" : "☀️ Light theme enabled");
            });

            row2.appendChild(toggle);
/*
            // --- 3️⃣ WhatsApp Row ---
            const row3 = createMenuRow(whatsappIcon, "WhatsApp", () => {
                console.log("Navigating to WhatsApp");
            });
*/
            // --- 3️⃣ WhatsApp Row ---
            const row3 = createMenuRow(whatsappIcon, "WhatsApp", () => {
                console.log("Navigating to WhatsApp group...");
                window.open("https://chat.whatsapp.com/l0Vvb5iYFJdJ1x2dQXAmL9?mode=wwt", "_blank");
            });

            menu2div.appendChild(row1);
            menu2div.appendChild(row2);
            menu2div.appendChild(row3);

            menudiv.appendChild(menu2div);

            document.body.appendChild(menudiv);

            // outside click closes menu
            setTimeout(() => { // allow the menudiv to be added before adding listener to avoid immediate close
                document.addEventListener("click", documentClickHandler);
            }, 0);
        }

        // remove menu and cleanup
        function removeMenu() {
            const menudiv = document.getElementById("menudiv");
            if (menudiv) menudiv.remove();
            document.removeEventListener("click", documentClickHandler);
        }

        // document click handler - close when click outside of menudiv or on nothing
        function documentClickHandler(evt) {
            const menudiv = document.getElementById("menudiv");
            const menuIconEl = leftGroup.querySelector(".menu-icon");
            const target = evt.target;
            if (!menudiv) {
                document.removeEventListener("click", documentClickHandler);
                return;
            }
            // if click is inside menudiv, ignore
            if (menudiv.contains(target)) return;
            // if click is on the menu icon itself, ignore (menu-icon listener handles toggling)
            if (menuIconEl && menuIconEl.contains(target)) return;
            // otherwise remove
            removeMenu();
        }

        if (window.innerWidth < 700) {
            // ===============================
            // 📱 SMALL SCREEN VIEW
            // ===============================
            if (!existingMenuIcon && existingDashboardLink) {
                // Remove D-bots astronaut button
                existingDashboardLink.remove();

                // Create inline SVG menu icon (theme-aware)
                const menuIcon = document.createElement("div");
                menuIcon.classList.add("menu-icon");
                menuIcon.style.height = "4vh";
                menuIcon.style.cursor = "pointer";
                menuIcon.style.marginLeft = "10px";
                menuIcon.style.marginRight = "1vw";
                menuIcon.style.verticalAlign = "middle";
                menuIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 16 16"
                         width="24"
                         height="24"
                         fill="var(--text-general)">
                        <path d="M13.539 12c.254 0 .461.224.461.5s-.207.5-.461.5H2.462C2.207 13 2 12.776 2 12.5s.207-.5.462-.5zm0-4.5c.254 0 .461.224.461.5s-.207.5-.461.5H2.462C2.207 8.5 2 8.276 2 8s.207-.5.462-.5zm0-4.5c.254 0 .461.224.461.5s-.207.5-.461.5H2.462C2.207 4 2 3.776 2 3.5s.207-.5.462-.5z"/>
                    </svg>
                `;

                // click toggles menudiv
                menuIcon.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const menudiv = document.getElementById("menudiv");
                    if (menudiv) {
                        removeMenu();
                    } else {
                        createAndShowMenu();
                    }
                });

                // Insert menu icon as the first element in left-g (before Telegram)
                leftGroup.insertBefore(menuIcon, leftGroup.firstChild);
            }

            // Hide elements not needed on mobile
            if (userIcon) userIcon.style.display = "none";
            if (depositBtn) depositBtn.style.display = "none";

            // Adjust spacing since user icon is hidden
            if (balanceContainer) balanceContainer.style.marginRight = "10px";
        } else {
            // ===============================
            // 💻 LARGE SCREEN VIEW
            // ===============================
            if (existingMenuIcon) {
                existingMenuIcon.remove();
                // Remove any open menudiv when going to large screen
                const menudiv = document.getElementById("menudiv");
                if (menudiv) menudiv.remove();
                document.removeEventListener("click", documentClickHandler);

                // Rebuild D-bots astronaut button
                const dashboardLink = document.createElement("a");
                dashboardLink.href = window.DASHBOARD_URL || "/dashboard/";
                dashboardLink.setAttribute("hx-target", "#page-content");
                dashboardLink.setAttribute("hx-push-url", "true");

                const dashboardButton = document.createElement("button");
                dashboardButton.classList.add("dashboard-btn");
                dashboardButton.innerHTML = `
                    <img src="${window.STATIC_ICONS?.astronaut || '/static/icons/astronaut.png'}"
                         alt="Rocket Icon"
                         class="dashboard-icon">
                    D-bots
                `;

                dashboardLink.appendChild(dashboardButton);
                leftGroup.insertBefore(dashboardLink, leftGroup.firstChild);
            }

            // Restore visible elements
            if (userIcon) userIcon.style.display = "inline-block";
            if (depositBtn) depositBtn.style.display = "inline-block";

            // Restore default balance spacing
            if (balanceContainer) balanceContainer.style.marginRight = "-2vw";
        }
    }

    // Run on load + resize
    //window.addEventListener("load", applyResponsiveHeader);
     // Run once on load
    applyResponsiveHeader();

    window.addEventListener("resize", applyResponsiveHeader);
}

// ===========================
// 🔹 Auto-run on page load
// ===========================
document.addEventListener("DOMContentLoaded", onloadUserDicon);

// ✅ Place this at the very top of your JS file (before updateBalanceUI)
function applyResponsiveBalanceStyles() {
    const balWin = document.getElementById("bal_win");
    if (!balWin) return;

    const screenWidth = window.innerWidth;

    if (screenWidth <= 700) {
        // 📱 Mobile view
        balWin.style.width = "90vw";
        balWin.style.maxWidth = "300px";
        balWin.style.right = "2vw";
        //balWin.style.transform = "translateX(50%)";
        balWin.style.top = "7.5vh";
        balWin.style.borderRadius = "8px";
    } else {
        // 💻 Desktop view
        balWin.style.width = "24vw";
        balWin.style.right = "2vw";
        balWin.style.transform = "none";
        balWin.style.top = "7.5vh";
        balWin.style.borderRadius = "5px";
    }
}

function updateBalanceUI(amount, currency) {

    const accountIcon = document.getElementById("accountIcon");
    const userIcon = document.getElementById("userIcon");

    // If either is missing, re-run the initializer
    if (!accountIcon || !userIcon) {
        console.warn("⚠️ One or more header icons missing. Reinitializing...");
        onloadUserDicon();
    }

    const balanceContainer = document.getElementById("acc_balance_but");
    if (!balanceContainer) return;

    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // ✅ Helper to apply responsive font sizes and weights
    function applyBalanceTextStyles() {
        const isMobile = window.innerWidth < 700;
        const fontSize = isMobile ? "12px" : "16px";
        const fontWeight = isMobile ? "700" : "800";

        // Update elements if they already exist
        const balanceAmount = document.getElementById("balanceAmount");
        const balanceCurrency = document.getElementById("balanceCurrency");
        if (balanceAmount && balanceCurrency) {
            balanceAmount.style.fontSize = fontSize;
            balanceCurrency.style.fontSize = fontSize;
            balanceAmount.style.fontWeight = fontWeight;
            balanceCurrency.style.fontWeight = fontWeight;
        }
    }

    balanceContainer.innerHTML = `
        <strong id="balanceAmount" style="color: rgba(0, 128, 0, 0.4); font-weight: 800; font-size: 14px;">
            ${formatted}
        </strong>
        <span id="balanceCurrency" style="color: rgba(0, 128, 0, 0.4); font-weight: 800; font-size: 14px;">
            ${currency}
        </span>
        <img id="balanceToggleIcon"
            src="/static/icons/down.png"
            alt="Toggle Icon"
            style="width: 4vh; height: 4vh; transform: rotate(180deg); transition: transform 0.1s ease; margin-left: 1vw;">
    `;

    // ✅ Apply font styles now
    applyBalanceTextStyles();

    // ✅ Also update on resize
    window.addEventListener("resize", applyBalanceTextStyles);

    let isBalWinOpen = false; // ✅ track open/closed state
    const toggleIcon = document.getElementById("balanceToggleIcon");

    balanceContainer.addEventListener("click", (e) => {
        //const isRotatedUp = toggleIcon.style.transform === "rotate(0deg)";
        //toggleIcon.style.transform = isRotatedUp ? "rotate(180deg)" : "rotate(0deg)";

        e.stopPropagation(); // prevent from triggering document listener

        isBalWinOpen = !isBalWinOpen; // flip state
        toggleIcon.style.transform = isBalWinOpen ? "rotate(0deg)" : "rotate(180deg)";

        let balWin = document.getElementById("bal_win");

        if (isBalWinOpen) {
            if (!balWin) {
                balWin = document.createElement("div");
                balWin.id = "bal_win";
                balWin.style.cssText = `
                    position: fixed;
                    top: 7.5vh;
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
                            //height: 3.5vw;
                            height: 7.5vh;
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
                            //height: 3.5vw;
                            height: 7.5vh;
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
                        height: 7vh;
                        width: 100%;
                        //overflow: hidden;
                        overflow: visible;
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
                            font-size: 12px;
                            color: rgba(0, 0, 0, 0.9);
                        ">Deriv accounts</span>
                        <img id="deaIcon" src="/static/icons/down.png" style="
                            position: absolute;
                            top: 50%;
                            right: 2vw;
                            transform: translateY(-50%);
                            width: 2.4vh;
                            height: 2.4vh;
                            cursor: pointer;
                            transition: transform 0.3s ease;
                        ">
                    </div>

                    <!-- Traders Hub Section -->
                    <div id="TH" style="
                        background-color: white;
                        color: rgba(255, 0, 0, 0.7);
                        font-size: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 7vh;
                        width: 100%;
                        border-bottom: 4px solid rgba(128, 128, 128, 0.2);
                        box-sizing: border-box;
                    ">Looking for CFD accounts? Go to Traders Hub</div>

                    <!-- Log Out Section -->
                    <div id="lo" style="
                        background-color: white;
                        height: 7vh;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        padding-left: 15vw;
                        font-size: 12px;
                        box-sizing: border-box;
                        border-radius: 0px 0px 5px 5px;
                    ">Logout</div>
                `;

                document.body.appendChild(balWin);
                applyResponsiveBalanceStyles(); // 👈 This goes right here, immediately after

                // ✅ Prevent clicks inside balWin from re-triggering the toggle
                //balWin.addEventListener("click", (e) => e.stopPropagation());
                // ✅ Prevent clicks inside balWin from closing it
                balWin.addEventListener("click", (e) => {
                    e.stopPropagation();
                });

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

                    // ✅ Keep global account status in sync
                    localStorage.setItem("account_logged", type);

                    ws.send(JSON.stringify({
                        event: type === "real" ? "select_account_real" : "select_account_demo",
                        type: type
                    }));

                    //console.log(`🔁 Switched to ${type} account`);

                    // ✅ Update the icon directly
                    const accountIcon = document.getElementById("accountIcon");
                    if (accountIcon) {
                        accountIcon.src = type === "real"
                            ? "/static/icons/united-kingdom.png"
                            : "/static/icons/d-icon.svg";
                        accountIcon.alt = type === "real" ? "Real Account" : "Demo Account";
                        //console.log("✅ Icon switched successfully:", accountIcon.src);
                    } else {
                        console.warn("⚠️ No accountIcon found in DOM!");
                    }
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
                    dea.style.height = isUp ? "6vh" : "14vh";

                    const deaText = dea.querySelector("span");
                    deaText.style.marginTop = isUp ? "0" : "-3vh";
                    deaIcon.style.marginTop = isUp ? "0" : "-4vh";

                    // Remove existing info panel if it exists
                    const oldPanel = dea.querySelector("#accountInfoPanel");
                    if (oldPanel) oldPanel.remove();

                    // If collapsed, stop here
                    if (isUp) return;

                    // Get actual values from the response dictionary
                    //const loginid = responseData?.balance?.balance?.loginid || "UnknownID";
                    //const loginid = window.WS_DATA?.currentAccount?.loginid;
                    //const actualBalance = responseData?.balance?.balance?.balance || 0;
                    //const currency = responseData?.balance?.balance?.currency || "";

                    // ✅ Temporary login ID placeholder (you’ll replace this later with localStorage)
                    //const loginid = "CR123456";
                    // Determine which account is active
                    const isDemo = demoBtn.style.fontWeight === "bold";

                    // ✅ Use correct login ID from localStorage
                    const loginid = isDemo
                        ? localStorage.getItem("demo_login")
                        : localStorage.getItem("real_login");

                    const currencyUsed = isDemo
                        ? localStorage.getItem("demo_currency")
                        : localStorage.getItem("real_currency");

                    const actualBalance = (typeof amount !== "undefined" && amount !== null)
                        ? amount
                        : parseFloat(localStorage.getItem("acct-bal")) || 0;


                    // Format the balance (e.g., 10000 becomes "10,000.00")
                    const formattedBalance = Number(actualBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });

                    // Determine active account
                    //const isDemo = demoBtn.style.fontWeight === "bold";
                    const accountId = loginid;
                    const balance = `${formattedBalance} ${currency}`;

                    // Create account info panel
                    const panel = document.createElement("div");
                    panel.id = "accountInfoPanel";
                    panel.style.cssText = `
                        position: absolute;
                        //bottom: 0.2vw;
                        top: 7vh;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 6vh;
                        width: calc(100% - 10px);
                        background-color: rgba(200, 200, 200, 0.7);
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 2vw;
                        box-sizing: border-box;
                        font-size: 12px;
                    `;

                    // Left section: icon + label + account ID
                    const left = document.createElement("div");
                    left.style.display = "flex";
                    left.style.alignItems = "center";
                    left.style.gap = "0.8vw"; // space between icon and text

                    // Choose correct icon based on account type
                    const icon = document.createElement("img");
                    icon.src = isDemo
                        ? "/static/icons/d-icon.svg"
                        : "/static/icons/united-kingdom.png";
                    icon.alt = isDemo ? "Demo Account" : "Real Account";
                    icon.style.width = "3vh";
                    icon.style.height = "3vh";
                    icon.style.borderRadius = "50%";
                    icon.style.objectFit = "cover";

                    // Text container (label + ID)
                    const textContainer = document.createElement("div");
                    textContainer.innerHTML = `
                        <div style="font-weight: bold;">${isDemo ? "Demo" : "US DOLLAR"}</div>
                        <div>${accountId}</div>
                    `;

                    // Append both
                    left.appendChild(icon);
                    left.appendChild(textContainer);


                    // Right section: either balance or reset button
                    const right = document.createElement("div");
                    if (isDemo && balance === "10,000.00 USD") {
                        right.innerHTML = `<div style="font-weight: bold; font-size: 10px; color: black;">${balance}</div>`;
                    } else if (isDemo) {
                        right.innerHTML = `<button id="reset-balance-btn" style="
                            border: 0.2px solid black;
                            width: auto;
                            //height: 3.5vh;
                            height: auto;
                            cursor: pointer;
                            border-radius: 5px;
                            background-color: rgba(128, 128, 128, 0.2);
                        ">Reset balance</button>`;

                        // ✅ Attach the event listener immediately
                        const resetBtn = right.querySelector("#reset-balance-btn");
                        if (resetBtn) {
                            resetBtn.addEventListener("click", () => {
                                //console.log("🔄 Reset balance button clicked");

                                const request = {
                                    event: "reset_virtual_balance",  // <-- 👈 Custom event type
                                    topup_virtual: 1,
                                    req_id: 1
                                };

                                if (ws && ws.readyState === WebSocket.OPEN) {
                                    ws.send(JSON.stringify(request));
                                    //console.log("📤 Sent topup_virtual request");
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
                    //dea.insertBefore(panel, deaIcon); // insert before icon to keep structure neat
                    dea.appendChild(panel); // ✅ simpler, reliable insertion

                    //console.log("Deriv accounts toggled");
                });
            } else {
                balWin.style.display = "flex";
            }
        } else {
            //if (balWin) balWin.style.display = "none";
            // ✅ close & cleanup safely
            if (balWin) {
                balWin.style.display = "none";
                balWin.remove(); // <— 🧹 remove it here, after closing
            }
        }
    });

    // ✅ Close when clicking outside
    document.addEventListener("click", (event) => {
        const balWin = document.getElementById("bal_win");
        if (!isBalWinOpen || !balWin) return;

        if (!balWin.contains(event.target) && !balanceContainer.contains(event.target)) {
            balWin.style.display = "none";
            isBalWinOpen = false;
            toggleIcon.style.transform = "rotate(180deg)";
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    applyResponsiveBalanceStyles();
});

window.addEventListener("resize", () => {
    applyResponsiveBalanceStyles();
});

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

    //console.log("🧱 Blockly workspace created and ready");

    // Check for saved XML blocks in localStorage
    const savedWorkspaceXml = localStorage.getItem("workspaceXml");

    if (savedWorkspaceXml) {
        const xmlDom = Blockly.Xml.textToDom(savedWorkspaceXml);
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
        //console.log("♻️ Restored workspace from localStorage XML");
    } else {
        // Fallback to InitialBlocks if nothing saved
        const initialDom = Blockly.utils.xml.textToDom(InitialBlocks);
        Blockly.Xml.domToWorkspace(initialDom, workspace);
        //console.log("🆕 Loaded InitialBlocks into workspace");
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

// 🧠 Step 1: Check if WebSocket is already active or closed
if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {
    // 🧠 Step 2: Only create client ID *inside* first connection
    let clientId = localStorage.getItem("client_id");
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("client_id", clientId);
    }

    // ✅ Check login status
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // 🌐 Dynamically detect ws:// or wss:// based on current page protocol
    const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const wsProtocol = isLocalhost ? "ws" : "wss";
    const wsHost = isLocalhost ? "localhost:8057" : "kkmaina.onrender.com";
    //const wsUrl = `${wsProtocol}://${wsHost}/ws/ticks/?client_id=${clientId}`;

    // 🔗 Include both client_id AND is_logged_in in the URL query params
    const wsUrl = `${wsProtocol}://${wsHost}/ws/ticks/?client_id=${clientId}&is_logged_in=${isLoggedIn}`;

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
        }

        // 🧱 Blockly workspace check
        const storedWorkspace = localStorage.getItem("workspace_initialized");
        if (!storedWorkspace || storedWorkspace !== "true") {
            createWorkspace();  // 🧰 Your Blockly init
            localStorage.setItem("workspace_initialized", "true");
        }
    };

    // ❌ On close — clear all localStorage keys
    window.ws.onclose = () => {
        //localStorage.clear();  // 🔥 You may want to refine this in future
        console.warn("🛑 WebSocket closed. LocalStorage cleared.");
    };

    // ❌ On error
    window.ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
    };
} else {
    console.log("✅ Reusing existing WebSocket connection");
}

document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runButton');

    const currentAccount = window.WS_DATA?.currentAccount;

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

            // Send Stop signal to backend
            sendStopSignalToBackend();  // <-- New method to send stop message
        } else {
            // ✅ If we're in Run mode (clicked to start the bot)
            try {
                const workspace = Blockly.getMainWorkspace();
                const workspaceXml = Blockly.Xml.workspaceToDom(workspace);
                const xmlText = Blockly.Xml.domToText(workspaceXml);

                const pythonCode = Blockly.Python.workspaceToCode(workspace);
                // Send Python code to backend
                sendPythonCodeToBackend(pythonCode);

                // Switch button to Stop mode
                if (icon && stopIcon) icon.src = stopIcon;
                if (text) text.textContent = "Stop";
                runButton.style.backgroundColor = "rgba(255, 82, 95, 1)"; //"rgba(255, 0, 0, 0.2)"; // strong red
            } catch (error) {
                console.error('❌ Error extracting Blockly workspace XML:', error);
            }
        }
    });
});

// Send Stop signal to backend
function sendStopSignalToBackend() {
    const stopMessage = {
        event: "stop_bot",
        message: "Stop the bot",
    };

    // Use the existing WebSocket send function to send the stop message
    window.sendWebSocketMessage(stopMessage);
}

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
}

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const rightG = document.querySelector(".right_g");

// ================================
// 🔁 Wait until WebSocket is open
// ================================
async function waitForWebSocket(ws, maxRetries = 25, interval = 400) {
    let attempt = 0;

    while ((!ws || ws.readyState !== WebSocket.OPEN) && attempt < maxRetries) {
        attempt++;
        console.warn(`⏳ Waiting for WebSocket to open... (attempt ${attempt})`);
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
        return true;
    } else {
        console.error("❌ WebSocket failed to open after retries.");
        return false;
    }
}

// ===========================
// 🔹 Define reusable login initializer
// ===========================
function onloadLogin() {
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    // ===========================
    // 🔹 Hardcoded test credentials
    // ===========================
    const acct1 = "YOUR_REAL_ACCOUNT_ID"; // e.g., CR123456
    const token1 = "YOUR_REAL_TOKEN";     // Get from Deriv dashboard
    const cur1 = "USD";

    const acct2 = "YOUR_DEMO_ACCOUNT_ID"; // e.g., VRTC123456
    const token2 = "YOUR_DEMO_TOKEN";     // Get from Deriv dashboard
    const cur2 = "USD";

    const lang = localStorage.getItem("lang") || "EN";

    // Store static account info
    localStorage.setItem("real_login", acct1);
    localStorage.setItem("demo_login", acct2);
    localStorage.setItem("real_currency", cur1);
    localStorage.setItem("demo_currency", cur2);

    // ===========================
    // 🔹 Login button → simulate OAuth flow
    // ===========================
    if (loginButton) {
        loginButton.addEventListener("click", async () => {
            console.log("🔐 Starting simulated login with hardcoded tokens...");

            // ✅ Ensure persistent client_id
            let clientId = localStorage.getItem("client_id");
            if (!clientId) {
                clientId = crypto.randomUUID();
                localStorage.setItem("client_id", clientId);
                console.log("🆔 Generated new client_id:", clientId);
            } else {
                console.log("🆔 Using existing client_id:", clientId);
            }

            // ✅ Prepare payload for backend
            const payload = {
                client_id: clientId,
                api_token: token1,
                demo_token: token2,
                accounts: {
                    real: { id: acct1, currency: cur1 },
                    demo: { id: acct2, currency: cur2 }
                },
                lang
            };

            console.log("📤 Sending payload to backend via /tracking/store_tokens/ ...", payload);

            try {
                // ✅ Step 1: Send tokens via HTTPS POST
                const resp = await fetch("/tracking/store_tokens/", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const json = await resp.json();
                console.log("📥 Backend response:", json);

                if (json && json.ok && json.client_id) {
                    localStorage.setItem("client_id", json.client_id);
                    localStorage.setItem("isLoggedIn", "true");

                    console.log("💾 Stored verified client_id:", json.client_id);

                    // ✅ Call user display initializer right after login success
                    onloadUserDicon();

                    // ✅ Step 3: Send start_auth to backend via WebSocket
                    if (window.ws && ws.readyState === WebSocket.OPEN) {
                        console.log("🌐 WebSocket is open — starting auth...");

                        const symbol = localStorage.getItem("selectedSymbol") || null;

                        ws.send(JSON.stringify({
                            event: "start_auth",
                            client_id: json.client_id,
                            symbol
                        }));

                        console.log("📤 Sent start_auth via WebSocket.");
                    } else {
                        console.warn("⚠️ WebSocket not ready — cannot start_auth yet.");
                    }
                }

                // ✅ Step 4: Cleanup local storage (remove sensitive data)
                localStorage.removeItem("api_token");
                localStorage.removeItem("demo_token");
                localStorage.removeItem("real_account");
                localStorage.removeItem("demo_account");
                localStorage.setItem("lang", lang);

                console.log("✅ Tokens securely sent and cleared locally.");

                // ===========================
                // 🔹 Update UI to logged-in state
                // ===========================
                const authContainer = document.getElementById("authContainer");
                if (authContainer) {
                    authContainer.innerHTML = "";

                    const balanceContainer = document.createElement("div");
                    balanceContainer.id = "acc_balance_but";
                    balanceContainer.style.display = "flex";
                    balanceContainer.style.alignItems = "center";
                    balanceContainer.style.justifyContent = "center";
                    //balanceContainer.style.gap = "1vw";
                    balanceContainer.style.cursor = "pointer";
                    balanceContainer.style.height = "7vh";
                    balanceContainer.style.borderTopRightRadius = "10px";
                    //balanceContainer.style.borderLeft = "1px solid rgba(0, 0, 0, 0.3)";
                    //balanceContainer.style.padding = "0 2vh";
                    balanceContainer.style.width = "fit-content";

                    const balText = document.createElement("span");
                    balText.textContent = "💰 Logged in (Simulated)";
                    balanceContainer.appendChild(balText);

                    authContainer.appendChild(balanceContainer);
                }

            } catch (err) {
                console.error("❌ Error posting tokens to backend:", err);
            }
        });
    }

    // 🔹 Step 8:

    //Handle Signup button
    //if (signupButton) {
      //  signupButton.addEventListener("click", () => {
        //    const derivSignupUrl =
          //    "https://oauth.deriv.com/oauth2/authorize?app_id=61801&l=EN&signup_device=desktop&redirect_uri=https://kkmaina.onrender.com/&signup=1";

            //console.log("🔗 Redirecting to Deriv signup page...");
            //window.location.href = derivSignupUrl; //"https://deriv.com/signup/";
        //});
    //}

    signupButton.onclick = () => {
        window.location.href =
            "https://track.deriv.com/_7BQgC3i6pG4pl7dR3lTXiGNd7ZgqdRLk/1/?redirect_url=" +
            encodeURIComponent(
                "https://oauth.deriv.com/oauth2/authorize?app_id=61801&l=EN&signup_device=desktop&redirect_uri=https://kkmaina.onrender.com/&signup=1"
            );
    };
}

// ===========================
// 🔹 Auto-run on page load
// ===========================
document.addEventListener("DOMContentLoaded", onloadLogin);

//ws.onmessage = function (event) {
function handleWSMessage(response) {
    //const response = JSON.parse(event.data);
    //console.log("Raw WebSocket Data:", response);  // ✅ SEE WHAT IS ACTUALLY COMING

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
        //console.log("🔐 Current account type received:", accountType);
    }

    // ✅ Handle account type event
    if (response.event === "reset_client") {
        //console.warn("Backend requested reset:", response.reason);

        // Only reset the client ID (not the bots/configs)
        localStorage.removeItem("client_id");

        // Optionally, force reconnect
        location.reload();
    }
/*
    // 🔹 Handle auth failure (no tokens, expired tokens, etc.)
    if (response.event === "auth_failed") {
        console.warn("⚠️ Auth failed:", response.message);

        // Mark user as logged out
        localStorage.setItem("isLoggedIn", "false");

        // Call your onloadLogin() function
        if (typeof onloadLogin === "function") {
            onloadLogin();
        }
    }
*/
    // 🔴 Backend says reset login
    if (response.event === "reset_login") {
        //console.warn("⚠️ Reset login:", response.message);
        localStorage.setItem("isLoggedIn", "false");
        if (typeof onloadLogin === "function") onloadLogin();
    }

    // 🟢 Backend says restore login
    if (response.event === "set_login_true") {
        //console.log("✅ Restoring login:", response.message);
        localStorage.setItem("isLoggedIn", "true");
        if (typeof onloadLogin === "function") onloadLogin();
    }
    //if (response.event === "statement") {
      //  console.log("📒✅💰📒✅💰📒✅💰📒✅💰 Statement:", response);
    //}

    if (response.event === "profit_table") {
        //console.log("💰📒✅💰📒✅💰📒✅💰 Profit Table:", response);

        const profitTable = response.data?.profit_table || null;

        if (profitTable) {
            // Save the entire profit_table object (count + transactions)
            localStorage.setItem("p_transactions", JSON.stringify(profitTable));
            //console.log("✅ Saved full profit_table to localStorage jik", profitTable);
            updateBpdFromTransactions();
        } else {
            console.log("⚠️ No profit_table found in response jik");
        }
    }

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

        //console.log("📊 Dispatched Full Candle History (candles):", formatted);
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

        //console.log("📊 Dispatched Full Candle History (ticks):", formatted);
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
        //console.log("🔥 Dispatched Live Candle Update:", liveCandle);
    }

    // ✅ Handle all_balances
    if (response.event === "all_balances") {
        window.WS_DATA.all_balances = responseData;  // ✅ Overwrites or updates
        window.dispatchEvent(new CustomEvent("allBalancesUpdated", { detail: responseData }));
        //console.log("📦 All Balances Received:", responseData);
    }

    if (response.event === "balance" || response.event === "all_balances") {
    //if (response.event === "all_balances") {
        window.WS_DATA.all_balances = responseData;  // ✅ Overwrites or updates
        //console.log("📦 All Balances Received: cindyjay", responseData);

        // 🧠 Step 1: Get current account type from localStorage (or default to 'real')
        let accountType = localStorage.getItem("selected_account") || "real";
        //console.log("🧩 Current account type (from localStorage):", accountType);

        // 🧠 Step 2: Retrieve the corresponding login ID based on account type
        let storedLoginId = null;

        if (accountType === "real") {
            storedLoginId = localStorage.getItem("real_login");
        } else if (accountType === "demo") {
            storedLoginId = localStorage.getItem("demo_login");
        }

        // 🧠 Step 3: Log it for debugging
        //if (storedLoginId) {
          //  console.log(`👤 Using stored ${accountType} login ID →`, storedLoginId);
        //} else {
          //  console.warn(`⚠️ No stored login ID found for ${accountType} account`);
        //}

        let loginid = window.WS_DATA?.currentAccount?.loginid;
        //console.log("👤 Current login ID:", loginid);

        if (!loginid) {
            //console.warn("⚠️ window.WS_DATA.currentAccount.loginid is undefined, using stored one instead");
            loginid = storedLoginId;
        }

        //console.log("👤 Final active login ID:", loginid);

        // Get full all_balances dictionary
        //const allBalances = window.WS_DATA?.all_balances;

        // Make sure responseData.balance exists
        //const allBalanceData = responseData.balance;

        // Get full all_balances dictionary
        const allBalances = window.WS_DATA?.all_balances;
        //console.log("📦 Full allBalances from WS_DATA:", allBalances);

        // Make sure responseData.balance exists
        const allBalanceData = responseData.balance;
        //console.log("💠 Raw balance data from responseData:", allBalanceData);

        let accountData = null;

        //const allBalanceData = responseData.balance; // ✅ this is correct

        if (allBalanceData && allBalanceData.loginid === loginid) {
            accountData = allBalanceData;
        } else if (allBalanceData) {
            //console.warn(`⚠️ loginid mismatch, using available balance as fallback.`);
            accountData = allBalanceData; // fallback to the single balance object
        }

        if (!accountData) {
            console.error("❌ Unable to extract accountData, skipping balance update.");
            //return;
        }

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

        //const accountData = allBalances[loginid];

        // ✅ Extract directly from the responseData
        //const accountData = responseData?.[loginid];
        //console.log("🔍 Extracted accountData for", loginid, "→", accountData);
        //console.log("📊 accountData full object:", accountData);

        //const actualBalance = accountData.balance;
        //const currency = accountData.currency;
        //const reqId = accountData.req_id;

        const actualBalance = accountData.balance.balance;  // note the double .balance
        const currency = accountData.balance.currency;      // inside the nested balance object
        const reqId = accountData.req_id;                   // top-level property

        //console.log("💰 Extracted values →", {
          //  actualBalance,
            //currency,
            //reqId,
        //});

        localStorage.setItem("acct-bal", actualBalance);
        localStorage.setItem("curr-currency", currency);

        //console.log("💾 Saved to localStorage → acct-bal:", actualBalance, "| curr-currency:", currency);

        const balanceContainer = document.getElementById("acc_balance_but");
        //console.log("✅ Balance UI kinda✅✅✅✅✅✅✅✅✅✅");

        if (balanceContainer && typeof actualBalance === "number" && currency) {

            //console.log("🎯 Ready to update balance UI with:", {
              //  actualBalance,
                //currency,
                //containerFound: !!balanceContainer,
            //});
            // ✅ Update the UI
            updateBalanceUI(actualBalance, currency);

            //console.log("✅ Balance UI update function executed successfully!");

            // ✅ Update cache
            localStorage.setItem(
                "cached_balance",
                JSON.stringify({ amount: actualBalance, currency })
            );
            window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: actualBalance }));
        }
    }
/*
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
*/
    if (response.event === "balance") {
        window.WS_DATA.balance = responseData.balance;
        window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: responseData.balance }));
        //console.log("📩 balance balancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalancebalance Update Received:", responseData);

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
        //window.dispatchEvent(new CustomEvent("contractDataUpdated", { detail: response }));
        //sessionStorage.setItem("contractData", JSON.stringify(response));
        //localStorage.setItem("contractData", JSON.stringify(response)); // ✅ changed to localStorage
        //console.log("📩 Contract for Update Received:", response);

        // ✅ Check qson flag
        const isQSon = localStorage.getItem("qson") === "true";

        // ---- Extra logic for initqscon / subqscon ----
        const currentSymbol = localStorage.getItem("qssymbol") || "1HZ10V";

        if (!isQSon) {
            // Only dispatch event if Quick Strategy is OFF
            window.dispatchEvent(new CustomEvent("contractDataUpdated", { detail: response }));
            localStorage.setItem("contractData", JSON.stringify(response)); // ✅ changed to localStorage
            //console.log("📩 Contract for Update Received + dispatched:", response);

            if (currentSymbol === "1HZ10V") {
                localStorage.setItem("initqscon", JSON.stringify(response));
                //console.log("💾 initqscon updated (default symbol 1HZ10V):", response);
            } else {
                localStorage.setItem("subqscon", JSON.stringify(response));
                //console.log("💾 subqscon updated (symbol:", currentSymbol, "):", response);
            }
        } else {
            //console.log("📩 Contract for Update Received but NOT dispatched (Quick Strategy ON)");

            if (currentSymbol === "1HZ10V") {
                localStorage.setItem("initqscon", JSON.stringify(response));
                //console.log("💾 initqscon updated (default symbol 1HZ10V):", response);

                // ✅ Refresh CT div with new contracts
                const ctDiv = document.getElementById("ct");
                if (ctDiv) {
                    popctdiv(ctDiv);
                }
            } else {
                localStorage.setItem("subqscon", JSON.stringify(response));
                //console.log("💾 subqscon updated (symbol:", currentSymbol, "):", response);

                // ✅ Refresh CT div with new contracts
                const ctDiv = document.getElementById("ct");
                if (ctDiv) {
                    popctdiv(ctDiv);
                }
            }
        }

    } else if ("quote" in response) {
        //console.log("📈 Tick Data:", response);
        window.WS_DATA.tickData = response;
        window.dispatchEvent(new CustomEvent("tickDataUpdated", { detail: response }));
    }
    else if (response.event === "buy_response") {
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
            //console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀", response.message); // or do anything else here (like show a toast, spinner, etc.)
                // ✅ Send custom event to frontend listeners (like in botbuilder.js)

            window.dispatchEvent(new CustomEvent("botStarted", {
                detail: response.message  // Or response if you want to send more data
            }));
        } else {
            //alert("❌ Failed to start the bot: " + response.error);
        }
    } else if (response.event === "b_proposal_update") {
        window.WS_DATA.proposalUpdate = response.data;
        //console.log("📩💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰 Received b_proposal_update:", response.data);

        window.dispatchEvent(new CustomEvent("proposalUpdateReceived", {
            detail: response.data
        }));
    } else {
        console.log("🔄 Other Data:");
        //console.log("🔄 Other Data:", responseData);
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

    const msg = JSON.stringify(data);

    //console.log("🟡 Attempting to send message:", msg);

    if (ws.readyState === WebSocket.OPEN) {
        //console.log("🟢 WebSocket OPEN → sending now...");
        ws.send(msg);
        //console.log("✅ Message sent successfully:", msg);
    } else {
        console.log("🔴 WebSocket is NOT open. ReadyState =", ws.readyState);
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

window.addEventListener("buyResponseUpdated", function (event) {
    //console.log("🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒🛒 Updated Buy Response:", event.detail);
    // You can trigger any function here based on new buy data

    // 🔥 Call the Byr() function immediately
    Byr(event.detail);
});

window.addEventListener("openContractUpdated", function (event) {
    //console.log("📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑v Updated Open Contract:", event.detail);
    // Do something useful here too

    // 🔥 Call the Opc function
    Opc(event.detail);
});

window.addEventListener("botStarted", function (event) {
    //console.log("🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖 Bot status message received:", event.detail);
    // Do whatever you want now (e.g. show spinner, activate strategy blocks, etc.)

    // 🔥 Call your function
    Bis();


    // ✅ Step 1: Check if we already have a start_date
    let startDate = localStorage.getItem("start_date");

    if (!startDate) {
        // No start date stored yet → set it now
        startDate = Math.floor(Date.now() / 1000); // epoch in seconds
        localStorage.setItem("start_date", startDate);
        //console.log("📌 New start_date set in localStorage:", startDate);
    } else {
        console.log("📌 Using existing start_date from localStorage:", startDate);
    }

    // ✅ Step 2: Send to backend
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            event: "set_start_date",
            start_date: parseInt(startDate, 10)
        }));
        //console.log("📤 Sent start_date to backend:", startDate);
    } else {
        console.error("WebSocket is not open");
    }
});

window.addEventListener("balanceUpdated", function (event) {
    //console.log("💰 Updated Balance:", event.detail);

    const balance = window.WS_DATA?.balance;

    if (balance) {
        //console.log("💼 Current Stored Balance:", balance);

        if (balance > 1000) {
            console.log("🟢 Balance is above $1,000 ✅");
        } else {
            console.log("🟡 Balance is below $1,000 ⚠️");
        }
    } else {
        console.log("⏳ Waiting for balance data...");
    }
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

function Bis() {
    const statusDiv = document.querySelector(".status-text");

    if (statusDiv) {
        // Update status text
        statusDiv.textContent = "Bot is starting";
        //console.log("✅ Updated status text to: Bot is starting");

        // Animate dots
        const dots = document.querySelectorAll(".dot");
        dots.forEach(dot => dot.classList.remove("animate"));
        void document.body.offsetWidth;
        dots.forEach(dot => dot.classList.add("animate"));
        setTimeout(() => {
            dots.forEach(dot => dot.classList.remove("animate"));
        }, 1600);

        // Update Run button to Stop
        const runButton = document.getElementById("runButton");
        if (runButton) {
            const icon = runButton.querySelector(".run-icon");
            const text = runButton.querySelector(".run-text");

            const stopIcon = runButton.getAttribute("data-stop-icon");

            if (icon && stopIcon) {
                icon.src = stopIcon; // ✅ Set the correct stop icon from HTML
            }

            if (text) {
                text.textContent = "Stop";
            }

            // ✅ Make the button background red with RGBA (strong red)
            runButton.style.backgroundColor = "rgba(255, 0, 0, 0.85)";

            //console.log("✅ Changed Run button to Stop and turned it red");

        } else {
            console.warn("⚠️ #runButton not found");
        }
    } else {
        console.warn("⚠️ .status-text not found");
    }
}

function Byr(buyr) {
    const statusDiv = document.querySelector(".status-text");
    const progressBar = document.querySelector("#progress-bar");

    if (!statusDiv) {
        console.warn("⚠️ .status-text element not found!");
        return;
    }

    statusDiv.textContent = "Buying contract";
    //console.log("🛒 Updated status text to: Buying contract...");

    const centerDot = document.querySelector(".center-dot");
    const rightDot = document.querySelector(".right-dot");

    const pulseDot = (dot, colorClass) => {
        if (dot) {
            dot.classList.remove("red", "green");
            void dot.offsetWidth;
            dot.classList.add(colorClass);

            setTimeout(() => {
                dot.classList.remove(colorClass);
            }, 900);
        }
    };

    pulseDot(centerDot, "green");
    pulseDot(rightDot, "red");

    if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";

        setTimeout(() => {
            progressBar.style.transition = "width 0.2s linear";
        }, 50);
    }

    const jnc = document.querySelector(".jonco");
    if (jnc) {
        jnc.style.display = "flex";
        jnc.style.flexDirection = "column";
        jnc.style.alignItems = "stretch";
        jnc.style.width = "100%";
        jnc.style.boxSizing = "border-box";
    }

    const boxContainer = document.querySelector(".box-container");
    if (boxContainer) {
        boxContainer.style.display = "flex";
        boxContainer.style.flexDirection = "column";
        boxContainer.style.alignItems = "stretch";
        boxContainer.style.width = "100%";
        boxContainer.style.height = "100%";
        boxContainer.style.boxSizing = "border-box";
    }
    if (!boxContainer) {
        console.error("❌ .boxContainer element not found!");
        return;
    }

    //console.log("✅ Contract bought! Proceeding to update .boxContainer UI...");

    // clear placeholder inside .boxContainer (only once)
    if (!boxContainer.dataset.initialized) {
        const hSC = boxContainer.querySelector("img") || boxContainer.querySelector(".no-messages");
        if (hSC) {
            boxContainer.innerHTML = "";
            //console.log("🧹 Cleared static boxContainer content (first time only)");
        }
        boxContainer.dataset.initialized = "true";
    }

    const jolDiv = document.createElement("div");
    jolDiv.className = "jol";
    Object.assign(jolDiv.style, {
        position: "relative",
        width: "100%",
        backgroundColor: "white",
        textAlign: "left",
        borderRadius: "1px",
        paddingLeft: "2vh",
        paddingRight: "2vh",
        boxSizing: "border-box",
    });

    function parseShortcode(shortcode) {
        if (!shortcode || typeof shortcode !== "string") {
            console.warn("⚠️ Invalid shortcode input:", shortcode);
            return { contract_type: null, display_name: null };
        }

        const parts = shortcode.split("_");
        if (parts.length < 2) {
            console.warn("⚠️ Shortcode format unexpected:", shortcode);
            return { contract_type: null, display_name: null };
        }

        const contract_type = parts[0];
        let display_name;

        // ✅ Handle special cases: OTC_* and R_*
        if (parts[1] === "OTC" || parts[1] === "R") {
            display_name = parts[1] + "_" + parts[2];
        } else {
            display_name = parts[1];
        }

        return { contract_type, display_name };
    }

    // Extract data safely
    const cid = buyr?.buy?.contract_id || "(No contract_id)";
    const p_t = buyr?.buy?.purchase_time;
    const longCode = buyr?.buy?.longcode || "(No code)";
    const shortcode = buyr?.buy?.shortcode || "(No code)";
    const bpr = buyr?.buy?.buy_price;

    const { contract_type, display_name } = parseShortcode(shortcode);

    //console.log("Contract Type:", contract_type);
    //console.log("Display Name:", display_name);

    // Convert purchase_time to human-readable UTC string
    let formattedTime = "(No purchase_time)";
    if (p_t) {
        const date = new Date(p_t * 1000);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");
        formattedTime = `${year}-${month}-${day} | ${hours}:${minutes}:${seconds} GMT`;
    }

    jolDiv.innerHTML = `
        <div style="margin-bottom: 10px; margin-top: 10px;">
            <span style="color: rgba(0, 0, 255, 0.7); font-size: 12px;">Bought:</span>
            <span style="color: rgba(0, 0, 0, 0.7); font-size: 12px;">${longCode} (ID: ${cid})</span>
        </div>
        <div style="font-size: 11px; color: rgba(128, 128, 128, 0.6); margin-bottom: 10px;">${formattedTime}</div>
    `;

    if (boxContainer.firstChild) {
        boxContainer.insertBefore(jolDiv, boxContainer.firstChild);
    } else {
        boxContainer.appendChild(jolDiv);
    }

    const amount = bpr; //parseFloat(window?.WS_DATA?.proposalUpdate?.echo_req?.amount) || 0;
    const currency = window?.WS_DATA?.proposalUpdate?.echo_req?.currency;
    const currenc = "USD";

    const boxDiv = document.querySelector(".box");
    if (!boxDiv) {
        console.error("❌ .box element not found!");
        return;
    }

    Object.assign(boxDiv.style, {
        paddingTop: "0vw",
        maxHeight: "300px",   // ✅ make scrollable
        overflowY: "auto",    // ✅ enable vertical scroll
    });

    //console.log("✅ Contract bought! Proceeding to update .box UI...");

    // clear placeholder only once
    if (!boxDiv.dataset.initialized) {
        const hasStaticContent = boxDiv.querySelector("img") || boxDiv.querySelector(".box-title");
        if (hasStaticContent) {
            boxDiv.innerHTML = "";
            //console.log("🧹 Cleared static box content (first time only)");
        }
        boxDiv.dataset.initialized = "true";
    }

    const container = document.createElement("div");
    container.classList.add("hover-gray");
    Object.assign(container.style, {
        position: "relative",
        width: "100%",
        marginTop: "0px",
        marginBottom: "1.5px",
        backgroundColor: "white",
        paddingTop: "10px",
        paddingBottom: "10px",
        borderTop: "1px solid rgba(200, 200, 200, 0.4)",
    });

    // ✅ Map display_name / contract_type → icon file in /static/icons/
    const iconMap = {
        "1HZ10V": "/static/icons/ic-10-1s-index.svg",
        "GBP/USD": "/static/icons/ic-10-index-v-usage.svg",
        "BTC/USD": "/static/icons/btc.svg",
        "CALL": "/static/icons/higher.svg",
        "PUT": "/static/icons/lower.svg",
    };

    container.innerHTML = `
        <div class="transaction-row" style="display: flex; width: 100%; justify-content: space-between;">

            <!-- Column 1: Type (display_name + contract_type icons) -->
            <div class="type-col" style="flex: 1; display: flex; justify-content: flex-start; align-items: center; gap: 1vw; padding-left: 2vw;">
                <img src="/static/icons/${display_name}.svg"
                     onerror="this.src='/static/icons/default.svg';"
                     style="width: clamp(18px, 2.5vh, 28px); height: clamp(18px, 2.5vh, 28px);">
                <img src="/static/icons/${contract_type}.svg"
                     onerror="this.src='/static/icons/default_type.svg';"
                     style="width: clamp(18px, 2.5vh, 28px); height: clamp(18px, 2.5vh, 28px);">
            </div>

            <!-- Column 2: Entry/Exit spot -->
            <div class="spot-col" style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding-left: 1vw;">
                <div style="display: flex; align-items: center; gap: 0.3vw; font-size: 10px; color: rgba(0,0,0,0.7);">
                    <img src="/static/icons/red_circle.svg" style="width: 8px; height: 8px;">
                    <div class="entry-spot"
                         style="width: clamp(40px, 6vh, 70px); height: clamp(14px, 2vh, 20px); background: lightgray; border-radius: 2px; font-size: 10px; display: flex; align-items: center; justify-content: center;">
                         <!-- entry spot value goes here -->
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.3vw; font-size: 10px; color: rgba(0,0,0,0.7);">
                    <img src="/static/icons/grey_circle.svg" style="width: 8px; height: 8px;">
                    <div class="exit-spot"
                         style="width: clamp(40px, 6vh, 70px); height: clamp(14px, 2vh, 20px); background: lightgray; border-radius: 2px; font-size: 10px; display: flex; align-items: center; justify-content: center;">
                         <!-- exit spot value goes here -->
                    </div>
                </div>
            </div>

            <!-- Column 3: Buy price + Profit -->
            <div class="amount-col" style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding-left: 1vw;">
                <div class="amount" style="color: rgba(0,0,0,0.7); font-weight: 750; font-size: 10px;">
                    ${amount.toFixed(2)} ${currenc}
                </div>
                <div class="profit"
                     style="width: 80%; height: clamp(6px, 1vh, 10px); background: lightgray; border-radius: 2px;"></div>
            </div>

        </div>
    `;

    // Insert new contract at the top
    if (boxDiv.firstChild) {
        boxDiv.insertBefore(container, boxDiv.firstChild);
    } else {
        boxDiv.appendChild(container);
    }

    boxDiv.scrollTop = 0;
}

let countdownInterval = null;
let lastCountdownValue = null;
let totalDuration = null;

function formatTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const timeStr = [hrs, mins, secs].map(unit => String(unit).padStart(2, "0")).join(":");
    return days > 0 ? `${days}d ${timeStr}` : timeStr;
}

function blinkDots(dots, color) {
    dots.forEach(dot => {
        if (dot) {
            dot.classList.remove("red", "green");
            void dot.offsetWidth; // trigger reflow
            dot.classList.add(color);
            setTimeout(() => dot.classList.remove(color), 900);
        }
    });
}

function startCountdown(timerDiv, countdownFill) {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        if (lastCountdownValue === null || totalDuration === null) return;

        lastCountdownValue--;

        if (lastCountdownValue <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            if (timerDiv) timerDiv.textContent = "00:00:00";
            if (countdownFill) countdownFill.style.width = "0%";
            return;
        }

        if (timerDiv) timerDiv.textContent = formatTime(lastCountdownValue);
        if (countdownFill) countdownFill.style.width = `${(lastCountdownValue / totalDuration) * 100}%`;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    updateBpdFromTransactions();
});

function updateBpdFromTransactions() {
    const profitTable = JSON.parse(localStorage.getItem("p_transactions")) || null;
    if (!profitTable) {
        console.log("⚠️ No profit_table in localStorage yet");
        return;
    }

    //console.log("📒 Loaded profitTable from localStorage:", profitTable);

    const transactions = Array.isArray(profitTable.transactions) ? profitTable.transactions : [];
    if (!transactions.length) {
        console.log("ℹ️ profit_table.transactions is empty");
    }

    // ---- Metrics (use correct fields) ----
    const runs = Number(profitTable.count ?? transactions.length);

    const won  = transactions.filter(t => Number(t.sell_price || 0) > 0).length;
    const lost = transactions.filter(t => Number(t.sell_price || 0) === 0).length;

    const stake = transactions.reduce((acc, t) => acc + Number(t.buy_price || 0), 0);
    const payoutRealized = transactions.reduce((acc, t) => acc + Number(t.sell_price || 0), 0);
    const totalProfit = transactions.reduce(
        (acc, t) => acc + (Number(t.sell_price || 0) - Number(t.buy_price || 0)),
        0
    );

    //console.log(
      //  "📊 Metrics → runs:", runs,
        //"won:", won,
        //"lost:", lost,
        //"stake:", stake,
        //"payout(realized):", payoutRealized,
        //"profit:", totalProfit
    //);

    // ---- Update ALL .bpd elements ----
    document.querySelectorAll(".bpd").forEach(bpd => {
        const setHTML = (selector, html) => {
            const el = bpd.querySelector(selector);
            if (!el) {
                console.warn("⚠️ Missing element for selector:", selector);
                return;
            }
            const strongHTML = el.querySelector("strong")?.outerHTML || "";
            el.innerHTML = `${strongHTML}<br>${html}`;
        };

        setHTML(".bpd-runs", String(runs));
        setHTML(".bpd-won", String(won));
        setHTML(".bpd-lost", String(lost));
        setHTML(".bpd-stake", `${stake.toFixed(2)} USD`);
        setHTML(".bpd-payout", `${payoutRealized.toFixed(2)} USD`);

        // Profit with color like before
        const profitStr = `${totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)} USD`;
        const profitColor = totalProfit > 0
            ? "rgba(0, 128, 0, 0.7)"
            : (totalProfit < 0 ? "rgba(255, 0, 0, 0.7)" : "rgba(0,0,0,0.6)");
        setHTML(".bpd-profit", `<span style="font-weight:1000; font-size:10px; color:${profitColor}">${profitStr}</span>`);
    });

    localStorage.setItem("bpd-runs", String(runs));
}

function Opc(data) {
    const statusDiv = document.querySelector(".status-text");
    const progressBar = document.querySelector("#progress-bar");
    const centerDot = document.querySelector(".center-dot");
    const rightDot = document.querySelector(".right-dot");
    const bpDiv = document.querySelector(".bp");
    const bpd = document.querySelector(".bpd");
    const boxDiv = document.querySelector(".box"); // <--- the box you mentioned

    if (!statusDiv || !bpDiv || !bpd) return;

    const contract = data?.proposal_open_contract;
    if (!contract) return;

    const {
        is_sold,
        tick_stream = [],
        profit = 0,
        entry_spot = 0,
        exit_tick = 0,
        display_name,
        contract_type,
        expiry_time,
        purchase_time,
        current_spot_time,
        is_valid_to_sell,
        payout = 0,
        status,
        currency,
        contract_id, // ✅ Add this line
        tick_count,
    } = contract;

    const amount = parseFloat(window?.WS_DATA?.proposalUpdate?.echo_req?.amount) || 0;
    const totalPayout = amount + profit;


    if (is_sold === 1) {

        const boxContainer = document.querySelector(".box-container");

        const jnc = document.querySelector(".jonco");
        if (jnc) {
            jnc.style.display = "flex";
            jnc.style.flexDirection = "column";
            jnc.style.alignItems = "stretch";
            //jnc.style.border = "1px solid red";
            jnc.style.width = "100%"; // 👈 ensures .jonco fills its container
            jnc.style.boxSizing = "border-box";
        }

        //const boxContainer = document.querySelector(".box-container");
        if (boxContainer) {
            boxContainer.style.display = "flex";
            boxContainer.style.flexDirection = "column";
            boxContainer.style.alignItems = "stretch";
            boxContainer.style.width = "100%"; // 👈 fill its parent (.jonco)
            boxContainer.style.height = "100%"; // 👈 fill its parent (.jonco)
            //boxContainer.style.border = "1px solid blue";
            boxContainer.style.boxSizing = "border-box"; // 👈 avoids unexpected width shrink
        }
        if (!boxContainer) {
            console.error("❌ .boxContainer element not found!");
            return;
        }

        //console.log("✅ Contract bought! Proceeding to update .boxContainer UI...");

        const hSC = boxContainer.querySelector("img") || boxContainer.querySelector(".no-messages");
        if (hSC) {
            boxContainer.innerHTML = "";
            //console.log("🧹 Cleared static boxContainer content");
        }

        const plDiv = document.createElement("div");
        plDiv.className = "pl";
        Object.assign(plDiv.style, {
            position: "relative",
            width: "100%",
            //height: "5vw",
            //padding: "5px",
            //marginBottom: "5px",
            //borderBottom: "0.5px solid gray",
            borderRadius: "1px",
            backgroundColor: "rgba(128, 128, 128, 0.15)",
            textAlign: "left",
            //border: "1px solid black",
            paddingLeft: "2vh",
        });

        // Convert purchase_time to human-readable UTC string
        let formattedTime = "(No purchase_time)";
        if (expiry_time) {
            const date = new Date(expiry_time * 1000); // convert seconds to ms
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');
            formattedTime = `${year}-${month}-${day} | ${hours}:${minutes}:${seconds} GMT`;
       }

        if (contract.status === "won") {
            plDiv.innerHTML = `
                <div style="font-size: 10px; color: rgba(0, 0, 0, 0.7); margin-bottom: 12px; margin-top: 10px;">
                    Profit amount:
                    <span style="color: rgba(0, 128, 0, 0.7); font-size: 10px;">${profit.toFixed(2)}</span>
                </div>
                <div style="font-size: 10px; color: rgba(128, 128, 128, 0.85); margin-bottom: 10px;">${formattedTime}</div>
            `;
        }

        if (contract.status === "lost") {
            plDiv.innerHTML = `
                <div style="font-size: 10px; color: rgba(0, 0, 0, 0.7); margin-bottom: 10px; margin-top: 10px;">
                    Loss amount:
                    <span style="color: rgba(255, 0, 0, 0.7); font-size: 10px;">${profit.toFixed(2)}</span>
                </div>
                <div style="font-size: 10px; color: rgba(128, 128, 128, 0.85); margin-bottom: 10px;">${formattedTime}</div>
            `;
        }

        if (boxContainer.firstChild) {
            boxContainer.insertBefore(plDiv, boxContainer.firstChild);
        } else {
            boxContainer.appendChild(plDiv);
        }
    }

    if (boxDiv) {
        // === ENTRY SPOT ===
        const entrySpotDiv = boxDiv.querySelector(".entry-spot");
        if (entrySpotDiv && contract.entry_spot !== undefined) {
            entrySpotDiv.style.background = "none"; // Remove gray background
            entrySpotDiv.textContent = parseFloat(contract.entry_spot).toFixed(2);
        }

        // === WHEN CONTRACT IS SOLD ===
        if (contract.is_sold === 1) {
            // === EXIT SPOT ===
            const exitSpotDiv = boxDiv.querySelector(".exit-spot");
            if (exitSpotDiv && contract.exit_tick !== undefined) {
                exitSpotDiv.style.background = "none"; // Remove gray background
                exitSpotDiv.textContent = parseFloat(contract.exit_tick).toFixed(2);
            }

            const profitDiv = boxDiv.querySelector(".profit");
            if (profitDiv && contract.profit !== undefined) {
                const profit = parseFloat(contract.profit);
                profitDiv.style.background = "none";
                profitDiv.style.fontSize = "10px";
                profitDiv.style.fontWeight = "750";

                if (profit < 0) {
                    profitDiv.style.color = "rgba(255, 0, 0, 0.7)";
                    profitDiv.textContent = `${profit.toFixed(2)} ${currency}`;  // Negative already has a minus sign
                } else {
                    profitDiv.style.color = "rgba(0, 128, 0, 0.8)";
                    profitDiv.textContent = `+${profit.toFixed(2)} ${currency}`; // Add + before positive values
                }
            }

        }
    }

    // ✅ Map display_name / contract_type → icon file in /static/icons/
    const iconMap = {
        "Volatility 10 (1s) Index": "/static/icons/ic-10-1s-index.svg",
        "GBP/USD": "/static/icons/ic-10-index-v-usage.svg",
        "BTC/USD": "/static/icons/btc.svg",

        "CALL": "/static/icons/higher.svg",  // up arrow
        "PUT": "/static/icons/lower.svg"     // down arrow
    };

    // 🧹 Reset bp panel
    bpDiv.innerHTML = "";
    Object.assign(bpDiv.style, {
        position: "relative",
        borderRadius: "2px",
        padding: "2vw",
        display: "block",
        height: "20.0vh",
        //width: "20vw",
        overflowY: "auto",
        //border: "5px solid black",
        overflowX: "hidden",
        marginTop: "1.5vh" // ✅ Make it sit right at the top of its container
    });
    // <div style="font-size: 3vh; margin-bottom: 5px; color: ${flagColor};">🏁</div>

    if (is_sold === 1) {
        statusDiv.textContent = "Contract closed";
        blinkDots([centerDot, rightDot], "red");

        const flagColor = profit >= 0 ? "green" : "red";
        if (progressBar) progressBar.style.width = "100%";
        const backgroundColor = profit >= 0 ? "rgba(144, 238, 144, 0.3)" : "rgba(255, 99, 71, 0.3)";
        bpDiv.style.background = `linear-gradient(to bottom, ${backgroundColor}, white)`;
        bpDiv.style.display = "flex";
        bpDiv.style.flexDirection = "column";
        bpDiv.style.justifyContent = "center"; // vertical center
        bpDiv.style.alignItems = "center";     // horizontal center
        bpDiv.style.textAlign = "center";      // center text inside

        const profitText = profit > 0 ? `+ ${profit.toFixed(2)}` : profit.toFixed(2);

        bpDiv.innerHTML += `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <div style="font-size: 2vh; color: ${flagColor};">
                    <i class="fas fa-flag-checkered"></i>
                </div>
                <div style="font-size: 12px; font-weight: 750; color: ${flagColor};">
                    Closed
                </div>
            </div>

            <div style="font-size: 15px; font-weight: 6500; color: ${flagColor}; margin-top: 5px;">
                ${profitText}
            </div>
        `;
        updateBpdFromTransactions();

        return;
    }

    statusDiv.textContent = "Contract bought";
    blinkDots([rightDot], "green");
    if (progressBar) progressBar.style.width = "52%";

    const isExactTime = purchase_time === current_spot_time;

    if (isExactTime) {
        // Full height gradient (100%) when purchase_time === current_spot_time
        bpDiv.style.background = profit < 0
            ? "linear-gradient(to bottom, rgba(255, 99, 71, 0.2), white)"
            : "linear-gradient(to bottom, rgba(144, 238, 144, 0.2), white)";

    } else {
        // Only top 20% is a fading color; rest is white
        const gradientColor = profit < 0 ? "rgba(255, 99, 71, 0.3)" : "rgba(144, 238, 144, 0.2)";
        bpDiv.style.background = `linear-gradient(to bottom,
            ${gradientColor} 0%,
            ${gradientColor} 1%,
            rgba(255, 255, 255, 1) 20%,
            white 100%)`;
    }

    // 🔹 Hold references so we don’t re-add the same icon
    let displayNameIcon = null;
    let contractTypeIcon = null;

    const addOrUpdateIcon = (key, iconPath, top, left, size = "4vh") => {
        if (!iconPath) return;

        let target;
        if (key === "display_name") {
            if (!displayNameIcon) {
                displayNameIcon = document.createElement("img");
                Object.assign(displayNameIcon.style, {
                    position: "absolute",
                    top,
                    left,
                    width: size,
                    height: size
                });
                bpDiv.appendChild(displayNameIcon);
            }
            target = displayNameIcon;
        } else if (key === "contract_type") {
            if (!contractTypeIcon) {
                contractTypeIcon = document.createElement("img");
                Object.assign(contractTypeIcon.style, {
                    position: "absolute",
                    top,
                    left,
                    width: size,
                    height: size
                });
                bpDiv.appendChild(contractTypeIcon);
            }
            target = contractTypeIcon;
        }

        // ✅ Update src only if different → prevents blink
        if (target && target.src !== window.location.origin + iconPath) {
            target.src = iconPath;
        }
    };


    const addInfo = (text, top, left, color = "black", fontSize = "1.5vh", bold = false) => {
        const div = document.createElement("div");
        div.textContent = text;
        Object.assign(div.style, {
            position: "absolute",
            top,
            left,
            fontSize,
            fontWeight: bold ? "bold" : "normal",
            color
        });
        bpDiv.appendChild(div);
    };

    const addLine = (top) => {
        const div = document.createElement("div");
        Object.assign(div.style, {
            position: "absolute",
            top,
            left: "1vh",
            width: "calc(100% - 2vh)",
            height: "1px",
            backgroundColor: "gray"
        });
        bpDiv.appendChild(div);
    };
    if (display_name) {
        const newIcon = iconMap[display_name];

        // ✅ Only update if different
        if (!displayNameIcon || displayNameIcon.dataset.iconPath !== newIcon) {
            addOrUpdateIcon("display_name", newIcon, "3vh", "1vw", "4vh");
        }

        addInfo(display_name, "4vh", "3.5vw", "rgba(0, 0, 0, 0.8)", "1.7vh", true);
        //console.log("📌 Display name:", display_name);
    }

    if (contract_type) {
        const label = contract_type === "CALL" ? "Higher"
                     : contract_type === "PUT" ? "Lower"
                     : contract_type;

        const newIcon = iconMap[contract_type];

        // ✅ Only update if different
        if (!contractTypeIcon || contractTypeIcon.dataset.iconPath !== newIcon) {
            addOrUpdateIcon("contract_type", newIcon, "3vh", "14vw", "4vh");
        }

        addInfo(label, "4vh", "16vw", "black", "1.5vh", true);
        //console.log("📌 Contract type:", contract_type);
    }

    addLine("12vh");

    const usdRect = document.createElement("div");
    usdRect.textContent = "USD";
    Object.assign(usdRect.style, {
        position: "absolute", top: "13vh", left: "2vh", width: "4.5vh", height: "2.5vh",
        backgroundColor: "green", color: "white", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: "bold", borderRadius: "3px"
    });
    bpDiv.appendChild(usdRect);

    addInfo("Total profit/loss:", "17vh", "2vh", "black", "1.5vh", true);
    addInfo(profit.toFixed(2), "19vh", "2vh", profit >= 0 ? "green" : "red", "1.5vh", true);

    addInfo("stake:", "21vh", "2vh", "black", "1.5vh");
    addInfo("Contract value:", "17vh", "20vh", "black", "1.5vh", true);
    addInfo("Potential payout:", "21vh", "20vh", "black", "1.5vh", true);
    addInfo(amount.toFixed(2), "23vh", "2vh", "black", "1.5vh", true);
    //addInfo(totalPayout.toFixed(2), "19vh", "20vh", "black", "1.5vh", true);

    let payoutText = totalPayout.toFixed(2);
    let payoutColor = "black";
    let payoutBold = false;

    if (totalPayout > 0) {
        payoutText = `+${payoutText}`;
        payoutColor = "rgba(0, 128, 0, 0.7)"; // less intense green
        payoutBold = true;
    } else if (totalPayout < 0) {
        payoutColor = "rgba(255, 0, 0, 0.7)"; // less intense red
        payoutBold = true;
    }

    addInfo(payoutText, "19vh", "20vh", payoutColor, "1.5vh", payoutBold);

    addInfo(payout.toFixed(2), "23vh", "20vh", "black", "1.5vh", true);

    addLine("25vh");

    if (is_valid_to_sell === 0) {
        addInfo("Resale not offered", "27vh", "10vh", "black", "1.5vh");
    } else {
        // Create a proper button
        const sellBox = document.createElement("button");
        sellBox.textContent = "Sell";

        // Style the button
        Object.assign(sellBox.style, {
            position: "absolute",
            top: "27vh",
            left: "1vh",
            width: "calc(100% - 2vh)",
            height: "4vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            border: "1px solid black",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer"
        });

        // Add click event to send WebSocket message
        sellBox.addEventListener("click", () => {
            const sellMessage = {
                event: "sell_contract",
                action: "SELL",
                contract_id: contract_id, // send it to backend
                timestamp: new Date().toISOString()
            };

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(sellMessage));
                //console.log("📤 Sent sell message:", sellMessage);
            } else {
                console.error("WebSocket is not open");
            }
        });

        // Add to the DOM
        bpDiv.appendChild(sellBox);
    }

    if (expiry_time && purchase_time && current_spot_time) {
        const duration = Math.max(expiry_time - purchase_time, 1);
        const remaining = Math.max(expiry_time - current_spot_time, 0);

        const timerDiv = document.createElement("div");
        timerDiv.classList.add("countdown-timer");
        Object.assign(timerDiv.style, {
            position: "absolute", top: "7vh", left: "1vh",
            fontSize: "10px", fontWeight: "bold", color: "black"
        });
        // ✅ Tick-based contract
        if (typeof tick_count !== "undefined" && tick_count <= 10) {
            timerDiv.textContent = `Tick ${tick_count}`;
            bpDiv.appendChild(timerDiv);

            // Create tick bar container
            const tickBar = document.createElement("div");
            Object.assign(tickBar.style, {
                position: "absolute",
                top: "10vh",
                left: "1vh",
                display: "flex",
                gap: "4px",
                width: "90%",          // ✅ make container 90% of bpDiv
            });

            // Create N tick boxes (grey)
            const tickBoxes = [];
            const boxWidth = `calc((100% - ${(tick_count - 1) * 4}px) / ${tick_count})`;
            // ^ divide container equally minus the gaps

            for (let i = 0; i < tick_count; i++) {
                const box = document.createElement("div");
                Object.assign(box.style, {
                    flex: `0 0 ${boxWidth}`,  // ✅ equal width
                    height: "0.5vh",            // fixed height
                    //backgroundColor: "#eee",
                    backgroundColor: "rgba(51, 51, 51, 0.5)",
                    //border: "1px solid #ccc",
                    borderRadius: "3px"
                });
                tickBar.appendChild(box);
                tickBoxes.push(box);
            }

            bpDiv.appendChild(tickBar);

            // ✅ Animate filling tick boxes one by one
            //startTickCountdown(tickBoxes);

            // wait for tick_stream updates and call updateTickBoxes
            updateTickBoxes(tickBoxes);
        } else {
            // ✅ Time-based contract (original countdown)
            timerDiv.textContent = formatTime(remaining);
            bpDiv.appendChild(timerDiv);

            const countdownBar = document.createElement("div");
            Object.assign(countdownBar.style, {
                position: "absolute", top: "10vh", left: "1vh",
                width: "calc(100% - 2vh)", height: "5px", backgroundColor: "rgba(51, 51, 51, 0.5)", //backgroundColor: "#eee",
                borderRadius: "4px", overflow: "hidden"
            });

            const fill = document.createElement("div");
            Object.assign(fill.style, {
                height: "100%", backgroundColor: "#4AB3B2", //backgroundColor: "green",
                transition: "width 1s linear",
                width: `${(remaining / duration) * 100}%`
            });

            countdownBar.appendChild(fill);
            bpDiv.appendChild(countdownBar);

            startCountdown(timerDiv, fill);
        }
    }

    // ✅ Instead of setInterval, update based on tick_stream
    function updateTickBoxes(tickBoxes) {
        // First reset all to grey
        tickBoxes.forEach(box => {
            box.style.backgroundColor = "rgba(51, 51, 51, 0.5)";
            //box.style.backgroundColor = "#eee";
        });

        // Fill only up to tick_stream.length
        for (let i = 0; i < tick_stream.length && i < tickBoxes.length; i++) {
            tickBoxes[i].style.backgroundColor= "#4AB3B2"; //backgroundColor = "green";
        }
    }

    if (tick_stream.length === 0) {
        blinkDots([centerDot, rightDot], "red");
    } else {
        blinkDots([rightDot], "green");
    }
}

document.querySelector('.reset-button').addEventListener('click', () => {
     // 1. Reset `.bp` startup message
    const bp = document.querySelector('.bp');
    if (bp) {
        bp.innerHTML = `
            <span class="bp-text">
                When you’re ready to trade, hit <strong>Run</strong>.
                You’ll be able to track your bot’s performance here.
            </span>
        `;
        bp.style.background = 'linear-gradient(to bottom, #f0f0f0, white)';
    }


    // 2. Reset `.bpd` stats (both in main and #transaction)
    const bpdItems = document.querySelectorAll('.bpd-item');
    bpdItems.forEach(item => {
        if (item.querySelector('strong')) {
            const label = item.querySelector('strong').textContent.trim();
            let resetValue = '0';
            if (label.toLowerCase().includes('stake') || label.toLowerCase().includes('payout') || label.toLowerCase().includes('profit')) {
                resetValue = '0.00 USD';
            }
            item.innerHTML = `<strong>${label}</strong><br>${resetValue}`;
        }
    });

    // 3. Reset `.box` in #transaction
    const box = document.querySelector('#transaction .box');
    if (box) {
        box.innerHTML = `
            <img src="/static/icons/box.png" alt="Box Icon" class="box-icon">
            <p class="box-title">There are no transactions to display</p>
            <p class="box-subtitle">Here are the possible reasons:</p>
            <ul class="box-reasons">
                <li>The bot is not running...</li>
                <li>The stats are cleared...</li>
            </ul>
        `;
    }

    // 4. Reset `.box-container` in #journal
    const boxContainer = document.querySelector('#journal .box-container');
    if (boxContainer) {
        boxContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 2vh;">
                <img src="/static/icons/box.png" alt="Box Icon" class="box-icon">
                <p class="no-messages"><strong>There are no messages to display</strong></p>
                <p class="reason-text">Here are the possible reasons:</p>
            </div>
            <ul class="reason-list" style="padding-left: 2.0vw; text-align: left; margin-top: 1vh;">
                <li>The bot is not running</li>
                <li>The stats are cleared</li>
                <li>All messages are filtered out</li>
            </ul>
        `;
    }
});
