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
python.pythonGenerator.forBlock['tradeparameters'] = function(block) {
  const statement_tp = python.pythonGenerator.statementToCode(block, 'tp');
  const statement_roat = python.pythonGenerator.statementToCode(block, 'roat');
  const statement_to = python.pythonGenerator.statementToCode(block, 'to');

const code = `
\n# Python code for tradeparameters_tp_block\ndef tradeparameters_tp_block():\n${statement_tp}\n  variables = locals().copy()\n  return variables\nvariables = tradeparameters_tp_block()\nprint("executed Tp1:", variables)
\n# Python code for tradeparameters_roat_block\ndef tradeparameters_roat_block():\n${statement_roat}\n  variables = locals().copy()\n  return variables\nvariables = tradeparameters_roat_block()\nprint("executed Roat1:", variables)
\n# Python code for tradeparameters_to block\ndef tradeparameters_to_block():\n${statement_to}\n  variables = locals().copy()\n  return variables\nvariables = tradeparameters_to_block()\nprint("executed To1:", variables)
`;
  return code;
}

const market = {
  init: function() {
    this.appendDummyInput('mk')
      .appendField(new Blockly.FieldLabelSerializable('market:  '), 'mktl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'mkts')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'sbmktsl:')
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


python.pythonGenerator.forBlock['market'] = function(block) {
  const dropdown_mkts = block.getFieldValue('mkts'); // .trim();
  const dropdown_sbmkts = block.getFieldValue('sbmkts'); // .trim();
  const dropdown_sl = block.getFieldValue('sl'); // .trim();

  // TODO: Assemble python into the code variable.
const code = `
\nmarket = "${dropdown_mkts}"\nsubmarket = "${dropdown_sbmkts}"\nsymbol = "${dropdown_sl}"
`;

  return code;
}

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
        ]), 'tt2');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Trade_Type: Trade_Type});

python.pythonGenerator.forBlock['Trade_Type'] = function(block) {
  const dropdown_tt1 = block.getFieldValue('tt1');
  const dropdown_tt2 = block.getFieldValue('tt2');

  // TODO: Assemble python into the code variable.
const code = `
\ntt1 = "${dropdown_tt1}"\ntt2 = "${dropdown_tt2}"
`;

  return code;
}

const Contract_Type = {
  init: function() {
    this.appendDummyInput('ct')
      .appendField(new Blockly.FieldLabelSerializable('Contract Type:  '), 'ct')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
        ]), 'ct1');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Contract_Type: Contract_Type});

python.pythonGenerator.forBlock['Contract_Type'] = function(block) {
  const dropdown_ct1 = block.getFieldValue('ct1');

  // TODO: Assemble python into the code variable.
const code = `
\nct1 = "${dropdown_ct1}"
`;

  return code;
}

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

python.pythonGenerator.forBlock['Default_Candle_Interval'] = function(block) {
  const dropdown_dciv = block.getFieldValue('dciv');

  // TODO: Assemble python into the code variable.
const code = `
\ndci = "${dropdown_dciv}"
`;

  return code;
}

const Restart_buy_sell = {
  init: function() {
    this.appendDummyInput('rbs')
      .appendField(new Blockly.FieldLabelSerializable('Restart buy/sell (disable for better perfomance): '), 'rb/s')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'rbscb');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Restart_buy_sell: Restart_buy_sell});

python.pythonGenerator.forBlock['Restart_buy_sell'] = function(block) {
  const dropdown_rbscb = block.getFieldValue('rbscb');

  // TODO: Assemble python into the code variable.
const code = `
\nrbscb = ${dropdown_rbscb}
`;

  return code;
}

const Restart_last_trade_on_error = {
  init: function() {
    this.appendDummyInput('rltoe')
      .appendField(new Blockly.FieldLabelSerializable('Restart last trade on error (bot ignores the unsuccesful trade):'), 'rltoebitut')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'rltoecb');
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Restart_last_trade_on_error: Restart_last_trade_on_error});

python.pythonGenerator.forBlock['Restart_last_trade_on_error'] = function(block) {
  const dropdown_rltoecb = block.getFieldValue('rltoecb');

  // TODO: Assemble python into the code variable.
const code = `
\nrltoecb = ${dropdown_rltoecb}
`;

  return code;
}

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

python.pythonGenerator.forBlock['Duration'] = function(block) {
  const dropdown_drd = block.getFieldValue('drd');
  const dropdown_drv = block.getFieldValue('drv');
  const dropdown_st = block.getFieldValue('st');
  // TODO: Assemble python into the code variable.
const code = `
\ndrd = ${dropdown_drd}\ndrv = ${dropdown_drv}\nst = ${dropdown_st}
`;

  return code;
}

const Multiplier = {
  init: function() {
    this.appendDummyInput('Multiplier')
      .appendField(new Blockly.FieldLabelSerializable('Multiplier:'), 'mt')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'mv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv');
    this.appendStatementInput('mts');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Multiplier: Multiplier});

python.pythonGenerator.forBlock['Multiplier'] = function(block) {
  const dropdown_mv = block.getFieldValue('mv');
  const number_stv = block.getFieldValue('stv');

  const statement_mts = python.pythonGenerator.statementToCode(block, 'mts');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nmv = ${dropdown_mv}\nstv = ${number_stv}\n${statement_mts}
`;
  return code;
}

const Take_profit = {
  init: function() {
    this.appendDummyInput('tpmd')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpml')
      .appendField(new Blockly.FieldNumber(0), 'tpmv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profit: Take_profit});

python.pythonGenerator.forBlock['Take_profit'] = function() {
  const number_tpmv = block.getFieldValue('tpmv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ntpmv = ${dropdown_tpmv}
`;
  return code;
}

const Stop_Loss = {
  init: function() {
    this.appendDummyInput('slmd')
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

python.pythonGenerator.forBlock['Stop_Loss'] = function() {
  const number_slv = block.getFieldValue('slv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nslv = ${dropdown_slv}
`;
  return code;
}

const Growth_Rate = {
  init: function() {
    this.appendDummyInput('Growth Rate')
      .appendField(new Blockly.FieldLabelSerializable('Growth Rate:'), 'gr')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'grv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv');
    this.appendStatementInput('grs');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Growth_Rate: Growth_Rate});

python.pythonGenerator.forBlock['Growth_Rate'] = function(block) {
  const dropdown_grv = block.getFieldValue('grv');
  const number_stv = block.getFieldValue('stv');

  const statement_grs = python.pythonGenerator.statementToCode(block, 'grs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
    const code = `
\ngrv = ${dropdown_grv}\nstv = ${number_stv}\n\t${statement_grs}
`;
  return code;
}

const Take_profit_a = {
  init: function() {
    this.appendDummyInput('tpa')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpau')
      .appendField(new Blockly.FieldNumber(0), 'tpav');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profit_a: Take_profit_a});

python.pythonGenerator.forBlock['Take_profit_a'] = function() {
  const number_tpav = block.getFieldValue('tpav');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ntpav = ${dropdown_tpav}
`;
  return code;
}

const Duration_T = {
  init: function() {
    this.appendDummyInput('dr1')
      .appendField(new Blockly.FieldLabelSerializable('Duration: '), 'dr1')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'd1')
      .appendField(new Blockly.FieldNumber(5), 'dv')
      .appendField(new Blockly.FieldLabelSerializable('Stake : USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Barrier Offset'), 'bo')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'bod')
      .appendField(new Blockly.FieldNumber(0), 'bov');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_T: Duration_T});

python.pythonGenerator.forBlock['Duration_T'] = function(block) {
  const dropdown_d1 = block.getFieldValue('d1');
  const dropdown_dv = block.getFieldValue('dv');
  const dropdown_stv = block.getFieldValue('stv');
  const dropdown_bod = block.getFieldValue('bod');
  const dropdown_bov = block.getFieldValue('bov');
  // TODO: Assemble python into the code variable.
const code = `
\nd1 = ${dropdown_d1}\ndv = ${dropdown_dv}\nstv = ${dropdown_stv}\nbod = ${dropdown_bod}\nbov = ${dropdown_bov}
`;

  return code;
}

const Duration_I = {
  init: function() {
    this.appendDummyInput('dr1')
      .appendField(new Blockly.FieldLabelSerializable('Duration: '), 'dr1')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'd1')
      .appendField(new Blockly.FieldNumber(5), 'dv')
      .appendField(new Blockly.FieldLabelSerializable('Stake : USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Barrier Offset'), 'bo')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'bod')
      .appendField(new Blockly.FieldNumber(0), 'bov')
      .appendField(new Blockly.FieldLabelSerializable('Low barrier Offset'), 'lbo')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'lbod')
      .appendField(new Blockly.FieldNumber(0), 'lbov');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_I: Duration_I});

