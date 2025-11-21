Blockly.defineBlocksWithJsonArray([
   {
      "type": "tradeparameters",
      "tooltip": "",
      "helpUrl": "",
      "message0": "1.Trade parameters               %1 %2 %3 Run once at start:%4 %5 %6 Trade options:%7 %8 %9",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": " ", //1.Trade parameters
          "name": "NAME",
          //"style": "color-white" // CSS class to apply black text

        },
        {
          "type": "input_end_row",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "Trade parameters"
        },
        {
          "type": "field_label_serializable",
          "text": " ", //Run once at start:
          "name": "NAME"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "Run once at start"
        },
        {
          "type": "field_label_serializable",
          "text": "                       ", //Trade options:
          "name": "NAME"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "Trade options"
        }
      ],
      "colour": "#064e72",
      "inputsInline": false
   },
   {
      "type": "Market__",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Market : %1 %2 > %3 %4 > %5 %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": " ", // Market :
          "name": "Market"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Derived",
              "Derived"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": " ", // >
          "name": "NAME"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": " ", // >
          "name": "NAME"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Trade_Type",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Trade Type:",
          "name": "Trade Type:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Up/Down",
              "Up/Down"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": ">",
          "name": "NAME"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Rise/Fall",
              "Rise/Fall"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Contract_Type",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Contract Type:",
          "name": "Contract Type:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Both",
              "Both"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Default_Candle_Interval",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Default Candle Interval:",
          "name": "Default Candle Interval:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "1 minute",
              "1 minute"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Restart_buy_sell",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Restart buy/sell (disable for better perfomance): %1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "       ", //Restart buy/sell (disable for better perfomance):
          "name": "NAME"
        },
        {
          "type": "field_checkbox",
          "name": "Rb/s",
          "checked": "TRUE"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Restart_last_trade_on_error",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Restart last trade on error (bot ignores the unsuccesful trade):      %1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "      ", //Restart last trade on error (bot ignores the unsuccesful trade):
          "name": "NAME"
        },
        {
          "type": "field_checkbox",
          "name": "Rlt",
          "checked": "TRUE"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Duration",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Duration: %1 %2 %3 Stake: USD %4 %5 (min:0.35 - max:50000) %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": " ", // Duration:
          "name": "NAME"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Ticks",
              "Ticks"
            ],
            [
              "Seconds",
              "Seconds"
            ],
            [
              "Minutes",
              "Minutes"
            ],
            [
              "Hours",
              "Hours"
            ],
            [
              "Days",
              "Days"
            ]
          ]
        },
        {
          "type": "field_number",
          "name": "duration",
          "value": 0
        },
        {
          "type": "field_label_serializable",
          "text": " ", //Stake: USD
          "name": "stak"
        },
        {
          "type": "field_number",
          "name": "stakeu",
          "value": 0
        },
        {
          "type": "field_label_serializable",
          "text": " ", // (min:0.35 - max:50000)
          "name": "NAME"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Multiplier",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Multiplier :",
          "name": "Multiplier :"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "Stake: USD",
          "name": "Stake: USD"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 0
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "Multiplier"
        }
      ],
      "previousStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
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
        "colour": "#e5e5e5",
        "tooltip": "Set your take profit value",
        "helpUrl": ""
    },
    {
        "type": "stop_loss_block",  // New Stop Loss block
        "message0": "Stop Loss: USD %1 %2",
        "args0": [
            {
                "type": "field_number",
                "name": "STOP_LOSS",
                "value": 0,
                "min": 0
            },
            {
                "type": "input_dummy"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#e5e5e5",
        "tooltip": "Set your stop loss value",
        "helpUrl": ""
    },
    {
      "type": "Growth_Rate",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Growth Rate:",
          "name": "Growth Rate:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "Stake: USD",
          "name": "Stake: USD"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 0
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "Growth Rate"
        }
      ],
      "previousStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "_2__Purchase_conditions_",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "2. Purchase conditions                        ",
          "name": "2. Purchase conditions "
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        }
      ],
      "colour": "#064e72",
      "inputsInline": false
    },
    {
      "type": "Purchase",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Purchase", // Purchase
          "name": "Purchase"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Rise",
              "Rise"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "_3__Sell_conditions",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "3. Sell conditions                             ",
          "name": "3. Sell conditions"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        }
      ],
      "colour": "#064e72",
      "inputsInline": false
    },
    {
      "type": "sell_at_market_price",
      "tooltip": "",
      "helpUrl": "",
      "message0": "sell at market price %1",
      "args0": [
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",  // Match the "Sell conditions" category color
    },
    {
      "type": "4_Restart trading conditions",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "4. Restart trading conditions                             ",
          "name": "4. Restart trading conditions"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        }
      ],
      "colour": "#064e72",
      "inputsInline": false
    },
    {
      "type": "Trade_again",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Trade again %1",
      "colour": "#e5e5e5",  // Match the "Sell conditions" category color
      "args0": [
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null
    },
    {
      "type": "sma",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "sma",
          "variable": "sma"
        },
        {
          "type": "field_label_serializable",
          "text": "to Simple Moving Average        ",
          "name": "to Simple Moving Average"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "sma_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "smaa",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "smaa",
          "variable": "smaa"
        },
        {
          "type": "field_label_serializable",
          "text": "to Simple Moving Average Array          ",
          "name": "to Simple Moving Average Array "
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "smaa_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "bba",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "bba",
          "variable": "bba"
        },
        {
          "type": "field_label_serializable",
          "text": " to Bollinger Bands  Array   ",
          "name": "to Bollinger Bands  Array "
        },
        {
          "type": "field_variable",
          "name": "middle",
          "variable": "middle"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "bba_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "bb",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "bb",
          "variable": "bb"
        },
        {
          "type": "field_label_serializable",
          "text": " to Bollinger Bands  ",
          "name": "to Bollinger Bands "
        },
        {
          "type": "field_variable",
          "name": "middle",
          "variable": "middle"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "bb_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "ema",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "ema",
          "variable": "ema"
        },
        {
          "type": "field_label_serializable",
          "text": " to Eponetial Moving Average    ",
          "name": " to Eponetial Moving Average    "
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "ema_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "emaa",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "emaa",
          "variable": "emaa"
        },
        {
          "type": "field_label_serializable",
          "text": " to Eponetial Moving Average Array    ",
          "name": " to Eponetial Moving Average Array "
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "emaa_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "rsia",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "rsia",
          "variable": "rsia"
        },
        {
          "type": "field_label_serializable",
          "text": " to Relative Strength Index Array     ",
          "name": " to Relative Strength Index Array "
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "rsia_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "rsi",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "rsi",
          "variable": "rsi"
        },
        {
          "type": "field_label_serializable",
          "text": " to Relative Strength Index      ",
          "name": " to Relative Strength Index"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "rsi_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "macda",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "set ",
          "name": "NAME"
        },
        {
          "type": "field_variable",
          "name": "macda",
          "variable": "macda"
        },
        {
          "type": "field_label_serializable",
          "text": " to MACD Array ",
          "name": " to MACD Array "
        },
        {
          "type": "field_variable",
          "name": "MACD",
          "variable": "MACD"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "macda_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Input_List",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Input List",
          "name": "NAME"
        },
        {
          "type": "input_value",
          "name": "NAME",
          "check": "Array"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Period",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Period",
          "name": "Period"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 10,
          "min": 2
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "bbsu",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Standard Deviation Up Multiplier",
          "name": "Standard Deviation Up Multiplier"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 5,
          "min": 1
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "bbsd",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Standard Deviation Down Multiplier",
          "name": "Standard Deviation Down Multiplier"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 5,
          "min": 1
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "MACDF",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Fast EMA Period",
          "name": "Fast EMA Period"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 12,
          "min": 2
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "MACDS",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Slow EMA Period",
          "name": "Slow EMA Period"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 26,
          "min": 2
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "MACDSI",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Signal EMA Period",
          "name": "Signal EMA Period"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 9,
          "min": 2
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Run_on_every_tick",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "The content of this block is called on every tick     ",
          "name": "The content of this block is called "
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        }
      ],
      "colour": "#064e72",
      "inputsInline": false
    },
    {
      "type": "Last_Tick",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Last Tick",
          "name": "Last Tick"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Last_Digit",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Last Digit",
          "name": "Last Digit"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Current_Stat",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Current Stat",
          "name": "Current Stat"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Current_stat_list",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Current stat list",
          "name": "Current stat list"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Tick_list",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Tick list",
          "name": "Tick list"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Last_digits_list",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Last digits list",
          "name": "Last digits list"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Market_direction",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Direction is",
          "name": "Direction is"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Rise",
              "Rise"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": false
    },
    {
      "type": "Is_candle_black_",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Is candle",
          "name": "Is candle"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "black?",
          "name": "black?"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Read_candle_value_(1)",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "In candles list read",
          "name": "In candles list read"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Open",
              "Open"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "# from end",
          "name": "# from end"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 1
        },
        {
          "type": "field_label_serializable",
          "text": "with interval:",
          "name": "with interval:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Default",
              "Default"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Read_candle_value__2_",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Read",
          "name": "Read"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Open",
              "Ope"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "value in candle",
          "name": "value in candle"
        },
        {
          "type": "input_value",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Create_a_list_of_candle_values__1_",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Make a list of",
          "name": "Make a list of"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Open",
              "Ope"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "values in candles list with interval:",
          "name": "values in candles list with interval:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Default",
              "Default"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Create_a_list_of_candle_values__2_",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Make a list of",
          "name": "Make a list of"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Open",
              "Ope"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "values from candles list ",
          "name": "values from candles list "
        },
        {
          "type": "input_value",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Get_candle",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "in candle list # get candle from end",
          "name": "in candle list # get candle from end"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 1
        },
        {
          "type": "field_label_serializable",
          "text": "with interval:",
          "name": "with interval:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Default",
              "Default"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Get_candle_list",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "candle list with interval here 2:",
          "name": "candle list with interval here 2:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Default",
              "Default"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Last_trade_result",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Result is",
          "name": "Result is"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Win",
              "Win"
            ],
            [
              "Loss",
              "Loss"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Contract_details",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Contract Details:",
          "name": "Contract Details:"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "deal referece id",
              "deal referece id"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Profit_loss_from_selling",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Sell profit/loss",
          "name": "Sell profit/loss"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Can_contract_be_sold_",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Sell is available",
          "name": "Sell is available"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Potential_payout",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "payout",
          "name": "payout"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Not available",
              "Not available"
            ],
            [
              "Loss",
              "Loss"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Purchase_price",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Ask price",
          "name": "Ask price"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "Not available",
              "Not available"
            ],
            [
              "Loss",
              "Loss"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Account_balance",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Balance:",
          "name": "Balance"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "string",
              "string"
            ],
            [
              "number",
              "number"
            ]
          ]
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Total_profit_loss",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Total profit/loss",
          "name": "Total profit/loss"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Number_of_runs",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Number of runs",
          "name": "Number of runs"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Function_1",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "function",
          "name": "function"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "do something"
        },
        {
          "type": "field_label_serializable",
          "text": "",
          "name": "NAME"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        }
      ],
      "colour": "#e5e5e5"
    },
    {
      "type": "Function_that_returns_a_value",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "function",
          "name": "function"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "do something"
        },
        {
          "type": "field_label_serializable",
          "text": "",
          "name": "NAME"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "return",
          "name": "NAME"
        },
        {
          "type": "input_value",
          "name": "NAME"
        }
      ],
      "colour": "#e5e5e5"
    },
    {
      "type": "Conditional_return",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "If",
          "name": "If"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "do something"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "return",
          "name": "NAME"
        },
        {
          "type": "input_value",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Custom_function",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "do something",
          "name": "do something"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Custom_function_1",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "do something2",
          "name": "do something2"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Print",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Print",
          "name": "Print"
        },
        {
          "type": "field_input",
          "name": "abc",
          "text": "abc"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Request_an_input",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "prompt for ",
          "name": "Print"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "string",
              "string"
            ],
            [
              "number",
              "number"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "with message ",
          "name": "NAME"
        },
        {
          "type": "field_input",
          "name": "abc",
          "text": "abc"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Notify",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Notify",
          "name": "Notify"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "green",
              "green"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "with soud ",
          "name": "NAME"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "silent",
              "silent"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "option",
              "OPTIONNAME"
            ]
          ]
        },
        {
          "type": "field_input",
          "name": "abc",
          "text": "abc"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Notify_Telegram",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Notify Telegram Access Token:",
          "name": "Notify Telegram Access Token:"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": " Chart ID:",
          "name": " Chart ID:"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "Message:",
          "name": "NAME"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "abc"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Second_Since_Epoch",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Second Since Epoch",
          "name": "Second Since Epoch"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Delayed_run",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "                                         ",
          "name": "Second Since Epoch"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "Run after",
          "name": "NAME"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "second(s)",
          "name": "second(s)"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Tick_Delay_run",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6 %7",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "                                  ",
          "name": "Second Since Epoch"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "Run after",
          "name": "NAME"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "tick(s)",
          "name": "tick(s)"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Convert_to_timestamp",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "To timestamp",
          "name": "To timestamp"
        },
        {
          "type": "field_input",
          "name": "yyyy-mm-dd hh:mm:ss",
          "text": "yyyy-mm-dd hh:mm:ss"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "Convert_to_date_time",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "To date/time",
          "name": "To date/time"
        },
        {
          "type": "field_number",
          "name": "NAME",
          "value": 1
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "variables_change",
      "message0": "Change %1 by %2",
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "item"  // The variable to change
        },
        {
          "type": "field_number",
          "name": "DELTA",
          "value": 1  // Placeholder for the change amount (default to 1)
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "tooltip": "Change a variable by a certain value",
      "helpUrl": ""
    },
    {
      "type": "aggregate_operations",
      "message0": "%1 of list %2",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "AGGREGATE_OP",
          "options": [
            ["SUM", "SUM"],
            ["AVERAGE", "AVERAGE"],
            ["MIN", "MIN"],
            ["MAX", "MAX"]
          ]
        },
        {
          "type": "input_value",
          "name": "LIST",
          "check": "Array"  // Ensures the input is a list
        }
      ],
      "output": null,  // Left output to connect to other blocks
      "colour": "#e5e5e5",
      "tooltip": "Perform aggregate operations like sum, average, min, or max on a list",
      "helpUrl": ""
    },
    {
      "type": "dummy_text_block",
      "message0": "%1",
      "args0": [
        {
          "type": "field_input",
          "name": "TEXT",
          "text": "abc"  // Prewritten and editable text "abc"
        }
      ],
      "output": null,  // Left connection to output a value
      "colour": 160,
      "tooltip": "An editable text field block",
      "helpUrl": ""
    },
    {
      "type": "text_join_statement",
      "message0": "join texts %1",
      "args0": [
        {
          "type": "input_value",
          "name": "ADD0"
        }
      ],
      "mutator": "text_join_mutator",  // Keep the mutator for dynamic inputs
      "previousStatement": null,  // Top connection
      "nextStatement": null,  // Bottom connection
      "colour": "#e5e5e5",  // Block color
      "tooltip": "Join multiple pieces of text",
      "helpUrl": ""
    },
    {
      "type": "text_value_block",
      "message0": "text %1",
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "tooltip": "Custom block with text input",
      "helpUrl": ""
    },
    {
      "type": "Search_for_string",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4 %5 %6",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "in text",
          "name": "in text"
        },
        {
          "type": "input_value",
          "name": "NAME"
        },
        {
          "type": "field_label_serializable",
          "text": "find",
          "name": "NAME"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "first",
              "first"
            ],
            [
              "last",
              "last"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "occurence of text",
          "name": "occurence of text"
        },
        {
          "type": "input_value",
          "name": "NAME"
        }
      ],
      "output": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },
    {
      "type": "custom_list_check",
      "message0": "list %1",
      "args0": [
        {
          "type": "input_value",
          "name": "LIST"
        }
      ],
      "output": null,  // This will return a boolean (true or false)
      "colour": "#e5e5e5",
      "tooltip": "Check if a list is empty",
      "helpUrl": ""
    },
    {
      "type": "dummy_coma_block",
      "message0": "%1",
      "args0": [
        {
          "type": "field_input",
          "name": "TEXT",
          "text": ","  // Prewritten and editable text "abc"
        }
      ],
      "output": null,  // Left connection to output a value
      "colour": 160,
      "tooltip": "An editable text field block",
      "helpUrl": ""
    },
    {
      "type": "Loads_from_URL",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Loads from URL %1 %2",
      "colour": "#e5e5e5",  // Match the "Sell conditions" category color
      "args0": [
        {
          "type": "field_input",
          "name": "NAME",
          "text": "http://www.example.com/block_xml"
        },
        {
          "type": "input_dummy",
          "name": "NAME"
        }
      ],
      "inputsInline": true
    },
    {
      "type": "Ignore",
      "tooltip": "",
      "helpUrl": "",
      "message0": "Ignore %1 %2",
      "colour": "#064e72",  // Match the "Sell conditions" category color
      "args0": [
        {
          "type": "input_dummy",
          "name": "NAME"
        },
        {
          "type": "input_statement",
          "name": "NAME"
        }
      ],
      "inputsInline": true
    },
    {
      "type": "Console",
      "tooltip": "",
      "helpUrl": "",
      "message0": "%1 %2 %3 %4",
      "args0": [
        {
          "type": "field_label_serializable",
          "text": "Console",
          "name": "Console"
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              "log",
              "log"
            ],
            [
              "first",
              "first"
            ],
            [
              "option",
              "OPTIONNAME"
            ],
            [
              "last",
              "last"
            ]
          ]
        },
        {
          "type": "field_label_serializable",
          "text": "value:",
          "name": "value:"
        },
        {
          "type": "input_value",
          "name": "console_"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#e5e5e5",
      "inputsInline": true
    },

]);


