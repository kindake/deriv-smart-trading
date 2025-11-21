document.addEventListener("DOMContentLoaded", () => {
    const savedCandles = localStorage.getItem("LCandleHistory");
    const savedTicks = localStorage.getItem("LCandleHist");

    window.WS_DATA = window.WS_DATA || {};

    if (savedCandles) {
        const parsedCandles = JSON.parse(savedCandles);
        window.WS_DATA.fullCandleHistory = parsedCandles;

        // Dispatch the event so charts can use it
        window.dispatchEvent(new CustomEvent("fullCandleHistory", {
            detail: parsedCandles,
        }));

        console.log("📦 Restored Candle History from localStorage.");
    }

    if (savedTicks) {
        const parsedTicks = JSON.parse(savedTicks);
        window.WS_DATA.fullCandleHist = parsedTicks;

        // Dispatch the event so charts can use it
        window.dispatchEvent(new CustomEvent("fullCandleHist", {
            detail: parsedTicks,
        }));

        console.log("📦 Restored Tick History from localStorage.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const DEFAULT_SYMBOL = "1HZ10V";
    const DEFAULT_TIMEFRAME = "tick";
    const favoriteSymbols = new Set();

    function waitForBox1AndInitialize(retryCount = 0) {
        const box1 = document.getElementById("chart-box1");

        if (!box1) {
            if (retryCount < 20) {
                setTimeout(() => waitForBox1AndInitialize(retryCount + 1), 300);
            } else {
                console.warn("⚠️ chart-box1 not found after multiple retries");
            }
            return;
        }

        if (box1.dataset.initialized) return;
        box1.dataset.initialized = "true";

        let symbol = localStorage.getItem("chart-symbol") || localStorage.getItem("symbol") || DEFAULT_SYMBOL;
        localStorage.setItem("chart-symbol", symbol);

        window.WS_DATA = window.WS_DATA || {};
        window.WS_DATA.activeSymbols = window.WS_DATA.activeSymbols || JSON.parse(localStorage.getItem("activeSymbols"));
        window.WS_DATA.assetIndex = window.WS_DATA.assetIndex || JSON.parse(localStorage.getItem("assetIndex"));
        window.WS_DATA.contractData = window.WS_DATA.contractData || JSON.parse(localStorage.getItem("contractData"));

        const matchedAsset = window.WS_DATA.assetIndex?.find(item => item.symbol === symbol);
        const displayName = matchedAsset ? matchedAsset.display_name : symbol;

        const symbolLabel = document.createElement("div");
        symbolLabel.id = "symbol-label";
        symbolLabel.textContent = displayName;
        Object.assign(symbolLabel.style, {
            fontWeight: 'bold', fontSize: '12px', position: 'absolute', top: '1.5vh', left: '3vw'
        });

        const toggleIcon = document.createElement("img");
        toggleIcon.id = 'toggleIcon';
        toggleIcon.src = '/static/icons/down.png';
        Object.assign(toggleIcon.style, {
            width: '15px', height: '15px', position: 'absolute', top: '3vh', left: '15vw', transition: 'transform 0.3s ease'
        });

        const popup = document.createElement("div");
        popup.id = "market-popup";
        Object.assign(popup.style, {
            display: 'none', position: 'absolute', top: '33vh', left: '2vw', width: '41.75vw', height: '52.5vh',
            backgroundColor: '#fff',/* border: '2px solid #aaa',*/ borderRadius: '4px', padding: '0',
            zIndex: '1000000', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        });

        const marketDiv = document.createElement("div");
        marketDiv.id = "market-div";
        Object.assign(marketDiv.style, {
            position: 'absolute', top: '0', left: '0', width: '41.75vw', height: '10vh',
            backgroundColor: '#f3f4f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '14px', fontWeight: 'bold'
        });

        const marketsText = document.createElement("div");
        marketsText.textContent = "Markets";
        marketsText.style.marginLeft = '2vw';

        const searchContainer = document.createElement("div");
        Object.assign(searchContainer.style, {
            height: '9.6vh', width: '23.75vw', backgroundColor: 'white', position: 'absolute',
            top: '0', right: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'
        });

        const searchInput = document.createElement("input");
        Object.assign(searchInput.style, {
            width: '75%', height: '50%', border: '1px solid grey', borderRadius: '4px', padding: '0 8px', fontSize: '12px'
        });
        searchInput.placeholder = "Search...";

        searchContainer.appendChild(searchInput);
        marketDiv.appendChild(marketsText);
        marketDiv.appendChild(searchContainer);

        const dermarkets = document.createElement("div");
        dermarkets.id = "dermarkets";
        Object.assign(dermarkets.style, {
            position: 'absolute', top: '10vh', left: '0', width: '18vw', height: '42.5vh',
            backgroundColor: '#f3f4f4',/* overflowY: 'auto'*/
        });

        const favouritesDiv = document.createElement("div");
        favouritesDiv.textContent = "Favourites";
        Object.assign(favouritesDiv.style, {
            height: "6vh", width: "100%", fontSize: "12px", lineHeight: "6vh", marginLeft: "1vw"
        });
        dermarkets.appendChild(favouritesDiv);

        const order = ["Derived", "Forex", "Stock Indices", "Commodities"];
        const activeSymbols = window.WS_DATA.activeSymbols || {};

        for (const key of order) {
            if (activeSymbols[key]) {
                const marketSection = document.createElement("div");
                marketSection.textContent = key;
                Object.assign(marketSection.style, {
                    height: "6vh", width: "19vw", lineHeight: "6vh", marginLeft: "1vw", fontSize: "12px", cursor: "pointer"
                });
                dermarkets.appendChild(marketSection);
            }
        }

        popup.appendChild(marketDiv);
        popup.appendChild(dermarkets);
        document.body.appendChild(popup);

        box1.addEventListener("click", () => {
            const isVisible = popup.style.display === "block";
            popup.style.display = isVisible ? "none" : "block";
            toggleIcon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
        });

        box1.appendChild(symbolLabel);
        box1.appendChild(toggleIcon);
        const symbolDiv = document.createElement("div");
        symbolDiv.id = "symbol_div";
        Object.assign(symbolDiv.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '23.75vw',
            height: '42.5vh',
            maxHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            zIndex: '999999',
            overflowY: "auto",
            overflowX: "hidden"
        });

        const favouritesHeader = document.createElement("div");

        // ✅ Apply new scrolling + height styles
        Object.assign(favouritesHeader.style, {
            minHeight: '12vh',                // 🔁 ⬅️ Make this 12vh as your new base
            maxHeight: '1000vh',
            overflowY: 'auto',                // 🔁 ⬅️ Use 'auto' instead of 'scroll'
            borderBottom: '2px solid #f3f4f4',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '1vh 0',
            scrollbarWidth: 'none',          // Firefox (OK to leave)
            msOverflowStyle: 'none'          // IE/Edge (OK to leave)
        });

        // ✅ Chrome/Safari scrollbar hiding via class
        favouritesHeader.classList.add('hide-scrollbar');

        // 🔤 Title
        const favTitle = document.createElement("div");
        favTitle.textContent = "Favourites";
        Object.assign(favTitle.style, {
            fontWeight: 'bold',
            fontSize: '14px',
            marginLeft: '2vw'
        });

        // 📭 Placeholder text
        const noFavText = document.createElement("div");
        noFavText.textContent = "There are no favourites yet.";
        Object.assign(noFavText.style, {
            fontWeight: 'normal',
            fontSize: '12px',
            marginLeft: '2vw',
            marginTop: '1vh'
        });

        favouritesHeader.appendChild(favTitle);
        favouritesHeader.appendChild(noFavText);
        symbolDiv.appendChild(favouritesHeader);

        function updateFavoritesView() {
            while (favouritesHeader.children.length > 1) {
                favouritesHeader.removeChild(favouritesHeader.lastChild);
            }

            if (favoriteSymbols.size === 0) {
                if (!favouritesHeader.contains(noFavText)) {
                    favouritesHeader.appendChild(noFavText);
                }
            } else {
                noFavText.remove();
                favoriteSymbols.forEach(symbolKey => {
                    const matched = window.WS_DATA.assetIndex?.find(item => item.symbol === symbolKey);
                    if (!matched) return;

                    const favRow = document.createElement("div");
                    Object.assign(favRow.style, {
                        display: 'flex',
                        alignItems: 'center',
                        height: '6vh',
                        width: '20vw',
                        marginLeft: '1vw',
                        cursor: 'pointer',
                        fontSize: '12px',
                        lineHeight: '6vh',
                        gap: '5vw' // ✅ Gap between icon and label
                    });

                    // ⭐ Star icon
                    const starIcon = document.createElement("img");
                    starIcon.src = '/static/icons/star (1).png';
                    Object.assign(starIcon.style, {
                        width: '15px',
                        height: '15px',
                        //marginRight: '0.5vw'
                    });

                    // 🏷️ Symbol label
                    const label = document.createElement("span");
                    label.textContent = matched.display_name;

                    // ⛏️ Build row
                    favRow.appendChild(label);
                    favRow.appendChild(starIcon);

                    // 🖱️ Click = initialize chart
                    favRow.addEventListener("click", () => {
                        const selectedSymbol = matched.symbol;
                        localStorage.setItem('selectedSymbol', selectedSymbol);
                        setCandleIntervalFromUI(DEFAULT_TIMEFRAME);
                        sendCandleRequest(selectedSymbol, DEFAULT_TIMEFRAME);
                        initChart('tv_chart_container', DEFAULT_TIMEFRAME === 'tick' ? 'line' : 'candlestick');
                        patchCanvasZIndex();
                    });

                    favouritesHeader.appendChild(favRow);
                });
            }
        }

        function renderSubmarket(section, submarkets, orderList, containerDiv) {
            const defaultTimeframe = localStorage.getItem('selectedTimeframe') || '1m';
            for (const subKey of orderList) {
                const sub = submarkets[subKey];
                if (sub && sub.symbols && Array.isArray(sub.symbols)) {
                    const header = document.createElement("div");
                    header.textContent = subKey;
                    Object.assign(header.style, { fontWeight: "bold", fontSize: "12px", marginLeft: "1vw", marginTop: "1vh" });
                    containerDiv.appendChild(header);

                    sub.symbols.forEach(sym => {
                        const wrapper = document.createElement("div");
                        Object.assign(wrapper.style, {
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            height: "6vh", width: "20vw", marginLeft: "1vw", cursor: "pointer",
                            fontSize: "12px", lineHeight: "6vh"
                        });

                        const nameDiv = document.createElement("div");
                        nameDiv.textContent = sym.display_name;
                        nameDiv.style.flex = '1';

                        const starIcon = document.createElement("img");
                        starIcon.src = '/static/icons/star.png';
                        Object.assign(starIcon.style, {
                            width: '15px', height: '15px', marginRight: '1vw', cursor: 'pointer'
                        });

                        starIcon.addEventListener("click", (e) => {
                            e.stopPropagation();
                            const isFav = favoriteSymbols.has(sym.symbol);
                            if (isFav) {
                                favoriteSymbols.delete(sym.symbol);
                                starIcon.src = '/static/icons/star.png';
                            } else {
                                favoriteSymbols.add(sym.symbol);
                                starIcon.src = '/static/icons/star (1).png';
                            }
                            updateFavoritesView();
                        });

                        wrapper.addEventListener("click", () => {
                            const selectedSymbol = sym.symbol;
                            localStorage.setItem('selectedSymbol', selectedSymbol);
                            setCandleIntervalFromUI(defaultTimeframe);
                            sendCandleRequest(selectedSymbol, defaultTimeframe);
                            initChart('tv_chart_container', defaultTimeframe === 'tick' ? 'line' : 'candlestick');
                            patchCanvasZIndex();
                        });

                        wrapper.appendChild(nameDiv);
                        wrapper.appendChild(starIcon);
                        containerDiv.appendChild(wrapper);
                    });
                }
            }
        }

        const derivedOrder = ["Commodities Basket", "Forex Basket", "Continuous Indices", "Crash/Boom Indices", "Daily Reset Indices", "Jump Indices", "Range Break Indices", "Step Indices"];
        const forexOrder = ["Minor Pairs", "Major Pairs"];

        const marketBlocks = [];
        const derived = activeSymbols["Derived"];
        if (derived?.submarkets) {
            marketBlocks.push({ label: "Derived", submarkets: derived.submarkets, order: derivedOrder });
        }

        const forex = activeSymbols["Forex"];
        if (forex?.submarkets) {
            marketBlocks.push({ label: "Forex", submarkets: forex.submarkets, order: forexOrder });
        }

        const stockIndices = activeSymbols["Stock Indices"];
        if (stockIndices?.submarkets) {
            marketBlocks.push({ label: "Stock Indices", submarkets: stockIndices.submarkets, order: Object.keys(stockIndices.submarkets) });
        }

        const commodities = activeSymbols["Commodities"];
        if (commodities?.submarkets) {
            marketBlocks.push({ label: "Commodities", submarkets: commodities.submarkets, order: Object.keys(commodities.submarkets) });
        }

        marketBlocks.forEach((market, index) => {
            const wrapper = document.createElement("div");
            if (index < marketBlocks.length - 1) {
                Object.assign(wrapper.style, { borderBottom: "2px solid grey" });
            }
            renderSubmarket(market.label, market.submarkets, market.order, wrapper);
            symbolDiv.appendChild(wrapper);
        });

        popup.appendChild(symbolDiv);

        let timeframe = localStorage.getItem("chart_timeframe") || DEFAULT_TIMEFRAME;
        localStorage.setItem("chart_timeframe", timeframe);

        setCandleIntervalFromUI(timeframe);
        sendCandleRequest(symbol, timeframe);
        initChart('tv_chart_container', timeframe === 'tick' ? 'line' : 'candlestick');
        patchCanvasZIndex();
    }

    waitForBox1AndInitialize();
});

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

function loadInlineChart(containerId = 'chart-page-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // Optional header
    const header = document.createElement('h2');
    header.textContent = 'Chart Viewer';
    header.style.marginBottom = '1vh';
    //container.appendChild(header);

    // Timeframe buttons
    const buttonBar = document.createElement('div');
    Object.assign(buttonBar.style, {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5vw',
        marginBottom: '1vh',
        overflowX: 'auto',
        zIndex: '2000'
    });

    const timeframes = ['tick', '1m', '2m', '5m', '10m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d'];
    timeframes.forEach(frame => {
        const btn = document.createElement('button');
        btn.textContent = frame;
        Object.assign(btn.style, {
            padding: '4px 8px',
            border: '1px solid gray',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
            fontSize: '9px',
        });

        btn.onclick = () => {
            // 🆕 Define variables
            const chart_symbol = '1HZ10V';
            const chart_timeframe = frame;

            // 🧠 Store in localStorage
            localStorage.setItem('chart_symbol', chart_symbol);
            localStorage.setItem('chart_timeframe', chart_timeframe);

            // 🧭 Use the variables
            setCandleIntervalFromUI(chart_timeframe);
            sendCandleRequest(chart_symbol, chart_timeframe);
            initChart('tv_chart_container', chart_timeframe === 'tick' ? 'line' : 'candlestick');
            patchCanvasZIndex();  // 🔴 PATCH RIGHT AFTER INIT
        };
        buttonBar.appendChild(btn);
    });

    //container.appendChild(buttonBar);

    const chartDiv = document.createElement('div');
    chartDiv.id = 'tv_chart_container';

    Object.assign(chartDiv.style, {
        position: 'relative',
        width: '100%',
        height: '100%',
        margin: '0',
        padding: '0',
        //border: '2px solid rgba(150, 150, 150, 0.3)',
        //borderRadius: '4px',
        boxSizing: 'border-box'
    });

    Object.assign(container.style, {
        width: '100%',
        height: '78.5vh',
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
        borderLeft: '2.4vh solid #e5e5e5',
        borderRight: '2.4vh solid #e5e5e5',
        borderBottom: '2.4vh solid #e5e5e5'
    });

    container.appendChild(chartDiv);

    const box1 = document.createElement('div');
    box1.id = 'chart-box1'; // ⬅️ KEY
    Object.assign(box1.style, {
        position: 'absolute',
        top: '2vh',
        left: '1vw',
        width: '21vw',
        height: '12vh',
        border: '7.5px solid #e5e5e5',
        backgroundColor: 'white',       // ✅ White background
        borderRadius: '5px',            // ✅ Rounded corners
        boxSizing: 'border-box',
        zIndex: '999999'
    });
    chartDiv.appendChild(box1);

    // Existing box2 setup (container for icons)
    const box2 = document.createElement('div');
    box2.id = 'chart-box2';
    Object.assign(box2.style, {
        position: 'absolute',
        top: 'calc(2vh + 12vh + 3vh)',
        left: '1vw',
        width: '4.5vw',
        height: '35vh',
        border: '7.5px solid #e5e5e5',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxSizing: 'border-box',
        zIndex: '999999',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5vh 0'
    });

    const iconData = [
        { src: 'area.svg', label: 'Chart types' },
        { src: 'ic-indicators.svg', label: 'Indicators' },
        { src: 'template.svg', label: 'Templates' },
        { src: 'pencil.svg', label: 'Drawing tools' },
        { src: 'download.svg', label: 'Download' }
    ];

    iconData.forEach(({ src, label }) => {
        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
            height: '7vh',
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer'
        });

        const img = document.createElement('img');
        img.src = `/static/icons/${src}`;
        img.alt = label;
        Object.assign(img.style, {
            height: '5vh',
            width: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none'
        });

        const tooltip = document.createElement('div');
        tooltip.textContent = label;

        const arrow = document.createElement('span');
        Object.assign(arrow.style, {
            position: 'absolute',
            left: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '0',
            height: '0',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '6px solid #e5e5e5'
        });
        tooltip.appendChild(arrow);

        Object.assign(tooltip.style, {
            position: 'absolute',
            left: '115%',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#e5e5e5',
            color: '#000',
            border: '1px solid #ccc',
            padding: '4px 8px',
            fontSize: '10px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: '9999999',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'none',
            pointerEvents: 'none'
        });

        wrapper.addEventListener('mouseenter', () => {
            wrapper.style.backgroundColor = '#e5e5e5';
            tooltip.style.display = 'block';
        });
        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.backgroundColor = 'white';
            tooltip.style.display = 'none';
        });

        wrapper.addEventListener('click', () => {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: '1000000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            });

            const modal = document.createElement('div');

            let modalWidth = '20vw';
            let modalHeight = '50vh';

            if (label === 'Chart types') {
                modalWidth = '31vw';
                modalHeight = '72vh';
            } else if (label === 'Indicators') {
                modalWidth = '44vw';
                modalHeight = '73vh';
            } else if (label === 'Templates') {
                modalWidth = '24vw';
                modalHeight = '59vh';
            } else if (label === 'Drawing tools') {
                modalWidth = '44vw';
                modalHeight = '72vh';
            } else if (label === 'Download') {
                modalWidth = '23vw';
                modalHeight = '31vh';
            }

            Object.assign(modal.style, {
                width: modalWidth,
                height: modalHeight,
                backgroundColor: 'white',
                borderRadius: '6px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            });


            const header = document.createElement('div');
            Object.assign(header.style, {
                height: '10vh',
                width: '100%',
                fontWeight: 'bold',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                position: 'relative',
                padding: '0 2vw'
            });

            const title = document.createElement('span');
            title.textContent = label;

            const closeBtn = document.createElement('div');
            closeBtn.innerText = '✕';
            Object.assign(closeBtn.style, {
                fontSize: '2.5vh',
                color: '#666',
                cursor: 'pointer',
                marginLeft: 'auto',
                marginRight: '4vw',
                lineHeight: '1'
            });

            closeBtn.addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });

            header.appendChild(title);
            header.appendChild(closeBtn);
            modal.appendChild(header);

            if (label === 'Chart types') {
                const selectedChartType = localStorage.getItem('selectedChartType'); // ✅ Add here
                const chartOptions = [
                    { icon: 'area.svg', name: 'Area' },
                    { icon: 'candle.svg', name: 'Candlestick' },
                    { icon: 'hollow.svg', name: 'Hollow' },
                    { icon: 'OHLC.svg', name: 'OHLC' }
                ];

                const optionsRow = document.createElement('div');
                Object.assign(optionsRow.style, {
                    display: 'flex',
                    height: '20vh',
                    borderBottom: '3px solid #e5e5e5',
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                });

                chartOptions.forEach(({ icon, name }) => {
                    const optionWrapper = document.createElement('div');
                    let isSelected = false;

                    Object.assign(optionWrapper.style, {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: '1vh',
                        borderRadius: '5px',
                        transition: 'background-color 0.2s ease'
                    });

                    const optionImg = document.createElement('img');
                    optionImg.src = `/static/icons/${icon}`;
                    Object.assign(optionImg.style, {
                        height: '6vh',
                        objectFit: 'contain'
                    });

                    const labelText = document.createElement('div');
                    labelText.textContent = name;
                    labelText.style.fontSize = '10px';

                    optionWrapper.appendChild(optionImg);
                    optionWrapper.appendChild(labelText);

                    // Hover logic: only if not selected
                    optionWrapper.addEventListener('mouseenter', () => {
                        if (!isSelected) {
                            optionWrapper.style.backgroundColor = '#e5e5e5';
                        }
                    });

                    optionWrapper.addEventListener('mouseleave', () => {
                        if (!isSelected) {
                            optionWrapper.style.backgroundColor = 'white';
                        }
                    });

                    optionWrapper.addEventListener('click', () => {
                        localStorage.setItem('selectedChartType', name);
                        console.log(name);

                        // Reset all options before selecting new one
                        optionsRow.querySelectorAll('div').forEach(div => {
                            div.style.border = 'none';
                            div.style.backgroundColor = 'white';
                            const label = div.querySelector('div');
                            if (label) label.style.fontWeight = 'normal';
                            div.dataset.selected = 'false';
                        });

                        optionWrapper.style.border = '1px solid gray';
                        optionWrapper.style.backgroundColor = 'white';
                        labelText.style.fontWeight = 'bold';
                        isSelected = true;
                        optionWrapper.dataset.selected = 'true';
                    });

                    optionsRow.appendChild(optionWrapper);
                });

                modal.appendChild(optionsRow);

                const timeframesDiv = document.createElement('div');
                timeframesDiv.textContent = 'Timeframes';
                Object.assign(timeframesDiv.style, {
                    fontWeight: 'bold',
                    color: '#000',
                    padding: '1vh 2vw'
                });
                modal.appendChild(timeframesDiv);

                const tfGrid = document.createElement('div');
                Object.assign(tfGrid.style, {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '5px',
                    padding: '0 2vw 2vh'
                });

                const selectedTimeframe = localStorage.getItem('selectedTimeframe'); // ✅ Add here

                const timeframes = ['tick', '1m', '2m', '5m', '10m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d'];
                timeframes.forEach(frame => {
                    const btn = document.createElement('button');
                    btn.textContent = frame;

                    Object.assign(btn.style, {
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '9px',
                        transition: 'background-color 0.2s ease'
                    });

                    btn.addEventListener('mouseenter', () => {
                        if (btn.style.border !== '1px solid gray') {
                            btn.style.backgroundColor = '#e5e5e5';
                        }
                    });

                    btn.addEventListener('mouseleave', () => {
                        if (btn.style.border !== '1px solid gray') {
                            btn.style.backgroundColor = 'white';
                        }
                    });

                    btn.addEventListener('click', () => {
                        const chart_symbol = '1HZ10V';         // 🔒 Set your default or dynamic symbol here
                        const chart_timeframe = frame;         // ⏱ This is from the loop

                        // 🧠 Save to localStorage
                        localStorage.setItem('chart_symbol', chart_symbol);
                        localStorage.setItem('chart_timeframe', chart_timeframe);

                        // Optionally still save under 'selectedTimeframe' for compatibility
                        localStorage.setItem('selectedTimeframe', chart_timeframe);

                        console.log(`${chart_timeframe} clicked`);

                        // 🔁 Update UI buttons
                        tfGrid.querySelectorAll('button').forEach(b => {
                            b.style.border = 'none';
                            b.style.backgroundColor = 'white';
                        });
                        btn.style.border = '1px solid gray';
                        btn.style.backgroundColor = 'white';

                        // 🚀 Trigger chart update
                        setCandleIntervalFromUI(chart_timeframe);
                        sendCandleRequest(chart_symbol, chart_timeframe);
                        initChart('tv_chart_container', chart_timeframe === 'tick' ? 'line' : 'candlestick');
                        patchCanvasZIndex(); // 🔴 PATCH RIGHT AFTER INIT
                    });
                    tfGrid.appendChild(btn);
                });

                modal.appendChild(tfGrid);
            }

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        });

        wrapper.appendChild(img);
        wrapper.appendChild(tooltip);
        box2.appendChild(wrapper);
    });

    chartDiv.appendChild(box2);


    // Delay chart init
    setTimeout(() => {
        const chartContainer = document.getElementById('tv_chart_container');
        if (chartContainer && chartContainer.clientWidth > 0 && chartContainer.clientHeight > 0) {
            initChart();
            patchCanvasZIndex();  // 🔴 PATCH AGAIN HERE
        } else {
            const retry = setInterval(() => {
                const ready = chartContainer && chartContainer.clientWidth > 0 && chartContainer.clientHeight > 0;
                if (ready) {
                    clearInterval(retry);
                    initChart();
                    patchCanvasZIndex();  // 🔴 AND AGAIN JUST IN CASE
                }
            }, 50);
        }
    }, 100);

    /*// 🔧 Patch canvas z-index so overlay boxes stay on top
    function patchCanvasZIndex() {
        setTimeout(() => {
            const canvas = chartDiv.querySelector('canvas');
            if (canvas) {
                canvas.style.zIndex = '1';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
            }
        }, 300);
    }*/

}

