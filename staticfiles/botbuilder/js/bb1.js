Blockly.defineBlocksWithJsonArray([
    {
        "type": "take_profit_block",  // Existing Take Profit block
        "message0": "Take Profit: USD %1 %2",
        "args0": [
            {
                "type": "field_number",
                "name": "TAKE_PROFIT",
                "value": 0,
                "min": 0
            },
            {
                "type": "input_dummy"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        //"colour": 230,
        "colour": "#064e72", // "#FF5733",  // Custom color
        "tooltip": "Set your take profit value",
        "helpUrl": "",
        //"style": "custom_blocks",  // Custom style group
    },
    {
        "type": "growth_rate_block",  // Existing Growth Rate block
        "message0": "Growth Rate: %1 Stake: USD %2 %3 %4",
        "args0": [
            {
                "type": "field_number",
                "name": "GROWTH_RATE",
                "value": 0
            },
            {
                "type": "field_number",
                "name": "STAKE",
                "value": 0
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "CONDITION"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        //"colour": 230,
        "colour": "#e5e5e5", //"#33C1FF",  // Custom color
        "tooltip": "Set your growth rate and stake",
        "helpUrl": "",
        //"style": "custom_blocks",  // Custom style group
    },
// Other blocks continue here...
]);

const tradeParametersBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="trade_param_block_1" type="math_number" x="10" y="20"></block>
  <block id="trade_param_block_2" type="variables_set" x="10" y="50"></block>
  <block id="trade_param_block_3" type="growth_rate_block" x="10" y="100"></block>
  <block id="trade_param_block_4" type="take_profit_block" x="10" y="170"></block>
</xml>`;

/*const tradeParametersBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="trade_param_block_1" type="math_number" x="10" y="20"></block>
  <block id="trade_param_block_2" type="variables_set" x="10" y="50"></block>
</xml>`;
*/
const purchaseConditionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="purchase_cond_block_1" type="math_number" x="10" y="20"></block>
  <block id="purchase_cond_block_2" type="variables_set" x="10" y="50"></block>
</xml>`;

const sellConditionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="sell_cond_block_1" type="math_number" x="10" y="20"></block>
  <block id="sell_cond_block_2" type="variables_set" x="10" y="50"></block>
</xml>`;

const restartTradingConditionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="restart_trading_block_1" type="math_number" x="10" y="20"></block>
  <block id="restart_trading_block_2" type="variables_set" x="10" y="50"></block>
</xml>`;

const blockSections = {
    'trade_param': Blockly.utils.xml.textToDom(tradeParametersBlocks),
    'purchase_cond': Blockly.utils.xml.textToDom(purchaseConditionsBlocks),
    'sell_cond': Blockly.utils.xml.textToDom(sellConditionsBlocks),
    'restart_trading': Blockly.utils.xml.textToDom(restartTradingConditionsBlocks)
};

document.addEventListener('DOMContentLoaded', function () {
    createWorkspace();
});

function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    const workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        zoom:
            {controls: false,
             wheel: true,
             startScale: 1.0,
             maxScale: 3,
             minScale: 0.3,
             scaleSpeed: 1.2,
             //pinch: true
             },
        renderer: 'zelos'  // Use the 'zelos' renderer
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
        modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 370px; height: 370px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;';
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
                tempWorkspaceDiv.style = 'width: 370px; height: 370px;';
                modal.appendChild(tempWorkspaceDiv);

                const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                    toolbox: null,
                    horizontalLayout: false,
                    move:{
                            scrollbars: {
                              horizontal: false,
                              vertical: true
                            },
                            drag: true,
                            wheel: false},
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

                tempWorkspace.addChangeListener((event) => {
                    if (event.type === Blockly.Events.BLOCK_DRAG) {
                        const block = tempWorkspace.getBlockById(event.blockId);
                        const draggedBlockXml = Blockly.Xml.blockToDom(block);
                        const mainBlockXml = document.createElement('xml');
                        mainBlockXml.appendChild(draggedBlockXml);
                        Blockly.Xml.domToWorkspace(mainBlockXml, workspace);

                        block.dispose(false, false);

                        const previousZoom = workspace.getScale();
                        workspace.resize();
                        workspace.setScale(previousZoom);
                        workspace.scrollCenter();
                        modal.style.display = 'none';
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
                modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 370px; height: 370px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;';
                workspace.getParentSvg().parentNode.appendChild(modal);

                subsectionDiv.addEventListener('click', () => {

                    modal.innerHTML = '';

                    modal.style.display = 'block';

                    let sectionBlockXml;
                    switch (subsectionName) {
                        case 'Indicator':
                            sectionBlockXml = Blockly.utils.xml.textToDom(tradeParametersBlocks);
                            break;
                        case 'Tick and candle analysis':
                            sectionBlockXml = Blockly.utils.xml.textToDom(purchaseConditionsBlocks);
                            break;
                        case 'Custom Functions':
                            sectionBlockXml = Blockly.utils.xml.textToDom(sellConditionsBlocks);
                            break;
                        case 'Variables':
                            sectionBlockXml = Blockly.utils.xml.textToDom(restartTradingConditionsBlocks);
                            break;
                    }

                    if (sectionBlockXml) {
                        const tempWorkspaceDiv = document.createElement('div');
                        tempWorkspaceDiv.style = 'width: 370px; height: 370px;';
                        modal.appendChild(tempWorkspaceDiv);

                        const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                            toolbox: null,
                            horizontalLayout: false,
                            renderer: 'zelos',  // Use the 'zelos' renderer
                            move:{
                                    scrollbars: {
                                      horizontal: false,
                                      vertical: true
                                    },
                                    drag: true,
                                    wheel: false}
                        });
                        // Resize the workspace when the modal is opened
                        const resizeWorkspace = () => {
                            Blockly.svgResize(tempWorkspace);
                        };

                        //modal.appendChild(tempWorkspaceDiv);
                        tempWorkspace.resize();
                        setTimeout(() => {
                            Blockly.Xml.domToWorkspace(sectionBlockXml, tempWorkspace);
                            tempWorkspace.resize();
                        }, 0);

                        tempWorkspace.addChangeListener((event) => {
                            if (event.type === Blockly.Events.BLOCK_DRAG) {
                                const block = tempWorkspace.getBlockById(event.blockId);
                                const draggedBlockXml = Blockly.Xml.blockToDom(block);
                                const mainBlockXml = document.createElement('xml');
                                mainBlockXml.appendChild(draggedBlockXml);
                                Blockly.Xml.domToWorkspace(mainBlockXml, workspace);

                                block.dispose(false, false);

                                const previousZoom = workspace.getScale();
                                workspace.resize();
                                workspace.setScale(previousZoom);
                                workspace.scrollCenter();
                                modal.style.display = 'none';
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