const myTheme = Blockly.Theme.defineTheme('myTheme', {
  'blockStyles': {
    'math_blocks': {
      'colourPrimary': '#e5e5e5',  // Light gray color for math blocks
      'colourSecondary': '#b3b3b3',  // Optional secondary color
      'colourTertiary': '#999999'  // Optional tertiary color for borders
    },
    'logic_blocks': {
      'colourPrimary': '#e5e5e5',  // Blue color for logic blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'loop_blocks': {
      'colourPrimary': '#e5e5e5',  // Orange color for loop blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'list_blocks': {
      'colourPrimary': '#e5e5e5',  // Purple color for list blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    },
    'text_blocks': {
      'colourPrimary': '#e5e5e5',  // Green color for text blocks
      'colourSecondary': '#b3b3b3',
      'colourTertiary': '#999999'
    }
  },
  'componentStyles': {
    'workspaceBackgroundColour': '#f4f4f4',  // Optional workspace background color
    'scrollbarColour': '#888'  // Optional scrollbar color
  }
});

const tradeParametersBlocks =`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="tradeparameters" x="10" y="10">
        <statement name="Trade parameters">
          <block type="Market__">
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
        <statement name="Trade options">
            <block type="Duration"></block>
        </statement>
      </block>
      <block id="trade_param_2" type="Duration" x="10" y="520"></block>
      <block id="trade_param_3" type="Multiplier" x="10" y="670"></block>
      <block id="trade_param_4" type="take_profit_block" x="10" y="800"></block>
      <block id="trade_param_5" type="stop_loss_block" x="10" y="1020"></block>
      <block id="trade_param_6" type="Growth_Rate" x="10" y="1240"></block>
      <block id="trade_param_7" type="take_profit_block" x="10" y="1460"></block>
    </xml>
`;

const purchaseConditionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="purchase_cond_block_1" type="_2__Purchase_conditions_" x="10" y="20"></block>
  <block id="purchase_cond_block_2" type="Purchase" x="10" y="50"></block>
</xml>`;

const sellConditionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="sell_cond_block_1" type="_3__Sell_conditions" x="10" y="20"></block>
  <block id="sell_cond_block_2" type="sell_at_market_price" x="10" y="50"></block>
</xml>`;

const restartTradingConditionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="restart_trading_block_1" type="4_Restart trading conditions" x="10" y="20"></block>
  <block id="restart_trading_block_2" type="Trade_again" x="10" y="50"></block>
</xml>`;

const IndicatorBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">

<block id="smaBlock" type="sma" x="10" y="20">
  <statement name="sma_">
    <block type="Input_List">
      <next>
        <block type="Period">
        </block>
      </next>
    </block>
  </statement>
</block>


  <block id="Indicator_block_2" type="smaa" x="10" y="140">
    <statement name="smaa_">
      <block type="Input_List">
        <next>
          <block type="Period"></block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_3" type="bb" x="10" y="140">
    <statement name="bb_">
      <block type="Input_List">
        <next>
          <block type="Period">
            <next>
              <block type="bbsu">
                <next>
                  <block type="bbsd"></block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_4" type="bba" x="10" y="250">
    <statement name="bba_">
      <block type="Input_List">
        <next>
          <block type="Period">
            <next>
              <block type="bbsu">
                <next>
                  <block type="bbsd"></block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_5" type="ema" x="10" y="340">
    <statement name="ema_">
      <block type="Input_List">
        <next>
          <block type="Period"></block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_6" type="emaa" x="10" y="440">
    <statement name="emaa_">
      <block type="Input_List">
        <next>
          <block type="Period"></block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_7" type="rsi" x="10" y="540">
    <statement name="rsi_">
      <block type="Input_List">
        <next>
          <block type="Period"></block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_8" type="rsia" x="10" y="660">
    <statement name="rsia_">
      <block type="Input_List">
        <next>
          <block type="Period"></block>
        </next>
      </block>
    </statement>
  </block>

  <block id="Indicator_block_9" type="macda" x="10" y="780">
    <statement name="macda_">
      <block type="Input_List">
        <next>
          <block type="MACDF">
            <next>
              <block type="MACDS">
                <next>
                  <block type="MACDSI"></block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>

</xml>`;

const TickandcandleanalysisBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="t1" type="Run_on_every_tick" x="10" y="20"></block>
  <block id="t2" type="Last_Tick" x="10" y="70"></block>
  <block id="t3" type="Last_Digit" x="10" y="120"></block>
  <block id="t4" type="Tick_list" x="10" y="170"></block>
  <block id="t4" type="Current_Stat" x="10" y="170"></block>
  <block id="t4" type="Current_stat_list" x="10" y="170"></block>
  <block id="t4" type="Tick_list" x="10" y="170"></block>
  <block id="t5" type="Last_digits_list" x="10" y="220"></block>
  <block id="t6" type="Market_direction" x="10" y="270"></block>
  <block id="t7" type="Is_candle_black_" x="10" y="170"></block>
  <block id="t8" type="Read_candle_value_(1)" x="10" y="320"></block>
  <block id="t9" type="Read_candle_value__2_" x="10" y="370"></block>
  <block id="t10" type="Create_a_list_of_candle_values__1_" x="10" y="420"></block>
  <block id="t11" type="Create_a_list_of_candle_values__2_" x="10" y="470"></block>
  <block id="t12" type="Get_candle" x="10" y="520"></block>
  <block id="t13" type="Get_candle_list" x="10" y="570"></block>
</xml>`;

const ContractBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="c1" type="Last_trade_result" x="10" y="20"></block>
  <block id="c2" type="Contract_details" x="10" y="70"></block>
  <block id="c3" type="Profit_loss_from_selling" x="10" y="120"></block>
  <block id="c4" type="Can_contract_be_sold_" x="10" y="170"></block>
  <block id="c5" type="Potential_payout" x="10" y="220"></block>
  <block id="c6" type="Purchase_price" x="10" y="270"></block>
</xml>`;


const StartsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="s1" type="Account_balance" x="10" y="70"></block>
  <block id="s2" type="Total_profit_loss" x="10" y="120"></block>
  <block id="s3" type="Number_of_runs" x="10" y="170"></block>
</xml>`;

const CustomFunctionsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="cf1" type="Function_1" x="10" y="120"></block>
  <block id="cf2" type="Function_that_returns_a_value" x="10" y="170"></block>
  <block id="cf3" type="Conditional_return" x="10" y="220"></block>
  <block id="cf4" type="Custom_function" x="10" y="270"></block>
  <block id="cf5" type="Custom_function_1" x="10" y="320"></block>
</xml>`;

const VariablesBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="v1" type="math_number" x="10" y="20"></block>
  <block id="v2" type="logic_compare" x="10" y="70"></block>
</xml>`;

const NotificationsBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="n1" type="Print" x="10" y="120"></block>
  <block id="n2" type="Request_an_input" x="10" y="170"></block>
  <block id="n3" type="Notify" x="10" y="220"></block>
  <block id="n4" type="Notify_Telegram" x="10" y="270"></block>
</xml>`;

const TimeBlocks =
`<xml xmlns="http://www.w3.org/1999/xhtml">
  <block id="ti1" type="Second_Since_Epoch" x="10" y="20"></block>
  <block id="ti2" type="Delayed_run" x="10" y="70"></block>
  <block id="ti3" type="Convert_to_timestamp" x="10" y="120"></block>
  <block id="ti4" type="Convert_to_date_time" x="10" y="170"></block>
</xml>`;

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

const blockSections = {
    'trade_param': Blockly.utils.xml.textToDom(tradeParametersBlocks),
    'purchase_cond': Blockly.utils.xml.textToDom(purchaseConditionsBlocks),
    'sell_cond': Blockly.utils.xml.textToDom(sellConditionsBlocks),
    'restart_trading': Blockly.utils.xml.textToDom(restartTradingConditionsBlocks)
};

class CustomBlockDragger extends Blockly.dragging.Dragger {
    constructor(draggable, workspace) {
        super(draggable, workspace);
        // Add any custom initialization here if needed
    }

    onDragStart(e) {
        this.startLoc = this.draggable.getRelativeToSurfaceXY(); // Save starting location
        this.draggable.startDrag(e); // Start the drag with the event
        console.log('Custom drag started');
    }

    onDrag(e, totalDelta) {
        const delta = this.pixelsToWorkspaceUnits(totalDelta);
        const newLoc = Coordinate.sum(this.startLoc, delta); //Blockly.utils.Coordinate.sum(this.startLoc, delta);

        //const newLoc = Coordinate.sum(this.startLoc, delta);
        this.draggable.drag(newLoc, e); // Move the draggable
        console.log('Block moved with custom dragger:', newLoc);
    }

    onDragEnd(e) {
        this.draggable.endDrag(e); // End the drag with the event
        console.log('Custom drag ended');
    }
}

// Register the custom dragger using Blockly's registry
Blockly.registry.register(Blockly.registry.Type.BLOCK_DRAGGER, 'CUSTOM_BLOCK_DRAGGER', CustomBlockDragger);

document.addEventListener('DOMContentLoaded', function () {
    createWorkspace();
});

function createWorkspace() {
    const blocklyDiv = document.getElementById('blocklyDiv');

    const workspace = Blockly.inject(blocklyDiv, {
        toolbox: null,
        trashcan: true,
        theme: myTheme,  // Apply the custom theme
        renderer: 'zelos',  // Use the 'zelos' renderer
        zoom: {
            controls: false,
            //wheel: true,
            startScale: 0.5,  // Increases the size of the blocks
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,    // Set grid spacing for snapping (can be any number)
            length: 0,      // This effectively hides the grid lines
            colour: null,   // No grid line color to make it invisible
            snap: false     // Don't snap blocks to the invisible grid
        },
        //scrollbars: true,  // Enable scrollbars for panning the workspace
        move: {
            //scrollbars: true,  // Allows the user to drag the workspace to hidden parts
            drag: true,        // Allow dragging the workspace itself
            //wheel: true        // Enable panning with the mouse wheel
        }
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
        modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 370px; height: 370px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto; overflow-x: hidden;';
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
                tempWorkspaceDiv.style = 'width: 370px; height: 870px;'; // "width: 100%; height: 100%; overflow: hidden;" //

                modal.appendChild(tempWorkspaceDiv);
                const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                    toolbox: null,
                    horizontalLayout: false,
                    move: {
                        scrollbars: {
                          horizontal: false,
                          vertical: true
                        },
                        drag: true,
                        wheel: true,
                    },
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

                // Optional: Resize the workspace when the window is resized or on modal interactions
                window.addEventListener('resize', resizeWorkspace);

                let isDragging = false;
                let draggedBlockXml = null;
                let addedBlock = null;
                let mainBlock = null;

                let mouseLocation = { x: 0, y: 0 }; // Declare this variable outside the scope to capture globally

                // Add a click event listener to record mouse position when clicked
                document.addEventListener('click', (event) => {
                    mouseLocation = {
                        x: event.clientX, // mouse x position
                        y: event.clientY  // mouse y position
                    };
                    console.log('Mouse Location on click:', mouseLocation);
                });

                tempWorkspace.addChangeListener((event) => {
                    if (event.type === Blockly.Events.BLOCK_DRAG && event.isStart) {
                        const block = tempWorkspace.getBlockById(event.blockId);
                        draggedBlockXml = Blockly.Xml.blockToDom(block);

                        // Convert block position in temp workspace to main workspace
                        let blockPosition = block.getRelativeToSurfaceXY();
                        let screenPosition = Blockly.utils.svgMath.wsToScreenCoordinates(tempWorkspace, blockPosition)
                        //let screenPosition = Blockly.utils.svgMath.workspaceToScreenCoordinates(tempWorkspace, blockPosition);

                        console.log('Block position in workspace coordinates:', blockPosition);

                        console.log('Block position in screen coordinates:', screenPosition);

                        // Dispose the block in the temp workspace
                        block.dispose(false, false);

                        // Hide modal
                        modal.style.display = 'none';

                        console.log('Mouse Location on drag start:', mouseLocation);

                        // Add block to the main workspace
                        var mainBlockXml = document.createElement('xml');
                        mainBlockXml.appendChild(draggedBlockXml);
                        Blockly.Xml.domToWorkspace(mainBlockXml, workspace);

                        // Find the newly added block in the main workspace
                        var newBlock = workspace.getBlockById(event.blockId);

                        // Step 2: Convert mouse screen coordinates to workspace coordinates
                        let workspacePosition = Blockly.utils.svgMath.screenToWsCoordinates(workspace, mouseLocation);

                        // Move the block to the mouse location in the main workspace
                        if (!isNaN(workspacePosition.x) && !isNaN(workspacePosition.y)) {
                            newBlock.moveBy(screenPosition.x, screenPosition.y);
                        } else {
                            console.error('Invalid coordinates for block movement:', workspacePosition);
                        }

                        console.log('Block moved to:', workspacePosition);

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
                modal.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 370px; height: 370px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); display: none; z-index: 20; overflow-y: auto;  overflow: auto;';
                workspace.getParentSvg().parentNode.appendChild(modal);

                subsectionDiv.addEventListener('click', () => {

                    modal.innerHTML = '';

                    modal.style.display = 'block';

                    let sectionBlockXml;
                    switch (subsectionName) {
                        case 'Indicator':
                            sectionBlockXml = Blockly.utils.xml.textToDom(IndicatorBlocks);
                            break;
                        case 'Tick and candle analysis':
                            sectionBlockXml = Blockly.utils.xml.textToDom(TickandcandleanalysisBlocks);
                            break;
                        case 'Contract':
                            sectionBlockXml = Blockly.utils.xml.textToDom(ContractBlocks);
                            break;
                        case 'starts':
                            sectionBlockXml = Blockly.utils.xml.textToDom(StartsBlocks);
                            break;
                        case 'Custom Functions':
                            sectionBlockXml = Blockly.utils.xml.textToDom(CustomFunctionsBlocks);
                            break;
                        case 'Variables':
                            sectionBlockXml = Blockly.utils.xml.textToDom(VariablesBlocks);
                            break;
                        case 'Notifications':
                            sectionBlockXml = Blockly.utils.xml.textToDom(NotificationsBlocks);
                            break;
                        case 'Time':
                            sectionBlockXml = Blockly.utils.xml.textToDom(TimeBlocks);
                            break;
                        case 'Math':
                            sectionBlockXml = Blockly.utils.xml.textToDom(MathBlocks);
                            break;
                        case 'Text':
                            sectionBlockXml = Blockly.utils.xml.textToDom(TextBlocks);
                            break;
                        case 'Logic':
                            sectionBlockXml = Blockly.utils.xml.textToDom(LogicBlocks);
                            break;
                        case 'Lists':
                            sectionBlockXml = Blockly.utils.xml.textToDom(ListsBlocks);
                            break;
                        case 'Loops':
                            sectionBlockXml = Blockly.utils.xml.textToDom(LoopsBlocks);
                            break;
                        case 'Miscellaneous':
                            sectionBlockXml = Blockly.utils.xml.textToDom(MiscellaneousBlocks);
                            break;
                    }

                    if (sectionBlockXml) {
                        const tempWorkspaceDiv = document.createElement('div');
                        tempWorkspaceDiv.style = 'width: 370px; height: 370px;';

                        modal.appendChild(tempWorkspaceDiv);
                        const tempWorkspace = Blockly.inject(tempWorkspaceDiv, {
                            toolbox: null,
                            horizontalLayout: false,
                            theme: myTheme,  // Apply the custom theme
                            renderer: 'zelos',  // Use the 'zelos' renderer
                            move: {
                                scrollbars: {
                                  horizontal: false,
                                  vertical: true
                                },
                                drag: true,
                                wheel: true,
                            },
                        });

                        // Resize the workspace when the modal is opened
                        const resizeWorkspace = () => {
                            Blockly.svgResize(tempWorkspace);
                        };

                        tempWorkspace.resize();

                        setTimeout(() => {
                            Blockly.Xml.domToWorkspace(sectionBlockXml, tempWorkspace);
                            tempWorkspace.resize();
                        }, 0);

                        let isDragging = false;
                        let draggedBlockXml = null;
                        let addedBlock = null;
                        let mainBlock = null;

                        tempWorkspace.addChangeListener((event) => {
                            if (event.type === Blockly.Events.BLOCK_DRAG) {
                                const block = tempWorkspace.getBlockById(event.blockId);
                                draggedBlockXml = Blockly.Xml.blockToDom(block);
                                const mainBlockXml = document.createElement('xml');
                                mainBlockXml.appendChild(draggedBlockXml);

                                // Capture all blocks before adding the new one
                                var initialBlocks = workspace.getAllBlocks();
                                //block.dispose(false, false);

                                Blockly.Xml.domToWorkspace(mainBlockXml, workspace);
                                isDragging = true;

                                // Dispose of the block from the temp workspace
                                block.dispose(false, false);

                                // Find the newly added block in the main workspace
                                var newBlocks = workspace.getAllBlocks();
                                addedBlock = newBlocks.find(b => !initialBlocks.includes(b));

                                if (addedBlock) {
                                    var blockId = addedBlock.id;
                                    console.log('New block ID:', blockId);
                                }

                                // Hide the modal
                                modal.style.display = 'none';
                            }

                            if (isDragging) {
                                // Make sure 'addedBlock' exists before continuing
                                if (!addedBlock) return;

                                document.addEventListener('mousemove', (event) => {

                                    // Use the real mouse position from the event
                                    const mouseX = event.clientX;
                                    const mouseY = event.clientY;

                                    // Convert the screen coordinates to workspace coordinates
                                    let screenCoordinates = { x: mouseX, y: mouseY };
                                    let wsCoord = Blockly.utils.svgMath.screenToWsCoordinates(workspace, screenCoordinates);

                                    // Extracting x and y coordinates
                                    let wsX = wsCoord.x;
                                    let wsY = wsCoord.y;

                                    //console.log("X workspace coordinate: ", wsX);
                                    //console.log("Y workspace coordinate: ", wsY);

                                    // Get the current position of the block (relative to the surface)
                                    var currentPos = addedBlock.getRelativeToSurfaceXY();

                                    // Calculate the offset (dx, dy)
                                    var dx = wsX - currentPos.x; // Horizontal offset
                                    var dy = wsY - currentPos.y; // Vertical offset

                                    // Attempt to move the block
                                    try {
                                        console.log('Moving block by:', dx, dy);
                                        addedBlock.moveBy(dx, dy, ['drag']);
                                        //block.dispose(false, false);
                                        console.log('Block moved to:', addedBlock.getRelativeToSurfaceXY());

                                        //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move (optional)
                                    } catch (error) {
                                        console.error("Error during block move: ", error);
                                    }
                                    // Move the block by the calculated offset
                                    //addedBlock.moveBy(dx, dy, ['drag']); // 'drag' is the reason for the move

                                    isDragging = false; // Set dragging to false after completing
                                    addedBlock = null;
                                });
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