function patchCanvasZIndex(attempt = 1) {
    const chartDiv = document.getElementById('tv_chart_container');
    if (!chartDiv) {
        if (attempt <= 5) {
            return setTimeout(() => patchCanvasZIndex(attempt + 1), 300); // Retry up to 5 times
        }
        console.warn("chartDiv still not found after retries");
        return;
    }

    const canvas = chartDiv.querySelector('canvas');
    if (canvas) {
        canvas.style.zIndex = '1';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
}

function sendWhenReady(ws, message, retries = 10) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        console.log("🟢 Sent candle request:", message);
    } else if (retries > 0) {
        console.log("🔁 Waiting for WebSocket to open...");
        setTimeout(() => sendWhenReady(ws, message, retries - 1), 200);
    } else {
        console.error("❌ WebSocket still not open after retries.");
    }
}

function sendCandleRequest(symbol, timeframe) {
    const message = {
        event: "subscribe_candles",
        symbol: symbol,
        timeframe: timeframe
    };

    sendWhenReady(window.ws, message);
}

document.addEventListener("DOMContentLoaded", function () {
    loadInlineChart(); // 👈 This auto-loads the chart inside the page
});

window.WS_DATA = {
    chartType: 'candlestick',
    series: null,
};
/*
function setCandleIntervalFromUI(tf) {
    const map = {
        "1m": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "4h": 14400,
        "8h": 28800,
        "12h": 43200,
        "1d": 86400,
    };

    if (tf === 'tick') {
        candleInterval = null;
        chartMode = 'tick';
        console.log("⏱️ Tick mode selected.");
    } else {
        candleInterval = map[tf] || 60;
        chartMode = 'candle';
        console.log(`⏱️ Candle interval set to ${candleInterval} seconds`);
    }
}
*/
function setCandleIntervalFromUI(tf) {
    const map = {
        "1m": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "4h": 14400,
        "8h": 28800,
        "12h": 43200,
        "1d": 86400,
    };

    if (tf === 'tick') {
        window.candleInterval = null;
        window.chartMode = 'tick';

        localStorage.setItem('chartMode', 'tick');
        localStorage.removeItem('candleInterval');

        console.log("⏱️ Tick mode selected.");
    } else {
        const interval = map[tf] || 60;

        window.candleInterval = interval;
        window.chartMode = 'candle';

        localStorage.setItem('chartMode', 'candle');
        localStorage.setItem('candleInterval', interval.toString());

        console.log(`⏱️ Candle interval set to ${interval} seconds`);
    }
}

