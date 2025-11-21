/*
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

console.log(typeof tradeParameters); // Should output "string"


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

const IndicatorBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="10" y="70">
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
      <block id="trade_param_2" type="Conditional_if" x="10" y="550"></block>
      <block id="trade_param_2" type="Duration" x="10" y="1550"></block>
      <block id="trade_param_3" type="Multiplier" x="10" y="650"></block>
      <block id="trade_param_4" type="Take_profit" x="10" y="950"></block>
      <block id="trade_param_5" type="Stop_Loss" x="10" y="1050"></block>
      <block id="trade_param_6" type="Growth_Rate" x="10" y="1150"></block>
      <block id="trade_param_7" type="Take_profit_a" x="10" y="1550"></block>
      <block id="trade_param_7" type="Trade_again" x="10" y="10"></block>

    </xml>
`;
*/
/*
const tradeParametersBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block id="trade_param_2" type="tradeparameters" x="10" y="420"></block>
      <block id="trade_param_2" type="market" x="10" y="90"></block>
      <block id="trade_param_2" type="Trade_Type" x="10" y="20"></block>
      <block id="trade_param_2" type="Contract_Type" x="10" y="120"></block>
      <block id="trade_param_2" type="Default_Candle_Interval" x="10" y="170"></block>
    </xml>
`;
*/