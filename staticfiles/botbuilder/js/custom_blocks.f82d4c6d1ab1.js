const tradeparameters = {
  init: function() {
    this.appendDummyInput('tpd')
      .appendField(new Blockly.FieldLabelSerializable('1.Trade parameters                 '), 'tpl');
    this.appendStatementInput('tp');
    this.appendDummyInput('rod')
      .appendField(new Blockly.FieldLabelSerializable('Run once at start:                                                     '), 'roatl');
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
          ['  ', 'OPTIONNAME'],
        ]), 'mkts')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'sbmktsl:')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
        ]), 'sbmkts')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'smbl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
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
          ['  ', 'OPTIONNAME'],
        ]), 'tt1')
      .appendField(new Blockly.FieldLabelSerializable('>'), 'value:')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
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
          ['  ', 'OPTIONNAME'],
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

const Durationn = {
  init: function() {
    this.appendValueInput('drv')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'drd');
    this.appendValueInput('st')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'lst');
    this.appendEndRowInput('NAME')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000)'), 'lstl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Durationn: Durationn});

python.pythonGenerator.forBlock['Durationn'] = function(block, generator) {
  const dropdown_drd = block.getFieldValue('drd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_drv = python.pythonGenerator.valueToCode(block, 'drv', python.Order.ATOMIC);
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_st = python.pythonGenerator.valueToCode(block, 'st', python.Order.ATOMIC);
  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\ndrdd = "${dropdown_drd}"\ndrv = ${value_drv}\nstake = ${value_st}
`;
  return code;
}


const Duration = {
  init: function() {
    this.appendDummyInput('dr')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
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
\ndrdd = "${dropdown_drd}"\ndrv = ${dropdown_drv}\nstake = ${dropdown_st}
`;
  return code;
}

const Multiplierr = {
  init: function() {
    this.appendValueInput('stv')
      .appendField(new Blockly.FieldLabelSerializable('Multiplier:'), 'mtl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'mvdd')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'stul');
    this.appendStatementInput('mts');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Multiplierr: Multiplierr});

python.pythonGenerator.forBlock['Multiplierr'] = function(block, generator) {
  const dropdown_mvdd = block.getFieldValue('mvdd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_stv = python.pythonGenerator.valueToCode(block, 'stv', python.Order.ATOMIC);

  const statement_mts = python.pythonGenerator.statementToCode(block, 'mts');
  //const code = '...';
    const code = `\n# Python code for Multiplier_block\ndef Multiplier_block(${value_stv}, ${dropdown_mvdd}):\n${statement_mts}\n  variables = locals().copy()\n  return variables\nMultiplier = Multiplier_block(${value_stv}, ${dropdown_mvdd})\nprint("executed Multiplier:", Multiplier)`;
  return code;
}

const Multiplier = {
  init: function() {
    this.appendDummyInput('md')
      .appendField(new Blockly.FieldLabelSerializable('Multiplier:'), 'mtl')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'mvdd')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stul')
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
  const dropdown_mvdd = block.getFieldValue('mvdd');
  const number_stv = block.getFieldValue('stv');
  const mtl = block.getFieldValue('mtl');

  const statement_mts = python.pythonGenerator.statementToCode(block, 'mts');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for ${mtl}_block\ndef ${mtl}_block(${number_stv}, ${dropdown_mvdd}):\n${statement_mts}\n  variables = locals().copy()\n  return variables\n${mtl} = ${mtl}_block(${dropdown_bbadd}, ${dropdown_mvdd})\nprint("executed ${mtl}:", ${mtl})`;

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
\nTake_profit = ${dropdown_tpmv}
`;
  return code;
}

const Take_profitt = {
  init: function() {
    this.appendValueInput('tpmv')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpml');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profitt: Take_profitt});

python.pythonGenerator.forBlock['Take_profitt'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_tpmv = python.pythonGenerator.valueToCode(block, 'tpmv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nTake_profit = ${value_tpmv}
`;
  return code;
}

const Stop_Loss = {
  init: function() {
    this.appendDummyInput('slmd')
      .appendField(new Blockly.FieldLabelSerializable('Stop Loss : USD'), 'slml')
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

python.pythonGenerator.forBlock['Stop_Loss'] = function(block) {
  const number_slv = block.getFieldValue('slv');

  // TODO: Assemble python into the code variable.
  //const code = '...'number_slv;
  const code = `
\nStop_Loss = ${number_slv}
`;
  return code;
}

const Stop_Losss = {
  init: function() {
    this.appendValueInput('slv')
      .appendField(new Blockly.FieldLabelSerializable('Stop Loss : USD'), 'slml');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Stop_Losss: Stop_Losss});

python.pythonGenerator.forBlock['Stop_Losss'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_slv = python.pythonGenerator.valueToCode(block, 'slv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nStop_Loss = ${value_slv}
`;
  return code;
}

const Growth_Rate = {
  init: function() {
    this.appendDummyInput('Grd')
      .appendField(new Blockly.FieldLabelSerializable('Growth Rate:'), 'grl')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'grvdd')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD'), 'stul')
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
  const dropdown_grvdd = block.getFieldValue('grvdd');
  const number_stv = block.getFieldValue('stv');

  const statement_grs = python.pythonGenerator.statementToCode(block, 'grs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for Growth_Rate_block\ndef Growth_Rate_block(${number_stv}, ${dropdown_grvdd}):\n${statement_grs}\n  variables = locals().copy()\n  return variables\nGrowth_Rate = Growth_Rate_block(${number_stv}, ${dropdown_grvdd})\nprint("executed Growth_Rate:", Growth_Rate)`;

  return code;
}

const Growth_Ratee = {
  init: function() {
    this.appendValueInput('stv')
      .appendField(new Blockly.FieldLabelSerializable('Growth Rate:'), 'grl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'grvdd')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'stul');
    this.appendStatementInput('grs');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Growth_Ratee: Growth_Ratee});

python.pythonGenerator.forBlock['Growth_Ratee'] = function(block, generator) {
  const dropdown_grvdd = block.getFieldValue('grvdd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_stv = python.pythonGenerator.valueToCode(block, 'stv', python.Order.ATOMIC);

  const statement_grs = python.pythonGenerator.statementToCode(block, 'grs');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `\n# Python code for Growth_Rate_block\ndef Growth_Rate_block(${value_stv}, ${dropdown_grvdd}):\n${statement_grs}\n  variables = locals().copy()\n  return variables\nGrowth_Rate = Growth_Rate_block(${value_stv}, ${dropdown_grvdd})\nprint("executed Growth_Rate:", Growth_Rate)`;
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
\nTake_profit_a = ${dropdown_tpav}
`;
  return code;
}

const Take_profit_aa = {
  init: function() {
    this.appendValueInput('tpav')
      .appendField(new Blockly.FieldLabelSerializable('Take Profit : USD'), 'tpal');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Take_profit_aa: Take_profit_aa});

python.pythonGenerator.forBlock['Take_profit_aa'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_tpav = python.pythonGenerator.valueToCode(block, 'tpav', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nTake_profit = ${value_tpav}
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
\ndrd = "${dropdown_d1}"\ndrv = ${dropdown_dv}\nstake = ${dropdown_stv}\nbod = ${dropdown_bod}\nbov = ${dropdown_bov}
`;

  return code;
}

const Duration_TT = {
  init: function() {
    this.appendValueInput('drv')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'drd');
    this.appendValueInput('stv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'stl');
    this.appendValueInput('bov')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Barrier Offset'), 'lstl')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'bod');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Duration_TT: Duration_TT});

python.pythonGenerator.forBlock['Duration_TT'] = function(block, generator) {
  const dropdown_drd = block.getFieldValue('drd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_drv = python.pythonGenerator.valueToCode(block, 'drv', python.Order.ATOMIC);

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_stv = python.pythonGenerator.valueToCode(block, 'stv', python.Order.ATOMIC);

  const dropdown_bod = block.getFieldValue('bod');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_bov = python.pythonGenerator.valueToCode(block, 'bov', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\ndrdd = "${dropdown_drd}"\ndrv = ${value_drv}\nstake = ${value_stv}\nbod = ${dropdown_bod}\nbov = ${value_bov}
`;  return code;
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

const Duration_II = {
  init: function() {
    this.appendValueInput('drv')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'drd');
    this.appendValueInput('stv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'stl');
    this.appendValueInput('bov')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Barrier Offset'), 'lstl')
      .appendField(new Blockly.FieldDropdown([
          [' ', 'OPTIONNAME']
        ]), 'bod');
    this.appendValueInput('lbov')
      .appendField(new Blockly.FieldLabelSerializable('Low barrier Offset'), 'NAME')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'lbod');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Duration_II: Duration_II});

python.pythonGenerator.forBlock['Duration_II'] = function(block, generator) {
  const dropdown_drd = block.getFieldValue('drd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_drv = python.pythonGenerator.valueToCode(block, 'drv', python.Order.ATOMIC);

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_stv = python.pythonGenerator.valueToCode(block, 'stv', python.Order.ATOMIC);

  const dropdown_bod = block.getFieldValue('bod');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_bov = python.pythonGenerator.valueToCode(block, 'bov', python.Order.ATOMIC);

  const dropdown_lbod = block.getFieldValue('lbod');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_lbov = python.pythonGenerator.valueToCode(block, 'lbov', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\ndrdd = "${dropdown_drd}"\ndrv = ${value_drv}\nstake = ${value_stv}\nbod = "${dropdown_bod}"\nbov = ${value_bov}\nlbod = "${dropdown_lbod}"\nlbov = ${value_lbov}
`;  return code;
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
\ndrdd = "${dropdown_d1}"\ndrv = ${dropdown_dv}\nstake = ${dropdown_stv}\nbov = ${dropdown_bov}
`;

  return code;
}

const Duration_HDD = {
  init: function() {
    this.appendValueInput('drv')
      .appendField(new Blockly.FieldLabelSerializable('Duration:'), 'drl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME']
        ]), 'drd');
    this.appendValueInput('stv')
      .appendField(new Blockly.FieldLabelSerializable('Stake: USD '), 'stl');
    this.appendValueInput('bov')
      .appendField(new Blockly.FieldLabelSerializable('(min:0.35 - max:50000) Prediction:'), 'lstl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Duration_HDD: Duration_HDD});

python.pythonGenerator.forBlock['Duration_HDD'] = function(block, generator) {
  const dropdown_drd = block.getFieldValue('drd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_drv = python.pythonGenerator.valueToCode(block, 'drv', python.Order.ATOMIC);

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_stv = python.pythonGenerator.valueToCode(block, 'stv', python.Order.ATOMIC);

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_bov = python.pythonGenerator.valueToCode(block, 'bov', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\ndrdd = "${dropdown_drd}"\ndrv = ${value_drv}\nstake = ${value_stv}\nbov = ${value_bov}
`;
  return code;
}

const Purchase_conditions = {
  init: function() {
    this.appendDummyInput('Pc')
      .appendField(new Blockly.FieldLabelSerializable('2. Purchase conditions                                            '), 'Pc');
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
# Python code for Purchase_conditions_block\ndef Purchase_conditions block():\n  Pdd = None\n${statement_Pcs}\n  variables = locals().copy()\n  return variables\nvariables = Purchase_conditions_block()\nprint("executed Pcs1:", variables)

`;
  return code;
}

const Sell_conditions = {
  init: function() {
    this.appendDummyInput('Scd')
      .appendField(new Blockly.FieldLabelSerializable('3. Sell conditions                                                     '), 'Sc');
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
# Python code for Sell_conditions_block\ndef Sell_conditions_block():\n  samp = None \n${statement_Scs}\n  variables = locals().copy()\n  return variables\nvariables = Sell_conditions_block()\nprint("executed Scs1:", variables)
`;
  return code;Scs1
}

const Restart_trading_conditions = {
  init: function() {
    this.appendDummyInput('Pc')
      .appendField(new Blockly.FieldLabelSerializable('4. Restart trading conditions                                   '), 'Rtc');
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
# Python code for Restart_trading_conditions_block\ndef Restart_trading_conditions_block():\n  Trade_again = None\n${statement_Rtcs}\n  variables = locals().copy()\n  return variables\nvariables = Restart_trading_conditions_block()\nprint("executed Rtcs1:", variables)

`;
  return code;
}

const Purchase = {
  init: function() {
    this.appendDummyInput('Pcd')
      .appendField(new Blockly.FieldLabelSerializable('Purchase'), 'Pl')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
        ]), 'Pdd');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Purchase: Purchase});

python.pythonGenerator.forBlock['Purchase'] = function(block) {
  const dropdown_Pdd = block.getFieldValue('Pdd');

  // TODO: Assemble python into the code variable.
const code = `
\nPdd = "${dropdown_Pdd}"
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
\nTrade_again = "${dropdown_Ta}"
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
\n"Sell_is_available"
`;

  return [code, python.Order.NONE];
}

const Conditional_if = {
  init: function() {
    this.appendValueInput('Ci')
      .appendField(new Blockly.FieldLabelSerializable('if'), 'if');
    this.appendEndRowInput('cier')
      .appendField(new Blockly.FieldLabelSerializable('then                                   '), 'th');
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

python.pythonGenerator.forBlock['Conditional_if'] = function(block, generator) {
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
\nsamp = "sell_at_market_price"
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

    const code = `\n${variable_smava} = """\n# Python code for sma_block\ndef ${variable_smava}_block(tick_data, maind):\n  indicator = "sma"\n  indicator_name = ["${variable_smava}"]\n${statement_smas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_smava}'] = talib.SMA(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_smava}_block(tick_data, maind)"""`;

    //const code = `\n${variable_smava} = """\n# Python code for sma_block\ndef ${variable_smava}_block(tick_data):\n  indicator = "sma"\n  indicator_name = ["${variable_smava}"]\n${statement_smas}\n  tick_data['${variable_smava}'] = talib.SMA(tick_data[input_List], timeperiod=period)\n  #variables = locals().copy()\n  return tick_data\nnew_tick_data = ${variable_smava}_block(tick_data)"""`; //\n  column = "${selected_column}"\n  period = ${period}
    return code;
};
//    const code = `\n# Python code for sma_block\ndef ${variable_smava}_block():\n  indicator = "sma"\n  indicator_name = "${variable_smava}"\n${statement_smas}\n  code = "talib.SMA(data_frame[input_List], timeperiod=nperiod)"\n  variables = locals().copy()\n  return variables\n${variable_smava} = ${variable_smava}_block()\nprint("executed ${variable_smava}:", ${variable_smava})`;
// \nprint("executed ${variable_smava}:",\n new_tick_data)
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
  //const code = `\n# Python code for smaa_block\ndef ${variable_smaava}_block():\n${statement_smaas}\n  variables = locals().copy()\n  return variables\n${variable_smaava} = ${variable_smaava}_block()\nprint("executed ${variable_smaava}:", ${variable_smaava})`;
  //const code = `\n${variable_smaava} = """\n# Python code for smaa_block\ndef ${variable_smaava}_block(tick_data, maind):\n  indicator = "smaa"\n  indicator_name = ["${variable_smaava}"]\n${statement_smaas}\n  tick_data['${variable_smaava}'] = talib.SMA(tick_data[input_List], timeperiod=period)\n  return tick_data\nnew_tick_data = ${variable_smaava}_block(tick_data)"""`;
  const code = `\n${variable_smaava} = """\n# Python code for smaa_block\ndef ${variable_smaava}_block(tick_data, maind):\n  indicator = "smaa"\n  indicator_name = ["${variable_smaava}"]\n${statement_smaas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_smaava}'] = talib.SMA(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_smaava}_block(tick_data, maind)"""`;

  return code;
}

const Bollinger_Bands__BB_ = {
  init: function() {
    this.appendDummyInput('bbd')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('bb'), 'bbva')
      .appendField(new Blockly.FieldLabelSerializable(' to Bollinger Bands   '), 'tbbl')
      .appendField(new Blockly.FieldDropdown([
        ['  ', 'OPTIONNAME']
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
  //const code = `\n# Python code for bb_block\ndef ${variable_bbva}_block(${dropdown_bbdd}):\n${statement_bbs}\n  variables = locals().copy()\n  return variables\n${variable_bbva} = ${variable_bbva}_block(${dropdown_bbdd})\nprint("executed ${variable_bbva}:", ${variable_bbva})`;
  const code = `\n${variable_bbva} = """\n# Python code for bb_block\ndef ${variable_bbva}_block(tick_data, maind):\n  indicator = "bb"\n  indicator_name = ["${variable_bbva}_upper_band", "${variable_bbva}_middle_band", "${variable_bbva}_lower_band"]\n${statement_bbs}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_bbva}_upper_band'], dataframe['${variable_bbva}_middle_band'], dataframe['${variable_bbva}_lower_band'] = talib.BBANDS(tick_data[input_List], timeperiod=period, nbdevup=sdum, nbdevdn=sddm)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_bbva}_block(tick_data, maind)"""`;
  return code;
}
//\n  upper_band, middle_band, lower_band = talib.BBANDS(tick_data[input_List], timeperiod=period, nbdevup=sdum, nbdevdn=sddm)\n  tick_data['upper_band'] = upper_band\n  tick_data['middle_band'] = middle_band\n  tick_data['lower_band'] = lower_band


const Bollinger_Bands_Array__BBA_ = {
  init: function() {
    this.appendDummyInput('bba')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'bbal')
      .appendField(new Blockly.FieldVariable('bba'), 'bba')
      .appendField(new Blockly.FieldLabelSerializable(' to Bollinger Bands Array   '), 'tbbal')
      .appendField(new Blockly.FieldDropdown([
        ['  ', 'OPTIONNAME'],
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
  //const code = `\n# Python code for bb_block\ndef ${variable_bbava}_block(${dropdown_bbadd}):\n${statement_bbas}\n  variables = locals().copy()\n  return variables\n${variable_bbava} = ${variable_bbava}_block(${dropdown_bbadd})\nprint("executed ${variable_bbava}:", ${variable_bbava})`;
  //const code = `\n${variable_bbava} = """\n# Python code for bba_block\ndef ${variable_bbava}_block(tick_data):\n  indicator = "bba"\n  indicator_name = "${variable_bbava}"\n${statement_bbas}\n  upper_band, middle_band, lower_band = talib.BBANDS(tick_data[input_List], timeperiod=period, nbdevup=sdum, nbdevdn=sddm)\n  tick_data['upper_band'] = upper_band\n  tick_data['middle_band'] = middle_band\n  tick_data['lower_band'] = lower_band\n  return tick_data\nnew_tick_data = ${variable_bbava}_block(tick_data)"""`;
  const code = `\n${variable_bbava} = """\n# Python code for bba_block\ndef ${variable_bbava}_block(tick_data, maind):\n  indicator = "bba"\n  indicator_name = ["${variable_bbava}_upper_band", "${variable_bbava}_middle_band", "${variable_bbava}_lower_band"]\n${statement_bbas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_bbava}_upper_band'], dataframe['${variable_bbava}_middle_band'], dataframe['${variable_bbava}_lower_band'] = talib.BBANDS(tick_data[input_List], timeperiod=period, nbdevup=sdum, nbdevdn=sddm)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_bbava}_block(tick_data, maind)"""`;

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
  //const code = `\n# Python code for ema_block\ndef ${variable_emava}_block():\n${statement_emas}\n  variables = locals().copy()\n   indicator_name = ["${variable_smava}"]return variables\n${variable_emava} = ${variable_emava}_block()\nprint("executed ${variable_emava}:", ${variable_emava})`;
  //const code = `\n${variable_emava} = """\n# Python code for ema_block\ndef ${variable_emava}_block(tick_data):\n  indicator = "ema"\n  indicator_name = ["${variable_emava}"]\n${statement_emas}\n  tick_data['${variable_emava}'] = talib.EMA(tick_data[input_List], timeperiod=period)\n  return tick_data\nnew_tick_data = ${variable_emava}_block(tick_data)"""`;
  const code = `\n${variable_emava} = """\n# Python code for ema_block\ndef ${variable_emava}_block(tick_data, maind):\n  indicator = "ema"\n  indicator_name = ["${variable_emava}"]\n${statement_emas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_emava}'] = talib.EMA(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_emava}_block(tick_data, maind)"""`;
  //const code = `\n${variable_smava} = """\n# Python code for sma_block\ndef ${variable_smava}_block(tick_data, maind):\n  indicator = "sma"\n  indicator_name = ["${variable_smava}"]\n${statement_smas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_smava}'] = talib.SMA(dataframe[column], timeperiod=period)\n  #print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_smava}_block(tick_data, maind)"""`;

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
  //const code = `\n# Python code for emaa_block\ndef ${variable_emaava}_block():\n${statement_emaas}\n  variables = locals().copy()\n  return variables\n${variable_emaava} = ${variable_emaava}_block()\nprint("executed ${variable_emaava}:", ${variable_emaava})`;
  //const code = `\n${variable_emaava} = """\n# Python code for emaa_block\ndef ${variable_emaava}_block(tick_data):\n  indicator = "emaa"\n  indicator_name = "${variable_emaava}"\n${statement_emaas}\n  tick_data['${variable_emaava}'] = talib.EMA(tick_data[input_List], timeperiod=period)\n  return tick_data\nnew_tick_data = ${variable_emaava}_block(tick_data)"""`;
  const code = `\n${variable_emaava} = """\n# Python code for emaa_block\ndef ${variable_emaava}_block(tick_data, maind):\n  indicator = "emaa"\n  indicator_name = ["${variable_emaava}"]\n${statement_emaas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_emaava}'] = talib.EMA(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_emaava}_block(tick_data, maind)"""`;

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
  //const code = `\n# Python code for rsi_block\ndef ${variable_rsiva}_block():\n${statement_rsis}\n  variables = locals().copy()\n  return variables\n${variable_rsiva} = ${variable_rsiva}_block()\nprint("executed ${variable_rsiva}:", ${variable_rsiva})`;
  //const code = `\n${variable_rsiva} = """\n# Python code for rsi_block\ndef ${variable_rsiva}_block(tick_data):\n  indicator = "rsi"\n  indicator_name = "${variable_rsiva}"\n${statement_rsis}\n  tick_data['${variable_rsiva}'] = talib.RSI(tick_data[input_List], timeperiod=period)\n  return tick_data\nnew_tick_data = ${variable_rsiva}_block(tick_data)"""`;
  const code = `\n${variable_rsiva} = """\n# Python code for rsi_block\ndef ${variable_rsiva}_block(tick_data, maind):\n  indicator = "rsi"\n  indicator_name = ["${variable_rsiva}"]\n${statement_rsis}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_rsiva}'] = talib.RSI(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_rsiva}_block(tick_data, maind)"""`;

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
  //const code = `\n# Python code for rsia_block\ndef ${variable_rsiava}_block():\n${statement_rsias}\n  variables = locals().copy()\n  return variables\n${variable_rsiava} = ${variable_rsiava}_block()\nprint("executed ${variable_rsiava}:", ${variable_rsiava})`;
  //const code = `\n${variable_rsiava} = """\n# Python code for rsia_block\ndef ${variable_rsiava}_block(tick_data):\n  indicator = "rsia"\n  indicator_name = "${variable_rsiava}"\n${statement_rsias}\n  tick_data['${variable_rsiava}'] = talib.RSI(tick_data[input_List], timeperiod=period)\n  return tick_data\nnew_tick_data = ${variable_rsiava}_block(tick_data)"""`;
  const code = `\n${variable_rsiava} = """\n# Python code for rsia_block\ndef ${variable_rsiava}_block(tick_data, maind):\n  indicator = "rsia"\n  indicator_name = ["${variable_rsiava}"]\n${statement_rsias}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_rsiava}'] = talib.RSI(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_rsiava}_block(tick_data, maind)"""`;

  return code;
}

const Moving_Average_Convergence_Divergence = {
  init: function() {
    this.appendDummyInput('macdad')
      .appendField(new Blockly.FieldLabelSerializable('set'), 'setl')
      .appendField(new Blockly.FieldVariable('MACD'), 'macdva')
      .appendField(new Blockly.FieldLabelSerializable(' to MACD Array  '), 'tmacdal')
      .appendField(new Blockly.FieldDropdown([
        ['  ', 'OPTIONNAME'],
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
  //const code = `\n# Python code for macda_block\ndef ${variable_macdva}_block(${dropdown_macddd}):\n${statement_macds}\n  variables = locals().copy()\n  return variables\n${variable_macdva} = ${variable_macdva}_block(${dropdown_macddd})\nprint("executed ${variable_macdva}:", ${variable_macdva})`;
  //const code = `\n${variable_macdva} = """\n# Python code for macd_block\ndef ${variable_macdva}_block(tick_data):\n  indicator = "macd"\n  indicator_name = "${variable_macdva}"\n${statement_macds}\n  macd, macdsignal, macdhist = talib.MACD(data_frame[input_List], fastperiod=femap, slowperiod=semap, signalperiod=siemap)\n  tick_data['macd'] = macd\n  tick_data['macdsignal'] = macdsignal\n  tick_data['macdhist'] = macdhist\n  return tick_data\nnew_tick_data = ${variable_macdva}_block(tick_data)"""`;
  //const code = `\n${variable_emava} = """\n# Python code for ema_block\ndef ${variable_emava}_block(tick_data, maind):\n  indicator = "ema"\n  indicator_name = ["${variable_emava}"]\n${statement_emas}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_emava}'] = talib.EMA(dataframe[column], timeperiod=period)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_emava}_block(tick_data, maind)"""`;
  //const code = `\n${variable_macdva} = """\n# Python code for macd_block\ndef ${variable_macdva}_block(tick_data):\n  indicator = "macd"\n  indicator_name = "${variable_macdva}"\n${statement_macds}\n  macd, macdsignal, macdhist = talib.MACD(data_frame[input_List], fastperiod=femap, slowperiod=semap, signalperiod=siemap)\n  tick_data['macd'] = macd\n  tick_data['macdsignal'] = macdsignal\n  tick_data['macdhist'] = macdhist\n  return tick_data\nnew_tick_data = ${variable_macdva}_block(tick_data)"""`;
  const code = `\n${variable_macdva} = """\n# Python code for macd_block\ndef ${variable_macdva}_block(tick_data, maind):\n  indicator = "macd"\n  indicator_name = ["${variable_macdva}_macd", "${variable_macdva}_macdsignal", "${variable_macdva}_macdhist"]\n${statement_macds}\n  dataframe = maind[timeframee][f"{timeframee}_df"]\n  print("🧪 after:", dataframe.columns)\n  dataframe['${variable_macdva}_macd'], dataframe['${variable_macdva}_macdsignal'], dataframe['${variable_macdva}_macdhist'] = talib.MACD(data_frame[input_List], fastperiod=femap, slowperiod=semap, signalperiod=siemap)\n  print("🧪 After update:", dataframe.tail(5))\n  maind[timeframee][f"{timeframee}_df"] = dataframe\n  #variables = locals().copy()\n  #return dataframe\n${variable_macdva}_block(tick_data, maind)"""`;

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
\ninput_List = ${value_ilv}\ncolumn, timeframee = input_List
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

const Period__ = {
  init: function() {
    this.appendValueInput('pv')
      .appendField(new Blockly.FieldLabelSerializable(' Period '), 'pl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Period__: Period__});

python.pythonGenerator.forBlock['Period__'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_pv = python.pythonGenerator.valueToCode(block, 'pv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
const code = `
\nperiod = ${value_pv}
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

const sdumm = {
  init: function() {
    this.appendValueInput('sdumv')
      .appendField(new Blockly.FieldLabelSerializable('Standard Deviation Up Multiplier '), 'sduml');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({sdumm: sdumm});

python.pythonGenerator.forBlock['sdumm'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_sdumv = python.pythonGenerator.valueToCode(block, 'sdumv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsdumv = ${value_sdumv}
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

const sddmm = {
  init: function() {
    this.appendValueInput('sddmv')
      .appendField(new Blockly.FieldLabelSerializable(' Standard Deviation Down Multiplier '), 'sddml');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({sddmm: sddmm});

python.pythonGenerator.forBlock['sddmm'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_sddmv = python.pythonGenerator.valueToCode(block, 'sddmv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsddmv = ${value_sddmv}
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

const femapp = {
  init: function() {
    this.appendValueInput('femapv')
      .appendField(new Blockly.FieldLabelSerializable(' Fast EMA Period '), 'femapl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({femapp: femapp});

python.pythonGenerator.forBlock['femapp'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_femapv = python.pythonGenerator.valueToCode(block, 'femapv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nfemapv = ${value_femapv}
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

const semapp = {
  init: function() {
    this.appendValueInput('semapv')
      .appendField(new Blockly.FieldLabelSerializable(' Slow EMA Period \''), 'semapl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({semapp: semapp});

python.pythonGenerator.forBlock['semapp'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_semapv = python.pythonGenerator.valueToCode(block, 'semapv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsemapv = ${value_semapv}
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

const siemapp = {
  init: function() {
    this.appendValueInput('siemapv')
      .appendField(new Blockly.FieldLabelSerializable(' Signal EMA Period '), 'siemapl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({siemapp: siemapp});

python.pythonGenerator.forBlock['siemapp'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_siemapv = python.pythonGenerator.valueToCode(block, 'siemapv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nsiemapv = ${value_siemapv}
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
  const statement_roets = python.pythonGenerator.statementToCode(block, 'roets');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n# Python code for Run_on_every_tick_block\ndef Run_on_every_tick_block():\n${statement_roets}\n  variables = locals().copy()\n  return variables\nvariables = Run_on_every_tick_block()\nprint("executed roet:", variables)
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
\n"quote"
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
\n'last_digit'
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
\n"Current_Stat"
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

python.pythonGenerator.forBlock['Current_stat_list'] = function(block, generator) {
  const csll = block.getFieldValue('csll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `"Current_Stat", 'tick'`;
//const code = `
//\n"Current_stat_list"
//`;
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
const code = `\n"quote", 'tick'`;
//const code = `'quote_list'`;

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

python.pythonGenerator.forBlock['Last_Digits_List'] = function(block, generator) {
  const csl = block.getFieldValue('ldll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `\n"last_digit", 'tick'`;
//const code = `
//\n'last_digit_list'
//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Market_direction = {
  init: function() {
    this.appendDummyInput('mdd')
      .appendField(new Blockly.FieldLabelSerializable('Direction is'), 'dil')
      .appendField(new Blockly.FieldDropdown([
          ['Rise', 'OPTIONNAME'],
          ['Fall', 'OPTIONNAME'],
          ['No Change', 'OPTIONNAME']
        ]), 'mdddd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Market_direction: Market_direction});

python.pythonGenerator.forBlock['Market_direction'] = function(block, generator) {
  const dropdown_mdddd = block.getFieldValue('mdddd');
  const dil = block.getFieldValue('dil');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n${dropdown_mddd} == Market_direction
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

python.pythonGenerator.forBlock['Is_candle_black_'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_icbv = python.pythonGenerator.valueToCode(block, 'icbv', python.Order.ATOMIC);
  const csl = block.getFieldValue('csl');
  // TODO: Assemble python into the code variable.
  //const code = '...';
//const code = `
//\ninput_List = ${value_ilv}\ncolumn, timeframee = input_List
//`;
  const code = `
\nIs_candle_black = ${value_icbv}\ntimeframee = Is_candle_black
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Read_candle_value__1_ = {
  init: function() {
    this.appendDummyInput('rcv1d')
      .appendField(new Blockly.FieldLabelSerializable('In candles list read '), 'rcv1l')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
        ]), 'rcv1dd')
      .appendField(new Blockly.FieldLabelSerializable('  # from end  '), '#fel')
      .appendField(new Blockly.FieldNumber(0), 'rcv1v')
      .appendField(new Blockly.FieldLabelSerializable(' with interval: '), 'wil')
      .appendField(new Blockly.FieldDropdown([
          ['  ', 'OPTIONNAME'],
        ]), 'rcv1dd1');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Read_candle_value__1_: Read_candle_value__1_});

python.pythonGenerator.forBlock['Read_candle_value__1_'] = function(block) {
  const dropdown_rcv1dd = block.getFieldValue('rcv1dd');
  const number_rcv1v = block.getFieldValue('rcv1v');
  const dropdown_rcv1dd1 = block.getFieldValue('rcv1dd1');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nRead_candle_value__1_ = Read_candle_value__1_(${dropdown_rcv1dd}, ${number_rcv1v}, ${dropdown_rcv1dd1})
`;

  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Read_candle_value__1__ = {
  init: function() {
    this.appendValueInput('rcv1v')
      .appendField(new Blockly.FieldLabelSerializable('In candles list read '), 'rcv1l')
      .appendField(new Blockly.FieldDropdown([
          ['Open', 'OPTIONNAME'],
          ['High', 'OPTIONNAME'],
          ['Low', 'OPTIONNAME'],
          ['Close', 'OPTIONNAME'],
          ['Open Time', 'OPTIONNAME'],
        ]), 'rcv1dd')
      .appendField(new Blockly.FieldLabelSerializable('  # from end  '), '#fel');
    this.appendEndRowInput('er')
      .appendField(new Blockly.FieldLabelSerializable(' with interval: '), 'wil')
      .appendField(new Blockly.FieldDropdown([
          ['Default', 'OPTIONNAME'],
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
        ]), 'rcv1dd1');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Read_candle_value__1__: Read_candle_value__1__});

python.pythonGenerator.forBlock['Read_candle_value__1__'] = function(block, generator) {
  const dropdown_rcv1dd = block.getFieldValue('rcv1dd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_rcv1v = python.pythonGenerator.valueToCode(block, 'rcv1v', python.Order.ATOMIC);

  const dropdown_rcv1dd1 = block.getFieldValue('rcv1dd1');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `\n"${dropdown_rcv1dd}", '${dropdown_rcv1dd1}'`;

//const code = `
//\n${dropdown_rcv1dd} = ${dropdown_rcv1dd1}.iloc[-${value_rcv1v}]['${dropdown_rcv1dd}']
//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Read_candle_value__2_ = {
  init: function() {
    this.appendValueInput('rcv2v')
      .appendField(new Blockly.FieldLabelSerializable('Read '), 'rl')
      .appendField(new Blockly.FieldDropdown([
          ['Open', 'OPTIONNAME'],
          ['High', 'OPTIONNAME'],
          ['Low', 'OPTIONNAME'],
          ['Close', 'OPTIONNAME'],
          ['Open Time', 'OPTIONNAME'],
        ]), 'rcv2dd')
      .appendField(new Blockly.FieldLabelSerializable(' value in candle '), 'vicl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Read_candle_value__2_: Read_candle_value__2_});

python.pythonGenerator.forBlock['Read_candle_value__2_'] = function(block, generator) {
  const dropdown_rcv2dd = block.getFieldValue('rcv2dd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_rcv2v = python.pythonGenerator.valueToCode(block, 'rcv2v', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n"${dropdown_rcv2dd}"
`;
//const code = `
//\n${dropdown_rcv2dd} =
//\nRead_candle_value__2_ = Read_candle_value__2_(${dropdown_rcv2dd}, ${rcv2v})
//`;
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
        ]), 'calocv1dd')
      .appendField(new Blockly.FieldLabelSerializable(' values in candles list with interval: '), 'viclwil')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'calocv1dd1');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Create_a_list_of_candle_values__1_: Create_a_list_of_candle_values__1_});

python.pythonGenerator.forBlock['Create_a_list_of_candle_values__1_'] = function() {
  const dropdown_calocv1dd = block.getFieldValue('calocv1dd');
  const dropdown_calocv1dd1 = block.getFieldValue('calocv1dd1');

  // TODO: Assemble python into the code variable.
  //const code = '...';
// \nCreate_a_list_of_candle_values__1_ = Create_a_list_of_candle_values__1_(${dropdown_calocv1dd}, ${dropdown_calocv1dd1})
const code = `\n"${dropdown_calocv1dd}", '${dropdown_calocv1dd1}'`;

//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Create_a_list_of_candle_values__2_ = {
  init: function() {
    this.appendValueInput('calocv2v')
      .appendField(new Blockly.FieldLabelSerializable('Make a list of '), 'malol')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'calocv2dd')
      .appendField(new Blockly.FieldLabelSerializable(' values from candles list'), 'vfcll');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Create_a_list_of_candle_values__2_: Create_a_list_of_candle_values__2_});

python.pythonGenerator.forBlock['Create_a_list_of_candle_values__2_'] = function(block, generator) {
  const dropdown_calocv2dd = block.getFieldValue('calocv2dd');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_calocv2v = python.pythonGenerator.valueToCode(block, 'calocv2v', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `\n"${dropdown_calocv2dd}", '${value_calocv2v}'`;
//const code = `
//\nCreate_a_list_of_candle_values__2_ = Create_a_list_of_candle_values__2_(${dropdown_calocv2dd}, ${value_calocv2v})
//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Get_candle = {
  init: function() {
    this.appendDummyInput('gcd')
      .appendField(new Blockly.FieldLabelSerializable('in candle list # get candle from end '), 'iclgcfel')
      .appendField(new Blockly.FieldNumber(0), 'gcv')
      .appendField(new Blockly.FieldLabelSerializable(' with interval: '), 'wil')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'gcdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Get_candle: Get_candle});

python.pythonGenerator.forBlock['Get_candle'] = function() {
  const number_gcv = block.getFieldValue('gcv');
  const dropdown_gcdd = block.getFieldValue('gcdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `\n"${dropdown_calocv2dd}", '${value_calocv2v}'`;
//const code = `
//\nGet_candle = Get_candle(${number_gcv}, ${dropdown_gcdd})
//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Get_candlee = {
  init: function() {
    this.appendValueInput('gcv')
      .appendField(new Blockly.FieldLabelSerializable('in candle list get # from end '), 'iclgcfel');
    this.appendEndRowInput('er')
      .appendField(new Blockly.FieldLabelSerializable(' with interval: '), 'wil')
      .appendField(new Blockly.FieldDropdown([
          ['Default', 'OPTIONNAME'],
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
        ]), 'gcdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Get_candlee: Get_candlee});

python.pythonGenerator.forBlock['Get_candlee'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_gcv = python.pythonGenerator.valueToCode(block, 'gcv', python.Order.ATOMIC);

  const dropdown_gcdd = block.getFieldValue('gcdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nGet_candle = ${dropdown_gcdd}_df.iloc[-${value_gcv}]
`;
//const code = `
//\nGet_candle = Get_candle(${value_gcv}, ${dropdown_gcdd})
//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}
//df.iloc[-1]
const Get_candle_list = {
  init: function() {
    this.appendDummyInput('gcld')
      .appendField(new Blockly.FieldLabelSerializable('Candles List with interval here 2: '), 'clwih2l')
      .appendField(new Blockly.FieldDropdown([
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME'],
          ['option', 'OPTIONNAME']
        ]), 'gcldd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Get_candle_list: Get_candle_list});

python.pythonGenerator.forBlock['Get_candle_list'] = function() {
  const dropdown_gcldd = block.getFieldValue('gcldd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\nGet_candle_list = "${dropdown_gcldd}_df"
`;
//const code = `
//\nGet_candle_list = Get_candle(${dropdown_gcldd})
//`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Last_trade_result = {
  init: function() {
    this.appendDummyInput('ltrd')
      .appendField(new Blockly.FieldLabelSerializable('Result is '), 'ril')
      .appendField(new Blockly.FieldDropdown([
          ['Win', 'OPTIONNAME'],
          ['Loss', 'OPTIONNAME'],
        ]), 'ltrd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Last_trade_result: Last_trade_result});

python.pythonGenerator.forBlock['Last_trade_result'] = function(block) {
  const dropdown_ltrd = block.getFieldValue('ltrd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
  \nLast_trade_result == ${dropdown_ltrd}
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

python.pythonGenerator.forBlock['Contract_details'] = function(block) {
  const dropdown_cddd = block.getFieldValue('cddd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
 \nContract_details == ${dropdown_cddd}
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

python.pythonGenerator.forBlock['Profit_loss_from_selling'] = function(block) {
  const dropdown_spll = block.getFieldValue('spll');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n"Profit_loss_from_selling"
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

python.pythonGenerator.forBlock['Can_contract_be_sold_'] = function(block) {

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nCan_contract_be_sold = True
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
        ]), 'ppdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Potential_payout: Potential_payout});

python.pythonGenerator.forBlock['Potential_payout'] = function(block) {
  const dropdown_ppdd = block.getFieldValue('ppdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nPotential_payout_${dropdown_ppdd}
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
        ]), 'pupdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Purchase_price: Purchase_price});

python.pythonGenerator.forBlock['Purchase_price'] = function(block) {
  const dropdown_pupdd = block.getFieldValue('pupdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nPurchase_price_${dropdown_pupdd}
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
        ]), 'abdd');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Account_balance: Account_balance});

python.pythonGenerator.forBlock['Account_balance'] = function() {
  const dropdown_abdd = block.getFieldValue('abdd');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nacc_balance_${dropdown_pupdd}
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
\n"Total_profit_loss"
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
\n"Number_of_runs"
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
\n# Python code for Function_1_block\ndef Function_1_block():\n${statement_fs}\n  variables = locals().copy()\n  return variables\nvariables = Function_1_block()\nprint("executed Function_1:", variables)
`;
  return code;
}

const Function_that_returns_a_value = {
  init: function() {
    this.appendDummyInput('ftravd')
      .appendField(new Blockly.FieldLabelSerializable('Function'), 'fl')
      .appendField(new Blockly.FieldTextInput('do something2'), 'dst');
    this.appendStatementInput('ftravs');
    this.appendValueInput('ftravv')
      .appendField(new Blockly.FieldLabelSerializable('return'), 'rl');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('#064e72');
  }
};
Blockly.common.defineBlocks({Function_that_returns_a_value: Function_that_returns_a_value});


python.pythonGenerator.forBlock['Function_that_returns_a_value'] = function(block, generator) {
  const text_dstl = block.getFieldValue('dst');

  const statement_ftravs = python.pythonGenerator.statementToCode(block, 'ftravs');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_ftravv = python.pythonGenerator.valueToCode(block, 'ftravv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
const code = `
\n# Python code for Function_that_returns_a_value_block\ndef Function_that_returns_a_value_block():\n${statement_ftravv}\n variables = locals().copy()\n  return variables\nvariables = Function_that_returns_a_value_block()\nprint("executed Function_that_returns_a_value:", variables)
`;
  return code;
}

const Conditional_return = {
  init: function() {
    this.appendValueInput('civ')
      .appendField(new Blockly.FieldLabelSerializable('if'), 'il');
    this.appendValueInput('crv')
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

python.pythonGenerator.forBlock['Conditional_return'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_civ = python.pythonGenerator.valueToCode(block, 'civ', python.Order.ATOMIC);

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_crv = python.pythonGenerator.valueToCode(block, 'crv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  //const code = ` \n# Python code for Conditional_return
 code = `
\nif ${value_civ}:\nreturn ${value_crv}
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

python.pythonGenerator.forBlock['Print'] = function(block) {
  const text_tl = block.getFieldValue('tl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nPrint ${text_tl}
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
        ]), 'raidd')
      .appendField(new Blockly.FieldLabelSerializable('with message '), 'wml')
      .appendField(new Blockly.FieldTextInput('abc'), 'rait');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Request_an_input: Request_an_input});

python.pythonGenerator.forBlock['Request_an_input'] = function(block) {
  const dropdown_raidd = block.getFieldValue('raidd');
  const text_rait = block.getFieldValue('rait');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nRequest_an_input = Request_an_input(${dropdown_raidd}, ${text_rait})
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
        ]), 'ndd1')
      .appendField(new Blockly.FieldTextInput('abc'), 'ntl');
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
  const dropdown_ndd1 = block.getFieldValue('ndd1');
  const text_ntl = block.getFieldValue('ntl');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nNotify = Notify(${dropdown_ndd}, ${dropdown_ndd1}, ${text_ntl})
`;
  return code;
}

const Notify_Telegram = {
  init: function() {
    this.appendDummyInput('ntd')
      .appendField(new Blockly.FieldLabelSerializable('Notify Telegram Access Token: '), 'ntatl')
      .appendField(new Blockly.FieldTextInput('default'), 'ntt')
      .appendField(new Blockly.FieldLabelSerializable(' Chart ID: '), 'cil')
      .appendField(new Blockly.FieldTextInput('default'), 'cit')
      .appendField(new Blockly.FieldLabelSerializable(' Message: '), 'ml')
      .appendField(new Blockly.FieldTextInput('abc'), 'mt');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Notify_Telegram: Notify_Telegram});

python.pythonGenerator.forBlock['Notify_Telegram'] = function(block) {
  const text_ntt = block.getFieldValue('ntt');
  const text_cit = block.getFieldValue('cit');
  const text_mt = block.getFieldValue('mt');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nNotify_Telegram = Notify_Telegram(${text_ntt}, ${text_cit}, ${text_mt})
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

python.pythonGenerator.forBlock['Second_Since_Epoch'] = function(block) {
  const dropdown_ssel = block.getFieldValue('ssel');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n"Second_Since_Epoch"
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

python.pythonGenerator.forBlock['Delayed_run'] = function(block, generator) {
  const statement_drs = generator.statementToCode(block, 'drs');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_drv = python.pythonGenerator.valueToCode(block, 'drv', python.Order.ATOMIC);


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

python.pythonGenerator.forBlock['Tick_Delayed_run'] = function(block, generator) {
  const statement_tdrs = generator.statementToCode(block, 'tdrs');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_tdrv = python.pythonGenerator.valueToCode(block, 'tdrv', python.Order.ATOMIC);


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
      .appendField(new Blockly.FieldTextInput('yyyy-mm-dd hh:mm:ss'), 'cttt');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Convert_to_timestamp: Convert_to_timestamp});

python.pythonGenerator.forBlock['Convert_to_timestamp'] = function(block) {
  const text_cttt = block.getFieldValue('cttt');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nConvert_to_timestamp  Convert_to_timestamp(${text_cttt})
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Convert_to_date_time = {
  init: function() {
    this.appendDummyInput('ctdtd')
      .appendField(new Blockly.FieldLabelSerializable('To date/time '), 'tdtl')
      .appendField(new Blockly.FieldNumber(0), 'ctdtv');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Convert_to_date_time: Convert_to_date_time});

python.pythonGenerator.forBlock['Convert_to_date_time'] = function() {
  const number_ctdtv = block.getFieldValue('ctdtv');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nConvert_to_date_time = Convert_to_date_time(${number_ctdtv})
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Convert_to_date_timee = {
  init: function() {
    this.appendValueInput('ctdtv')
      .appendField(new Blockly.FieldLabelSerializable('To date/time '), 'tdtl');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Convert_to_date_timee: Convert_to_date_timee});

python.pythonGenerator.forBlock['Convert_to_date_timee'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_ctdtv = python.pythonGenerator.valueToCode(block, 'ctdtv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nConvert_to_date_time = Convert_to_date_time(${value_ctdtv})
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Loads_from_URL = {
  init: function() {
    this.appendEndRowInput('lfurler')
      .appendField(new Blockly.FieldLabelSerializable('Load block from URL: '), 'lbful')
      .appendField(new Blockly.FieldTextInput('http://www.example.com/block.xml'), 'lfurlt');
    this.setInputsInline(true)
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Loads_from_URL: Loads_from_URL});

python.pythonGenerator.forBlock['Loads_from_URL'] = function() {
  const text_lfurlt = block.getFieldValue('lfurlt');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nLoads_from_URL = Loads_from_URL(${text_lfurlt})
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
      .appendField(new Blockly.FieldTextInput('abc'), 'ct');
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
  const text_ct = block.getFieldValue('ct');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\nConsole = Console(${dropdown_cdd}, ${text_ct})
`;
  return code;
}

const dummy_text_block = {
  init: function() {
    this.appendValueInput('dtbv');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({dummy_text_block: dummy_text_block});

python.pythonGenerator.forBlock['dummy_text_block'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_dtbv = python.pythonGenerator.valueToCode(block, 'dtbv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\ndummy_text_block = dummy_text_block(${value_dtbv})
`;
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const text_block = {
  init: function() {
    this.appendDummyInput('tbd')
      .appendField(new Blockly.FieldTextInput('abc'), 'abct');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({text_block: text_block});

python.pythonGenerator.forBlock['text_block'] = function(block) {
  const text_abct = block.getFieldValue('abct');

  // TODO: Assemble python into the code variable.
  //const code = '...';
  const code = `
\n${text_abct}`;

  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}

const Change_variable = {
  init: function() {
    this.appendValueInput('cvv')
      .appendField(new Blockly.FieldLabelSerializable('change'), 'NAME')
      .appendField(new Blockly.FieldDropdown([
          ['item', 'OPTIONNAME']
        ]), 'cvi');
    this.setInputsInline(true)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({Change_variable: Change_variable});

python.pythonGenerator.forBlock['Change_variable'] = function(block, generator) {
  const dropdown_cvi = block.getFieldValue('cvi');
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_cvv = python.pythonGenerator.valueToCode(block, 'cvv', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  const code = '...';
  return code;
}

const math_number_p = {
  init: function() {
    this.appendValueInput('mnp');
    this.setInputsInline(true)
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#e5e5e5");
  }
};
Blockly.common.defineBlocks({math_number_p: math_number_p});

python.pythonGenerator.forBlock['math_number_p'] = function(block, generator) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_mnp = python.pythonGenerator.valueToCode(block, 'mnp', python.Order.ATOMIC);

  // TODO: Assemble python into the code variable.
  const code = '...';
  // TODO: Change Order.NONE to the correct operator precedence strength
  return [code, python.Order.NONE];
}
//console.log(typeof tradeParameters); // Should output "string"

//            <block type="Duration"></block>

const InitialBlocks = `
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="390" y="94">
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
          <block type="Durationn">
            <value name="drv">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
            <value name="st">
              <block type="math_number">
                <field name="NUM">0.35</field>
              </block>
            </value>
          </block>
        </statement>
      </block>

      <block type="Purchase_conditions" x="390" y="662">
        <statement name="Pcs">
          <block type="Purchase"></block>
        </statement>
      </block>

      <block type="Sell_conditions" x="1140" y="94">
        <statement name="Scs">
          <block type="Conditional_if">
            <value name="Ci">
              <block type="Sell_is_available"></block>
            </value>
          </block>
        </statement>
      </block>

      <block type="Restart_trading_conditions" x="1140" y="324">
        <statement name="Rtcs">
          <block type="Trade_again"></block>
        </statement>
      </block>

</xml>`;

//      <block id="trade_param_2" type="Duration" x="10" y="10"></block>

const domi = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="Durationn" x="10" y="10">
    <value name="drv">
      <block type="math_number">
        <field name="NUM">1</field>
      </block>
    </value>
    <value name="st">
      <block type="math_number">
        <field name="NUM">1</field>
      </block>
    </value>
  </block>
</xml>`;
//const dom = Blockly.Xml.textToDom(xmlText);
//Blockly.Xml.domToWorkspace(dom, workspace);  // assuming you have your workspace

const kk = `
<block type="Durationn">
  <value name="drv">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
  <value name="st">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>`;

const tradeParametersBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="10" y="10">
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
      <block type="Durationn" x="10" y="10">
        <value name="drv">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="st">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
      </block>
      <block type="Multiplierr" x="10" y="10">
        <value name="stv">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
      </block>

    <block type="Take_profitt" x="10" y="10">
      <value name="tpmv">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
      </value>
    </block>

    <block type="Stop_Losss" x="10" y="10">
      <value name="slv">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
      </value>
    </block>

    <block type="Growth_Ratee" x="10" y="10">
      <value name="stv">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>

    <block type="Take_profit_aa" x="10" y="10">
      <value name="tpav">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
      </value>
    </block>

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
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
          </next>
        </block>
      </statement>
    </block>

      <block type="Simple_Moving_Average_Array__SMAA_" x="10" y="70">
        <statement name="smaas">
          <block type="input_List">
            <next>
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            </next>
          </block>
        </statement>
      </block>

    <block type="Bollinger_Bands__BB_" x="10" y="70">
      <statement name="bbs">
        <block type="input_List">
          <next>
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <next>
                <block type="sdumm">
                  <value name="sdumv">
                    <block type="math_number">
                      <field name="NUM">5</field>
                    </block>
                  </value>
                  <next>
                    <block type="sddmm">
                      <value name="sddmv">
                        <block type="math_number">
                          <field name="NUM">5</field>
                        </block>
                      </value>
                    </block>
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
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <next>
                <block type="sdumm">
                  <value name="sdumv">
                    <block type="math_number">
                      <field name="NUM">5</field>
                    </block>
                  </value>
                  <next>
                    <block type="sddmm">
                      <value name="sddmv">
                        <block type="math_number">
                          <field name="NUM">5</field>
                        </block>
                      </value>
                    </block>
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
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Exponential_Moving_Average_Array__EMAA_" x="10" y="70">
        <statement name="emaas">
          <block type="input_List">
            <next>
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Relative_Strength_Index__RSI_" x="10" y="70">
        <statement name="rsis">
          <block type="input_List">
            <next>
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            </next>
          </block>
        </statement>
      </block>

      <block type="Relative_Strength_Index_Array__RSIA_" x="10" y="70">
        <statement name="rsias">
          <block type="input_List">
            <next>
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            </next>
          </block>
        </statement>
      </block>

    <block type="Moving_Average_Convergence_Divergence" x="10" y="70">
      <statement name="macds">
        <block type="input_List">
          <next>
            <block type="femapp">
              <value name="femapv">
                <block type="math_number">
                  <field name="NUM">12</field>
                </block>
              </value>
              <next>
                <block type="semapp">
                  <value name="semapv">
                    <block type="math_number">
                      <field name="NUM">26</field>
                    </block>
                  </value>
                  <next>
                    <block type="siemapp">
                      <value name="siemapv">
                        <block type="math_number">
                          <field name="NUM">9</field>
                        </block>
                      </value>
                    </block>
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
      <block type="Read_candle_value__1__" x="10" y="10">
        <value name="rcv1v">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
      </block>
      <block id="trade_param_7" type="Read_candle_value__2_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Create_a_list_of_candle_values__1_" x="10" y="1550"></block>
      <block id="trade_param_7" type="Create_a_list_of_candle_values__2_" x="10" y="1550"></block>
      <block type="Get_candlee" x="10" y="110">
        <value name="gcv">
          <block type="math_number">
            <field name="NUM">1</field>
          </block>
        </value>
      </block>
      <block id="trade_param_7" type="Get_candle_list" x="10" y="1550"></block>
    </xml>
`;
//       <block id="trade_param_7" type="Read_candle_value__1_" x="10" y="1550"></block>
//       <block id="trade_param_7" type="Get_candle" x="10" y="1550"></block>
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

const StatsBlocks =`
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
      <block type="Convert_to_date_timee" x="10" y="210">
        <value name="ctdtv">
          <block type="math_number">
            <field name="NUM">0</field>
          </block>
        </value>
      </block>
    </xml>
`;

//       <block id="trade_param_6" type="Convert_to_date_time" x="10" y="1150"></block>
const MathBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="m1" type="math_number" x="200" y="20"></block>
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

<block type="math_number_p">
  <value name="mnp">
    <block type="math_number_property">
      <field name="PROPERTY">EVEN</field>
      <value name="NUMBER_TO_CHECK">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
      </value>
    </block>
  </value>
</block>

    <block type="Change_variable">
      <value name="cvv">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>

<block type="math_on_list">
  <field name="OP">SUM</field> <!-- or MIN, MAX, AVERAGE, etc. -->
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
    <value name="dtbv">  <!-- Input number for the operation -->
      <block type="text_block"></block>
    </value>
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

  <block type="text_isEmpty">
    <value name="VALUE">
      <block type="text">
        <field name="TEXT"></field>
      </block>
    </value>
  </block>


<block type="text_indexOf">
  <field name="END">FIRST</field>  <!-- Can be "FIRST" or "LAST" -->
  <value name="VALUE">
    <block type="text">
      <field name="TEXT">Hello World</field>
    </block>
  </value>
  <value name="FIND">
    <block type="text">
      <field name="TEXT">World</field>
    </block>
  </value>
</block>

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
  <block id="l6" type="Conditional_if" x="10" y="20"></block>
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

<block type="lists_isEmpty">
  <value name="VALUE">
    <block type="lists_create_with">
      <mutation items="0"></mutation>  <!-- Empty list -->
    </block>
  </value>
</block>

  <block type="lists_indexOf" id="indexOfVarBlock" x="10" y="470"></block>

  <block id="li3" type="lists_getIndex" x="10" y="20"></block>

  <block id="li4" type="lists_setIndex" x="10" y="570"></block>

  <block type="lists_getSublist" id="getSublistBlock" x="10" y="460"></block>

  <block type="lists_split"></block>

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


const varb =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="variables_set" id="setVarBlock" x="10" y="10">
    <field name="VAR">list</field>  <!-- Variable field for selecting the variable -->
    <value name="VALUE">  <!-- Value input placeholder -->
    </value>
  </block>
</xml>`;




const llBlocks =`
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
      <block id="trade_param_2" type="Purchase_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="Purchase" x="10" y="10"></block>
      <block id="trade_param_2" type="Sell_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="sell_at_market_price" x="10" y="10"></block>

      <block id="trade_param_2" type="Restart_trading_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="Trade_again" x="10" y="10"></block>

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
        <statement name="macds">
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

      <block id="trade_param_2" type="Last_trade_result" x="10" y="1550"></block>
      <block id="trade_param_3" type="Contract_details" x="10" y="650"></block>
      <block id="trade_param_4" type="Profit_loss_from_selling" x="10" y="950"></block>
      <block id="trade_param_5" type="Can_contract_be_sold_" x="10" y="1050"></block>
      <block id="trade_param_6" type="Potential_payout" x="10" y="1150"></block>
      <block id="trade_param_7" type="Purchase_price" x="10" y="1550"></block>

      <block id="trade_param_2" type="Account_balance" x="10" y="1550"></block>
      <block id="trade_param_3" type="Total_profit_loss" x="10" y="650"></block>
      <block id="trade_param_4" type="Number_of_runs" x="10" y="950"></block>

      <block id="trade_param_2" type="Function_1" x="10" y="1550"></block>
      <block id="trade_param_3" type="Function_that_returns_a_value" x="10" y="650"></block>
      <block id="trade_param_4" type="Conditional_return" x="10" y="950"></block>

      <block id="trade_param_2" type="Print" x="10" y="1550"></block>
      <block id="trade_param_3" type="Request_an_input" x="10" y="650"></block>
      <block id="trade_param_4" type="Notify" x="10" y="950"></block>
      <block id="trade_param_5" type="Notify_Telegram" x="10" y="1050"></block>

      <block id="trade_param_2" type="Second_Since_Epoch" x="10" y="1550"></block>
      <block id="trade_param_3" type="Delayed_run" x="10" y="650"></block>
      <block id="trade_param_4" type="Tick_Delayed_run" x="10" y="950"></block>
      <block id="trade_param_5" type="Convert_to_timestamp" x="10" y="1050"></block>
      <block id="trade_param_6" type="Convert_to_date_time" x="10" y="1150"></block>

  <block id="m1" type="math_number" x="200" y="20"></block>
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

<block type="math_number_p">
  <value name="mnp">
    <block type="math_number_property">
      <field name="PROPERTY">EVEN</field>
      <value name="NUMBER_TO_CHECK">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
      </value>
    </block>
  </value>
</block>

    <block type="Change_variable">
      <value name="cvv">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>

<block type="math_on_list">
  <field name="OP">SUM</field> <!-- or MIN, MAX, AVERAGE, etc. -->
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

  <block type="dummy_text_block" id="textBlock1" x="10" y="10">
    <value name="dtbv">  <!-- Input number for the operation -->
      <block type="text_block"></block>
    </value>
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

  <block type="text_isEmpty">
    <value name="VALUE">
      <block type="text">
        <field name="TEXT"></field>
      </block>
    </value>
  </block>


<block type="text_indexOf">
  <field name="END">FIRST</field>  <!-- Can be "FIRST" or "LAST" -->
  <value name="VALUE">
    <block type="text">
      <field name="TEXT">Hello World</field>
    </block>
  </value>
  <value name="FIND">
    <block type="text">
      <field name="TEXT">World</field>
    </block>
  </value>
</block>

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

  <block id="l6" type="Conditional_if" x="10" y="20"></block>
  <block id="l1" type="logic_compare" x="10" y="70"></block>
  <block id="l3" type="logic_operation" x="10" y="120"></block>
  <block id="l4" type="logic_negate" x="10" y="170"></block>
  <block id="l2" type="logic_boolean" x="10" y="70"></block>
  <block type="logic_null" id="nullBlock" x="10" y="10"></block>
  <block id="l7" type="logic_ternary" x="10" y="320"></block>

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

<block type="lists_isEmpty">
  <value name="VALUE">
    <block type="lists_create_with">
      <mutation items="0"></mutation>  <!-- Empty list -->
    </block>
  </value>
</block>

  <block type="lists_indexOf" id="indexOfVarBlock" x="10" y="470"></block>

  <block id="li3" type="lists_getIndex" x="10" y="20"></block>

  <block id="li4" type="lists_setIndex" x="10" y="570"></block>

  <block type="lists_getSublist" id="getSublistBlock" x="10" y="460"></block>

  <block type="lists_split"></block>

  <block id="li8" type="lists_sort" x="10" y="570"></block>

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

  <block id="mi1" type="Loads_from_URL" x="10" y="20"></block>
  <block id="mi2" type="Ignore" x="10" y="70"></block>

  <block id="mi3" type="Console" x="10" y="520">
    <value name="console_">
      <block type="dummy_text_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">abc</field>  <!-- Editable text field with "abc" -->
      </block>
    </value>
  </block>


  <block type="variables_set" id="setVarBlock" x="10" y="10">
    <field name="VAR">list</field>  <!-- Variable field for selecting the variable -->
    <value name="VALUE">  <!-- Value input placeholder -->
    </value>
  </block>
</xml>`;


/*
const llBlocks =`
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
      <block id="trade_param_2" type="Purchase_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="Purchase" x="10" y="10"></block>
      <block id="trade_param_2" type="Sell_conditions" x="10" y="10"></block>
      <block id="trade_param_3" type="sell_at_market_price" x="10" y="10"></block>

  <block id="lo3" type="controls_for" x="10" y="120"></block>

  <block id="lo4" type="controls_forEach" x="10" y="170"></block>

  <block id="lo5" type="controls_flow_statements" x="10" y="220"></block>

  <block id="mi1" type="Loads_from_URL" x="10" y="20"></block>
  <block id="mi2" type="Ignore" x="10" y="70"></block>

  <block id="mi3" type="Console" x="10" y="520">
    <value name="console_">
      <block type="dummy_text_block" id="textBlock1" x="10" y="10">
        <field name="TEXT">abc</field>  <!-- Editable text field with "abc" -->
      </block>
    </value>
  </block>


  <block type="variables_set" id="setVarBlock" x="10" y="10">
    <field name="VAR">list</field>  <!-- Variable field for selecting the variable -->
    <value name="VALUE">  <!-- Value input placeholder -->
    </value>
  </block>
</xml>`;

*/
/*
const blockData = {
        'tradeparameters': `Trade parameters
    Here is where you define the parameters of your contract.
    Learn more`,

        'duration': `Trade options
    Define your trade options such as duration and stake. Some options are only applicable for certain trade types.
    Learn more`,

        'multiplier': `Multiplier trade options
    Define your trade options such as multiplier and stake. This block can only be used with the multipliers trade type. If you select another trade type, this block will be replaced with the Trade options block.
    Learn more`,

        'take_profit': `Take Profit (Multiplier)
    Your contract is closed automatically when your profit is more than or equals to this amount. This block can only be used with the multipliers trade type.`,

        'stop_loss': `Stop loss (Multiplier)
    Your contract is closed automatically when your loss is more than or equals to this amount. This block can only be used with the multipliers trade type.`,

        'growth_rate': `Accumulator trade options
    Define your trade options such as accumulator and stake. This block can only be used with the accumulator trade type. If you select another trade type, this block will be replaced with the Trade options block.`,

        'take_profit_a': `Take Profit (Accumulator)
    Your contract is closed automatically when your profit is more than or equals to this amount. This block can only be used with the accumulator trade type.`,

        'purchase_conditions': `Purchase conditions
    This block is mandatory. Only one copy of this block is allowed. You can place the Purchase block (see below) here as well as conditional blocks to define your purchase conditions.
    Learn more`,

        'purchase': `Purchase
    Use this block to purchase the specific contract you want. You may add multiple Purchase blocks together with conditional blocks to define your purchase conditions. This block can only be used within the Purchase conditions block.`,

        'sell_conditions': `Sell conditions
    Here is where you can decide to sell your contract before it expires. Only one copy of this block is allowed.
    Learn more`,

        'sell_at_market_price': `Sell at market price
    Use this block to sell your contract at the market price.
    Learn more`,

        'restart_trading_conditions': `Restart trading conditions
    Here is where you can decide if your bot should continue trading.
    Learn more`,

        'trade_again': `Trade again
    This block will transfer the control back to the Purchase conditions block, enabling you to purchase another contract.
    Learn more`,

        'run_on_every_tick': `Run on every tick
    The content of this block is called on every tick. Place this block outside of any root block.
    Learn more`,

        'last_tick': `Last tick
    This block gives you the value of the last tick.`,

        'last_digit': `Last Digit
    This block gives you the last digit of the latest tick value.
    Learn more`,

        'current_stat': `Current Stat
    This block gives you the Current Stat value.`,

        'current_stat_list': `Current stat list
    This block gives you a list of the curent stats of the last 1000 tick values.`,

        'tick_list': `Tick list
    This block gives you a list of the last 1000 tick values.`,

        'last_digits_list': `Last Digits List
    This block gives you a list of the last digits of the last 1000 tick values.`,

        'market_direction': `Market direction
    This block is used to determine if the market price moves in the selected direction or not. It gives you a value of “True” or “False”.
    Learn more
    `,

        'is_candle_black_': `Is candle black?
    This block returns “True” if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.
    Learn more`,

        'read_candle_value__1_': `Read candle value (1)
    This block gives you the specified candle value for a selected time interval.
    Learn more
    `,

        'read_candle_value__2_': `Read candle value (2)
    This block gives you the selected candle value.
    Learn more`,

        'create_a_list_of_candle_values__1_': `Create a list of candle values (1)
    This block gives you the selected candle value from a list of candles within the selected time interval.
    Learn more`,

        'create_a_list_of_candle_values__2_': `Create a list of candle values (2)
    This block gives you the selected candle value from a list of candles.
    Learn more`,

        'get_candle': `Get candle
    This block gives you a specific candle from within the selected time interval.
    Learn more`,

        'get_candle_list': `Get candle list
    This block gives you a list of candles within a selected time interval.
    Learn more`,

        'last_trade_result': `Last trade result
    You can check the result of the last trade with this block.
    Learn more`,

        'contract_details': `Contract details
    This block gives you information about your last contract.
    Learn more`,

        'profit_loss_from_selling': `Profit/loss from selling
    This block gives you the potential profit or loss if you decide to sell your contract.
    Learn more`,

        'can_contract_be_sold_': `Can contract be sold?
    This block helps you check if your contract can be sold. If your contract can be sold, it returns “True”. Otherwise, it returns an empty string.`,

        'potential_payout': `Potential payout
    This block returns the potential payout for the selected trade type. This block can be used only in the "Purchase conditions" root block.`,

        'purchase_price': `Purchase price
    This block returns the purchase price for the selected trade type. This block can be used only in the "Purchase conditions" root block.`,

        'account_balance': `Account balance
    This block gives you the balance of your account either as a number or a string of text.
    Learn more
    `,

        'total_profit_loss': `Total profit/loss
    This block gives you the total profit/loss of your trading strategy since your bot started running. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.`,

        'number_of_runs': `Number of runs
    This block gives you the total number of times your bot has run. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.`,

        'function_1': `Function
    This block creates a function, which is a group of instructions that can be executed at any time. Place other blocks in here to perform any kind of action that you need in your strategy. When all the instructions in a function have been carried out, your bot will continue with the remaining blocks in your strategy. Click the “do something” field to give it a name of your choice. Click the plus icon to send a value (as a named variable) to your function.`,

        'function_that_returns_a_value': `Function that returns a value
    This block is similar to the one above, except that this returns a value. The returned value can be assigned to a variable of your choice.`,

        'conditional_return': `Conditional return
    This block returns a value when a condition is true. Use this block within either of the function blocks above.
    Learn more`,

        'print': `Print
    This block displays a dialog box with a customised message. When the dialog box is displayed, your strategy is paused and will only resume after you click "OK".
    Learn more`,

        'request_an_input': `Request an input
    This block displays a dialog box that uses a customised message to prompt for an input. The input can be either a string of text or a number and can be assigned to a variable. When the dialog box is displayed, your strategy is paused and will only resume after you enter a response and click "OK".
    Learn more`,

        'notify': `Notify
    This block displays a message. You can specify the color of the message and choose from 6 different sound options.`,

        'notify_telegram': `Notify Telegram
    This block sends a message to a Telegram channel.
    Learn more`,

        'second_since_epoch': `Second Since Epoch
    This block returns the number of seconds since January 1st, 1970.
    Learn more`,

        'delayed_run': `Delayed run
    This block delays execution for a given number of seconds. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.`,

        'tick_delayed_run': `Tick Delayed run
    This block delays execution for a given number of ticks. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.`,

        'convert_to_timestamp': `Convert to timestamp
    This block converts a string of text that represents the date and time into seconds since the Unix Epoch (1 January 1970). The time and time zone offset are optional. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825.
    Learn more`,

        'convert_to_date_time': `Convert to date/time
    This block converts the number of seconds since the Unix Epoch (1 January 1970) into a string of text representing the date and time.
    Learn more`,

        'math_number': `Number
    Enter an integer or fractional number into this block. Please use '.' as a decimal separator for fractional numbers.
    `,

        'math_arithmetic': `Arithmetical operations
    This block performs arithmetic operations between two numbers.
    Learn more`,

        'math_single': `Operations on a given number
    This block performs the selected operations to a given number.
    Learn more
    `,

        'math_trig': `Trigonometric functions
    This block performs trigonometric functions.`,

        'math_constant': `Mathematical constants
    This block gives you the selected constant values.`,

        'math_number_p': `Test a number
    This block tests a given number according to the selection and it returns a value of “True” or “False”. Available options: Even, Odd, Prime, Whole, Positive, Negative, Divisible`,

        'change_variable': `Change variable
    This block adds the given number to the selected variable.`,

        'math_on_list': `Aggregate operations
    This block performs the following operations on a given list: sum, minimum, maximum, average, median, mode, antimode, standard deviation, random item.`,

        'math_round': `Rounding operation
    This block rounds a given number according to the selection: round, round up, round down.`,

        'math_modulo': `Remainder after division
    Returns the remainder after the division of the given numbers.`,

        'math_constrain': `Constrain within a range
    This block constrains a given number so that it is within a set range.
    Learn more`,

        'math_random_int': `Random integer
    This block gives you a random number from within a set range.`,

        'math_random_float': `Random fraction number
    This block gives you a random fraction between 0.0 to 1.0.`,

        'dummy_text_block': `Text
    A block that can contain text.`,

        'variables_set': `Text join
    Creates a single text string from combining the text value of each attached item, without spaces in between. The number of items can be added accordingly.`,

        'text_append': `Text Append
    Appends a given text to a variable.`,

        'text_length': `Text String Length
    Returns the number of characters of a given string of text, including numbers, spaces, punctuation marks, and symbols.
    `,

        'text_isempty': `Text Is empty
    Tests whether a string of text is empty. Returns a boolean value (true or false).
    `,

        'purchase_conditions': `Search for string
    Searches through a string of text for a specific occurrence of a given character or word, and returns the position.`,

        'text_charat': `Get character
    Returns the specific character from a given string of text according to the selected option.`,

        'text_getsubstring': `Get substring
    Returns a specific portion of a given string of text.
    `,

        'text_changecase': `Change text case
    Changes the capitalisation of a string of text to Upper case, Lower case, Title case.`,


        'text_trim': `Trim spaces
    Trims the spaces within a given string or text.`,

        'conditional_if': `Conditional block
    This block evaluates a statement and will perform an action only when the statement is true.
    Learn more`,

        'logic_compare': `Compare
    This block compares two values and is used to build a conditional structure.`,

        'logic_operation': `Logic operation
    This block performs the "AND" or the "OR" logic operation.
    Learn more`,

        'logic_negation': `Logic negation
    This block converts the boolean value (true or false) to its opposite.`,

        'logic_boolean': `True-False
    This is a single block that returns a boolean value, either true or false.`,

        'logic_null': `Null
    This block assigns a null value to an item or statement.
    `,

        'logic_ternary': `Test value
    This block tests if a given value is true or false and returns “True” or “False” accordingly.`,

        'variables_set': `Create list
    This block creates a list with strings and numbers.
    `,

        'lists_repeat': `Repeat an item
    Creates a list with a given item repeated for a specific number of times.`,

        'lists_length': `List Length
    This block gives you the total number of items in a given list.
    `,

        'lists_isempty': `Is list empty?
    This block checks if a given list is empty. It returns “True” if the list is empty, “False” if otherwise.`,

        'lists_indexof': `List item position
    This block gives you the position of an item in a given list.
    `,

        'lists_getindex': `Get list item
    This block gives you the value of a specific item in a list, given the position of the item. It can also remove the item from the list.`,

        'lists_setindex': `Set list item
    This block replaces a specific item in a list with another given item. It can also insert the new item in the list at a specific position.`,

        'lists_getsublist': `Get sub-list
    This block creates a list of items from an existing list, using specific item positions.`,

        'lists_split': `Create list from text
    This block creates a list from a given string of text, splitting it with the given delimiter. It can also join items in a list into a string of text.`,

        'lists_sort': `Sort list
    Sorts the items in a given list, by their numeric or alphabetical value, in either ascending or descending order.`,

        'controls_repeat_ext': `Repeat (1)
    This block repeats the instructions contained within for a specific number of times.`,

        'controls_repeat_ext': `Repeat (2)
    This block is similar to the block above, except that the number of times it repeats is determined by a given variable.
    `,

        'controls_whileuntil': `Repeat While/Until
    This block repeats instructions as long as a given condition is true.
    Learn more`,

        'controls_for': `Iterate (1)
    This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.
    Learn more`,

        'controls_foreach': `Iterate (2)
    This block uses the variable "i" to control the iterations. With each iteration, the value of "i" is determined by the items in a given list.
    Learn more`,

        'controls_flow_statements': `Break out/continue
    This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.
    Learn more`,

        'loads_from_url': `Loads from URL
    This block allows you to load blocks from a URL if you have them stored on a remote server, and they will be loaded only when your bot runs.`,


        'ignore': `Ignore
    Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.`,

        'console': `Console
    This block displays messages in the developer's console with an input that can be either a string of text, a number, boolean, or an array of data.
    Learn more`,

        'simple_moving_average__sma_': `Simple Moving Average (SMA)
    SMA is a frequently used indicator in technical analysis. It calculates the average market price over a specified period, and is usually used to identify market trend direction: up or down. For example, if the SMA is moving upwards, it means the market trend is up.
    Learn more`,

        'simple_moving_average_array__smaa_': `Simple Moving Average Array (SMAA)
    Similar to SMA, this block gives you the entire SMA line containing a list of all values for a given period.`,

        'bollinger_bands__bb_': `Bollinger Bands (BB)
    BB is a technical analysis indicator that’s commonly used by traders. The idea behind BB is that the market price stays within the upper and lower bands for 95% of the time. The bands are the standard deviations of the market price, while the line in the middle is a simple moving average line. If the price reaches either the upper or lower band, there’s a possibility of a trend reversal.`,

        'bollinger_bands_array__bba_': `Bollinger Bands Array (BBA)
    Similar to BB. This block gives you a choice of returning the values of either the lower band, higher band, or the SMA line in the middle.`,

        'exponential_moving_average__ema_': `Exponential Moving Average (EMA)
    EMA is a type of moving average that places more significance on the most recent data points. It’s also known as the exponentially weighted moving average. EMA is different from SMA in that it reacts more significantly to recent price changes.
    `,

        'exponential_moving_average_array__emaa_': `Exponential Moving Average Array (EMAA)
    This block is similar to EMA, except that it gives you the entire EMA line based on the input list and the given period.`,

        'relative_strength_index__rsi_': `Relative Strength Index (RSI)
    RSI is a technical analysis tool that helps you identify the market trend. It will give you a value from 0 to 100. An RSI value of 70 and above means that the asset is overbought and the current trend may reverse, while a value of 30 and below means that the asset is oversold.`,

        'relative_strength_index_array__rsia_': `Relative Strength Index Array (RSIA)
    Similar to RSI, this block gives you a list of values for each entry in the input list.`,

         'moving_average_convergence_divergence': `Moving Average Convergence Divergence
    MACD is calculated by subtracting the long-term EMA (26 periods) from the short-term EMA (12 periods). If the short-term EMA is greater or lower than the long-term EMA than there’s a possibility of a trend reversal.`,

    // Add more keys and values as needed
};
*/
/*
const IndicatorBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">

    <block type="Simple_Moving_Average__SMA_" x="10" y="70">
      <statement name="smas">
        <block type="input_List">
          <next>
            <block type="Period__">
              <value name="pv">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
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
        <statement name="macds">
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
*/