/*
function setCandleIntervalFromUI(tf) {
    const map = {
        "1m": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "4h": 14400,
        "8h": 28800,
        "12h": 43200,
        "1d": 86400,
    };

    if (tf === 'tick') {
        candleInterval = null;
        chartMode = 'tick';
        localStorage.setItem('chartMode', 'tick');
        localStorage.removeItem('candleInterval');
        console.log("⏱️ Tick mode selected.");
    } else {
        candleInterval = map[tf] || 60;
        chartMode = 'candle';
        localStorage.setItem('chartMode', 'candle');
        localStorage.setItem('candleInterval', candleInterval.toString());
        console.log(`⏱️ Candle interval set to ${candleInterval} seconds`);
    }
}
*/
/*
window.addEventListener("fullCandleHist", function (event) {
    if (window.WS_DATA.series) {
        console.log("📊 Setting full candle history...");
        console.log("🧪 Data:", event.detail);  // ✅ log the data
        window.WS_DATA.series.setData(event.detail);
    } else {
        console.warn("⛔ Chart series not initialized yet. Stashing history...");
        pendingFullData = event.detail;
        console.log("🧪 Data:", event.detail);  // ✅ log the data
    }
});

window.addEventListener("fullCandleHistory", function (event) {
    if (window.WS_DATA.series) {
        console.log("📊 Setting full candle history...");
        window.WS_DATA.series.setData(event.detail);
    } else {
        console.warn("⛔ Chart not ready — stashing data.");
        pendingFullData = event.detail;
    }
});
*//*
window.addEventListener("fullCandleHist", function (event) {
    console.log("📊 Received full tick history");
    waitAndSetSeriesData(event.detail);
});

window.addEventListener("fullCandleHistory", function (event) {
    console.log("📊 Received full candle history");
    waitAndSetSeriesData(event.detail);
});
*/
window.addEventListener("fullCandleHist", function (event) {
    console.log("📊 Received full tick history");
    waitAndSetSeriesData(event.detail);
});