python.pythonGenerator.forBlock['Duration_I'] = function(block) {
  const dropdown_d1 = block.getFieldValue('d1');
  const dropdown_dv = block.getFieldValue('dv');
  const dropdown_stv = block.getFieldValue('stv');
  const dropdown_bod = block.getFieldValue('bod');
  const dropdown_bov = block.getFieldValue('bov');
  const dropdown_lbod = block.getFieldValue('lbod');
  const dropdown_lbov = block.getFieldValue('lbov');
  // TODO: Assemble python into the code variable.
const code = `
\nd1 = ${dropdown_d1}\ndv = ${dropdown_dv}\nstv = ${dropdown_stv}\nbod = ${dropdown_bod}\nbov = ${dropdown_bov}\nlbod = ${dropdown_lbod}\nlbov = ${dropdown_lbov}
`;

  return code;
}

const Duration_HD = {
  init: function() {
    this.appendDummyInput('dr1')
      .appendField(new Blockly.FieldLabelSerializable('Duration: '), 'dr1')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME']
        ]), 'd1')
      .appendField(new Blockly.FieldNumber(5), 'dv')
      .appendField(new Blockly.FieldLabelSerializable('Stake : USD'), 'stu')
      .appendField(new Blockly.FieldNumber(1), 'stv')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Prediction:'), 'bo')
      .appendField(new Blockly.FieldNumber(1), 'bov');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    //this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_HD: Duration_HD});

python.pythonGenerator.forBlock['Duration_HD'] = function(block) {
  const dropdown_d1 = block.getFieldValue('d1');
  const dropdown_dv = block.getFieldValue('dv');
  const dropdown_stv = block.getFieldValue('stv');
  const dropdown_bov = block.getFieldValue('bov');
  // TODO: Assemble python into the code variable.
const code = `
\nd1 = ${dropdown_d1}\ndv = ${dropdown_dv}\nstv = ${dropdown_stv}\nbov = ${dropdown_bov}
`;

  return code;
}