window.addEventListener("fullCandleHistory", function (event) {
    console.log("📊 Received full candle history");
    waitAndSetSeriesData(event.detail);
});

function waitAndSetSeriesData(data, maxRetries = 10, delay = 300) {
    let attempt = 0;

    const trySet = () => {
        if (window.WS_DATA.series) {
            console.log("✅ Chart series is ready. Setting data...");
            window.WS_DATA.series.setData(data);
        } else {
            attempt++;

            if (attempt === 2) {
                // Force chart init if container is ready but initChart not called yet
                waitForChartContainerAndInit(() => {
                    // After init, keep trying
                    setTimeout(trySet, delay);
                });
                return;
            }

            if (attempt >= maxRetries) {
                console.error("⛔ Max retries reached. Could not set series data.");
                return;
            }

            console.log(`⏳ Waiting for chart series... (${attempt}/${maxRetries})`);
            setTimeout(trySet, delay);
        }
    };
    trySet();
}

function waitForChartContainerAndInit(callback) {
    let attempts = 0;
    const maxAttempts = 10;

    const check = () => {
        const chartDiv = document.getElementById('tv_chart_container');
        if (chartDiv) {
            const chart_timeframe = localStorage.getItem('chart_timeframe') || 'tick';

            console.log("🖼️ Chart container found. Initializing chart...");
            initChart(chartDiv, chart_timeframe);  // ✅ Call your real initChart here
            if (typeof callback === "function") callback(); // Continue to set data
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                console.warn("⚠️ Chart container not found after max attempts.");
                return;
            }
            console.log(`⏳ Waiting for chart container... (${attempts}/${maxAttempts})`);
            setTimeout(check, 300); // Try again in 300ms
        }
    };

    check();
}

/*
function waitAndSetSeriesData(data, maxRetries = 10, delay = 200) {
    let attempt = 0;

    const trySet = () => {
        if (window.WS_DATA.series) {
            console.log("✅ Chart series is ready. Setting data...");
            window.WS_DATA.series.setData(data);
        } else {
            attempt++;

            if (attempt === 2 && typeof initChart === "function") {
                console.warn("📉 Chart not ready. Forcing initChart() after second failed attempt...");
                initChart();  // 💡 Force chart init early
            }

            if (attempt >= maxRetries) {
                console.error("⛔ Max retries reached. Could not set series data.");
                return;
            }

            console.log(`⏳ Waiting for chart series... (${attempt}/${maxRetries})`);
            setTimeout(trySet, delay);
        }
    };

    trySet();
}
*/
/*
window.addEventListener("tickDataUpdated", function (event) {
    const series = window.WS_DATA.series;
    if (!series) return;

    const tick = event.detail.quote;
    let tickEpoch;
    if (event.detail?.tick?.epoch) {
        tickEpoch = parseInt(event.detail.tick.epoch);
    } else {
        tickEpoch = Math.floor(Date.now() / 1000);
    }
    //const tickEpoch = parseInt(event.detail.echo_req?.subscribe === 1 ? event.detail.tick.epoch : Date.now() / 1000);
    const tickPrice = parseFloat(tick);

    //const tickPrice = parseFloat(event.detail?.quote);
    //const tickEpoch = parseInt(event.detail?.epoch);
    //const tickEpoch = parseInt(event.detail?.tick?.epoch) || Math.floor(Date.now() / 1000);

    if (!tickPrice) return;

    if (isNaN(tickPrice) || isNaN(tickEpoch)) {
        console.warn("❌ Invalid tick data:", event.detail);
        return;
    }

    console.log("🕒 Chart mode:", chartMode);
    console.log("⏱️ Candle Interval:", candleInterval);
    console.log("🧮 Tick Epoch:", tickEpoch);

    if (chartMode === 'candle' && candleInterval) {
        const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

        if (!liveCandle || currentCandleEpoch !== bucketTime) {
            liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice
            };
            currentCandleEpoch = bucketTime;
        } else {
            liveCandle.high = Math.max(liveCandle.high, tickPrice);
            liveCandle.low = Math.min(liveCandle.low, tickPrice);
            liveCandle.close = tickPrice;
        }
        console.log("🕯️ Updating Candle Series with:", liveCandle);
        series.update(liveCandle);
    } else {
        // Tick/line chart
        const liveTick = { time: tickEpoch, value: tickPrice };
        console.log("📈 Updating Tick Series with:", liveTick);
        series.update(liveTick);
    }
    // Floating price label (optional)
    const label = document.getElementById("livePriceLabel");
    if (label) label.textContent = tickPrice.toFixed(2);
});
*/
/*
window.addEventListener("tickDataUpdated", function (event) {
    const series = window.WS_DATA?.series;
    if (!series) {
        console.warn("⚠️ No chart series found.");
        return;
    }

    // Get chart settingschart
    const chartMode = window.chartMode || localStorage.getItem("chartMode") || "tick";
    candleInterval = window.candleInterval || candleInterval;
    if (!candleInterval && chartMode === "candle") {
        candleInterval = parseInt(localStorage.getItem("candleInterval")) || 60;
    }

    // Safely extract tick price and epoch
    let tickPrice = null;
    let tickEpoch = null;

    if (event?.detail?.tick) {
        tickPrice = parseFloat(event.detail.tick.quote || event.detail.tick.ask || event.detail.quote);
        tickEpoch = parseInt(event.detail.tick.epoch);
    } else {
        tickPrice = parseFloat(event?.detail?.quote || event?.detail?.ask);
        tickEpoch = parseInt(event?.detail?.epoch);
    }

    if (isNaN(tickPrice) || isNaN(tickEpoch)) {
        console.warn("❌ Invalid tick data received:", event.detail);
        return;
    }

    console.log("🕒 Chart Mode:", chartMode);
    console.log("⏱️ Candle Interval:", candleInterval);
    console.log("🧮 Tick Epoch:", tickEpoch);

    if (chartMode === "candle" && candleInterval) {
        const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

        if (!window.liveCandle || window.currentCandleEpoch !== bucketTime) {
            // Start new candle
            window.liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice,
            };
            window.currentCandleEpoch = bucketTime;
            console.log("🆕 New Candle Started:", window.liveCandle);
        } else {
            // Update existing candle
            window.liveCandle.high = Math.max(window.liveCandle.high, tickPrice);
            window.liveCandle.low = Math.min(window.liveCandle.low, tickPrice);
            window.liveCandle.close = tickPrice;
            console.log("🔁 Candle Updated:", window.liveCandle);
        }

        series.update(window.liveCandle);
    } else {
        // Tick or line chart mode
        const liveTick = {
            time: tickEpoch,
            value: tickPrice,
        };
        console.log("📈 Updating Tick Series with:", liveTick);
        series.update(liveTick);
    }

    // Update live price label if it exists
    const label = document.getElementById("livePriceLabel");
    if (label) label.textContent = tickPrice.toFixed(2);
});
*/
/*
window.addEventListener("tickDataUpdated", function (event) {
    const series = window.WS_DATA?.series;
    if (!series) {
        console.warn("⚠️ No chart series found.");
        return;
    }

    // Get chart settingschart
    const chartMode = window.chartMode || localStorage.getItem("chartMode") || "tick";
    let candleInterval = window.candleInterval;
    if (!candleInterval && chartMode === "candle") {
        candleInterval = parseInt(localStorage.getItem("candleInterval")) || 60;
    }

    // Safely extract tick price and epoch
    let tickPrice = null;
    let tickEpoch = null;

    if (event?.detail?.tick) {
        tickPrice = parseFloat(event.detail.tick.quote || event.detail.tick.ask || event.detail.quote);
        tickEpoch = parseInt(event.detail.tick.epoch);
    } else {
        tickPrice = parseFloat(event?.detail?.quote || event?.detail?.ask);
        tickEpoch = parseInt(event?.detail?.epoch);
    }

    if (isNaN(tickPrice) || isNaN(tickEpoch)) {
        console.warn("❌ Invalid tick data received:", event.detail);
        return;
    }

    console.log("🕒 Chart Mode:", chartMode);
    console.log("⏱️ Candle Interval:", candleInterval);
    console.log("🧮 Tick Epoch:", tickEpoch);

    if (chartMode === "candle" && candleInterval) {
        const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

        if (!window.liveCandle || window.currentCandleEpoch !== bucketTime) {
            // Start new candle
            window.liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice,
            };
            window.currentCandleEpoch = bucketTime;
            console.log("🆕 New Candle Started:", window.liveCandle);
        } else {
            // Update existing candle
            window.liveCandle.high = Math.max(window.liveCandle.high, tickPrice);
            window.liveCandle.low = Math.min(window.liveCandle.low, tickPrice);
            window.liveCandle.close = tickPrice;
            console.log("🔁 Candle Updated:", window.liveCandle);
        }

        series.update(window.liveCandle);
    } else {
        // Tick or line chart mode
        const liveTick = {
            time: tickEpoch,
            value: tickPrice,
        };
        console.log("📈 Updating Tick Series with:", liveTick);
        series.update(liveTick);
    }

    // Update live price label if it exists
    const label = document.getElementById("livePriceLabel");
    if (label) label.textContent = tickPrice.toFixed(2);
});
*/