const Purchase_conditions = {
  init: function() {
    this.appendDummyInput('Pc')
      .appendField(new Blockly.FieldLabelSerializable('2. Purchase conditions'), 'Pc');
    this.appendStatementInput('Pcs');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({Purchase_conditions: Purchase_conditions});

python.pythonGenerator.forBlock['Purchase_conditions'] = function(block) {
  const statement_Pcs = python.pythonGenerator.statementToCode(block, 'Pcs');

  const code = `
# Python code for Purchase_conditions_block\ndef Purchase_conditions block():\n  Pd = None\n${statement_Pcs}\n  variables = locals().copy()\n  return variables\nvariables = Purchase_conditions_block()\nprint("executed Pcs1:", variables)

`;
  return code;
}
// \nupdate_pcs1('Pd', Pd) \nPcs1 = Purchase_conditions_block()
//\nupdate_extracted_vars('Pcs1', Pcs1)\nupdate_extracted_vars('Pd', Pd) \nupdate_Pcs1('Pcs1', Pcs1)    \n  Pcs1 = {}  \n  Pcs1 = Pcs1  \n  Sell_is_available = True\n  kkkkcs1 = {}
const Sell_conditions = {
  init: function() {
    this.appendDummyInput('Scd')
      .appendField(new Blockly.FieldLabelSerializable('3. Sell conditions'), 'Sc');
    this.appendStatementInput('Scs');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({Sell_conditions: Sell_conditions});

python.pythonGenerator.forBlock['Sell_conditions'] = function(block) {
  const statement_Scs = python.pythonGenerator.statementToCode(block, 'Scs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
# Python code for Sell_conditions_block\ndef Sell_conditions_block():\n${statement_Scs}\n  variables = locals().copy()\n  return variables\nvariables = Sell_conditions_block()\nprint("executed Scs1:", variables)
`;
  return code;Scs1
}

const Restart_trading_conditions = {
  init: function() {
    this.appendDummyInput('Pc')
      .appendField(new Blockly.FieldLabelSerializable('4. Restart trading conditions'), 'Rtc');
   this.appendStatementInput('Rtcs');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({Restart_trading_conditions: Restart_trading_conditions});

python.pythonGenerator.forBlock['Restart_trading_conditions'] = function(block) {
  const statement_Rtcs = python.pythonGenerator.statementToCode(block, 'Rtcs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
# Python code for Restart_trading_conditions_block\ndef Restart_trading_conditions_block():\n  Ta = None\n${statement_Rtcs}\n  variables = locals().copy()\n  return variables\nvariables = Restart_trading_conditions_block()\nprint("executed Rtcs1:", variables)

`;
  return code;
}

const Purchase = {
  init: function() {
    this.appendDummyInput('Pc')
      .appendField(new Blockly.FieldLabelSerializable('Purchase'), 'Pl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'Pd');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Purchase: Purchase});

python.pythonGenerator.forBlock['Purchase'] = function(block) {
  const dropdown_Pd = block.getFieldValue('Pd');

  // TODO: Assemble python into the code variable.
const code = `
\nPd = "${dropdown_Pd}"
`;
  return code;
}

const Trade_again = {
  init: function() {
    this.appendDummyInput('Tadu')
     .appendField(new Blockly.FieldLabelSerializable('Trade again'), 'Ta');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Trade_again: Trade_again});

python.pythonGenerator.forBlock['Trade_again'] = function(block) {
  const dropdown_Ta = block.getFieldValue('Ta');

  // TODO: Assemble python into the code variable.
const code = `
\nTa = "${dropdown_Ta}"
`;
  return code;
}

const Sell_is_available = {
  init: function() {
    this.appendDummyInput('Siad')
      .appendField(new Blockly.FieldLabelSerializable('Sell is available'), 'Sia');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Sell_is_available: Sell_is_available});

python.pythonGenerator.forBlock['Sell_is_available'] = function(block) {
  const dropdown_Sia = block.getFieldValue('Sia');

  // TODO: Assemble python into the code variable.
const code = `
\n${dropdown_Sia}
`;

  return [code, python.Order.NONE];
}

const Conditional_if = {
  init: function() {
    this.appendValueInput('Ci')
      .appendField(new Blockly.FieldLabelSerializable('if'), 'if');
    this.appendEndRowInput('cier')
      .appendField(new Blockly.FieldLabelSerializable('then                    '), 'th');
    this.appendStatementInput('cifs');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");

    this.addPlusIcon_();

    this.elseIfCount_ = 0;
    this.elseCount_ = 0;
  },

  addPlusIcon_: function() {
    if (this.getInput('ADD_BUTTON')) {
      this.removeInput('ADD_BUTTON'); // Prevent duplicate buttons
    }

    this.appendDummyInput('ADD_BUTTON')
      .appendField(new Blockly.FieldImage(
        '/static/icons/add.png', // Path to the plus icon
        20, 20, '+',
        this.onAddButtonClick_.bind(this)
      ));
  },

  onAddButtonClick_: function() {
    Blockly.Events.disable(); // Prevent excessive event generation
    try {
      if (this.elseCount_ === 0) {
        this.addElseBlock_();
      } else {
        this.addElseIfBlock_();
      }
    } finally {
      Blockly.Events.enable(); // Re-enable events
    }
    this.addPlusIcon_(); // Reposition the '+' button
  },

  addElseBlock_: function() {
    if (this.elseCount_ === 0) {
      const elseDummyInput = this.appendDummyInput('Ce').appendField('else');
      const elseInput = this.appendStatementInput('ELSE'); //.appendField('else');
      this.addMinusIcon_(elseDummyInput, 'Ce');
      this.elseCount_++;
      console.log(this.inputList.map(input => input.name));
    }
  },

  addElseIfBlock_: function() {
    const index = this.elseIfCount_;
    const elseIfCondition = this.appendValueInput('IF' + index).appendField('else if');
    const elseIfEndRow = this.appendEndRowInput('th' + index).appendField('then');
    const elseIfStatement = this.appendStatementInput('DO' + index); //.appendField('then');
    this.addMinusIcon_(elseIfEndRow, 'th' + index);

    // Check for the presence of the ELSE block and reposition
    if (this.getInput('Ce')) {
      this.moveInputBefore('IF' + index, 'Ce');
      this.moveInputBefore('th' + index, 'Ce');
      this.moveInputBefore('DO' + index, 'Ce');
    }

    this.elseIfCount_++;
    console.log(this.inputList.map(input => input.name));
  },

  addMinusIcon_: function(input, partKey) {
      input.appendField(new Blockly.FieldImage(
          '/static/icons/minus.png', // Path to the minus icon
          20, 20, '-',             // Width, height, and alt text
          () => this.removePart_(partKey) // Callback for when the icon is clicked
      ));
  },

//console.log("Before removal:", this.inputList.map(input => input.name));
removePart_: function(partKey) {
  Blockly.Events.disable(); // Disable events temporarily to avoid triggering unnecessary updates
  console.log("Before removal:", this.inputList.map(input => input.name));
  try {
    if (partKey.startsWith('th')) { // Handle 'else if' blocks
      const index = parseInt(partKey.replace('th', ''), 10);

      // Remove the targeted inputs for the 'else if' block
      if (this.getInput('IF' + index)) {
        this.removeInput('IF' + index);
      }
      if (this.getInput('th' + index)) {
        this.removeInput('th' + index);
      }
      if (this.getInput('DO' + index)) {
        this.removeInput('DO' + index);
      }

      //this.elseIfCount_--;

      // Rebuild the remaining indices
      for (let i = index + 1; i <= this.elseIfCount_; i++) {
        const newIndex = i - 1;

        // Rename inputs for remaining 'else if' blocks
        this.renameInput_('IF' + i, 'IF' + newIndex);
        this.renameInput_('th' + i, 'th' + newIndex);
        this.renameInput_('DO' + i, 'DO' + newIndex);
      }

      this.elseIfCount_--;

      // Update the block shape
      //this.updateShape_();
    } else if (partKey === 'Ce' && this.getInput('Ce')) {
      // Remove the 'else' block
      this.removeInput('Ce');
      this.removeInput('ELSE');
      this.elseCount_--;
    }
    // Update the block shape
    //this.updateShape_();
    this.addPlusIcon_(); // Add the '+' button if necessary

  } finally {
    Blockly.Events.enable(); // Re-enable events
    Blockly.Touch.clearTouchIdentifier(); // Clear any lingering drag state
    this.workspace.resizeContents(); // Force a redraw of the workspace
  }
  //this.addPlusIcon_(); // Add the '+' button if necessary
  console.log("After removal:", this.inputList.map(input => input.name));
},

//console.log("After removal:", this.inputList.map(input => input.name));

// Helper method to rename inputs
renameInput_: function(oldName, newName) {
  const input = this.getInput(oldName);
  if (input) {
    input.name = newName;
  }
},

  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('elseIfs', this.elseIfCount_);
    container.setAttribute('else', this.elseCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.elseIfCount_ = parseInt(xmlElement.getAttribute('elseIfs'), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },

  updateShape_: function() {
    // Remove all existing else/else if inputs safely
    let i = 0;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('th' + i);
      this.removeInput('DO' + i);
      i++;
    }
    if (this.getInput('Ce')) {
      this.removeInput('Ce');
      this.removeInput('ELSE')
    }

    // Rebuild the structure
    for (let i = 0; i < this.elseIfCount_; i++) {
      const elseIfCondition = this.appendValueInput('IF' + i).appendField('else if');
      const elseIfEndRow = this.appendEndRowInput('th' + index).appendField('then');
      const elseIfStatement = this.appendStatementInput('DO' + i); //.appendField('then');
      this.addMinusIcon_(elseIfEndRow, 'th' + i);
    }
    if (this.elseCount_ > 0) {
      const elseDummyInput = this.appendDummyInput('Ce').appendField('else');
      const elseInput = this.appendStatementInput('ELSE'); //.appendField('else');
      this.addMinusIcon_(elseDummyInput, 'Ce');
    }
  }
};

// Register the block
Blockly.common.defineBlocks({ Conditional_if: Conditional_if });

python.pythonGenerator.forBlock['Conditional_if'] = function(block) {
  let code = '';

  const ifCondition = python.pythonGenerator.valueToCode(block, 'Ci', python.Order.ATOMIC);
  //const value_ci = python.pythonGenerator.valueToCode(block, 'Ci', python.Order.ATOMIC);

  const ifStatements = python.pythonGenerator.statementToCode(block, 'cifs');
  //const statement_cifs = python.pythonGenerator.statementToCode(block, 'cifs');

  //code += '\n if (${ifCondition}) {\n${ifStatements}}';
  //code += '\n if (${ifCondition}) \n then {${ifStatements}}';
  //code += '\n if = ${ifCondition} \n then = ${ifStatements}';
  code += `if ${ifCondition}:\n${ifStatements}`;


  for (let i = 0; i < block.elseIfCount_; i++) {
    const elseifCondition = python.pythonGenerator.valueToCode(block, 'IF' + i, python.Order.ATOMIC);
    const elseifStatements = python.pythonGenerator.statementToCode(block, 'DO' + i);
    //code += '\n else if (${elseifCondition}) \n then {${elseifStatements}}';
    //code += '\n else if = ${elseifCondition} \n then = ${elseifStatements}';
    code += `\nelif ${elseifCondition}:\n${elseifStatements}`;

  }

  if (block.elseCount_ > 0) {
    const elseStatements = python.pythonGenerator.statementToCode(block, 'ELSE');
    //code += '\n else {${elseStatements}}';
    code += `\nelse:\n${elseStatements}`;
    //code += '\n else: \n {${elseStatements}}';

  }

  return code + '\n' ; // + '\n'
};


const sell_at_market_price = {
  init: function() {
    this.appendDummyInput('tpmd')
      .appendField(new Blockly.FieldLabelSerializable('sell at market price'), 'samp');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({sell_at_market_price: sell_at_market_price});

python.pythonGenerator.forBlock['sell_at_market_price'] = function() {
  const samp = block.getFieldValue('samp');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nsamp = "${samp}"
`;
  return code;
}


const Simple_Moving_Average__SMA_ = {
  init: function() {
    this.appendDummyInput('smad')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('sma'), 'smava')
      .appendField(new Blockly.FieldLabelSerializable(' to Simple Moving Average   '), 'tsmal');
    this.appendStatementInput('smas');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Simple_Moving_Average__SMA_: Simple_Moving_Average__SMA_});

python.pythonGenerator.forBlock['Simple_Moving_Average__SMA_'] = function(block, generator) {
    const variable_smava = generator.nameDB_.getName(block.getFieldValue('smava'), Blockly.VARIABLE_CATEGORY_NAME);
    const statement_smas = python.pythonGenerator.statementToCode(block, 'smas');

    const code = `\n# Python code for sma_block\ndef ${variable_smava}_block():\n${statement_smas}\n  variables = locals().copy()\n  return variables\n${variable_smava} = ${variable_smava}_block()\nprint("executed ${variable_smava}:", ${variable_smava})`;
    return code;
};


const Simple_Moving_Average_Array__SMAA_ = {
  init: function() {
    this.appendDummyInput('smaad')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('smaa'), 'smaava')
      .appendField(new Blockly.FieldLabelSerializable(' to Simple Moving Average Array  '), 'tsmaal');
    this.appendStatementInput('smaas');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Simple_Moving_Average_Array__SMAA_: Simple_Moving_Average_Array__SMAA_});

python.pythonGenerator.forBlock['Simple_Moving_Average_Array__SMAA_'] = function(block, generator) {
    const variable_smaava = generator.nameDB_.getName(block.getFieldValue('smaava'), Blockly.VARIABLE_CATEGORY_NAME);

  const statement_smaas = python.pythonGenerator.statementToCode(block, 'smaas');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for smaa_block\ndef ${variable_smaava}_block():\n${statement_smaas}\n  variables = locals().copy()\n  return variables\n${variable_smaava} = ${variable_smaava}_block()\nprint("executed ${variable_smaava}:", ${variable_smaava})`;

  return code;
}

const Bollinger_Bands__BB_ = {
  init: function() {
    this.appendDummyInput('bbd')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('bb'), 'bbva')
      .appendField(new Blockly.FieldLabelSerializable(' to Bollinger Bands   '), 'tbbl')
      .appendField(new Blockly.FieldDropdown([
        ['option', 'OPTIONNAME'],
        ['option', 'OPTIONNAME'],
        ['option', 'OPTIONNAME']
      ]), 'bbdd');
    this.appendStatementInput('bbs');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Bollinger_Bands__BB_: Bollinger_Bands__BB_});

python.pythonGenerator.forBlock['Bollinger_Bands__BB_'] = function(block, generator) {
  const variable_bbva = generator.nameDB_.getName(block.getFieldValue('bbva'), Blockly.VARIABLE_CATEGORY_NAME);
  const dropdown_bbdd = block.getFieldValue('bbdd'); // .trim();
  const statement_bbs = python.pythonGenerator.statementToCode(block, 'bbs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for bb_block\ndef ${variable_bbva}_block(${dropdown_bbdd}):\n${statement_bbs}\n  variables = locals().copy()\n  return variables\n${variable_bbva} = ${variable_bbva}_block(${dropdown_bbdd})\nprint("executed ${variable_bbva}:", ${variable_bbva})`;

  return code;
}

const Bollinger_Bands_Array__BBA_ = {
  init: function() {
    this.appendDummyInput('bba')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'bbal')
      .appendField(new Blockly.FieldVariable('bba'), 'bba')
      .appendField(new Blockly.FieldLabelSerializable(' to Bollinger Bands Array   '), 'tbbal')
      .appendField(new Blockly.FieldDropdown([
        ['option', 'OPTIONNAME'],
        ['option', 'OPTIONNAME'],
        ['option', 'OPTIONNAME']
      ]), 'bbadd');
    this.appendStatementInput('bbas');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Bollinger_Bands_Array__BBA_: Bollinger_Bands_Array__BBA_});

python.pythonGenerator.forBlock['Bollinger_Bands_Array__BBA_'] = function(block, generator) {
  const variable_bbava = generator.nameDB_.getName(block.getFieldValue('bbava'), Blockly.VARIABLE_CATEGORY_NAME);
  const dropdown_bbadd = block.getFieldValue('bbadd'); // .trim();
  const statement_bbas = python.pythonGenerator.statementToCode(block, 'bbas');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for bb_block\ndef ${variable_bbava}_block(${dropdown_bbadd}):\n${statement_bbas}\n  variables = locals().copy()\n  return variables\n${variable_bbava} = ${variable_bbava}_block(${dropdown_bbadd})\nprint("executed ${variable_bbava}:", ${variable_bbava})`;

  return code;
}

const Exponential_Moving_Average__EMA_ = {
  init: function() {
    this.appendDummyInput('emad')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('ema'), 'emava')
      .appendField(new Blockly.FieldLabelSerializable(' to Exponential Moving Average   '), 'tmal');
    this.appendStatementInput('emas');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Exponential_Moving_Average__EMA_: Exponential_Moving_Average__EMA_});

python.pythonGenerator.forBlock['Exponential_Moving_Average__EMA_'] = function(block, generator) {
    const variable_emava = generator.nameDB_.getName(block.getFieldValue('emava'), Blockly.VARIABLE_CATEGORY_NAME);

  const statement_emas = python.pythonGenerator.statementToCode(block, 'emas');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for ema_block\ndef ${variable_emava}_block():\n${statement_emas}\n  variables = locals().copy()\n  return variables\n${variable_emava} = ${variable_emava}_block()\nprint("executed ${variable_emava}:", ${variable_emava})`;
  return code;
}

const Exponential_Moving_Average_Array__EMAA_ = {
  init: function() {
    this.appendDummyInput('emaa')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'emaal')
      .appendField(new Blockly.FieldVariable('emaa'), 'emaa')
      .appendField(new Blockly.FieldLabelSerializable(' to Exponential Moving Average Array   '), 'NAME');
    this.appendStatementInput('emaas');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Exponential_Moving_Average_Array__EMAA_: Exponential_Moving_Average_Array__EMAA_});

python.pythonGenerator.forBlock['Exponential_Moving_Average_Array__EMAA_'] = function(block, generator) {
    const variable_emaava = generator.nameDB_.getName(block.getFieldValue('emaava'), Blockly.VARIABLE_CATEGORY_NAME);

  const statement_emaas = python.pythonGenerator.statementToCode(block, 'emaas');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for emaa_block\ndef ${variable_emaava}_block():\n${statement_emaas}\n  variables = locals().copy()\n  return variables\n${variable_emaava} = ${variable_emaava}_block()\nprint("executed ${variable_emaava}:", ${variable_emaava})`;
  return code;
}

const Relative_Strength_Index__RSI_ = {
  init: function() {
    this.appendDummyInput('rsid')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('rsi'), 'rsiva')
      .appendField(new Blockly.FieldLabelSerializable(' to Relative Strength Index  '), 'trsil');
    this.appendStatementInput('rsis');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Relative_Strength_Index__RSI_: Relative_Strength_Index__RSI_});

python.pythonGenerator.forBlock['Relative_Strength_Index__RSI_'] = function(block, generator) {
    const variable_rsiva = generator.nameDB_.getName(block.getFieldValue('rsiva'), Blockly.VARIABLE_CATEGORY_NAME);

  const statement_rsis = python.pythonGenerator.statementToCode(block, 'rsis');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for rsi_block\ndef ${variable_rsiva}_block():\n${statement_rsis}\n  variables = locals().copy()\n  return variables\n${variable_rsiva} = ${variable_rsiva}_block()\nprint("executed ${variable_rsiva}:", ${variable_rsiva})`;
  return code;
}
const Relative_Strength_Index_Array__RSIA_ = {
  init: function() {
    this.appendDummyInput('rsiad')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('rsia'), 'rsiava')
      .appendField(new Blockly.FieldLabelSerializable(' to Relative Strength Index Array  '), 'trsial');
    this.appendStatementInput('rsias');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Relative_Strength_Index_Array__RSIA_: Relative_Strength_Index_Array__RSIA_});

python.pythonGenerator.forBlock['Relative_Strength_Index_Array__RSIA_'] = function(block, generator) {
    const variable_rsiava = generator.nameDB_.getName(block.getFieldValue('rsiava'), Blockly.VARIABLE_CATEGORY_NAME);

  const statement_rsias = python.pythonGenerator.statementToCode(block, 'rsias');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for rsia_block\ndef ${variable_rsiava}_block():\n${statement_rsias}\n  variables = locals().copy()\n  return variables\n${variable_rsiava} = ${variable_rsiava}_block()\nprint("executed ${variable_rsiava}:", ${variable_rsiava})`;
  return code;
}


const Moving_Average_Convergence_Divergence = {
  init: function() {
    this.appendDummyInput('macdad')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('MACD'), 'macdva')
      .appendField(new Blockly.FieldLabelSerializable(' to MACD Array  '), 'tmacdal')
      .appendField(new Blockly.FieldDropdown([
        ['option', 'OPTIONNAME'],
        ['option', 'OPTIONNAME'],
        ['option', 'OPTIONNAME']
      ]), 'macddd');
    this.appendStatementInput('macds');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Moving_Average_Convergence_Divergence: Moving_Average_Convergence_Divergence});

python.pythonGenerator.forBlock['Moving_Average_Convergence_Divergence'] = function(block, generator) {
  const variable_macdva = generator.nameDB_.getName(block.getFieldValue('macdva'), Blockly.VARIABLE_CATEGORY_NAME);
  const dropdown_macddd = block.getFieldValue('macddd'); // .trim();
  const statement_macds = python.pythonGenerator.statementToCode(block, 'macds');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for macda_block\ndef ${variable_macdva}_block(${dropdown_macddd}):\n${statement_macds}\n  variables = locals().copy()\n  return variables\n${variable_macdva} = ${variable_macdva}_block(${dropdown_macddd})\nprint("executed ${variable_macdva}:", ${variable_macdva})`;
  return code;
}

const input_List = {
  init: function() {
    this.appendValueInput('ilv')
      .appendField(new Blockly.FieldLabelSerializable(' Input List '), 'ill');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({input_List: input_List});

python.pythonGenerator.forBlock['input_List'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_ilv = python.pythonGenerator.valueToCode(block, 'ilv', python.Order.ATOMIC);
  const value_ill = block.getFieldValue('ill');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\ninput_List = ${value_ilv}
`;
  return code;
}

const Period_ = {
  init: function() {
    this.appendDummyInput('pd')
      .appendField(new Blockly.FieldLabelSerializable(' Period '), 'pl')
      .appendField(new Blockly.FieldNumber(0), 'pv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Period_: Period_});

python.pythonGenerator.forBlock['Period_'] = function(block) {
  const period = block.getFieldValue('pv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nperiod = ${period}
`;
  return code;
}

const sdum = {
  init: function() {
    this.appendDummyInput('sdumd')
      .appendField(new Blockly.FieldLabelSerializable(' Standard Deviation Up Multiplier '), 'sduml')
      .appendField(new Blockly.FieldNumber(0), 'sdumv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({sdum: sdum});

python.pythonGenerator.forBlock['sdum'] = function() {
  const number_sdumv = block.getFieldValue('sdumv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsdumv = ${number_sdumv}
`;
  return code;
}

const sddm = {
  init: function() {
    this.appendDummyInput('sddmd')
      .appendField(new Blockly.FieldLabelSerializable(' Standard Deviation Down Multiplier '), 'sddml')
      .appendField(new Blockly.FieldNumber(0), 'sddmv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({sddm: sddm});

python.pythonGenerator.forBlock['sddm'] = function() {
  const number_sddmv = block.getFieldValue('sddmv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  //const code = '...';
const code = `
\nsddmv = ${number_sddmv}
`;
  return code;
}

const femap = {
  init: function() {
    this.appendDummyInput('femapd')
      .appendField(new Blockly.FieldLabelSerializable(' Fast EMA Period '), 'femapl')
      .appendField(new Blockly.FieldNumber(0), 'femapv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({femap: femap});

python.pythonGenerator.forBlock['femap'] = function() {
  const number_femapv = block.getFieldValue('femapv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  //const code = '...';
const code = `
\nfemapv = ${number_femapv}
`;
  return code;
}

const semap = {
  init: function() {
    this.appendDummyInput('semapd')
      .appendField(new Blockly.FieldLabelSerializable(' Slow EMA Period '), 'semapl')
      .appendField(new Blockly.FieldNumber(0), 'semapv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({semap: semap});

python.pythonGenerator.forBlock['semap'] = function() {
  const number_semapv = block.getFieldValue('semapv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsemapv = ${number_semapv}
`;
  return code;
}

const siemap = {
  init: function() {
    this.appendDummyInput('siemapd')
      .appendField(new Blockly.FieldLabelSerializable(' Signal EMA Period '), 'siemapl')
      .appendField(new Blockly.FieldNumber(0), 'siemapv');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({siemap: siemap});

python.pythonGenerator.forBlock['siemap'] = function() {
  const number_siemapv = block.getFieldValue('siemapv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsiemapv = ${number_siemapv}
`;
  return code;
}

const Run_on_every_tick = {
  init: function() {
    this.appendDummyInput('roetd')
      .appendField(new Blockly.FieldLabelSerializable('The content of this block is called on every tick '), 'roetl');
    this.appendStatementInput('roets');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({Run_on_every_tick: Run_on_every_tick});

python.pythonGenerator.forBlock['Run_on_every_tick'] = function(block) {
  const statement_roets = generator.statementToCode(block, 'roets');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
# Python code for Run_on_every_tick_block\ndef Run_on_every_tick_block():\n${statement_roets}\n  variables = locals().copy()\n  return variables\nvariables = Run_on_every_tick_block()\nprint("executed roets1:", variables)

`;
  return code;
}

const Last_tick = {
  init: function() {
    this.appendDummyInput('ltd')
      .appendField(new Blockly.FieldLabelSerializable('Last Tick '), 'ltl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Last_tick: Last_tick});

python.pythonGenerator.forBlock['Last_tick'] = function(block) {
  const ltl = block.getFieldValue('ltl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  // TODO: Change Order.NONE to the correct operator precedence strength
const code = `
\n${ltl} = last_tick
`;
  return [code, python.Order.NONE];
}

const Last_Digit = {
  init: function() {
    this.appendDummyInput('ldd')
      .appendField(new Blockly.FieldLabelSerializable('Last Digit '), 'ldl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Last_Digit: Last_Digit});

python.pythonGenerator.forBlock['Last_Digit'] = function(block) {
  const ldl = block.getFieldValue('ldl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  // TODO: Change Order.NONE to the correct operator precedence strength
const code = `
\n${ldl} = last_digit
`;
  return [code, python.Order.NONE];
}

const Current_Stat = {
  init: function() {
    this.appendDummyInput('csd')
      .appendField(new Blockly.FieldLabelSerializable('Current Stat'), 'csl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Current_Stat: Current_Stat});

python.pythonGenerator.forBlock['Current_Stat'] = function(block) {
  const csl = block.getFieldValue('csl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n${csl} = Current_Stat
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Current_stat_list = {
  init: function() {
    this.appendDummyInput('csld')
      .appendField(new Blockly.FieldLabelSerializable('Current stat list'), 'csll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Current_stat_list: Current_stat_list});

python.pythonGenerator.forBlock['Current_stat_list'] = function(block) {
  const csll = block.getFieldValue('csll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n${csll} = Current_stat_list
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Tick_list = {
  init: function() {
    this.appendDummyInput('tld')
      .appendField(new Blockly.FieldLabelSerializable('Tick list '), 'tll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Tick_list: Tick_list});

python.pythonGenerator.forBlock['Tick_list'] = function(block, generator) {
  const tll = block.getFieldValue('tll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
Tick_list
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Last_Digits_List = {
  init: function() {
    this.appendDummyInput('ldld')
      .appendField(new Blockly.FieldLabelSerializable('Last Digits List '), 'ldll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Last_Digits_List: Last_Digits_List});

python.pythonGenerator.forBlock['Last_Digits_List'] = function() {
  const csl = block.getFieldValue('ldll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n${ldll} = Last_Digits_List
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Market_direction = {
  init: function() {
    this.appendDummyInput('mdd')
      .appendField(new Blockly.FieldLabelSerializable('Direction is'), 'dil')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'mdddd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Market_direction: Market_direction});

python.pythonGenerator.forBlock['Market_direction'] = function() {
  const dropdown_mdddd = block.getFieldValue('mdddd');
  const dil = block.getFieldValue('dil');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n${dil}  = ${dropdown_mmddd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}


const Is_candle_black_ = {
  init: function() {
    this.appendValueInput('icbv')
      .appendField(new Blockly.FieldLabelSerializable('Is candle '), 'icl');
    this.appendEndRowInput('icber')
      .appendField(new Blockly.FieldLabelSerializable(' black? '), 'bl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Is_candle_black_: Is_candle_black_});

python.pythonGenerator.forBlock['Is_candle_black_'] = function(block) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_icbv = python.pythonGenerator.valueToCode(block, 'icbv', python.Order.ATOMIC);
  const csl = block.getFieldValue('csl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n${value_icbv}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Read_candle_value__1_ = {
  init: function() {
    this.appendDummyInput('iclrv')
      .appendField(new Blockly.FieldLabelSerializable('In candles list read '), 'iclrl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'iclrdd')
      .appendField(new Blockly.FieldLabelSerializable('  # from end  '), '#fel')
      .appendField(new Blockly.FieldNumber(0), '#fev')
      .appendField(new Blockly.FieldLabelSerializable(' with interval: '), 'wil')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'widd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Read_candle_value__1_: Read_candle_value__1_});

python.pythonGenerator.forBlock['Read_candle_value__1_'] = function() {
  const dropdown_iclrdd = block.getFieldValue('iclrdd');
  const number_fev = block.getFieldValue('#fev');
  const dropdown_widd = block.getFieldValue('widd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\niclrdd  = ${dropdown_iclrdd}\nfev  = ${number_fev}\nwidd  = ${dropdown_widd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Read_candle_value__2_ = {
  init: function() {
    this.appendValueInput('rcvd')
      .appendField(new Blockly.FieldLabelSerializable('Read '), 'rl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'rldd')
      .appendField(new Blockly.FieldLabelSerializable(' value in candle '), 'vicl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Read_candle_value__2_: Read_candle_value__2_});

python.pythonGenerator.forBlock['Read_candle_value__2_'] = function() {
  const dropdown_rldd = block.getFieldValue('rldd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_rcvd = generator.valueToCode(block, 'rcvd', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nrldd  = ${dropdown_rldd}\nrcvd  = ${value_rcvd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Create_a_list_of_candle_values__1_ = {
  init: function() {
    this.appendDummyInput('calocv1d')
      .appendField(new Blockly.FieldLabelSerializable('Make a list of '), 'malol')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'malodd')
      .appendField(new Blockly.FieldLabelSerializable(' values in candles list with interval: '), 'viclwil')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'viclwidd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Create_a_list_of_candle_values__1_: Create_a_list_of_candle_values__1_});

python.pythonGenerator.forBlock['Create_a_list_of_candle_values__1_'] = function() {
  const dropdown_malodd = block.getFieldValue('malodd');
  const dropdown_viclwidd = block.getFieldValue('viclwidd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nmalodd  = ${dropdown_malodd}\nviclwidd  = ${dropdown_viclwidd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Create_a_list_of_candle_values__2_ = {
  init: function() {
    this.appendValueInput('calocv2d')
      .appendField(new Blockly.FieldLabelSerializable('Make a list of '), 'malol')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'malodd')
      .appendField(new Blockly.FieldLabelSerializable(' values from candles list'), 'vfcll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Create_a_list_of_candle_values__2_: Create_a_list_of_candle_values__2_});

python.pythonGenerator.forBlock['Create_a_list_of_candle_values__2_'] = function() {
  const dropdown_malodd = block.getFieldValue('malodd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_calocv2d = generator.valueToCode(block, 'calocv2d', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nmalodd  = ${dropdown_malodd}\ncalocv2d = ${value_calocv2d}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Get_candle = {
  init: function() {
    this.appendDummyInput('gcd')
      .appendField(new Blockly.FieldLabelSerializable('in candle list # get candle from end '), 'iclgcfel')
      .appendField(new Blockly.FieldNumber(0), 'iclgcfev')
      .appendField(new Blockly.FieldLabelSerializable(' with interval: '), 'wil')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'wildd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Get_candle: Get_candle});

python.pythonGenerator.forBlock['Get_candle'] = function() {
  const number_iclgcfev = block.getFieldValue('iclgcfev');
  const dropdown_wildd = block.getFieldValue('wildd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Get_candle_list = {
  init: function() {
    this.appendDummyInput('gcd')
      .appendField(new Blockly.FieldLabelSerializable('Candles List with interval here 2: '), 'clwih2l')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'clwih2dd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Get_candle_list: Get_candle_list});

python.pythonGenerator.forBlock['Get_candle_list'] = function() {
  const dropdown_clwih2dd = block.getFieldValue('clwih2dd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nclwih2dd  = ${dropdown_clwih2dd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Last_trade_result = {
  init: function() {
    this.appendDummyInput('ltrd')
      .appendField(new Blockly.FieldLabelSerializable('Result is '), 'ril')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'ridd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Last_trade_result: Last_trade_result});

python.pythonGenerator.forBlock['Last_trade_result'] = function() {
  const dropdown_ridd = block.getFieldValue('ridd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nridd  = ${dropdown_ridd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Contract_details = {
  init: function() {
    this.appendDummyInput('cdd')
      .appendField(new Blockly.FieldLabelSerializable('Contract Details: '), 'cdl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'cddd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Contract_details: Contract_details});

python.pythonGenerator.forBlock['Contract_details'] = function() {
  const dropdown_cddd = block.getFieldValue('cddd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ncddd  = ${dropdown_cddd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Profit_loss_from_selling = {
  init: function() {
    this.appendDummyInput('spld')
      .appendField(new Blockly.FieldLabelSerializable('Sell profit/loss '), 'spll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Profit_loss_from_selling: Profit_loss_from_selling});

python.pythonGenerator.forBlock['Profit_loss_from_selling'] = function() {
  const dropdown_spll = block.getFieldValue('spll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nspll = ${dropdown_spll}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Can_contract_be_sold_ = {
  init: function() {
    this.appendDummyInput('ccbsd')
      .appendField(new Blockly.FieldLabelSerializable('Sell is available '), 'sial');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Can_contract_be_sold_: Can_contract_be_sold_});

python.pythonGenerator.forBlock['Can_contract_be_sold_'] = function() {

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Potential_payout = {
  init: function() {
    this.appendDummyInput('ppd')
      .appendField(new Blockly.FieldLabelSerializable('payout '), 'pl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'pdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Potential_payout: Potential_payout});

python.pythonGenerator.forBlock['Potential_payout'] = function() {
  const dropdown_pdd = block.getFieldValue('pdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Purchase_price = {
  init: function() {
    this.appendDummyInput('pupd')
      .appendField(new Blockly.FieldLabelSerializable('Ask price '), 'apl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'apdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Purchase_price: Purchase_price});

python.pythonGenerator.forBlock['Purchase_price'] = function() {
  const dropdown_apdd = block.getFieldValue('apdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Account_balance = {
  init: function() {
    this.appendDummyInput('abd')
      .appendField(new Blockly.FieldLabelSerializable('Balance: '), 'bl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'bldd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Account_balance: Account_balance});

python.pythonGenerator.forBlock['Account_balance'] = function() {
  const dropdown_bldd = block.getFieldValue('bldd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Total_profit_loss = {
  init: function() {
    this.appendDummyInput('tpld')
      .appendField(new Blockly.FieldLabelSerializable('Total profit/loss '), 'tpll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Total_profit_loss: Total_profit_loss});

python.pythonGenerator.forBlock['Total_profit_loss'] = function() {

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Number_of_runs = {
  init: function() {
    this.appendDummyInput('nord')
      .appendField(new Blockly.FieldLabelSerializable('Number of runs '), 'norl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Number_of_runs: Number_of_runs});

python.pythonGenerator.forBlock['Number_of_runs'] = function() {

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Function_1 = {
  init: function() {
    this.appendDummyInput('fd')
      .appendField(new Blockly.FieldLabelSerializable('Function '), 'fl')
      .appendField(new Blockly.FieldTextInput('do something'), 'dstl');
    this.appendStatementInput('fs');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Function_1: Function_1});

python.pythonGenerator.forBlock['Function_1'] = function() {
  const text_dstl = block.getFieldValue('dstl');

  const statement_fs = generator.statementToCode(block, 'fs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ndstl  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  return code;
}

const Function_that_returns_a_value = {
  init: function() {
    this.appendDummyInput('fd')
      .appendField(new Blockly.FieldLabelSerializable('Function '), 'fl')
      .appendField(new Blockly.FieldTextInput('do something2'), 'dstl');
    this.appendStatementInput('fs');
    this.appendValueInput('NAME')
      .appendField(new Blockly.FieldLabelSerializable(' return '), 'rl');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Function_that_returns_a_value: Function_that_returns_a_value});

python.pythonGenerator.forBlock['Function_that_returns_a_value'] = function() {
  const text_dstl = block.getFieldValue('dstl');

  const statement_fs = generator.statementToCode(block, 'fs');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_name = generator.valueToCode(block, 'NAME', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  return code;
}

const Conditional_return = {
  init: function() {
    this.appendValueInput('iv')
      .appendField(new Blockly.FieldLabelSerializable('if'), 'ifl');
    this.appendValueInput('rv')
      .appendField(new Blockly.FieldLabelSerializable('return'), 'rl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Conditional_return: Conditional_return});

python.pythonGenerator.forBlock['Conditional_return'] = function() {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_iv = generator.valueToCode(block, 'iv', python.Order.ATOMIC);

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_rv = generator.valueToCode(block, 'rv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niv  = ${value_iv}\nrv = ${value_rv}
`;
  return code;
}

const Custom_function = {
  init: function() {
    this.appendDummyInput('cfd')
      .appendField(new Blockly.FieldLabelSerializable('do something '), 'dl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Custom_function: Custom_function});

python.pythonGenerator.forBlock['Custom_function'] = function() {

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\niclgcfev  = ${number_iclgcfev}\nwildd = ${dropdown_wildd}
`;
  return code;
}

const Print = {
  init: function() {
    this.appendDummyInput('pd')
      .appendField(new Blockly.FieldLabelSerializable('print '), 'pl')
      .appendField(new Blockly.FieldTextInput('abc'), 'tl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Print: Print});

python.pythonGenerator.forBlock['Print'] = function() {
  const text_tl = block.getFieldValue('tl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ntl  = ${text_tl}
`;
  return code;
}

const Request_an_input = {
  init: function() {
    this.appendDummyInput('raid')
      .appendField(new Blockly.FieldLabelSerializable('prompt for '), 'pfl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'pfdd')
      .appendField(new Blockly.FieldLabelSerializable('with message '), 'wml')
      .appendField(new Blockly.FieldTextInput('abc'), 'wmtl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Request_an_input: Request_an_input});

python.pythonGenerator.forBlock['Request_an_input'] = function() {
  const dropdown_pfdd = block.getFieldValue('pfdd');
  const text_wmtl = block.getFieldValue('wmtl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\npfdd  = ${dropdown_pfdd}\nwmtl = ${text_wmtl}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Notify = {
  init: function() {
    this.appendDummyInput('nd')
      .appendField(new Blockly.FieldLabelSerializable('Notify '), 'nl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'ndd')
      .appendField(new Blockly.FieldLabelSerializable(' with sound: '), 'wsl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'wsdd')
      .appendField(new Blockly.FieldTextInput('abc'), 'tl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Notify: Notify});

python.pythonGenerator.forBlock['Notify'] = function() {
  const dropdown_ndd = block.getFieldValue('ndd');
  const dropdown_wsdd = block.getFieldValue('wsdd');
  const text_tl = block.getFieldValue('tl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nndd  = ${dropdown_ndd}\nwsdd = ${dropdown_wsdd}\ntl  = ${text_tl}
`;
  return code;
}

const Notify_Telegram = {
  init: function() {
    this.appendDummyInput('ntd')
      .appendField(new Blockly.FieldLabelSerializable('Notify Telegram Access Token: '), 'ntatl')
      .appendField(new Blockly.FieldTextInput('default'), 'ntattl')
      .appendField(new Blockly.FieldLabelSerializable(' Chart ID: '), 'cil')
      .appendField(new Blockly.FieldTextInput('default'), 'citl')
      .appendField(new Blockly.FieldLabelSerializable(' Message: '), 'ml')
      .appendField(new Blockly.FieldTextInput('abc'), 'mtl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Notify_Telegram: Notify_Telegram});

python.pythonGenerator.forBlock['Notify_Telegram'] = function() {
  const text_ntattl = block.getFieldValue('ntattl');
  const text_citl = block.getFieldValue('citl');
  const text_mtl = block.getFieldValue('mtl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nntattl  = ${text_ntattl}\ncitl = ${text_citl}\nmtl  = ${text_mtl}
`;
  return code;
}

const Second_Since_Epoch = {
  init: function() {
    this.appendDummyInput('ssed')
      .appendField(new Blockly.FieldLabelSerializable('Second Since Epoch '), 'ssel');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Second_Since_Epoch: Second_Since_Epoch});

python.pythonGenerator.forBlock['Second_Since_Epoch'] = function() {
  const dropdown_ssel = block.getFieldValue('ssel');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n${dropdown_ssel}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Delayed_run = {
  init: function() {
    this.appendStatementInput('drs');
    this.appendValueInput('drv')
      .appendField(new Blockly.FieldLabelSerializable('Run after '), 'ral');
    this.appendEndRowInput('drer')
      .appendField(new Blockly.FieldLabelSerializable('second(s)'), 'sl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Delayed_run: Delayed_run});

python.pythonGenerator.forBlock['Delayed_run'] = function() {
  const statement_drs = generator.statementToCode(block, 'drs');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_drv = generator.valueToCode(block, 'drv', python.Order.ATOMIC);


  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n# Python code for Delayed_run_block\ndef Delayed_run_block():\n${statement_drs}\ndrv = ${value_drv}\n  variables = locals().copy()\n  return variables\nvariables = Delayed_run_block()\nprint("executed Delayed_run:", variables)
`;
  return code;
}

const Tick_Delayed_run = {
  init: function() {
    this.appendStatementInput('tdrs');
    this.appendValueInput('tdrv')
      .appendField(new Blockly.FieldLabelSerializable('Run after '), 'tral');
    this.appendEndRowInput('tdrer')
      .appendField(new Blockly.FieldLabelSerializable('tick(s)'), 'tl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Tick_Delayed_run: Tick_Delayed_run});

python.pythonGenerator.forBlock['Tick_Delayed_run'] = function() {
  const statement_tdrs = generator.statementToCode(block, 'tdrs');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_tdrv = generator.valueToCode(block, 'tdrv', python.Order.ATOMIC);


  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n# Python code for Tick_Delayed_run_block\ndef Tick_Delayed_run_block():\n${statement_tdrs}\ntdrv = ${value_tdrv}\n  variables = locals().copy()\n  return variables\nvariables = Tick_Delayed_run_block()\nprint("executed Tick_Delayed_run:", variables)
`;
  return code;
}

const Convert_to_timestamp = {
  init: function() {
    this.appendDummyInput('cttd')
      .appendField(new Blockly.FieldLabelSerializable('To timestamp '), 'ttl')
      .appendField(new Blockly.FieldTextInput('yyyy-mm-dd hh:mm:ss'), 'tttl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Convert_to_timestamp: Convert_to_timestamp});

python.pythonGenerator.forBlock['Convert_to_timestamp'] = function() {
  const text_tttl = block.getFieldValue('tttl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ntttl  = ${text_tttl}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Convert_to_date_time = {
  init: function() {
    this.appendDummyInput('ctdtd')
      .appendField(new Blockly.FieldLabelSerializable('To date/time '), 'tdtl')
      .appendField(new Blockly.FieldNumber(0), 'tdtv');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Convert_to_date_time: Convert_to_date_time});

python.pythonGenerator.forBlock['Convert_to_date_time'] = function() {
  const number_tdtv = block.getFieldValue('tdtv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ntdtv  = ${number_tdtv}
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Loads_from_URL = {
  init: function() {
    this.appendEndRowInput('ctdtd')
      .appendField(new Blockly.FieldLabelSerializable('Load block from URL: '), 'lbful')
      .appendField(new Blockly.FieldTextInput('http://www.example.com/block.xml'), 'lbfutl');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Loads_from_URL: Loads_from_URL});

python.pythonGenerator.forBlock['Loads_from_URL'] = function() {
  const text_lbfutl = block.getFieldValue('lbfutl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nlbfutl  = ${text_lbfutl}
`;
  return code;
}

const Ignore = {
  init: function() {
    this.appendDummyInput('id')
      .appendField(new Blockly.FieldLabelSerializable('Ignore'), 'il');
    this.appendStatementInput('is');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({Ignore: Ignore});

python.pythonGenerator.forBlock['Ignore'] = function() {
  const statement_is = generator.statementToCode(block, 'is');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n# Python code for Ignore_block\ndef Ignore_block():\n${statement_is}\n  variables = locals().copy()\n  return variables\nvariables = Ignore_block()\nprint("executed Ignore:", variables)

`;
  return code;
}

const Console = {
  init: function() {
    this.appendDummyInput('cd')
      .appendField(new Blockly.FieldLabelSerializable('Console '), 'cl')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'cdd')
      .appendField(new Blockly.FieldLabelSerializable('value: '), 'vl')
      .appendField(new Blockly.FieldTextInput('abc'), 'vtl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Console: Console});

python.pythonGenerator.forBlock['Console'] = function() {
  const dropdown_cdd = block.getFieldValue('cdd');
  const text_vtl = block.getFieldValue('vtl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ncdd  = ${dropdown_cdd}\nvtl = ${text_vtl}
`;
  return code;
}





//console.log(typeof tradeParameters); // Should output "string"


const InitialBlocks = `
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="400" y="10">
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

      <block type="Purchase_conditions" x="400" y="1200">
        <statement name="Pcs">
          <block type="Purchase"></block>
        </statement>
      </block>

      <block type="Sell_conditions" x="1700" y="10">
        <statement name="Scs">
          <block type="Conditional_if">
            <value name="Ci">
              <block type="Sell_is_available"></block>
            </value>
          </block>
        </statement>
      </block>

      <block type="Restart_trading_conditions" x="1800" y="300">
        <statement name="Rtcs">
          <block type="Trade_again"></block>
        </statement>
      </block>

</xml>`;

const tradeParametersBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="10" y="40">
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
      </block>
      <block id="trade_param_2" type="Duration" x="10" y="10"></block>
      <block id="trade_param_3" type="Multiplier" x="10" y="10"></block>
      <block id="trade_param_4" type="Take_profit" x="10" y="10"></block>
      <block id="trade_param_5" type="Stop_Loss" x="10" y="10"></block>
      <block id="trade_param_6" type="Growth_Rate" x="10" y="10"></block>
      <block id="trade_param_7" type="Take_profit_a" x="10" y="10"></block>
    </xml>
`;


const purchaseConditionsBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Purchase_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="Purchase" x="10" y="10"></block>
    </xml>
`;

const sellConditionsBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Sell_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="sell_at_market_price" x="10" y="10"></block>
    </xml>
`;

const restartTradingConditionsBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Restart_trading_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="Trade_again" x="10" y="10"></block>
    </xml>
`;

const IndicatorBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="Simple_Moving_Average__SMA_" x="10" y="70">
        <statement name="smas">
          <block type="input_List">
            <next>
              <block type="Period_"></block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Simple_Moving_Average_Array__SMAA_" x="10" y="70">
        <statement name="smaas">
          <block type="input_List">
            <next>
              <block type="Period_"></block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Bollinger_Bands__BB_" x="10" y="70">
        <statement name="bbs">
          <block type="input_List">
            <next>
              <block type="Period_">
                <next>
                  <block type="sdum">
                    <next>
                      <block type="sddm"></block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Bollinger_Bands_Array__BBA_" x="10" y="70">
        <statement name="bbas">
          <block type="input_List">
            <next>
              <block type="Period_">
                <next>
                  <block type="sdum">
                    <next>
                      <block type="sddm"></block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Exponential_Moving_Average__EMA_" x="10" y="70">
        <statement name="emas">
          <block type="input_List">
            <next>
              <block type="Period_"></block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Exponential_Moving_Average_Array__EMAA_" x="10" y="70">
        <statement name="emaas">
          <block type="input_List">
            <next>
              <block type="Period_"></block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Relative_Strength_Index__RSI_" x="10" y="70">
        <statement name="rsis">
          <block type="input_List">
            <next>
              <block type="Period_"></block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Relative_Strength_Index_Array__RSIA_" x="10" y="70">
        <statement name="rsias">
          <block type="input_List">
            <next>
              <block type="Period_"></block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Moving_Average_Convergence_Divergence" x="10" y="70">
        <statement name="macdas">
          <block type="input_List">
            <next>
              <block type="femap">
                <next>
                  <block type="semap">
                    <next>
                      <block type="siemap"></block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>
`;

const TickandcandleanalysisBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Run_on_every_tick" x="10" y="1550"></block>
      <block id="trade_param_3" type="Last_tick" x="10" y="650"></block>
      <block id="trade_param_4" type="Last_Digit" x="10" y="950"></block>
      <block id="trade_param_5" type="Current_Stat" x="10" y="1050"></block>
      <block id="trade_param_6" type="Current_stat_list" x="10" y="1150"></block>
      <block id="trade_param_7" type="Tick_list" x="10" y="1550"></block>
      <block id="trade_param_7" type="Last_Digits_List" x="10" y="1550"></block>
      <block id="trade_param_7" type="Market_direction" x="10" y="1550"></block>
      <block id="trade_param_7" type="Is_candle_black_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Read_candle_value__1_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Read_candle_value__2_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Create_a_list_of_candle_values__1_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Create_a_list_of_candle_values__2_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Get_candle" x="10" y="1550"></block>
      <block id="trade_param_7" type="Get_candle_list" x="10" y="1550"></block>
    </xml>
`;

const ContractBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Last_trade_result" x="10" y="1550"></block>
      <block id="trade_param_3" type="Contract_details" x="10" y="650"></block>
      <block id="trade_param_4" type="Profit_loss_from_selling" x="10" y="950"></block>
      <block id="trade_param_5" type="Can_contract_be_sold_" x="10" y="1050"></block>
      <block id="trade_param_6" type="Potential_payout" x="10" y="1150"></block>
      <block id="trade_param_7" type="Purchase_price" x="10" y="1550"></block>
    </xml>
`;

const StartsBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Account_balance" x="10" y="1550"></block>
      <block id="trade_param_3" type="Total_profit_loss" x="10" y="650"></block>
      <block id="trade_param_4" type="Number_of_runs" x="10" y="950"></block>
    </xml>
`;

const CustomFunctionsBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Function_1" x="10" y="1550"></block>
      <block id="trade_param_3" type="Function_that_returns_a_value" x="10" y="650"></block>
      <block id="trade_param_4" type="Conditional_return" x="10" y="950"></block>
    </xml>
`;

const NotificationsBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Print" x="10" y="1550"></block>
      <block id="trade_param_3" type="Request_an_input" x="10" y="650"></block>
      <block id="trade_param_4" type="Notify" x="10" y="950"></block>
      <block id="trade_param_5" type="Notify_Telegram" x="10" y="1050"></block>
    </xml>
`;

const TimeBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="Second_Since_Epoch" x="10" y="1550"></block>
      <block id="trade_param_3" type="Delayed_run" x="10" y="650"></block>
      <block id="trade_param_4" type="Tick_Delayed_run" x="10" y="950"></block>
      <block id="trade_param_5" type="Convert_to_timestamp" x="10" y="1050"></block>
      <block id="trade_param_6" type="Convert_to_date_time" x="10" y="1150"></block>
    </xml>
`;

const MathBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="m1" type="math_number" x="10" y="20"></block>
  <block id="m2" type="math_arithmetic" x="10" y="70">
    <field name="OP">ADD</field>  <!-- Sets the arithmetic operator to 'ADD' (can be changed to other operators like 'SUBTRACT', etc.) -->
    <value name="A">  <!-- First number input -->
      <block type="math_number">
        <field name="NUM">5</field>  <!-- First number value -->
      </block>
    </value>
    <value name="B">  <!-- Second number input -->
      <block type="math_number">
        <field name="NUM">3</field>  <!-- Second number value -->
      </block>
    </value>
  </block>

  <block id="m3" type="math_single" x="10" y="120">
    <field name="OP">ROOT</field>  <!-- Sets the operator to 'ROOT' (square root) -->
    <value name="NUM">  <!-- Input number for the operation -->
      <block type="math_number">
        <field name="NUM">9</field>  <!-- The input number, changeable -->
      </block>
    </value>
  </block>

  <block id="m4" type="math_trig" x="10" y="170">
    <field name="OP">SIN</field>  <!-- Set the trigonometric operation to sine (SIN) -->
    <value name="NUM">  <!-- Input number for the trigonometric operation -->
      <block type="math_number">
        <field name="NUM">45</field>  <!-- The input number, for example, 45 degrees -->
      </block>
    </value>
  </block>

  <block id="m5" type="math_constant" x="10" y="220"></block>
  <block id="m6" type="math_number_property" x="10" y="270">
    <field name="PROPERTY">EVEN</field>
    <value name="NUMBER_TO_CHECK">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
  </block>

  <block type="variables_change" id="m12" x="10" y="10">
    <field name="VAR">item</field>  <!-- The variable to change -->
    <field name="DELTA">1</field>  <!-- The number to change the variable by -->
  </block>

  <block type="aggregate_operations" id="agg1" x="10" y="20">
    <field name="AGGREGATE_OP">SUM</field>
  </block>

  <block id="m7" type="math_round" x="10" y="320">
    <field name="OP">ROUND</field>  <!-- Default rounding mode is 'ROUND', can also be 'ROUNDUP', 'ROUNDDOWN' -->
    <value name="NUM">  <!-- The number input field for rounding -->
      <block type="math_number">
        <field name="NUM">0</field>  <!-- Default number to round (changeable) -->
      </block>
    </value>
  </block>

  <block id="m8" type="math_modulo" x="10" y="370">
    <value name="DIVIDEND">  <!-- First number (dividend) -->
      <block type="math_number">
        <field name="NUM">10</field>  <!-- Default dividend value -->
      </block>
    </value>
    <value name="DIVISOR">  <!-- Second number (divisor) -->
      <block type="math_number">
        <field name="NUM">3</field>  <!-- Default divisor value -->
      </block>
    </value>
  </block>

  <block id="m9" type="math_constrain" x="10" y="420"></block>

  <block id="m10" type="math_random_int" x="10" y="470">
    <value name="FROM">  <!-- Input for the minimum value -->
      <block type="math_number">
        <field name="NUM">1</field>  <!-- Default minimum value -->
      </block>
    </value>
    <value name="TO">  <!-- Input for the maximum value -->
      <block type="math_number">
        <field name="NUM">100</field>  <!-- Default maximum value -->
      </block>
    </value>
  </block>

  <block id="m11" type="math_random_float" x="10" y="520"></block>
</xml>`;

const TextBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="dummy_text_block" id="textBlock1" x="10" y="10">
    <field name="TEXT">abc</field>  <!-- Editable text field -->
  </block>

  <block type="variables_set" id="setVarBlock" x="10" y="10">
    <field name="VAR">text</field>  <!-- Variable field for selecting the variable -->
    <value name="VALUE">  <!-- Value input placeholder -->
      <block type="text_join" id="textJoinBlock" x="10" y="70">
        <value name="ADD0">
          <block type="dummy_text_block" id="textBlock1" x="10" y="10">
            <field name="TEXT">abc</field>  <!-- Editable text field -->
          </block>
        </value>
      </block>
    </value>
  </block>

  <block type="text_append" id="textAppendBlock" x="10" y="10">
    <field name="VAR">text</field>  <!-- Variable to which text will be appended -->
    <value name="TEXT">
      <block type="dummy_text_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">abc</field>  <!-- Editable text field -->
      </block>
    </value>
  </block>

  <block id="te3" type="text_length" x="10" y="120"></block>

  <block id="custom_text_block" type="text_value_block" x="45" y="10">
    <value name="TEXT">
      <block id="te4" type="text_isEmpty" x="10" y="170"></block>
    </value>
  </block>


  <block id="te5" type="Search_for_string" x="10" y="220"></block>

  <block id="te5" type="text_charAt" x="10" y="250"></block>

  <block type="text_getSubstring" id="getSubstringBlock" x="10" y="10">
    <mutation at1="true" at2="true"></mutation>
    <value name="STRING">
      <block type="variables_get">
        <field name="VAR">text</field>  <!-- Variable field to get the string -->
      </block>
    </value>
    <value name="AT1">
      <block type="math_number">
        <field name="NUM">0</field>  <!-- Start index -->
      </block>
    </value>
    <value name="AT2">
      <block type="math_number">
        <field name="NUM">2</field>  <!-- End index -->
      </block>
    </value>
  </block>

  <block id="te6" type="text_changeCase" x="10" y="270">
    <value name="TEXT">
      <block type="dummy_text_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">abc</field>  <!-- Editable text field -->
      </block>
    </value>
  </block>

  <block id="te7" type="text_trim" x="10" y="320">
    <value name="TEXT">
      <block type="dummy_text_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">abc</field>  <!-- Editable text field -->
      </block>
    </value>
  </block>
</xml>`;


const LogicBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="l6" type="controls_if" x="10" y="20"></block>
  <block id="l1" type="logic_compare" x="10" y="70"></block>
  <block id="l3" type="logic_operation" x="10" y="120"></block>
  <block id="l4" type="logic_negate" x="10" y="170"></block>
  <block id="l2" type="logic_boolean" x="10" y="70"></block>
  <block type="logic_null" id="nullBlock" x="10" y="10"></block>
  <block id="l7" type="logic_ternary" x="10" y="320"></block>
</xml>`;


const ListsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="variables_set" id="setVarBlock" x="10" y="10">
    <field name="VAR">list</field>  <!-- Variable field for selecting the variable -->
    <value name="VALUE">  <!-- Value input placeholder -->
      <block type="lists_create_with" id="lists_create_with_block" x="10" y="70"></block>
    </value>
  </block>

  <block type="lists_repeat" id="repeatItemBlock" x="10" y="10">
    <value name="NUM">
      <block type="math_number">
        <field name="NUM">5</field>  <!-- Repeat 4 times -->
      </block>
    </value>
  </block>

  <block id="li5" type="lists_length" x="10" y="220"></block>

  <block type="custom_list_check" id="listCheckBlock" x="10" y="290">
    <value name="LIST">
      <block id="li7" type="lists_isEmpty" x="10" y="320"></block>  <!-- The lists_isEmpty block -->
    </value>
  </block>

  <block type="lists_indexOf" id="indexOfVarBlock" x="10" y="470"></block>

  <block id="li3" type="lists_getIndex" x="10" y="20"></block>

  <block id="li4" type="lists_setIndex" x="10" y="570"></block>

  <block type="lists_getSublist" id="getSublistBlock" x="10" y="460"></block>

  <block type="lists_split" id="splitListBlock" x="10" y="510">
    <mutation mode="SPLIT"></mutation>
    <value name="DELIM">
      <block type="dummy_coma_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">,</field>
      </block>
    </value>
  </block>

  <block id="li8" type="lists_sort" x="10" y="570"></block>

</xml>`;


const LoopsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">

  <block type="controls_repeat_ext" id="lo1" x="10" y="520">
    <value name="TIMES">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
  </block>

  <block id="lo1" type="controls_repeat_ext" x="10" y="20"></block>

  <block id="lo2" type="controls_whileUntil" x="10" y="70"></block>

  <block id="lo3" type="controls_for" x="10" y="120"></block>

  <block id="lo4" type="controls_forEach" x="10" y="170"></block>

  <block id="lo5" type="controls_flow_statements" x="10" y="220"></block>
</xml>`;

const MiscellaneousBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="mi1" type="Loads_from_URL" x="10" y="20"></block>
  <block id="mi2" type="Ignore" x="10" y="70"></block>

  <block id="mi3" type="Console" x="10" y="520">
    <value name="console_">
      <block type="dummy_text_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">abc</field>  <!-- Editable text field with "abc" -->
      </block>
    </value>
  </block>

</xml>`;