window.addEventListener("tickDataUpdated", function (event) {
    const series = window.WS_DATA?.series;
    if (!series) {
        console.warn("⚠️ No chart series found.");
        return;
    }

    // Get chart settings
    const chartMode = window.chartMode || localStorage.getItem("chartMode") || "tick";
    let candleInterval = window.candleInterval;
    if (!candleInterval && chartMode === "candle") {
        candleInterval = parseInt(localStorage.getItem("candleInterval")) || 60;
    }

    // Safely extract tick price and epoch
    let tickPrice = null;
    let tickEpoch = null;

    if (event?.detail?.tick) {
        tickPrice = parseFloat(event.detail.tick.quote || event.detail.tick.ask || event.detail.quote);
        tickEpoch = parseInt(event.detail.tick.epoch);
    } else {
        tickPrice = parseFloat(event?.detail?.quote || event?.detail?.ask);
        tickEpoch = parseInt(event?.detail?.epoch);
    }

    if (isNaN(tickPrice) || isNaN(tickEpoch)) {
        console.warn("❌ Invalid tick data received:", event.detail);
        return;
    }

    console.log("🕒 Chart Mode:", chartMode);
    console.log("⏱️ Candle Interval:", candleInterval);
    console.log("🧮 Tick Epoch:", tickEpoch);

    if (chartMode === "candle" && candleInterval) {
        const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

        if (!window.liveCandle || window.currentCandleEpoch !== bucketTime) {
            // Start new candle
            window.liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice,
            };
            window.currentCandleEpoch = bucketTime;
            console.log("🆕 New Candle Started:", window.liveCandle);
        } else {
            // Update existing candle
            window.liveCandle.high = Math.max(window.liveCandle.high, tickPrice);
            window.liveCandle.low = Math.min(window.liveCandle.low, tickPrice);
            window.liveCandle.close = tickPrice;
            console.log("🔁 Candle Updated:", window.liveCandle);
        }

        series.update(window.liveCandle);
    } else {
        // Tick or line chart mode
        const liveTick = {
            time: tickEpoch,
            value: tickPrice,
        };
        console.log("📈 Updating Tick Series with:", liveTick);
        series.update(liveTick);
    }

    // Update live price label if it exists
    const label = document.getElementById("livePriceLabel");
    if (label) label.textContent = tickPrice.toFixed(2);
});

/*
window.addEventListener("tickDataUpdated", function (event) {
    const series = window.WS_DATA.series;
    if (!series) {
        console.warn("⚠️ No chart series found.");
        return;
    }

    // Get chart mode and interval, fallback to localStorage if not globally defined
    const chartMode = window.chartMode || localStorage.getItem("chartMode") || "tick";
    let candleInterval = window.candleInterval;
    if (!candleInterval && chartMode === "candle") {
        candleInterval = parseInt(localStorage.getItem("candleInterval")) || 60;
    }

    // Parse tick price
    const tickPrice = parseFloat(event?.detail?.quote);
    const tickEpoch = parseInt(event?.detail?.tick?.epoch) || Math.floor(Date.now() / 1000);

    if (isNaN(tickPrice) || isNaN(tickEpoch)) {
        console.warn("❌ Invalid tick data received:", event.detail);
        return;
    }

    console.log("🕒 Chart Mode:", chartMode);
    console.log("⏱️ Candle Interval:", candleInterval);
    console.log("🧮 Tick Epoch:", tickEpoch);

    if (chartMode === "candle" && candleInterval) {
        const bucketTime = Math.floor(tickEpoch / candleInterval) * candleInterval;

        if (!window.liveCandle || window.currentCandleEpoch !== bucketTime) {
            window.liveCandle = {
                time: bucketTime,
                open: tickPrice,
                high: tickPrice,
                low: tickPrice,
                close: tickPrice,
            };
            window.currentCandleEpoch = bucketTime;
            console.log("🆕 New Candle Started:", window.liveCandle);
            series.update(window.liveCandle);
        } else {
            // Update the existing candle
            window.liveCandle.high = Math.max(window.liveCandle.high, tickPrice);
            window.liveCandle.low = Math.min(window.liveCandle.low, tickPrice);
            window.liveCandle.close = tickPrice;
            console.log("🔁 Candle Updated:", window.liveCandle);
            series.update(window.liveCandle);
        }

        //series.update(window.liveCandle);
    } else {
        // Tick/line chart update
        const liveTick = { time: tickEpoch, value: tickPrice };
        console.log("📈 Updating Tick Series with:", liveTick);
        series.update(liveTick);
    }

    // Optional: Floating live price label
    const label = document.getElementById("livePriceLabel");
    if (label) label.textContent = tickPrice.toFixed(2);
});
*/
function clearChartContainerExceptOverlays(container) {
    const keepIds = new Set(['chart-box1', 'chart-box2']);
    [...container.children].forEach(child => {
        if (!keepIds.has(child.id)) {
            container.removeChild(child);
        }
    });
}

function initChart(containerId = 'tv_chart_container', chartType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    clearChartContainerExceptOverlays(container);
    console.log(`📈 Initializing ${chartType} chart...`);

    const { createChart, CandlestickSeries, AreaSeries } = LightweightCharts;

    const chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
            background: { color: '#fff' },
            textColor: '#666',
            fontSize: 8
        },
        grid: {
            vertLines: { color: '#eee' },
            horzLines: { color: '#eee' },
        },
        timeScale: {
            timeVisible: true,
            borderColor: '#fff'
        },
        rightPriceScale: {
            borderColor: '#fff'
        },
        crossHair: { mode: 1 },
    });

    //let series;
    if (chartType === 'candlestick') {
        series = chart.addSeries(CandlestickSeries);
    } else {
        series = chart.addSeries(AreaSeries, {
            lineColor: 'rgba(0, 0, 0, 0.9)',
            topColor: 'rgba(0, 0, 0, 0.2)',
            bottomColor: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
        });
    }

    console.log("✅ Chart and series initialized.");

    // 🔁 Get timeframe and symbol
    const timeframe = localStorage.getItem('chart_timeframe') || 'tick';
    const symbol = localStorage.getItem('selectedSymbol');

    // 📜 Load stored or pending data
    //let hasHistory = false;
    if (chartType === 'candlestick') {
        const localHistory = localStorage.getItem("LCandleHistory");

        if (window.WS_DATA?.fullCandleHistory) {
            console.log("📜 Loading full candle history (live)...");
            series.setData(window.WS_DATA.fullCandleHistory);
            //hasHistory = true;
        } else if (pendingFullData) {
            series.setData(pendingFullData);
            pendingFullData = null;
            //hasHistory = true;
        }/* else if (localHistory) {
            console.log("📦 Loading candle history from localStorage...");
            const parsed = JSON.parse(localHistory);
            series.setData(parsed);
            //hasHistory = true;
        }

        if (!hasHistory && symbol) {
            console.warn("⚠️ No candle history found — sending request...");
            sendCandleRequest(symbol, timeframe);
        }*/

        // 🔁 Live update
        if (window.WS_DATA?.lastLiveCandle) {
            series.update(window.WS_DATA.lastLiveCandle);
        } else if (pendingLiveUpdate) {
            series.update(pendingLiveUpdate);
            pendingLiveUpdate = null;
        }

    } else {
        const localTicks = localStorage.getItem("LCandleHist");
        let parsedTicks = localTicks ? JSON.parse(localTicks) : null;

        if (window.WS_DATA?.fullCandleHist?.length) {
            console.log("📜 Loading full tick history (live)...");
            series.setData(window.WS_DATA.fullCandleHist);
            //hasHistory = true;
        } else if (parsedTicks) {
            console.log("📦 Loading tick history from localStorage...");
            series.setData(parsedTicks);
            //hasHistory = true;
        }
/*
        if (!hasHistory && symbol) {
            console.warn("⚠️ No tick history found — sending request...");
            sendCandleRequest(symbol, timeframe);
        }*/

        if (window.WS_DATA?.lastLiveTick) {
            series.update(window.WS_DATA.lastLiveTick);
        }
    }

    // 📌 Live price label
    let priceLabel = document.getElementById('livePriceLabel');
    if (!priceLabel) {
        priceLabel = document.createElement('div');
        priceLabel.id = 'livePriceLabel';
        priceLabel.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: white;
            color: #00B386;
            font-size: 10px;
            border-radius: 4px;
            z-index: 1000;
            font-weight: bold;
        `;
        container.appendChild(priceLabel);
    }

    chart.timeScale().fitContent();

    // 📦 Save references globally
    window.WS_DATA.chart = chart;
    window.WS_DATA.series = series;
}
/*
//function initChart(containerId = 'tv_chart_container', chartType = 'candlestick') {
function initChart(containerId = 'tv_chart_container', chartType = 'tick') {
    const container = document.getElementById(containerId);
    if (!container) return;

    //container.innerHTML = ''; // Clear previous chart
    clearChartContainerExceptOverlays(container);

    //const oldCanvas = container.querySelector('canvas');
    //if (oldCanvas) container.removeChild(oldCanvas);

    console.log(`📈 Initializing ${chartType} chart...`);

    const { createChart, CandlestickSeries, AreaSeries } = LightweightCharts;

    const chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
            background: { color: '#fff' },
            textColor: '#666',
            fontSize: 8   // ✅ Smaller text for price and time axes

        },
        grid: {
            vertLines: { color: '#eee' },
            horzLines: { color: '#eee' },
        },
        timeScale: {
            timeVisible: true,
            borderColor: '#fff'   // ✅ removes bottom black line
        },
        rightPriceScale: {
            borderColor: '#fff'   // ✅ removes right black line
        },
        crossHair: {
            mode: 1,
        },
    });

    let series;
    if (chartType === 'candlestick') {
        series = chart.addSeries(CandlestickSeries);
    } else {
        // Use area series instead of line
        series = chart.addSeries(AreaSeries, {
            lineColor: 'rgba(0, 0, 0, 0.9)',
            topColor: 'rgba(0, 0, 0, 0.2)',
            bottomColor: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
        });
    }

    console.log("✅ Chart and series initialized.");

    // 🗃️ Load historical data
    if (chartType === 'candlestick') {
        if (window.WS_DATA?.fullCandleHistory) {
            console.log("📜 Loading full candle history...");
            series.setData(window.WS_DATA.fullCandleHistory);
        } else if (pendingFullData) {
            series.setData(pendingFullData);
            pendingFullData = null;
        }

        if (window.WS_DATA?.lastLiveCandle) {
            series.update(window.WS_DATA.lastLiveCandle);
        } else if (pendingLiveUpdate) {
            series.update(pendingLiveUpdate);
            pendingLiveUpdate = null;
        }

    } else {
        // Tick or area chart mode
        if (window.WS_DATA?.fullCandleHist?.ticks?.length) {
            console.log("📜 Loading full tick history...");
            series.setData(window.WS_DATA.fullCandleHist.ticks);
        }

        if (window.WS_DATA?.lastLiveTick) {
            series.update(window.WS_DATA.lastLiveTick);
        }
    }

    // 🔖 Create live price label if missing
    let priceLabel = document.getElementById('livePriceLabel');
    if (!priceLabel) {
        priceLabel = document.createElement('div');
        priceLabel.id = 'livePriceLabel';
        priceLabel.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: white;
            color: #00B386;
            font-size: 10px;
            //padding: 4px 8px;
            border-radius: 4px;
            z-index: 1000;
            font-weight: bold;
        `;
        container.appendChild(priceLabel);
    }

    chart.timeScale().fitContent();

    // 📦 Save chart and series globally
    window.WS_DATA.chart = chart;
    window.WS_DATA.series = series;
}
*/