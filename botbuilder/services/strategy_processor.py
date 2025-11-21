from typing import Union, Dict, Any, Optional
from rx import Observable
import time  # For simulating a loop until Pd changes
import traceback
from collections import defaultdict
from datetime import datetime
import pandas as pd
import talib
import numpy as np
import re
import ast
import os
from decimal import Decimal
import redis
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from ws.ws_services.dc import DerivWebSocket
from shared.shared_q import shared_q
from channels.layers import get_channel_layer
import asyncio
import json
from ws.ws_services.dc import DerivWebSocket
from .market_subscriber import MarketSubscriptionManager
from ws.ws_services.redis_conn import (
    is_already_subscribed, get_subscription, store_subscription,
    add_subscription_mappin, get_all_subscriptions, set_bot_live_status,
    get_bot_live_status, get_subscription_mappin,
    set_chart_live_status, get_chart_live_status, remove_matching_subscriptions, remove_subs
)
from ws.ws_services.subscription_registry import (
    is_subscribed, mark_subscribed,
    is_tick_subscribed, mark_tick_subscribed,
    remove_tick_subscription, remove_candle_subscription,
)
from ws.ws_services.socket_registry import register_socket, has_socket, get_socket, update_task, get_task

# Global list to track active subscriptions
global active_subscriptions
global latest_proposals
active_subscriptions = {}  # Global dictionary to store contract_type and proposal_id pairs
latest_proposals = {}

# Initialize an empty DataFrame to store tick data
tick_data = pd.DataFrame(columns=['timestamp', 'ask', 'bid', 'quote', 'pip_size', 'spread', 'last_digit', 'market_direction'])

def indicator_list_xtractor(Roat1_result):
    """
    Extracts indicator names from string values inside Roat1_result.

    :param Roat1_result: Dictionary containing key-value pairs, where some values are strings with indicator lists.
    :return: A tuple (indicator_list, indicator_dic) where:
             - indicator_list: A list of unique extracted indicator names.
             - indicator_dic: A dictionary where keys and values remain the same as Roat1_result.
    """
    indicator_list = []  # List to store unique extracted indicators
    indicator_dic = {}   # Dictionary to store the original key-value pairs

    for key, value in Roat1_result.items():
        if isinstance(value, str):  # Ensure value is a string
            # Use regex to find `indicator_name = ["..."]`
            matches = re.findall(r'indicator_name\s*=\s*\[([^\]]+)\]', value)

            for match in matches:
                # Extract individual indicators and clean up quotes/spaces
                indicators = [item.strip().strip('"').strip("'") for item in match.split(",")]

                for indicator in indicators:
                    if indicator not in indicator_list:
                        indicator_list.append(indicator)

            # Store the original key-value pair
            indicator_dic[key] = value

    return indicator_list, indicator_dic  # Return both extracted indicators and the original dictionary


def Roat1_result_function(Roat1_result, tick_data, indicator_name):
    """
    Processes Roat1_result dictionary, checks for 'indicator_name' inside both dictionary and string values,
    and adds corresponding columns to tick_data DataFrame.

    :param Roat1_result: Dictionary containing indicator data
    :param tick_data: Pandas DataFrame to update with indicator columns
    :param indicator_name: Variable containing a list of indicator names
    :return: Updated tick_data DataFrame
    """
    # Ensure tick_data is a valid DataFrame
    if not isinstance(tick_data, pd.DataFrame):
        raise ValueError("tick_data must be a Pandas DataFrame.")

    # Ensure indicator_name is a list
    if not isinstance(indicator_name, list):
        raise ValueError("indicator_name must be a list of strings.")

    for key, value in Roat1_result.items():
        if isinstance(value, dict):
            # Original behavior: Process dictionary values
            if "indicator_name" in value and isinstance(value["indicator_name"], list):
                indicator_names = value["indicator_name"]
                if "code" in value and isinstance(value["code"], str):
                    for indicator in indicator_names:
                        if isinstance(indicator, str) and indicator not in tick_data.columns:
                            tick_data[indicator] = None

        elif isinstance(value, str):
            # New behavior: Check if "indicator_name" is inside the string
            if "indicator_name" in value:
                for indicator in indicator_name:
                    if isinstance(indicator, str) and indicator not in tick_data.columns:
                        tick_data[indicator] = None

    return tick_data  # Return updated DataFrame


def remove_leading_spaces(formula):
    # Split the block into lines
    lines = formula.split("\n")

    # Remove exactly 4 leading spaces from each line, if they exist
    stripped_lines = [line[4:] if line.startswith("    ") else line for line in lines]

    # Join the cleaned lines back into a single string
    cleaned_formula = "\n".join(stripped_lines)

    return cleaned_formula

async def subscribe_market_data(api, symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data):
    try:
        #tick = await tick_data_queue.get()  # 🟡 Pull new tick
        #print(f"Subscribing to market data for symbolticktickticktickticktickticktickticktickticktickticktickticktickv: {tick}")

        print(f"Subscribing to market data for symbol: {symbol}")

        # Subscribe to tick data
        source_tick = await api.subscribe({'ticks': symbol})

        if not source_tick:
            print(f"Subscription failed for symbol: {symbol}")
            return

        def handle_tick(tick):
            print("kk mainaaaaaaa:")
            global tick_data
            tick_time = datetime.fromtimestamp(tick['tick']['epoch'])
            tick_quote = float(tick['tick']['quote'])
            tick_ask = float(tick['tick']['ask'])
            tick_bid = float(tick['tick']['bid'])
            tick_pip_size = float(tick['tick']['pip_size'])
            tick_spread = float(tick_ask - tick_bid)

            # Append the new tick data to the DataFrame
            new_tick = pd.DataFrame(
                {'timestamp': [tick_time], 'ask': [tick_ask], 'bid': [tick_bid], 'quote': [tick_quote],
                 'pip_size': [tick_pip_size], 'spread': [tick_spread]})
            tick_data = pd.concat([tick_data, new_tick], ignore_index=True)

            # Keep only the last 1000 rows to optimize performance
            tick_data = tick_data.tail(1000)

            # Calculate indicator values and update tick_data
            for indicator_name, formula in indicator_df.items():
                try:
                    # print("formularrrrrrrr:\n", formula)
                    cleaned_formula = remove_leading_spaces(formula)
                    # print(cleaned_formula)
                    # tick_data[indicator_name] = eval(formula.replace("data_frame", "tick_data"))  # Apply formula
                    # tick_data[indicator_name] = eval(cleaned_formula)  # Apply formula
                    tick_data = p_a_e_p_code(cleaned_formula, tick_data)  #  n_tick_data =
                    print("Updated new_tick_data datarrrrrrrrggggggg:\n", tick_data)

                except Exception as e:
                    print(f"Error calculating {indicator_name}: {e}")

            # Add the update to the df_queue
            #asyncio.create_task(df_queue.put(tick_data))

            # Get the running event loop
            loop = asyncio.get_running_loop()

            # Use loop.call_soon_threadsafe to safely add data to the queue
            loop.call_soon_threadsafe(asyncio.create_task, df_queue.put(tick_data))
            #loop.call_soon_threadsafe(df_queue.put_nowait, tick_data)
            #loop.call_soon_threadsafe(asyncio.create_task, df_queue.put(tick_data))
            #asyncio.create_task(df_queue.put(tick_data))

            # Create a dictionary for the latest tick
            latest_tick = {
                "timestamp": tick_time.isoformat(),
                "ask": tick_ask,
                "bid": tick_bid,
                "quote": tick_quote,
                "pip_size": tick_pip_size,
                "spread": tick_spread
            }

            # Print the updated DataFrame to the console
            print('Updated tick data:\n', tick_data)

            print('Tick data:', tick)

            # Add the update to the queue
            # asyncio.create_task(update_queue.put(latest_tick))
            # Use loop.call_soon_threadsafe to safely add data to the queue
            loop.call_soon_threadsafe(asyncio.create_task, update_queue.put(latest_tick))
            #asyncio.create_task(update_queue.put(latest_tick))

            # Convert DataFrame to JSON for transmission
            # tick_data_json = tick_data.to_json(orient="records")

        source_tick.subscribe(lambda tick: handle_tick(tick))
        #print("Subscription successful")

        #print("kyyyyyyyyyuuuuuuuuuuuk:")

        # Keep the subscription active until
        # explicitly unsubscribed
        #while True:
            #await asyncio.sleep(1)

    except Exception as e:
        print(f"Error in market data subscription for {symbol}: {e}")
        print(f"Error in subscription: {e}. Retrying in 5 seconds...")
        #await asyncio.sleep(1)
        await subscribe_market_data(api, symbol, update_queue, df_queue, Roat1_result)  # Retry

    finally:
        print(symbol)


async def subscribe_to_proposals(api, proposal_payload, proposal_queue):
    """
    Dynamically subscribe to one or more proposals using the external `proposal_payload` variable.
    """
    print("Payload for subscription before try:", proposal_payload)

    try:
        tasks = []  # To store subscription tasks
        # Loop through each key-value pair in the payload dictionary
        for key, payload in proposal_payload.items():
            print(f"Processing subscription for {key}: {payload}")

            async def subscribe(payload):
                try:
                    # Create the subscription for the proposal
                    source_proposal = await api.subscribe(payload)

                    # Handle incoming data streams for the proposal
                    #source_proposal.subscribe(lambda proposal: print(f"Subscribed proposal for {payload['contract_type']}: {proposal}"))
                    source_proposal.subscribe(lambda proposal: asyncio.create_task(proposal_queue.put(proposal)))

                except Exception as e:
                    print(f"Error in subscription for {payload['contract_type']}: {e}")

            # Create and store the task for concurrent execution
            tasks.append(asyncio.create_task(subscribe(payload)))

        # Wait for all subscription tasks to complete
        await asyncio.gather(*tasks)

    except Exception as e:
        print(f"Error in subscribe_to_proposals: {e}")

async def buy_proposal(ctb, contracts, Rltoe, updated_variables, websocket, proposal_p, prop, p_queue):
    try:
        while True:
            updated_prop = await p_queue.get()
            print("📦🛑 Received new prop dict from p_queue:", updated_prop)

            if ctb not in updated_prop:
                print(f"⏳ Waiting for '{ctb}' to appear in prop...")
                continue

            ctr_data = updated_prop[ctb]
            print("✅ Payload to websocket.buy:", ctr_data)

            contract_id_chos = ctr_data["id"]
            print(f"✅ Selected contract ID for '{ctb}': {contract_id_chos}")

            extracted_vars = updated_variables
            #proposal_payload = cre_propo_paylo(ctb, extracted_vars, contracts)
            #print("Initial proposal_payload:", proposal_payload)
            print("Initial proposal_p:", proposal_p)

            print(f"🚦 Restart last trade on error (Rltoe): {Rltoe}")

            if str(Rltoe) == "True":
                # 🔁 Keep trying until successful
                while True:
                    try:
                        await websocket.buy(ctr_data)
                        print("🎯 Buy successful!")
                        return
                    except Exception as e:
                        print(f"❌ Buy failed: {e}")
                        print("🔁 Retrying buy because Rltoe is True...")
                        await asyncio.sleep(1)
            else:
                # 🚫 Try only once
                try:
                    await websocket.buy(ctr_data)
                    print("🎯 Buy attempted once (no retry).")
                except Exception as e:
                    print(f"❌ Buy failed but not retrying (Rltoe is False): {e}")
                return  # ✅ Done, regardless of success/failure

    except Exception as e:
        print(f"❌ Error in buy_proposal wrapper: {e}")
        return None

async def subscribe_to_open_contract(api, contract_id, open_contract_queue, client_id):
    """
    Subscribes to updates for a specific open contract and sends to the queue + frontend.
    """
    try:
        # Subscribe via API
        source_poc = await api.subscribe({
            "proposal_open_contract": 1,
            "contract_id": contract_id
        })
        print(f"✅ Subscribed to open contract ID: {contract_id}")

        # Access the Django Channels layer
        channel_layer = get_channel_layer()

        # Define handler for updates
        async def handle_update(poc_data):
            #print("📡 Open contract update received:", poc_data)

            # Send to local queue for internal processing
            await open_contract_queue.put(poc_data)

            # Broadcast to frontend WebSocket group
            if channel_layer:
                await channel_layer.group_send(
                    #"contract_data",  # Same group name your consumer is listening to
                    f"contract_data_{client_id}",
                    {
                        "type": "send_open_contract",
                        "data": poc_data  # This is the open contract payload
                    }
                )

        # Set the subscription callback
        source_poc.subscribe(lambda poc: asyncio.create_task(handle_update(poc)))

    except Exception as e:
        print(f"❌ Error subscribing to open contract: {e}")


def analyze_python_code(python_code):
    """
    Cleans Python-like code by:
    - Removing spaces immediately after '('
    - Removing spaces immediately before ')'
    - Consolidating multi-line parentheses into a single line
    :param python_code: The Python code received from the frontend.
    :return: Tuple of cleaned Python code and analysis report.
    """
    analysis_report = []
    cleaned_code = []

    lines = python_code.splitlines()
    inside_parentheses = False
    current_parentheses = ""

    for line in lines:
        line = line.rstrip()

        # Ignore empty lines
        if not line:
            continue

        # Consolidate multi-line parentheses
        if '(' in line and ')' not in line:
            inside_parentheses = True
            current_parentheses = line
            continue
        elif inside_parentheses:
            current_parentheses += " " + line
            if ')' in line:
                inside_parentheses = False
                line = current_parentheses
                current_parentheses = ""

        # Remove spaces **after** '(' and **before** ')'
        line = re.sub(r'\(\s+', '(', line)  # Remove space after '('
        line = re.sub(r'\s+\)', ')', line)  # Remove space before ')'

        cleaned_code.append(line)

    return "\n".join(cleaned_code), analysis_report


def fix_python_code_indentation(python_code):
    """
    Fixes the indentation of Python code by doubling the existing indentation level,
    corrects function names, and validates syntax.

    Args:
        python_code (str): Raw Python code as a string.

    Returns:
        str: Corrected Python code.
    """
    corrected_code = []
    lines = python_code.splitlines()

    for line in lines:
        # Calculate the current indentation level
        indent_level = len(line) - len(line.lstrip())  # Number of leading spaces
        #print(f"Line: '{line}', Current Indentation Level: {indent_level}")

        # Calculate the new indentation level (doubled)
        new_indent_level = indent_level * 2

        # Create the updated line with the new indentation
        updated_line = " " * new_indent_level + line.lstrip()

        # Correct boolean values
        updated_line = updated_line.replace("FALSE", "False").replace("TRUE", "True")

        # Correct function names with spaces
        updated_line = re.sub(r"def\s+(\w+)\s+block", r"def \1_block", updated_line)

        # Append the corrected line to the final output
        corrected_code.append(updated_line)

    return "\n".join(corrected_code)


# Extract the Purchase_conditions block
def extract_purchase_conditions_block(cleaned_code, start_marker, end_marker):
    start_marker = start_marker #"def Purchase_conditions_block():"
    end_marker = end_marker #"print('executed Pcs1:', Pcs1)"  #"update_extracted_vars('Pd', Pd)" #

    # Initialize variables to track the extracted block
    purchase_conditions_code = []
    inside_target_section = False

    # Iterate through each line of the code
    for line in cleaned_code.splitlines():
        # Check for the start of the Purchase_conditions block
        if start_marker in line:
            inside_target_section = True

        # If inside the target section, add the line to the result
        if inside_target_section:
            purchase_conditions_code.append(line)

        # Check for the end of the Purchase_conditions block
        if inside_target_section and end_marker in line:
            break  # Stop once we've captured the block

    # Combine the extracted lines into a single string
    return "\n".join(purchase_conditions_code)

# Function to extract variables from the given code
def extract_variables_from_code(code):
    """
    Extract key-value pairs from a specific section of the provided code.

    :param fixed_code: The cleaned and fixed Python code as a string.
    :return: A dictionary of extracted variables.
    """
    extracted_vars = {}
    # Process each line of the provided code
    lines = code.split('\n')
    for line in lines:
        # Skip empty lines or comments
        if not line.strip() or line.strip().startswith('#') or 'variables = ' in line.strip():
        #if not line.strip() or line.strip().startswith('#') or line.strip() == 'variables = locals().copy()':
            continue

        # Split the line into a potential key-value pair
        if '=' in line:
            key, value = line.split('=', 1)
            key, value = key.strip(), value.strip()
            extracted_vars[key] = value.strip("'\"")  # Remove quotes if present

    return extracted_vars


def update_extracted_variables(extracted_variables, **other_dicts):
    """
    Updates dictionaries inside `extracted_variables` with values
    from other dictionaries, ensuring nested dictionaries are handled properly.

    Args:
        extracted_variables (dict): The main dictionary to update.
        **other_dicts: Additional dictionaries to merge into `extracted_variables`.

    Returns:
        dict: Updated `extracted_variables` dictionary.
    """
    for dict_name, other_dict in other_dicts.items():
        if not isinstance(other_dict, dict):
            continue  # Skip non-dictionary inputs

        # Ensure the value in extracted_variables is a dictionary
        if dict_name not in extracted_variables or not isinstance(extracted_variables[dict_name], dict):
            extracted_variables[dict_name] = {}

        # Update the dictionary inside extracted_variables
        for key, value in other_dict.items():
            if key in extracted_variables[dict_name]:
                # Update only if values differ
                if extracted_variables[dict_name][key] != value:
                    extracted_variables[dict_name][key] = value
            else:
                # Add new key-value pairs
                extracted_variables[dict_name][key] = value

    return extracted_variables


import re

def parse_duration_string(duration_str):
    """Convert duration like '365d', '30s', '2m', '1h' into seconds."""
    if not duration_str:
        return 0
    match = re.match(r'(\d+)([smhd])', duration_str)
    if not match:
        return 0
    value, unit = match.groups()
    value = int(value)
    unit_multipliers = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}
    return value * unit_multipliers.get(unit, 1)


def cre_propo_paylo(cts, extracted_vars, contracts):
    try:
        #print("🔍 cre_propo_paylo called with:")
        #print("📦 cts:", cts)
        #print("📦 extracted_vars:", extracted_vars)
        #print("📦 contracts:", contracts)

        # ✅ Safely extract common proposal parameters
        to1 = extracted_vars.get('To1', {})
        tp1 = extracted_vars.get('Tp1', {})

        raw_amount = to1.get('stake')
        raw_duration = to1.get('drv')
        duration_unit = to1.get('drdd', 's')
        symbol = tp1.get('symbol')
        tt1 = tp1.get('tt1')
        tt2 = tp1.get('tt2')
        ct1 = tp1.get('ct1')

        # Determine contract types based on tt2 and ct1
        contract_types = {}
        if tt2 == 'callput-Rise/Fall':
            if ct1 == "both":
                contract_types = {"CALL": None, "PUT": None}
            elif ct1 == "Rise":
                contract_types = {"CALL": None}
            else:  # Assume ct1 == "Fall"
                contract_types = {"PUT": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Accumulator':
            contract_types = {"ACCU": None}

        elif tt1 == 'Rise/Fall Equal':
            if ct1 == "both":
                contract_types = {"CALLE": None, "PUTE": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        elif tt1 == 'Asians':
            if ct1 == "both":
                contract_types = {"ASIANU": None, "ASIAND": None}
            elif ct1 == "Asian Up":
                contract_types = {"ASIANU": None}
            else:  # Assume ct1 == "Fall Equals"
                contract_types = {"ASIAND": None}

        if raw_amount is None or raw_duration is None or symbol is None:
            print("❌ Missing required fields: stake, duration, or symbol")
            return None

        amount = int(raw_amount)
        duration = int(raw_duration)

        # ✅ Convert duration to seconds for comparison
        duration_seconds = duration * {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}.get(duration_unit, 1)

        # ✅ Define contract types
        CONTRACTS_REQUIRING_BARRIER = {
            "CALL", "PUT", "ASIANU", "ASIAND", "CALLE", "PUTE",
            "RESETCALL", "RESETPUT", "RUNHIGH", "RUNLOW"
        }

        CONTRACTS_REQUIRING_DIGITS = {
            "DIGITMATCH", "DIGITDIFF", "DIGITOVER", "DIGITUNDER", "TICKHIGH", "TICKLOW"
        }

        C_R_B = {
            "Up/Down", "Asian", "Rise/Fall Equal", "Reset Call/Reset Put", "Only Ups/Only Downs"
        }

        C_R_D = {
            "DIGITMATCH", "DIGITDIFF", "DIGITOVER", "DIGITUNDER", "TICKHIGH", "TICKLOW"
        }
        requires_barrier = tt1 in C_R_B
        is_digit_contract = tt2 in CONTRACTS_REQUIRING_DIGITS

        requires_barrier = cts in CONTRACTS_REQUIRING_BARRIER
        is_digit_contract = cts in CONTRACTS_REQUIRING_DIGITS

        final_barrier = None  # default is no barrier

        if requires_barrier:
            # Fallback if no 'callput' data exists
            print("⚠️ Requires barrier but no 'callput' contracts found — using default barrier = 1")
            #final_barrier = "1"

        elif is_digit_contract:
            bov_value = to1.get('bov')
            if bov_value is not None:
                final_barrier = str(bov_value)
                print(f"🔢 Digit contract detected, using BOV value as barrier: {final_barrier}")
            else:
                print("⚠️ Digit contract but no BOV value found!")
                return None

        # ✅ Build the base payload
        proposal_payload = {
            "proposal": 1,
            "amount": amount,
            "basis": "stake",
            "currency": "USD",
            "duration": duration,
            "duration_unit": duration_unit,
            "contract_type": cts,
            "symbol": symbol,
        }

        # ✅ Add barrier if needed
        if final_barrier is not None:
            proposal_payload["barrier"] = final_barrier

        return proposal_payload

    except Exception as e:
        print("🚨 Error in cre_propo_paylo:", str(e))
        return None



def cre_propo_paylo(ctb, extracted_vars, contracts):
    try:
        #print("🔍 cre_propo_paylo called with:")
        print("📦 ctb:", ctb)
        #print("📦 extracted_vars:", extracted_vars)
        #print("📦 contracts:", contracts)

        # ✅ Safely extract common proposal parameters
        to1 = extracted_vars.get('To1', {})
        tp1 = extracted_vars.get('Tp1', {})

        raw_amount = to1.get('stake')
        raw_duration = to1.get('drv')
        duration_unit = to1.get('drdd', 's')
        symbol = tp1.get('symbol')

        if raw_amount is None or raw_duration is None or symbol is None:
            print("❌ Missing required fields: stake, duration, or symbol")
            return None

        amount = int(raw_amount)
        duration = int(raw_duration)

        # ✅ Convert duration to seconds for comparison
        duration_seconds = duration * {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}.get(duration_unit, 1)

        # ✅ Define contract types
        CONTRACTS_REQUIRING_BARRIER = {
            "CALL", "PUT", "ASIANU", "ASIAND", "CALLE", "PUTE",
            "RESETCALL", "RESETPUT", "RUNHIGH", "RUNLOW"
        }

        CONTRACTS_REQUIRING_DIGITS = {
            "DIGITMATCH", "DIGITDIFF", "DIGITOVER", "DIGITUNDER", "TICKHIGH", "TICKLOW"
        }

        requires_barrier = ctb in CONTRACTS_REQUIRING_BARRIER
        is_digit_contract = ctb in CONTRACTS_REQUIRING_DIGITS

        final_barrier = None  # default is no barrier

        if requires_barrier:
            # Fallback if no 'callput' data exists
            print("⚠️ Requires barrier but no 'callput' contracts found — using default barrier = 1")
            #final_barrier = "1"

        elif is_digit_contract:
            bov_value = to1.get('bov')
            if bov_value is not None:
                final_barrier = str(bov_value)
                print(f"🔢 Digit contract detected, using BOV value as barrier: {final_barrier}")
            else:
                print("⚠️ Digit contract but no BOV value found!")
                return None

        # ✅ Build the base payload
        proposal_payload = {
            "proposal": 1,
            "amount": amount,
            "basis": "stake",
            "currency": "USD",
            "duration": duration,
            "duration_unit": duration_unit,
            "contract_type": ctb,
            "symbol": symbol,
        }

        # ✅ Add barrier if needed
        if final_barrier is not None:
            proposal_payload["barrier"] = final_barrier

        return proposal_payload

    except Exception as e:
        print("🚨 Error in cre_propo_paylo:", str(e))
        return None


def create_proposal_payloads(extracted_vars):
    # Extract proposal parameters from extracted_vars
    amount = int(extracted_vars.get('To1', {}).get('stake', 0.35))
    duration = int(extracted_vars.get('To1', {}).get('drv', None))
    duration_unit = extracted_vars.get('To1', {}).get('drdd', None)
    symbol = extracted_vars.get('Tp1', {}).get('symbol', None)
    tt2 = extracted_vars.get('Tp1', {}).get('tt2', None)
    ct1 = extracted_vars.get('Tp1', {}).get('ct1', None)

    # Determine contract types based on tt2 and ct1
    contract_types = {}
    if tt2 == 'callput-Rise/Fall':
        if ct1 == "both":
            contract_types = {"CALL": None, "PUT": None}
        elif ct1 == "Rise":
            contract_types = {"CALL": None}
        else:  # Assume ct1 == "Fall"
            contract_types = {"PUT": None}

    elif tt2 == 'callput-Higher/Lower':
        if ct1 == "both":
            contract_types = {"CALL": None, "PUT": None}
        elif ct1 == "Higher":
            contract_types = {"CALL": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"PUT": None}

    elif tt2 == 'Asian Up/Asian Down':
        if ct1 == "both":
            contract_types = {"ASIANU": None, "ASIAND": None}
        elif ct1 == "Asian Up":
            contract_types = {"ASIANU": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"ASIAND": None}

    elif tt2 == 'Rise Equals/Fall Equals':
        if ct1 == "both":
            contract_types = {"CALLE": None, "PUTE": None}
        elif ct1 == "Rise Equals":
            contract_types = {"CALLE": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"PUTE": None}

    elif tt2 == 'touchnotouch-Touch/No Touch':
        if ct1 == "both":
            contract_types = {"ONETOUCH": None, "NOTOUCH": None}
        elif ct1 == "Touch":
            contract_types = {"ONETOUCH": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"NOTOUCH": None}

    elif tt2 == 'Even/Odd':
        if ct1 == "both":
            contract_types = {"DIGITODD": None, "DIGITEVEN": None}
        elif ct1 == "Odd":
            contract_types = {"DIGITODD": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"DIGITEVEN": None}

    elif tt2 == 'Over/Under':
        if ct1 == "both":
            contract_types = {"DIGITOVER": None, "DIGITUNDER": None}
        elif ct1 == "Rise Equals":
            contract_types = {"DIGITOVER": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"DIGITUNDER": None}

    elif tt2 == 'Matches/Differs':
        if ct1 == "both":
            contract_types = {"DIGITMATCH": None, "DIGITDIFF": None}
        elif ct1 == "Matches":
            contract_types = {"DIGITMATCH": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"DIGITDIFF": None}

    elif tt2 == 'reset-Reset Call/Reset Put':
        if ct1 == "both":
            contract_types = {"RESETCALL": None, "RESETPUT": None}
        elif ct1 == "Reset Call":
            contract_types = {"RESETCALL": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"RESETPUT": None}

    elif tt2 == 'runs-Only Ups/Only Downs':
        if ct1 == "both":
            contract_types = {"RUNHIGH": None, "RUNLOW": None}
        elif ct1 == "Only Ups":
            contract_types = {"RUNHIGH": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"RUNLOW": None}

    elif tt2 == 'Buy':
        if ct1 == "Buy":
            contract_types = {"ACCU": None}

    elif tt2 == 'endsinout-Ends Between/Ends Outside':
        if ct1 == "both":
            contract_types = {"EXPIRYMISS": None, "EXPIRYRANGE": None}
        elif ct1 == "Ends Outside":
            contract_types = {"EXPIRYMISS": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"EXPIRYRANGE": None}

    elif tt2 == 'High Ticks/Low Ticks':
        if ct1 == "both":
            contract_types = {"TICKHIGH": None, "TICKLOW": None}
        elif ct1 == "High Ticks":
            contract_types = {"TICKHIGH": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"TICKLOW": None}

    elif tt2 == 'staysinout-Stays Between/Goes Outside':
        if ct1 == "both":
            contract_types = {"RANGE": None, "UPORDOWN": None}
        elif ct1 == "Stays Between":
            contract_types = {"RANGE": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"UPORDOWN": None}

    elif tt2 == 'Rise Equals/Fall Equals':
        if ct1 == "both":
            contract_types = {"CALLE": None, "PUTE": None}
        elif ct1 == "Rise Equals":
            contract_types = {"CALLE": None}
        else:  # Assume ct1 == "Fall Equals"
            contract_types = {"PUTE": None}


    # Populate the contract_types dictionary with payloads
    for contract_type in contract_types:
        contract_types[contract_type] = {
            "proposal": 1,
            "amount": amount,
            "barrier": "+0.1",
            "basis": "payout",
            "currency": "USD",
            "duration": duration,
            "duration_unit": duration_unit,
            "contract_type": contract_type,
            "symbol": symbol,
            "subscribe": 1,
        }

    return contract_types


def normalize_barrier(value):
    if not value:
        return None
    value = value.strip().lower()
    mapping = {
        "offset +": "+",
        "offset -": "-",
        "offset_plus": "+",
        "offset_minus": "-",
        "absolute": "absolute"
    }
    return mapping.get(value, value)  # fallback to the same value if not in mapping

def create_p_payloads(extracted_vars, en_variables):
    to1 = extracted_vars.get("To1", {})
    tp1 = extracted_vars.get("Tp1", {})
    tt1 = tp1.get("tt1")
    tt2 = tp1.get("tt2")
    ct1 = tp1.get("ct1")

    amount = None
    mulvalue = None
    gr_value = None  # accumulators

    # 🔎 Special case: Multipliers
    if tt1 == "Multipliers" and "Multiplier" in to1:
        multiplier_str = to1.get("Multiplier")
        print("⚡ Multipliers mode detected. Raw To1 block:", multiplier_str)
        try:
            nums = multiplier_str.split("(")[1].split(")")[0].split(",")
            amount = float(nums[0].strip())
            mulvalue = int(nums[1].strip())
            print(f"💰 Parsed stake={amount}, mulvalue={mulvalue}")
        except Exception as e:
            raise ValueError(f"❌ Failed to parse Multiplier string: {multiplier_str} ({e})")

    # 🔎 Special case: Accumulators
    elif tt1 == "Accumulators" and "Growth_Rate" in to1:
        gr_str = to1.get("Growth_Rate")
        print("⚡ Accumulators mode detected. Raw To1 block:", gr_str)
        try:
            nums = gr_str.split("(")[1].split(")")[0].split(",")
            amount = float(nums[0].strip())
            gr_value = float(nums[1].strip())
            print(f"💰 Parsed stake={amount}, growth_rate={gr_value}")
        except Exception as e:
            raise ValueError(f"❌ Failed to parse Growth_Rate string: {gr_str} ({e})")

    # 🔎 Normal case
    else:
        amount = float(to1.get("stake", 0.35))
        print("💰 Normal stake amount:", amount)

    # -------------------------
    # Build proposal parameters
    # -------------------------
    duration = int(to1.get("drv", 0) or 0)
    duration_unit = to1.get("drdd")
    bov = to1.get("bov")
    pv = to1.get("pv")
    lbov = to1.get("lbov")

    bod = normalize_barrier(to1.get('bod'))
    lbod = normalize_barrier(to1.get('lbod'))

    symbol = tp1.get('symbol')

    # --------------------------------
    # Select contract types by tt2+ct1
    # --------------------------------
    contract_types = {}

    # --------------------------------
    # Select contract types by tt2+ct1
    # --------------------------------
    if ct1 == "both":
        both_map = {
            'callput-Rise/Fall': {"CALL", "PUT"},
            'callput-Higher/Lower': {"CALL", "PUT"},
            'Asian Up/Asian Down': {"ASIANU", "ASIAND"},
            'Rise Equals/Fall Equals': {"CALLE", "PUTE"},  # 🟢 the one you were missing
            'touchnotouch-Touch/No Touch': {"ONETOUCH", "NOTOUCH"},
            'Even/Odd': {"DIGITODD", "DIGITEVEN"},
            'Over/Under': {"DIGITOVER", "DIGITUNDER"},
            'Matches/Differs': {"DIGITMATCH", "DIGITDIFF"},
            'reset-Reset Call/Reset Put': {"RESETCALL", "RESETPUT"},
            'runs-Only Ups/Only Downs': {"RUNHIGH", "RUNLOW"},
            'endsinout-Ends Between/Ends Outside': {"EXPIRYMISS", "EXPIRYRANGE"},
            'High Ticks/Low Ticks': {"TICKHIGH", "TICKLOW"},
            'staysinout-Stays Between/Goes Outside': {"RANGE", "UPORDOWN"},
            'Up/Down': {"MULTUP", "MULTDOWN"},
        }

        if tt2 in both_map:
            contract_types = {ctype: {} for ctype in both_map[tt2]}

    else:
        if tt2 == 'callput-Rise/Fall':
            contract_types = {"CALL": {}} if ct1 == "Rise" else {"PUT": {}}
        elif tt2 == 'callput-Higher/Lower':
            contract_types = {"CALL": {}} if ct1 == "Higher" else {"PUT": {}}
        elif tt2 == 'Asian Up/Asian Down':
            contract_types = {"ASIANU": {}} if ct1 == "Asian Up" else {"ASIAND": {}}
        elif tt2 == 'Rise Equals/Fall Equals':
            contract_types = {"CALLE": {}} if ct1 == "Rise Equals" else {"PUTE": {}}
        elif tt2 == 'touchnotouch-Touch/No Touch':
            contract_types = {"ONETOUCH": {}} if ct1 == "Touch" else {"NOTOUCH": {}}
        elif tt2 == 'Even/Odd':
            contract_types = {"DIGITODD": {}} if ct1 == "Odd" else {"DIGITEVEN": {}}
        elif tt2 == 'Over/Under':
            contract_types = {"DIGITOVER": {}} if ct1 == "Over" else {"DIGITUNDER": {}}
        elif tt2 == 'Matches/Differs':
            contract_types = {"DIGITMATCH": {}} if ct1 == "Matches" else {"DIGITDIFF": {}}
        elif tt2 == 'reset-Reset Call/Reset Put':
            contract_types = {"RESETCALL": {}} if ct1 == "Reset Call" else {"RESETPUT": {}}
        elif tt2 == 'runs-Only Ups/Only Downs':
            contract_types = {"RUNHIGH": {}} if ct1 == "Only Ups" else {"RUNLOW": {}}
        elif tt2 == 'Buy' and ct1 == "Buy":
            contract_types = {"ACCU": {}}
        elif tt2 == 'endsinout-Ends Between/Ends Outside':
            contract_types = {"EXPIRYMISS": {}} if ct1 == "Ends Outside" else {"EXPIRYRANGE": {}}
        elif tt2 == 'High Ticks/Low Ticks':
            contract_types = {"TICKHIGH": {}} if ct1 == "High Ticks" else {"TICKLOW": {}}
        elif tt2 == 'staysinout-Stays Between/Goes Outside':
            contract_types = {"RANGE": {}} if ct1 == "Stays Between" else {"UPORDOWN": {}}
        elif tt2 == "Up/Down":
            contract_types = {"MULTUP": {}} if ct1 == "Up" else {"MULTDOWN": {}}

    # --------------------------------
    # Build payloads
    # --------------------------------
    for contract_type in contract_types:
        payload = {
            "proposal": 1,
            "amount": amount,   # 🟢 default stake here
            "basis": "stake",
            "currency": "USD",
            "contract_type": contract_type,
            "symbol": symbol,
        }

        # Multipliers
        if contract_type in ["MULTUP", "MULTDOWN"] and mulvalue is not None:
            payload["multiplier"] = mulvalue
        elif contract_type == "ACCU":
            payload["growth_rate"] = str(gr_value)
        else:
            payload["duration"] = duration
            payload["duration_unit"] = duration_unit

        # Barriers
        if tt2 in {"Matches/Differs", "Over/Under"}:
            if pv is not None:
                payload["barrier"] = str(pv)
        elif tt2 == "High Ticks/Low Ticks":
            if pv is not None:
                payload["selected_tick"] = str(pv)
        elif tt2 == "touchnotouch-Touch/No Touch":
            if bov is not None and bod:
                payload["barrier"] = f"{bod}{bov}"
        elif tt2 == "callput-Higher/Lower":
            if bov is not None and bod:
                payload["barrier"] = f"{bod}{bov}"
        elif tt2 == "endsinout-Ends Between/Ends Outside":
            if lbov and lbod and bov and bod:
                payload["barrier"] = f"{bod}{bov}"
                payload["barrier2"] = f"{lbod}{lbov}"

        contract_types[contract_type] = payload

    # -------------------------
    # 🔄 Apply en_variables stake override (AFTER building payloads)
    # -------------------------
    for key, value in en_variables.items():
        if key.lower() == "stake":
            stake_override = float(value)
            for ct, payload in contract_types.items():
                if payload["amount"] != stake_override:
                    print(f"🔄 Overriding stake for {ct}: {payload['amount']} → {stake_override}")
                    payload["amount"] = stake_override
        else:
            print(f"⚠️ Key '{key}' is not stake → no stake override applied")
    return contract_types

def prse_and_execute_purchase_code(code_string, maind):
    try:
        import ast
        import talib
        import pandas as pd

        print("🔍 Injecting dictionaries and DataFrames from maind...")

        # ✅ Step 1: AST Safety Check
        tree = ast.parse(code_string, mode="exec")
        allowed_nodes = (
            ast.Module, ast.FunctionDef, ast.Expr, ast.Call, ast.Assign,
            ast.If, ast.Name, ast.Load, ast.Constant, ast.Return, ast.arguments,
            ast.BinOp, ast.Compare, ast.arg, ast.Num, ast.Dict, ast.List,
            ast.Set, ast.ListComp, ast.Store, ast.Tuple, ast.Attribute, ast.Subscript,
            ast.keyword, ast.Gt, ast.GtE, ast.Lt, ast.LtE, ast.Eq, ast.NotEq, ast.Is,
            ast.IsNot, ast.In, ast.NotIn, ast.And, ast.Or, ast.UnaryOp, ast.Not
        )
        for node in ast.walk(tree):
            if not isinstance(node, allowed_nodes):
                raise ValueError(f"❌ Disallowed operation: {type(node).__name__}")

        compiled_code = compile(tree, filename="<ast>", mode="exec")

        # ✅ Step 2: Prepare execution context
        context = {
            "talib": talib,
            "pd": pd
        }

        # ✅ Step 3: Inject all DataFrames and prefixed dictionary values
        for tf_key, tf_data in maind.items():
            if not isinstance(tf_data, dict):
                continue

            for inner_key, value in tf_data.items():
                # Inject DataFrames directly
                if isinstance(value, pd.DataFrame):
                    print(f"🧾 Injecting DataFrame as '{inner_key}'")
                    context[inner_key] = value

                # Inject dictionary values with prefixed keys
                elif isinstance(value, dict):
                    print(f"📦 Injecting values from dict: maind['{tf_key}']['{inner_key}']")
                    for k, v in value.items():
                        if isinstance(k, str):
                            prefixed_key = k  # Example: 'tick_quote'
                            context[prefixed_key] = v
                            print(f"   ↪️ Injected: {prefixed_key} = {v}")

        # ✅ Step 4: Execute user strategy code
        exec(compiled_code, context)

        # ✅ Step 5: Return user-defined variables
        if "variables" in context and isinstance(context["variables"], dict):
            return context["variables"]
        else:
            raise ValueError("The variable 'variables' was not found or is not a dictionary.")

    except Exception as e:
        print(f"❌ Error during strategy execution: {e}")
        raise

def en_variables_parse_and_execute_purchase_code(code_string, en_variables):
    """
    Execute Python code and update en_variables with any variables
    found in a `variables` dictionary defined in the code.
    """
    try:
        import talib
        import ast

        # Parse and validate AST
        tree = ast.parse(code_string, mode="exec")
        allowed_nodes = (
            ast.Module, ast.FunctionDef, ast.Expr, ast.Call, ast.Assign,
            ast.If, ast.Name, ast.Load, ast.Constant, ast.Return, ast.arguments,
            ast.BinOp, ast.Compare, ast.arg, ast.Num, ast.Dict, ast.List,
            ast.Set, ast.ListComp, ast.Store, ast.Tuple, ast.Attribute, ast.Subscript,
            ast.keyword
        )
        for node in ast.walk(tree):
            if not isinstance(node, allowed_nodes):
                raise ValueError(f"Disallowed operation: {type(node).__name__}")

        compiled_code = compile(tree, filename="<ast>", mode="exec")

        # Execution context includes talib and previous variables
        context = {"talib": talib, "pd": pd, **en_variables}

        # Execute user code
        exec(compiled_code, context)

        # Merge new variables found in `variables` into en_variables
        if "variables" in context and isinstance(context["variables"], dict):
            en_variables.update(context["variables"])
        else:
            print("⚠️ No 'variables' dictionary returned from code.")

        return en_variables  # ✅ Return the full updated dictionary

    except Exception as e:
        print(f"❌❌❌❌❌kkmaina❌❌❌❌❌❌ Error during execution:❌❌❌❌❌❌❌ {e}")
        raise

def parse_and_execute_purchase_code(code_string):
    """
    Parse and execute Python code safely with AST,
    capturing variables created during execution.
    """
    try:
        import talib  # Ensure talib is imported inside the function

        # Parse the code into an AST
        tree = ast.parse(code_string, mode="exec")

        # Validate the AST (allow only safe constructs)
        allowed_nodes = (
            ast.Module, ast.FunctionDef, ast.Expr, ast.Call, ast.Assign,
            ast.If, ast.Name, ast.Load, ast.Constant, ast.Return, ast.arguments,
            ast.BinOp, ast.Compare, ast.arg, ast.Num, ast.Dict, ast.List,
            ast.Set, ast.ListComp, ast.Store, ast.Tuple, ast.Attribute, ast.Subscript,
            ast.keyword
        )
        for node in ast.walk(tree):
            if not isinstance(node, allowed_nodes):
                raise ValueError(f"Disallowed operation: {type(node).__name__}")

        # Compile the code
        compiled_code = compile(tree, filename="<ast>", mode="exec")

        # Create a custom context for execution
        #context = {}

        # Create a custom context for execution and inject talib
        context = {"talib": talib}  # Inject talib into the execution context

        # Execute the code in the custom context
        exec(compiled_code, context)

        # Ensure the 'variables' dictionary is returned
        if "variables" in context and isinstance(context["variables"], dict):
            return context["variables"]
        else:
            raise ValueError("The variable 'variables' was not found or is not a dictionary.")

    except Exception as e:
        print(f"Error during execution: {e}")
        raise

def contract_to_sub(To1):
    tt1 = To1.get("tt1")
    tt2 = To1.get("tt2")
    ct1 = To1.get("ct1")

    if tt1 == "Up/Down":
        return "callput"
    elif tt1 == "asian":
        return "Asian"
    elif tt1 == "Accumulator":
        return "accumulator"
    elif tt1 == "Rise/Fall Equal":
        return "callputequal"
    elif tt1 == "Digits":
        return "digits"
    elif tt1 == "Ends Between/Ends Outside":
        return "endsinout"
    elif tt1 == "High/Low Ticks":
        return "highlowticks"
    elif tt1 == "Lookbacks":
        return "lookback"
    elif tt1 == "Multiply Up/Multiply Down":
        return "multiplier"
    elif tt1 == "Reset Call/Reset Put":
        return "reset"
    elif tt1 == "Only Ups/Only Downs":
        return "runs"
    elif tt1 == "Stays Between/Goes Outside":
        return "staysinout"
    elif tt1 == "Touch/No Touch":
        return "touchnotouch"
    elif tt1 == "Turbos Options":
        return "turbos"
    elif tt1 == "Vanilla Options":
        return "vanilla"
    elif tt1 == "Multipliers":
        return "multiplier"


def contract_to_buy(Pd_value):
    """
    Determine the contract type to buy based on the Pd_value.
    """
    if Pd_value == "Rise":
        return "CALL"
    elif Pd_value == "Fall":
        return "PUT"
    elif Pd_value == "Rise Equals":
        return "CALLE"
    elif Pd_value == "Fall Equals":
        return "PUTE"
    elif Pd_value == "Asian Up":
        return "ASIANU"
    elif Pd_value == "Asian Down":
        return "ASIAND"
    elif Pd_value == "Reset Call":
        return "RESETCALL"
    elif Pd_value == "Reset Put":
        return "RESETPUT"
    elif Pd_value == "Even":
        return "DIGITEVEN"
    elif Pd_value == "Odd":
        return "DIGITODD"
    elif Pd_value == "Only Ups":
        return "RUNHIGH"
    elif Pd_value == "Only Downs":
        return "RUNLOW"
    elif Pd_value == "Matches":
        return "DIGITMATCH"
    elif Pd_value == "Differs":
        return "DIGITDIFF"
    elif Pd_value == "Over":
        return "DIGITOVER"
    elif Pd_value == "Under":
        return "DIGITUNDER"
    elif Pd_value == "Only Downs":
        return "RUNLOW"
    elif Pd_value == "Only Downs":
        return "RUNLOW"
    elif Pd_value == "High Tick":
        return "TICKHIGH"
    elif Pd_value == "Low Tick":
        return "TICKLOW"
    elif Pd_value == "Touch":
        return "ONETOUCH"   # ✅ Deriv API name for Touch
    elif Pd_value == "No Touch":
        return "NOTOUCH"    # ✅ Deriv API name for No Touch
    elif Pd_value == "Up":
        return "MULTUP"
    elif Pd_value == "Down":
        return "MULTDOWN"
    elif Pd_value == "High Ticks":
        return "TICKHIGH"
    elif Pd_value == "Low Ticks":
        return "TICKLOW"
    elif Pd_value == "Buy":
        return "ACCU"
    elif Pd_value == "Higher":
        return "CALL"
    elif Pd_value == "Lower":
        return "PUT"
    else:
        raise ValueError(f"Unexpected Pd_value: {Pd_value}")

def restart_trading_conditions(Rtcs1_result):
    """
    Evaluate whether to restart trading conditions based on the result of the Restart_trading_conditions block.
    :param Rtcs1_result: Dictionary containing the result of the Restart_trading_conditions block.
    :return: Boolean indicating whether to restart trading (True) or exit (False).
    """
    trade_again = Rtcs1_result.get("Trade_again")  # Assuming 'Ta' indicates "Trade Again"
    if trade_again == "Trade again":
        print("Conditions met to restart trading.")
        return True
    else:
        print("Conditions not met. Stopping trading.")
        return False

async def print_live_prop_data(p_queue, prop):
    """Continuously process incoming contract data from shared queue."""
    try:
        # Get new proposal data from shared queue
        prop_data = await shared_q.c_d_queue.async_q.get()

        # Extract contract type from proposal data
        echo_info = prop_data.get("echo_req", {})
        contract_type = echo_info.get("contract_type")
        proposal_info = prop_data["proposal"]
        proposal_id = proposal_info.get("id")
        payout = proposal_info.get("payout")
        a_p = proposal_info.get("ask_price")

        if contract_type:
            # Decide which field is the correct price
            if contract_type in ("MULTUP", "MULTDOWN"):
                # Update the prop dictionary with the latest data for this contract type
                prop[contract_type] = {"id": proposal_id, "payout": a_p}  # prop_data
            elif contract_type == "ACCU":
                # Update the prop dictionary with the latest data for this contract type
                prop[contract_type] = {"id": proposal_id, "payout": a_p}  # prop_data
            else:
                # Update the prop dictionary with the latest data for this contract type
                prop[contract_type] = {"id": proposal_id, "payout": payout}  # prop_data
            # Update the prop dictionary with the latest data for this contract type
            #prop[contract_type] = {"id": proposal_id, "payout": payout}  # prop_data

            print(f"🔄 Updated prop[{contract_type}]")
        else:
            print("⚠️ Missing contract_type in proposal data")

        print("📦 Current prop dict state:", prop)

        # Push the full updated prop dictionary into the queue for downstream use
        loop = asyncio.get_running_loop()
        loop.call_soon_threadsafe(asyncio.create_task, p_queue.put(prop.copy()))

    except Exception as e:
        print(f"⚠️ Error in print_live_prop_data: {e}")

async def print_live_contracts_data(cd_queue, contracts):
    """Continuously process incoming contract data from shared queue."""
    while True:
        try:
            contract_data = await shared_q.contracts_data_queue.async_q.get()

            #print("📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄v", contracts)

            contracts.clear()
            contracts.update(contract_data)
            #print("📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄📄contracts", contracts)

            # Optional: Push into update_queue for downstream processing
            loop = asyncio.get_running_loop()
            loop.call_soon_threadsafe(asyncio.create_task, cd_queue.put(contracts))

        except Exception as e:
            print(f"⚠️ Error in print_live_contracts_data: {e}")
            raise

async def sell_at_market_price(websocket, poc_contract_id):
    try:
        print("🚀 Selling at market price now...")
        await websocket.sell(poc_contract_id, price=0)
        print("✅ Sell at market price executed.")
    except Exception as e:
        print(f"❌ Error during sell at market price: {e}")

async def monitor_contract_updates(con_queue, stop_event, Scs1_execution, Sell_conditions_code, buy_event, buy_d, en_variables, websocket):
    #while not stop_event.is_set():
    while True:
        try:
            # Wait until a new buy has occurred
            print("⏳ Waiting for buy_event...")
            await buy_event.wait()  # blocks until set

            print("🚀 buy_event triggered!")
            #current_contract_id = buy_d.get("contract_id")
            current_contract_id = buy_d.get("buy", {}).get("contract_id")
            if not current_contract_id:
                print("❌ No contract_id in buy_d")
                buy_event.clear()
                continue

            # Now start monitoring the contract updates for this ID
            while True:
                data = await con_queue.get()

                print(f"📦 Raw data from con_queue:\n{data}")
                rtc = data.get("rtc")
                dataa = data.get("raw", {})
                proposal_info = dataa.get("proposal_open_contract", {})
                is_sell_available = proposal_info.get("is_valid_to_sell") == 1
                poc_contract_id = proposal_info.get("contract_id")

                print(f"🎧 Listener: Got data → rtc={rtc} | contract_id={poc_contract_id} | sell={is_sell_available}")

                # Check if contract ID matches the active buy contract
                if poc_contract_id == current_contract_id:
                    if rtc:
                        print("🛑 Restart triggered by contract listener!")
                        stop_event.set()
                        break

                    if Scs1_execution and is_sell_available:
                        print("✅ Scs1_execution and is_valid_to_sell are both True.")

                        en_variables = en_variables_parse_and_execute_purchase_code(Sell_conditions_code, en_variables)
                        print("Tp1_result_en_variables:", en_variables)
                        # Check for direct market sell request
                        if en_variables.get("samp") == "sell_at_market_price":
                            print("🔍 'samp' is 'sell_at_market_price', executing immediate sell...")
                            asyncio.create_task(sell_at_market_price(websocket, poc_contract_id))
                        #Scs1_result = parse_and_execute_purchase_code(Sell_conditions_code)
                        #print(f"🧠 Scs1_result: {Scs1_result}")
                        break  # after handling, exit to wait for next buy

            # After handling a contract, reset for the next buy
            buy_d.clear()
            buy_event.clear()
            stop_event.set()
            print("🔁 Waiting for next buy event...")

        except Exception as e:
            print(f"⚠️ Error in monitor_contract_updates: {e}")

async def print_live_cons_data(con_queue, con_d, Restart_trading_conditions_code, en_variables):
    """Continuously process incoming contract data from shared queue."""
    while True:
        try:
            o_c_u = await shared_q.poc_data_queue.async_q.get()

            # Access the nested 'status' value
            proposal_data = o_c_u.get("proposal_open_contract", {})
            status = proposal_data.get("status")
            print(f"📢 Contract status: {status}")

            if status != "open":
                print(f"📢 Contract closed with status: {status}")

                # Call restart logic
                Rtcs1_result = parse_and_execute_purchase_code(Restart_trading_conditions_code)
                print(f"🔁 Restart trading condition result: {Rtcs1_result}")

                en_variables = en_variables_parse_and_execute_purchase_code(Restart_trading_conditions_code, en_variables)
                print("Rtcs1_result_en_variables:", en_variables)

                should_restart = restart_trading_conditions(Rtcs1_result)
                print(f"🔁 should_restart evaluated to: {should_restart}")

                # Update con_d in-place
                con_d.clear()
                con_d["rtc"] = should_restart
                con_d["raw"] = o_c_u  # Optional: include full response

                # Push to queue
                loop = asyncio.get_running_loop()
                loop.call_soon_threadsafe(asyncio.create_task, con_queue.put(con_d))

            else:
                # Still open – you may want to push that too
                con_d.clear()
                con_d["rtc"] = False
                con_d["raw"] = o_c_u
                loop = asyncio.get_running_loop()
                loop.call_soon_threadsafe(asyncio.create_task, con_queue.put(con_d))

        except Exception as e:
            print(f"⚠️ Error in print_live_cons_data: {e}")
            raise

async def print_live_buy_data(buy_queue, buy_d, stop_event, buy_event):
    """Continuously process incoming contract data from shared queue."""
    while True:
        try:
            buy_contract_data = await shared_q.buy_data_queue.async_q.get()
            print("buy_contract_data")
            print(buy_d)
            # Clear and update with the latest contract data
            buy_d.clear()
            buy_d.update(buy_contract_data)
            print(buy_d)
            buy_event.set()  # notify monitor_contract_updates
            stop_event.clear()

            # Optional: Push into update_queue for downstream processing
            loop = asyncio.get_running_loop()

            def _put_to_buy_queue():
                asyncio.create_task(buy_queue.put(buy_d))

            loop.call_soon_threadsafe(_put_to_buy_queue)
            #loop.call_soon_threadsafe(asyncio.create_task, buy_queue.put(buy_d))

        except Exception as e:
            print(f"⚠️ Error in print_live_buy_data: {e}")
            raise

async def print_live_tick_data(symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data, maind):
    while True:
        try:
            tick = await shared_q.tick_data_queue.async_q.get()
            #print("📈 Tick (streamed):", tick)

            tick_time = datetime.fromtimestamp(tick['tick']['epoch'])
            tick_quote = float(tick['tick']['quote'])
            tick_ask = float(tick['tick']['ask'])
            tick_bid = float(tick['tick']['bid'])
            tick_pip_size = float(tick['tick']['pip_size'])
            tick_spread = tick_ask - tick_bid
            tick_last_digit = int(str(tick_quote)[-1])

            #print("🧪 tick_data['df'] type:", type(tick_data))
            #print(latest_data)
            #print(f"🧪🧪 tick_data DataFrame:\n{tick_data}")

            # ✅ Safely get the previous quote from latest_data["tick"]
            try:
                if latest_data.get("tick") and latest_data["tick"].get("quote") is not None:
                    p_q = latest_data["tick"]["quote"]
                else:
                    p_q = tick_quote  # Fallback if quote is missing
            except Exception as e:
                print(f"⚠️ Error accessing latest_data['tick']['quote']: {e}")
                p_q = tick_quote

            #if tick_data is not None and not tick_data.empty:
             #   p_q = tick_data["quote"].iloc[-1]
            #else:
             #   p_q = tick_quote

            # ✅ Safely get the previous quote
            #if "df" in tick_data and not tick_data["df"].empty:
             #   p_q = tick_data["df"]["quote"].iloc[-1]
            #else:
             #   p_q = tick_quote  # fallback to current value if no previous data

            # ✅ Determine market direction
            if tick_quote > p_q:
                market_direction = "Rise"
            elif tick_quote < p_q:
                market_direction = "Fall"
            else:
                market_direction = "No change"

            # ✅ Create new tick DataFrame with market direction
            new_tick = pd.DataFrame({
                'timestamp': [tick_time],
                'ask': [tick_ask],
                'bid': [tick_bid],
                'quote': [tick_quote],
                'pip_size': [tick_pip_size],
                'spread': [tick_spread],
                'last_digit': [tick_last_digit],
                'market_direction': [market_direction],  # ✅ new column
            })

            #if tick_data is None:
             #   tick_data = pd.DataFrame()  # Initialize as empty DataFrame
            #print(f"🧪1111111111111111111🧪 tick_data DataFrame:\n{tick_data}")

            #tick_data = pd.concat([tick_data, new_tick], ignore_index=True)

            tick_data = pd.concat([tick_data, new_tick], ignore_index=True)

            # ✅ Only proceed if we have at least 100 ticks
            if len(tick_data) < 30:
                print(f"⏳ Waiting for 100 ticks... current count: {len(tick_data)}")
                continue  # Go to the next tick without doing anything else

            # ✅ Keep only the last 100 rows
            tick_data = tick_data.tail(120)
            #print(f"🧪✅ We now have 100 ticks! Proceeding.\ntick_data:\n{tick_data}")

            #tick_data = tick_data.tail(100)
            #print(f"🧪222222222222222222🧪 tick_data DataFrame:\n{tick_data}")

            for indicator_name, formula in indicator_df.items():
                try:
                    cleaned_formula = remove_leading_spaces(formula)
                    #tick_data = p_a_e_p_code(cleaned_formula, tick_data, maind)
                    p_a_e_p_code(cleaned_formula, tick_data, maind)
                    #print(f"🧪🧪🧪 tick_data DataFrame:\n{tick_data}")
                except Exception as e:
                    print(f"⚠️ Error calculating {indicator_name}: {e}")

            #latest_tick = {
             #   "timestamp": tick_time.isoformat(),
              #  "ask": tick_ask,
               # "bid": tick_bid,
            #    "quote": tick_quote,
             #   "pip_size": tick_pip_size,
              #  "spread": tick_spread
            #}

            if tick_data is not None and not tick_data.empty:
                latest_tick = tick_data.iloc[-1].to_dict()
                if isinstance(latest_tick.get("timestamp"), pd.Timestamp):
                    latest_tick["timestamp"] = latest_tick["timestamp"].isoformat()
            else:
                latest_tick = {
                    "timestamp": tick_time.isoformat(),
                    "ask": tick_ask,
                    "bid": tick_bid,
                    "quote": tick_quote,
                    "pip_size": tick_pip_size,
                    "spread": tick_spread,
                    "last_digit": tick_last_digit,
                    "market_direction": market_direction
                }

            #latest_tick = tick_data.iloc[-1].to_dict()
            #if isinstance(latest_tick.get("timestamp"), pd.Timestamp):
             #   latest_tick["timestamp"] = latest_tick["timestamp"].isoformat()

            #print(f"📊 Latest Tick Data:\n{latest_tick}")

            #print('Tick data:⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️', tick_data)

            latest_data["tick"] = latest_tick
            latest_data["df"] = tick_data

            loop = asyncio.get_running_loop()
            loop.call_soon_threadsafe(asyncio.create_task, update_queue.put(latest_tick))
            loop.call_soon_threadsafe(asyncio.create_task, df_queue.put(tick_data))

        except Exception as e:
            print(f"⚠️ Error in print_live_tick_data: {e}")
            raise  # Let the wrapper function handle retrying



async def start_tick_data_with_retry(symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data, maind):
    while True:
        try:
            await print_live_tick_data(symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data, maind)
            print("🔁🔁🔁🔁🔁🔁🔁🔁🔁")
        except Exception as e:
            print(f"🔁 Restarting print_live_tick_data after error: {e}")
            await asyncio.sleep(5)  # Delay before retry

async def print_live_balance_data(df_queue):
    while True:
        try:
            balance = await shared_q.balance_data_queue.async_q.get()
            print("💰 Balance (streamed):", balance)

            # Optional: structure it like a dict if you want to pass it
            balance_info = {
                "balance": balance.get("balance", {}).get("balance"),
                "currency": balance.get("balance", {}).get("currency"),
                "loginid": balance.get("balance", {}).get("loginid"),
                "timestamp": datetime.now().isoformat(),
            }

            # Send to same df_queue or use a separate one if needed
            loop = asyncio.get_running_loop()
            loop.call_soon_threadsafe(asyncio.create_task, df_queue.put(balance_info))

        except Exception as e:
            print("⚠️ Error in balance streamer:", repr(e))
            break

def start_tracked_task(coro, task_list, name=None):
    task = asyncio.create_task(coro, name=name)
    task_list.append(task)
    return task
def prse_and_execute_purchase_cond(code_string, maind, en_variables):
    """
    Execute strategy code with injected context and update en_variables.
    """
    try:
        import ast
        import talib
        import pandas as pd

        print("🔍 Preparing execution context with maind + en_variables...")

        # Step 1: Parse and validate AST
        tree = ast.parse(code_string, mode="exec")
        allowed_nodes = (
            ast.Module, ast.FunctionDef, ast.Expr, ast.Call, ast.Assign,
            ast.If, ast.Name, ast.Load, ast.Constant, ast.Return, ast.arguments,
            ast.BinOp, ast.Compare, ast.arg, ast.Num, ast.Dict, ast.List,
            ast.Set, ast.ListComp, ast.Store, ast.Tuple, ast.Attribute, ast.Subscript,
            ast.keyword, ast.Gt, ast.GtE, ast.Lt, ast.LtE, ast.Eq, ast.NotEq, ast.Is,
            ast.IsNot, ast.In, ast.NotIn, ast.And, ast.Or, ast.UnaryOp, ast.Not
        )
        for node in ast.walk(tree):
            if not isinstance(node, allowed_nodes):
                raise ValueError(f"❌ Disallowed operation: {type(node).__name__}")

        compiled_code = compile(tree, filename="<ast>", mode="exec")

        # ✅ Create context with injected variables
        execution_context = {
            "talib": talib,
            "pd": pd,
            **en_variables  # Safe: no reassignment, just copying values in
        }

        # ✅ Inject maind content into context
        for tf_key, tf_data in maind.items():
            if isinstance(tf_data, dict):
                for inner_key, value in tf_data.items():
                    if isinstance(value, pd.DataFrame):
                        execution_context[inner_key] = value
                    elif isinstance(value, dict):
                        for k, v in value.items():
                            if isinstance(k, str):
                                execution_context[k] = v

        # ✅ Execute code
        exec(compiled_code, execution_context)

        # ✅ Update the original en_variables dict
        result_vars = execution_context.get("variables", {})
        if isinstance(result_vars, dict):
            en_variables.update(result_vars)
            print("✅ en_variables updated with executed code's 'variables'")
        else:
            print("⚠️ No 'variables' dictionary found in executed code.")

        return en_variables

    except Exception as e:
        print(f"❌ Error during strategy execution: {e}")
        raise

async def run_trading_cycle(
    websocket,
    purchase_conditions_code,
    extracted_vars,
    prop,
    p_queue,
    contracts,
    con_queue,
    Scs1_execution,
    Sell_conditions_code,
    updated_variables,
    stop_event,
    maind,
    en_variables
):
    stop_event.set()
    required_timeframes = list(maind.keys())

    while True:
        print("⏸️ Waiting for stop_event to start new trading cycle...")
        await stop_event.wait()
        print("🟢 stop_event triggered, continuing...")

        try:
            stop_event.clear()
            print("✅ stop_event cleared successfully.")
        except Exception as e:
            print(f"❌ Failed to clear stop_event: {e}")

        print("🔁 Starting trading cycle...")

        try:
            # ✅ Wait for all required timeframes to be ready (≥1010 rows + dict present)
            while True:
                all_ready = True
                for tf in required_timeframes:
                    tf_data = maind.get(tf)
                    df = tf_data.get(f"{tf}_df") if tf_data else None
                    latest = tf_data.get(tf) if tf_data else None

                    if not isinstance(df, pd.DataFrame) or len(df) < 101:
                        print(f"⏳ Waiting for {tf}_df to have ≥101 rows (currently: {len(df) if isinstance(df, pd.DataFrame) else 0})...")
                        all_ready = False
                    if not isinstance(latest, dict) or not latest:
                        print(f"⏳ Waiting for latest data dict for '{tf}'...")
                        all_ready = False

                if all_ready:
                    print("✅ All timeframes have ≥101 rows and valid latest dicts.")
                    break

                await asyncio.sleep(1)

            # ✅ Safe to evaluate purchase code now
            purchase_data = None
            attempt = 1

            while purchase_data is None:
                print(f"\n🔍 Attempt {attempt} to evaluate purchase conditions...")

                for tf_key, tf_data in maind.items():
                    df = tf_data.get(f"{tf_key}_df")
                    if isinstance(df, pd.DataFrame) and not df.empty:
                        print(f"🔹 {tf_key}_df (last 3 rows):")
                        print(df.tail(3))
                    else:
                        print(f"⚠️ {tf_key}_df is missing or empty")
                try:
                    #purchase_result = prse_and_execute_purchase_code(purchase_conditions_code, maind)
                    #print("🧪 Purchase result:", purchase_result)

                    en_variables = prse_and_execute_purchase_cond(purchase_conditions_code, maind, en_variables)

                    print("🧠 Updated en_variables:", en_variables)
                    purchase_data = en_variables.get("Pdd")

                    #purchase_data = purchase_result.get("Pdd")
                    if not purchase_data:
                        print("⚠️ 'Pdd' is None. Retrying in 1 second...")
                        await asyncio.sleep(1)
                        attempt += 1
                        purchase_data = None  # Force retry

                except Exception as e:
                    print(f"❌ Error during strategy execution: {e}")
                    print("🔁 Retrying in 1 second...")
                    await asyncio.sleep(1)
                    attempt += 1

            print("✅ Valid 'Pdd' signal found. Proceeding with proposal...")

            contract_type = contract_to_buy(purchase_data)

            print("📦 Extracted Vars before proposal:", extracted_vars)
            print("✅ Valid 'Pdd' signal found. Proceeding with proposal...")

            proposal_payloads = create_p_payloads(extracted_vars, en_variables)
            print("📝 Proposal Payloads:", proposal_payloads)


            selected_proposal = {contract_type: proposal_payloads[contract_type]}
            print("🎯 Selected Proposal:", selected_proposal)

            await websocket.get_proposal(selected_proposal)
            await print_live_prop_data(p_queue, prop)

            override_ref = extracted_vars.get("Tp1", {}).get("rltoecb")
            restart_buysell_flag = extracted_vars.get("Tp1", {}).get("rbscb")

            print(f"🚀 Restart last trade on error: {override_ref}")
            print(f"🔁 Restart buy/sell on error: {restart_buysell_flag}")

            await buy_proposal(
                contract_type,
                contracts,
                override_ref,
                updated_variables,
                websocket,
                proposal_payloads,
                prop,
                p_queue
            )

            print("📦 Trade placed, monitoring...")

        except Exception as e:
            print(f"⚠️ Error in trading cycle: {e}")
            await asyncio.sleep(1)

def normalize_timeframe(dci_str: str) -> str:
    """
    Converts human-readable timeframe to API timeframe string.
    Examples: "1 minute" -> "1m", "5 minutes" -> "5m", "4 hour" -> "4h", "1 day" -> "1d"
    """
    mapping = {
        "1 minute": "1m",
        "2 minutes": "2m",
        "5 minutes": "5m",
        "10 minutes": "10m",
        "15 minutes": "15m",
        "30 minutes": "30m",
        "1 hour": "1h",
        "2 hours": "2h",
        "4 hour": "4h",
        "8 hours": "8h",
        "12 hours": "12h",
        "1 day": "1d",
        "tick": "tick",
    }

    normalized = mapping.get(dci_str.strip().lower())
    if not normalized:
        raise ValueError(f"Unsupported timeframe: '{dci_str}'")
    return normalized


def extract_unique_timeframes(e_v: dict) -> dict:
    """
    Extracts 'dci' and all 'sci' keys from the e_v dictionary,
    filters out duplicates by timeframe value.

    - Only one entry per unique timeframe is kept.
    - dci gets priority in naming ('dci'), others use 'sci_<timeframe>' as keys.

    Returns:
        A dictionary mapping labels (like 'dci', 'sci_5m') to timeframe strings.
    """
    subscriptions = {}
    seen_timeframes = set()

    # STEP 1: Extract 'dci' if present
    dci = e_v.get("dci")
    if dci and dci not in seen_timeframes:
        subscriptions["dci"] = dci
        seen_timeframes.add(dci)

    # STEP 2: Extract all 'sci' keys (if multiple sci keys exist)
    for key, value in e_v.items():
        if key == "sci" and value not in seen_timeframes:
            label = f"sci_{value}"
            subscriptions[label] = value
            seen_timeframes.add(value)

    return subscriptions

def build_timeframe_dict(e_v: dict, symbol: str) -> dict:
    """
    Build a unique timeframe dictionary from the e_v config.

    Returns:
        dict like {
            'tfr1': 'R_50_tick',
            'tfr2': 'R_50_1m',
            'tfr3': 'R_50_15m',
        }
    """
    timeframes = {}
    seen = set()

    def add_tf(tf_value, label_prefix):
        tf_key = f"{symbol}_{tf_value}"
        if tf_key not in seen:
            seen.add(tf_key)
            timeframes[f"tfr{len(timeframes) + 1}"] = tf_key

    # Always add tick first
    add_tf("tickh", "dci")
    add_tf("tickl", "dci")

    # Handle dci if available
    dci = e_v.get("dci")
    if dci:
        add_tf(dci, "dci")

    # Handle all sci entries (there could be multiple)
    for key, val in e_v.items():
        if key == "sci":
            add_tf(val, "sci")

    print("🧠 Timeframe dictionary built:", timeframes)
    return timeframes

async def start_passive_tick_listener(key, queue, process_fn=None):
    """
    Listens to tick data from a specific queue in the background.
    Optionally processes it with a callback like process_fn(data).
    """
    while True:
        try:
            tick = await queue.async_q.get()
            print(f"📈 Tick from {key}: {tick}")

            if process_fn:
                await process_fn(key, tick)

        except Exception as e:
            print(f"❌ Error in tick listener for {key}: {e}")
            await asyncio.sleep(3)

def start_all_passive_listeners(subscription_result):
    for key, info in subscription_result.items():
        queue_name = info["queue"]
        queue = getattr(shared_q, queue_name, None)

        if queue:
            asyncio.create_task(start_passive_tick_listener(key, queue))
        else:
            print(f"⚠️ Queue '{queue_name}' not found.")

def create_indicator_queues(subscription_result):
    unique_keys = set()

    for key in subscription_result.keys():
        if "tick" in key:
            unique_keys.add("tick")
        else:
            try:
                tf_part = key.split("_")[-1]
                unique_keys.add(tf_part)
            except IndexError:
                print(f"⚠️ Failed to parse timeframe from key: {key}")

    indicator_queues = {}
    for key in unique_keys:
        indicator_queues[key] = asyncio.Queue()
        print(f"📦 Created indicator queue: {key}")

    return indicator_queues


def create_maind_data(indicator_queues: dict) -> dict:
    maind = {}

    for key in indicator_queues.keys():
        maind[key] = {
            key: {},  # e.g. "tick": {}
            f"{key}_df": pd.DataFrame()
        }
        print(f"🧠 Initialized maind data for: {key}")

    return maind

# ------------------------------------------
# ✅ Execute parsed code using safe AST
# ------------------------------------------
def p_a_e_p_code(code_string, selected_df, maind):
    try:
        import talib

        tree = ast.parse(code_string, mode="exec")
        allowed_nodes = (
            ast.Module, ast.FunctionDef, ast.Expr, ast.Call, ast.Assign,
            ast.If, ast.Name, ast.Load, ast.Constant, ast.Return, ast.arguments,
            ast.BinOp, ast.Compare, ast.arg, ast.Num, ast.Dict, ast.List,
            ast.Set, ast.ListComp, ast.Store, ast.Tuple, ast.Attribute,
            ast.Subscript, ast.keyword, ast.JoinedStr, ast.FormattedValue
        )

        for node in ast.walk(tree):
            if not isinstance(node, allowed_nodes):
                raise ValueError(f"Disallowed operation: {type(node).__name__}")

        compiled_code = compile(tree, filename="<ast>", mode="exec")

        context = {
            "talib": talib,
            "pd": pd,
            "df": selected_df,
            "tick_data": selected_df,
            "maind": maind
        }

        for tf_key, tf_data in maind.items():
            if isinstance(tf_data, dict):
                df_val = tf_data.get(f"{tf_key}_df")
                if isinstance(df_val, pd.DataFrame):
                    context[f"{tf_key}_df"] = df_val

        exec(compiled_code, context)
        print("✅ p_a_e_p_code executed.")

    except Exception as e:
        print(f"❌ Error during execution: {e}")

# -------------------------------------------------
# ✅ Apply indicators that match the current key
# -------------------------------------------------
def apply_indicators(tick_data, matching_indicators, maind, key):
    if len(tick_data) >= 2 and "quote" in tick_data.columns:
        for name, formula in matching_indicators.items():
            try:
                formula = remove_leading_spaces(formula)
                p_a_e_p_code(formula, tick_data, maind)
            except Exception as e:
                print(f"⚠️ Failed to apply indicator '{name}': {e}")

async def p_l_tick_data(queues, Roat1_result, matching_indicators, key, maind, d_sub, client_id):
    tick_data = maind[key].get(f"{key}_df", pd.DataFrame())
    #initialized = not tick_data.empty  # Flag: True if already populated

    def get_latest_valid_row(df: pd.DataFrame) -> dict:
        if len(df) < 2:
            return df.iloc[-1].to_dict() if not df.empty else {}

        last_row = df.iloc[-1]
        second_last_row = df.iloc[-2]

        latest = {}
        for col in df.columns:
            last_val = last_row[col]
            second_val = second_last_row[col]
            latest[col] = (
                last_val if pd.notna(last_val)
                else second_val if pd.notna(second_val)
                else None
            )

        if isinstance(latest.get("timestamp"), pd.Timestamp):
            latest["timestamp"] = latest["timestamp"].isoformat()

        return latest

    async def process_history_data(data):
        if "history" in data:
            prices = data["history"].get("prices", [])
            times = data["history"].get("times", [])
            if prices and times:
                quotes = [float(p) for p in prices]
                timestamps = [datetime.fromtimestamp(t) for t in times]
                last_digits = [int(str(q)[-1]) for q in quotes]
                market_directions = ["No change"] + [
                    "Rise" if quotes[i] > quotes[i - 1] else "Fall" if quotes[i] < quotes[i - 1] else "No change"
                    for i in range(1, len(quotes))
                ]
                return pd.DataFrame({
                    "timestamp": timestamps,
                    "quote": quotes,
                    "last_digit": last_digits,
                    "market_direction": market_directions,
                    "ask": [None] * len(prices),
                    "bid": [None] * len(prices),
                    "spread": [None] * len(prices),
                    "pip_size": [None] * len(prices),
                })

        if "candles" in data:
            candles = data["candles"]
            if candles:
                df = pd.DataFrame(candles)
                df["timestamp"] = pd.to_datetime(df["epoch"], unit='s')
                return df

        return None

    async def process_live_tick(data):
        try:
            tick = data["tick"]
            tick_time = datetime.fromtimestamp(tick["epoch"])
            tick_quote = float(tick["quote"])
            tick_ask = float(tick.get("ask", tick_quote))
            tick_bid = float(tick.get("bid", tick_quote))
            tick_pip_size = float(tick["pip_size"])
            tick_spread = tick_ask - tick_bid
            tick_last_digit = int(str(tick_quote)[-1])
            prev_quote = maind[key].get(key, {}).get("quote", tick_quote)
            market_direction = (
                "Rise" if tick_quote > prev_quote else
                "Fall" if tick_quote < prev_quote else
                "No change"
            )
            return pd.DataFrame([{
                "timestamp": tick_time,
                "ask": tick_ask,
                "bid": tick_bid,
                "quote": tick_quote,
                "pip_size": tick_pip_size,
                "spread": tick_spread,
                "last_digit": tick_last_digit,
                "market_direction": market_direction,
            }])
        except Exception as e:
            print(f"❌ Failed to process live tick: {e}")
            return None

    async def process_live_candle(data):
        try:
            candle = data["ohlc"]
            candle_time = datetime.fromtimestamp(candle["epoch"])
            return pd.DataFrame([{
                "timestamp": candle_time,
                "open": float(candle["open"]),
                "high": float(candle["high"]),
                "low": float(candle["low"]),
                "close": float(candle["close"]),
                "epoch": candle["epoch"],
                "granularity": candle["granularity"]
            }])
        except Exception as e:
            print(f"❌ Failed to process live candle: {e}")
            return None

    async def listen_queue(queue):
        nonlocal tick_data
        print(f"🚦 Listening to queue: {queue}")
        while True:
            try:
                #data = await queue.async_q.get()
                try:
                    print(f"⏳ Waiting for data from queue: {queue}")
                    data = await queue.async_q.get()
                    print(f"📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥📥 Received data from queue ({queue=}):\n{data}")
                except Exception as e:
                    print(f"❌❌❌❌❌❌❌❌❌❌❌❌v❌ Error while getting data from queue: {e}")

                # 🔗 Track subscription mapping
                if "subscription" in data and "req_id" in data:
                    sub_id = data["subscription"]["id"]
                    req_id = data["req_id"]
                    if req_id not in d_sub:
                        d_sub[req_id] = sub_id
                        print(f"🔗 Mapped req_id {req_id} → subscription_id {sub_id}")

                        # 🚀 Save to Redis
                        await add_subscription_mappin("bot", client_id, req_id, sub_id)  # or "chart"

                        # ✅ Mark bot/chart live
                        await set_bot_live_status(client_id, status=True)

                # 📥 Handle historical or candle data (initialize only if df is empty)
                if ("history" in data or "candles" in data):
                    if f"{key}_df" not in maind[key] or maind[key][f"{key}_df"].empty:
                        df = await process_history_data(data)
                        if df is not None:
                            tick_data = df.tail(1100)
                            maind[key][f"{key}_df"] = tick_data
                            print(f"📥 Initialized {key} with historical data.")

                # 🔄 Handle live tick updates
                elif "tick" in data:
                    df = await process_live_tick(data)
                    if df is not None:
                        tick_data = pd.concat([tick_data, df], ignore_index=True).tail(1100)
                        maind[key][f"{key}_df"] = tick_data
                        if len(tick_data) >= 2:
                            print(f"🔍 Matching indicators for {key}:", matching_indicators)
                            if matching_indicators:
                                apply_indicators(tick_data, matching_indicators, maind, key)
                            else:
                                print(f"⚠️ No indicators to apply for {key}")
                            latest = get_latest_valid_row(tick_data)
                            maind[key][key] = latest

                # 📊 Handle live candle updates
                elif "ohlc" in data:
                    df = await process_live_candle(data)
                    if df is not None:
                        tick_data = pd.concat([tick_data, df], ignore_index=True).tail(1100)
                        maind[key][f"{key}_df"] = tick_data
                        if len(tick_data) >= 2:
                            print(f"🔍 Matching indicators for {key}:", matching_indicators)
                            if matching_indicators:
                                apply_indicators(tick_data, matching_indicators, maind, key)
                            else:
                                print(f"⚠️ No indicators to apply for {key}")
                            latest = get_latest_valid_row(tick_data)
                            maind[key][key] = latest

            except Exception as e:
                print(f"❌ Queue listen error: {e}")
                continue

    print("👀 Starting listeners for queues:", queues)
    print("🔍 Queues passed to p_l_tick_data:", queues)
    await asyncio.gather(*(listen_queue(q) for q in queues))

async def run_streaming_task(key, subscription_result, Roat1_result, matching_indicators, maind, d_sub, client_id):
    print(f"🚀 Starting streaming task for {key}")  # 🔍 Confirm task launch

    while True:
        try:
            print(f"🧪 Inside loop for {key}")  # 🔍 Confirm we're looping

            queues = get_queues_for_key(key, subscription_result)
            print(f"📦 Queues for {key} resolved:", queues)

            await p_l_tick_data(
                queues, Roat1_result, matching_indicators, key, maind, d_sub, client_id
            )  # ✅ Pass key string

            print(f"🔁🔁 Streaming continues for {key} 🔁🔁")

        except Exception as e:
            print(f"❌ Error in streaming task for {key}: {e}")

            await asyncio.sleep(5)

def get_queues_for_key(key, subscription_result):
    queues = []

    for sub_key, value in subscription_result.items():
        if sub_key.endswith("tickl") or sub_key.endswith("tickh"):
            if key == "tick":
                qname = value["queue"]
                queue = shared_q.subscription_queues.get(qname)
                if queue:
                    queues.append(queue)
        elif sub_key.endswith(key):
            qname = value["queue"]
            queue = shared_q.subscription_queues.get(qname)
            if queue:
                queues.append(queue)

    return queues


def filter_indicators_by_timeframe(indicator_df, tf):
    filtered = {}

    print(f"🔎 Checking indicators for timeframe: {tf}")
    print(f"📦 Full indicator_df keys: {list(indicator_df.keys())}")
    print("🧾 Full indicator_df content:\n")
    for name, code_str in indicator_df.items():
        print(f"--- {name} ---\n{code_str}\n")

        print(f"🔍 Scanning indicator: {name}")

        # 👇 NEW REGEX - allow multiline + indentation
        match = re.search(r"^\s*input_List\s*=\s*(\([^)]+\))", code_str, re.MULTILINE)

        if match:
            try:
                input_list = ast.literal_eval(match.group(1))
                if isinstance(input_list, (list, tuple)) and len(input_list) == 2:
                    column, timeframe = input_list
                    if timeframe == tf:
                        filtered[name] = code_str
            except Exception as e:
                print(f"⚠️ Error parsing input_List in {name}: {e}")
                continue
        else:
            print(f"❌ No input_List match found in {name}")

    print(f"🎯 Final matching indicators for '{tf}': {list(filtered.keys())}")
    return filtered

async def unsubscribe_all(websocket, d_sub):
    print("🔁 Unsubscribing from all active subscriptions...")
    print("📦 Current d_sub contents:", d_sub)

    for req_id, sub_id in d_sub.items():
        if sub_id:
            try:
                await websocket.ws.send(json.dumps({
                    "forget": sub_id,
                    "req_id": req_id
                }))
                print(f"🧹 Unsubscribed (req_id: {req_id}, sub_id: {sub_id})")
            except Exception as e:
                print(f"❌ Failed to unsubscribe (req_id: {req_id}): {e}")
        else:
            print(f"⚠️ Missing subscription ID for req_id: {req_id}")

    print("✅ All subscriptions successfully forgotten.")

def remove_indicator_keys_from_en_variables(indicator_df, en_variables):
    """
    Removes any keys from en_variables that are also present in indicator_df.
    If indicator_df is empty, returns en_variables unchanged.
    """
    if not indicator_df:
        # indicator_df is empty → return original
        return en_variables

    # Create a new dictionary excluding indicator keys
    cleaned_variables = {
        k: v for k, v in en_variables.items() if k not in indicator_df
    }

    return cleaned_variables

async def update_balance_task(en_variables):
    """
    Listens to shared_q.balance_data_queue and updates en_variables["acc_bal"]
    whenever new balance data arrives.
    """
    while True:
        try:
            balance_data = await shared_q.balance_data_queue.async_q.get()

            # Extract the balance value
            balance = balance_data.get("balance", {}).get("balance")
            if balance is not None:
                en_variables["acc_bal"] = balance
                print(f"💰 Updated acc_bal in en_variables: {balance}")
            else:
                print("⚠️ Balance not found in incoming data.")

        except Exception as e:
            print(f"❌ Error in update_balance_task: {e}")
            continue  # Don't crash, just keep listening


async def process_blocks(python_code, client_id): #  websocket,
    print(f"🆔 process_blocks() started for client_id: {client_id}")
    """
    Process the received Python code, clean it, and extract trading parameters.
    :param python_code: The Python code received from the frontend.
    """
    try:
        print("Processing Python Code...")

        #api = DerivAPI(app_id=APP_ID)

        print(f"Authorizing API for ...")
        #await api.authorize(API_TOKEN)
        print("Authorization successful!")

        # ✅ Instead of using passed-in websocket, pull it dynamically
        socket_entry = get_socket(client_id)
        if not socket_entry or not socket_entry.get("websocket"):
            print(f"❌ No websocket found for client {client_id}")
            return

        websocket = socket_entry["websocket"]
        print("📡 WebSocket object resolved in process_blocks:", websocket)
        print("⚙️ Type of websocket:", type(websocket))

        print("📡 WebSocket object received in process_blocks:", websocket)

        # Optional: check its type
        print("⚙️ Type of websocket:", type(websocket))

        #latest_data = {
         ##  "df": None
        #}

        latest_data = {
            "tick": {},  # ✅ empty dictionary
            "df": pd.DataFrame()  # ✅ empty DataFrame
        }

        contracts = {}
        running_tasks = []

        # Analyze and clean the code
        cleaned_code, analysis_report = analyze_python_code(python_code)

        # Display the cleaned code
        print("Cleaned Python Code:")
        print(cleaned_code)
        print(talib)

        fixed_code = fix_python_code_indentation(cleaned_code)
        print("Fixed Python Code:")
        print(fixed_code)

        # Define the starting and ending markers
        tp1_start_marker = "# Python code for tradeparameters_tp_block"
        tp1_end_marker = "variables = tradeparameters_tp_block()"    # "return Tp1"
        # Define the starting and ending markers
        roat1_start_marker = "# Python code for tradeparameters_roat_block"
        roat1_end_marker = "variables = tradeparameters_roat_block()"  # "return Roat1"
        # Define the starting and ending markers
        to1_start_marker = "# Python code for tradeparameters_to block"
        to1_end_marker = "variables = tradeparameters_to_block()"  # "return To1"
        # Define the starting and ending markers
        Scs1_start_marker = "# Python code for Sell_conditions_block"
        Scs1_end_marker = "variables = Sell_conditions_block()"  # "return Scs1"
        # Define the starting and ending markers
        Pcs1_start_marker = "# Python code for Purchase_conditions_block"
        Pcs1_end_marker = "variables = Purchase_conditions_block()"  # "return Pcs1"
        # Define the starting and ending markers
        Rtcs1_start_marker = "# Python code for Restart_trading_conditions_block"
        Rtcs1_end_marker = "variables = Restart_trading_conditions_block()"  #  "return Rtcs1"

        tradeparameters_tp1_code = extract_purchase_conditions_block(fixed_code, tp1_start_marker, tp1_end_marker)
        tradeparameters_roat1_code = extract_purchase_conditions_block(fixed_code, roat1_start_marker, roat1_end_marker)
        tradeparameters_to1_code = extract_purchase_conditions_block(fixed_code, to1_start_marker, to1_end_marker)
        purchase_conditions_code = extract_purchase_conditions_block(fixed_code, Pcs1_start_marker, Pcs1_end_marker)
        Sell_conditions_code = extract_purchase_conditions_block(fixed_code, Scs1_start_marker, Scs1_end_marker)
        Restart_trading_conditions_code = extract_purchase_conditions_block(fixed_code, Rtcs1_start_marker, Rtcs1_end_marker)

        # Extract variables using the newly defined function
        e_v = extract_variables_from_code(fixed_code)
        # Extract variables using the newly defined function
        Tp1 = extract_variables_from_code(tradeparameters_tp1_code)
        # Extract variables using the newly defined function
        Roat1 = extract_variables_from_code(tradeparameters_roat1_code)
        # Extract variables using the newly defined function
        To1 = extract_variables_from_code(tradeparameters_to1_code)
        # Extract variables using the newly defined function
        Pcs1 = extract_variables_from_code(purchase_conditions_code)
        # Extract variables using the newly defined function
        Scs1 = extract_variables_from_code(Sell_conditions_code)
        # Extract variables using the newly defined function
        Rtcs1 = extract_variables_from_code(Restart_trading_conditions_code)

        # Output the extracted variables
        print("E_V:", e_v)
        print("Tp1_vars:", Tp1)
        print("Roat1_vars:", Roat1)
        print("To1_vars:", To1)
        print("Pcs1_vars:", Pcs1)
        print("Scs1_vars:", Scs1)
        print("Rtcs1_vars:", Rtcs1)

        extracted_vars = {}

        # Call the function
        updated_variables = update_extracted_variables(
            extracted_vars,
            Tp1=Tp1,
            Roat1=Roat1,
            To1=To1,
            Pcs1=Pcs1,
            Scs1=Scs1,
            Rtcs1=Rtcs1,
        )

        print("updated_variables:")
        print(updated_variables)

        # Print the extracted Purchase_conditions block
        print("Extracted Purchase_conditions block:")
        print(purchase_conditions_code)
        print(tradeparameters_tp1_code)
        print(tradeparameters_roat1_code)
        print(tradeparameters_to1_code)
        print(Sell_conditions_code)
        print(Restart_trading_conditions_code)

        #en_variables = {}
        en_variables = {"acc_ball": 123}  # already has some values

        en_variables = en_variables_parse_and_execute_purchase_code(tradeparameters_tp1_code, en_variables)
        print("Tp1_result_en_variables:", en_variables)
        en_variables = en_variables_parse_and_execute_purchase_code(tradeparameters_roat1_code, en_variables)
        print("Roat1_result_en_variables:", en_variables)
        en_variables = en_variables_parse_and_execute_purchase_code(tradeparameters_to1_code, en_variables)
        print("To1_result_en_variables:", en_variables)

        Tp1_result = parse_and_execute_purchase_code(tradeparameters_tp1_code)
        print("Tp1_result:", Tp1_result)

        Roat1_result = parse_and_execute_purchase_code(tradeparameters_roat1_code)
        print("Roat1_result:", Roat1_result)

        To1_result = parse_and_execute_purchase_code(tradeparameters_to1_code)
        print("To1_result:", To1_result)

        if "Scs1" in updated_variables:
            scs1_dict = updated_variables["Scs1"]

            # Case: exactly one key 'samp' with value 'None' -> False
            if scs1_dict == {"samp": "None"}:
                Scs1_execution = False
            else:
                Scs1_execution = True
        else:
            Scs1_execution = False

        # Output the result
        print(f"Scs1_execution: {Scs1_execution}")

        #proposal_payload = create_proposal_payloads(extracted_vars)
        #print("Payload for subscription:", proposal_payload)

        prop = {}

        p_queue = asyncio.Queue()

        # Define a queue to hold proposal updates
        proposal_queue = asyncio.Queue()

        # Shared queue for updates
        df_queue = asyncio.Queue()

        bl_queue = asyncio.Queue()

        # Shared queue for updates
        update_queue = asyncio.Queue()
        cd_queue = asyncio.Queue()
        buy_d = {}
        buy_queue = asyncio.Queue()

        poc_data_queue = asyncio.Queue()
        poc_d = {}

        #symbol = extracted_vars.get('Tp1', {}).get('symbol')
        symbol = extracted_vars.get('Tp1', {}).get('symbol')
        if not symbol:
            raise ValueError("No symbol found in extracted Tp1 variables.")

        # ✅ Subscribe to tick data using the WebSocket object
        #await websocket.subscribe_ticks(symbol)

        raw_dci = extracted_vars.get('Tp1', {}).get('dci')
        #timeframe = normalize_timeframe(raw_dci)

        # 👇 Extract unique timeframes (deduplicated)
        subscriptions = extract_unique_timeframes(e_v)
        timeframes = build_timeframe_dict(e_v, symbol)
        print("⏱️ Timeframes dictionary:", timeframes)

        # 👇 Create queues dynamically
        #queue_map = create_subscription_queues(subscriptions)
        #print_available_queues(queue_map)

        # Create shared janus queues
        #queue_map = shared_q.create_subscription_queues(subscriptions)
        #queue_map = shared_q.create_subscription_queues(timeframes)

        queue_map = shared_q.create_subscription_queues(timeframes)
        print(queue_map)

        # Print the queues (optional debug)
        shared_q.print_available_queues()

        # ✅ Example: accessing a queue
        # await queue_map['dci_1m_queue'].put(data)

        # ✅ Initialize subscription manager with websocket instance
        print("🧪 Before creating MarketSubscriptionManager...")
        sub_manager = MarketSubscriptionManager(websocket, client_id)
        print("✅ After creating MarketSubscriptionManager")
        #await sub_manager.subscribe(symbol, raw_dci)

        #task = asyncio.create_task(sub_manager.subscribe(symbol, raw_dci))
        #task.add_done_callback(lambda t: print(f"🔄 Subscription task done. Exception: {t.exception()}"))
        subscription_result = {}

        print(f"Roat1_resultyyyyyyy: {Roat1_result}")

        indicator_list, indicator_dic = indicator_list_xtractor(Roat1_result)
        print(f"Extracted indicator_list: {indicator_list}")
        print(f"Extracted indicator_dic: {indicator_dic}")

        indicator_df = indicator_dic  # Roat1_result_function(Roat1_result, tick_data, indicator_list) # , indicator_name
        print(f"Extracted Indicators: {indicator_df}")  # Debugging

        en_variables = remove_indicator_keys_from_en_variables(indicator_df, en_variables)
        print("🧹 Cleaned en_variables:", en_variables)

        # Add columns dynamically based on indicator_list
        for indicator_name in indicator_list:
            if indicator_name not in tick_data.columns:
                tick_data[indicator_name] = None  # Initialize the new column

        print(tick_data.columns.tolist())

        print(f"🧪xxxxxxxxxxxxxxxxx🧪 tick_data DataFrame:\n{tick_data}")
        print("🧪 Columns in tick_data:", tick_data.columns.tolist())

        maind = None  # prepare outer variable if you need access later

        def on_subscriptions_done(t):
            try:
                result = t.result()
                subscription_result.update(result)

                print("\n✅ Subscription task finished successfully!")
                print("📦 Final subscription_result dictionary:")
                for k, v in subscription_result.items():
                    print(f"🔹 {k} → Queue: {v['queue']}, Req ID: {v['req_id']}")

                # ✅ Now pass the final subscription_result to the WebSocket instance
                #websocket.set_subscription_map(subscription_result)

                # ✅ Create indicator queues
                indicator_queues = create_indicator_queues(subscription_result)

                # ✅ Now create the maind dictionary
                maind = create_maind_data(indicator_queues)
                #websocket.maind = maind  # Optional: attach for access later
                # ✅ Start a task for each timeframe key
                for tf in indicator_queues:
                    task_name = f"{tf}_stream_task"
                    task = asyncio.create_task(
                        run_streaming_task(tf, subscription_result, Roat1_result, indicator_df, maind, client_id),
                        name=task_name
                    )
                    running_tasks.append(task)
                    print(f"🚀 Started streaming task for: {tf}")

                #running_tasks.append(asyncio.create_task(start_tick_data_with_retry(symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data, maind), name="tick_d"))

                #websocket.maind = maind  # Optional: store for access later

                # ✅ If needed globally, save them to websocket or shared
                #websocket.indicator_queues = indicator_queues

            except Exception as e:
                print(f"❌ Subscription task failed: {e}")

        #task = asyncio.create_task(sub_manager.subscribe(timeframes))
        #task = asyncio.create_task(sub_manager.subscribe(queue_map))
        #task.add_done_callback(lambda t: print(f"🔄 Subscription task done. Exception: {t.exception()}"))
        #task.add_done_callback(on_subscriptions_done)

        subscription_result = await sub_manager.subscribe(queue_map)
        print("\n✅ Subscription task finished successfully!")
        print("\n📦 Final subscription_result:")
        #for key, val in subscription_result.items():
         #   print(f"🔹 {key} → Queue: {val['queue']}, Req ID: {val['req_id']}, Sub ID: {val['sub_id']}")

        #print("\n📦 Final subscription_result:")
        #for k, v in subscription_result.items():
          #  print(f"🔹 {k} → Queue: {v['queue']}, Req ID: {v['req_id']}")

        # ✅ Now pass the final subscription_result to the WebSocket instance
        websocket.set_subscription_map(subscription_result)

        # ✅ Create indicator queues
        indicator_queues = create_indicator_queues(subscription_result)

        # ✅ Create maind dictionary
        maind = create_maind_data(indicator_queues)

        # ✅ Print maind for debugging
        print("📦 maind dictionary created:")
        for key, value in maind.items():
            print(f"🔹 {key}: {value}")

        d_sub = {}

        # ✅ Start a task for each timeframe key
        for tf in indicator_queues:
            # 🔍 Filter indicators for this specific timeframe
            matching_indicators = filter_indicators_by_timeframe(indicator_df, tf)
            print(f"📊 Indicators for timeframe {tf}: {list(matching_indicators.keys())}")
            print(f"📦 Full matching_indicators for {tf}: {matching_indicators}")

            # 🧠 OPTIONAL: Skip if no indicators for this tf
            #if not matching_indicators:
             #   print(f"⚠️ No indicators found for {tf}, skipping task.")
              #  continue

            # ✅ Create the streaming task only with relevant indicators
            task_name = f"{tf}_stream_task"
            task = asyncio.create_task(
                run_streaming_task(tf, subscription_result, Roat1_result, matching_indicators, maind, d_sub, client_id),
                name=task_name
            )
            running_tasks.append(task)
            print(f"🚀 Started streaming task for: {tf}")

        con_queue = asyncio.Queue()
        con_d = {}
        stop_event = asyncio.Event()
        buy_event = asyncio.Event()

        print(subscription_result)
        print(f"subscription_result subscription_resultsubscription_resultsubscription_: {subscription_result}")

        running_tasks.append(asyncio.create_task(update_balance_task(en_variables), name="update_balance"))
        #running_tasks.append(asyncio.create_task(start_tick_data_with_retry(symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data, maind), name="tick_d"))
        running_tasks.append(asyncio.create_task(print_live_contracts_data(cd_queue, contracts), name="contracts"))
        running_tasks.append(asyncio.create_task(print_live_buy_data(buy_queue, buy_d, stop_event, buy_event), name="buy_data"))
        running_tasks.append(asyncio.create_task(print_live_cons_data(con_queue, con_d, Restart_trading_conditions_code, en_variables), name="conditions"))
        running_tasks.append(asyncio.create_task(monitor_contract_updates(con_queue, stop_event, Scs1_execution, Sell_conditions_code, buy_event, buy_d, en_variables, websocket), name="poc_data"))

        cts = contract_to_sub(Tp1)
        print(f"Contract to buy determined: {cts}")

        # Step 1: Generate initial proposal payload
        extracted_vars = updated_variables
        proposal_payload = cre_propo_paylo(cts, extracted_vars, contracts)
        print("Initial proposal_payload:", proposal_payload)

        await run_trading_cycle(websocket, purchase_conditions_code, extracted_vars, prop, p_queue, contracts, con_queue, Scs1_execution, Sell_conditions_code, updated_variables, stop_event, maind, en_variables)

    finally:
        print(f"🔚 Entered finally block for client_id: {client_id}")
        print("🛑 Cancelling all running tasks...")
        for task in running_tasks:
            task.cancel()
        await asyncio.gather(*running_tasks, return_exceptions=True)

        try:
            chart_is_live = await get_chart_live_status(client_id)
            if chart_is_live:
                print(f"📊 Chart is still live for {client_id} — checking subscriptions...")

                # ⛓️ Redis req_id → sub_id map for chart
                chart_map = await get_subscription_mappin("chart", client_id)
                print(f"📌 Redis req_id → sub_id map for chart client {client_id}:")
                for req_id, sub_id in chart_map.items():
                    print(f"  🔄 {req_id} → {sub_id}")

                # 📦 Chart subscriptions
                chart_subs = await get_all_subscriptions(client_id)
                print(f"📦 All chart subscriptions for {client_id}:")
                for key, val in chart_subs.items():
                    print(f"  📈 {key} → {val}")

                # ✅ If chart is live, call slon_d_sub before unsubscribe
                try:
                    await slim_d_sub(d_sub, chart_map)
                except Exception as e:
                    print(f"⚠️ Error in slim_d_sub for chart: {e}")
            else:
                print(f"📉 Chart is not live for {client_id}. Proceeding to unsubscribe without slon_d_sub...")

        except Exception as e:
            print(f"⚠️ Error checking chart live status or subscriptions: {e}")

        # 🔍 Bot client status
        if await get_bot_live_status(client_id):
            bot_map = await get_subscription_mappin("bot", client_id)
            print(f"📌 Redis req_id → sub_id map for bot client {client_id}:")
            for req_id, sub_id in bot_map.items():
                print(f"  🤖 {req_id} → {sub_id}")
        else:
            print(f"❌ Bot client {client_id} is not live.")

        # ✅ Unsubscribe from everything
        try:
            all_subs = await get_all_subscriptions(client_id)
            print(f"📦 All subscriptions for {client_id}:")
            for key, val in all_subs.items():
                print(f"  🔑 {key} → {val}")

            await unsubscribe_all(websocket, d_sub)

            # Print the queues (optional debug)
            shared_q.print_available_queues()
            
            # Now clean queues from shared_instance
            await clear_matching_queues(client_id, d_sub)

            #remove_matching_subscriptions(client_id, d_sub)

            #from ws.ws_services.subscription_registry import print_and_clean_subscriptions

            #print_and_clean_subscriptions(d_sub, all_subs, do_clear=True)
            await clean_subs_using_dsub_and_allsubs(d_sub, all_subs, client_id, do_clear=True)

            d_sub.clear()

        except Exception as e:
            print(f"⚠️ Error during full unsubscription: {e}")

        # Print the queues (optional debug)
        shared_q.print_available_queues()

async def clean_subs_using_dsub_and_allsubs(d_sub, all_subs, client_id, do_clear=False):
    print("\n🧹 Cleaning registry based on d_sub and all_subs mapping...\n")

    for d_req_id in d_sub.keys():
        found = False

        for key, val in all_subs.items():
            req_id_in_all = val.get("req_id")
            if req_id_in_all != d_req_id:
                continue  # skip non-matching

            found = True
            print(f"🔍 Matched req_id {d_req_id} → key: {key}")

            if "_" not in key:
                print(f"⚠️ Invalid format (missing '_') in key: {key}")
                continue

            symbol, timeframe = key.split("_", 1)

            # ✅ Case 1: tickl → use is_tick_subscribed
            if timeframe == "tickl":
                if is_tick_subscribed(symbol):
                    print(f"✅ Tick (low freq) is subscribed: {symbol}")
                    if do_clear:
                        remove_tick_subscription(symbol)
                        print(f"🧹 Removed tick (low freq): {symbol}")
                        await remove_subs(client_id, key)
                        print(f"🗑️ Cleared Redis cache entry for {key} (client_id: {client_id})")
                else:
                    print(f"❌ Tick (low freq) not in registry: {symbol}")

            # ✅ Case 2: tickh → check with is_subscribed(symbol, "tick")
            elif timeframe == "tickh":
                if is_subscribed(symbol, "tick"):
                    print(f"✅ Tick (high freq) is subscribed: {symbol}_tick")
                    if do_clear:
                        remove_candle_subscription(symbol, "tick")
                        print(f"🧹 Removed tick (high freq): {symbol}_tick")
                        await remove_subs(client_id, key)
                        print(f"🗑️ Cleared Redis cache entry for {key} (client_id: {client_id})")
                else:
                    print(f"❌ Tick (high freq) not in registry: {symbol}_tick")

            # ✅ Case 3: any other candle timeframe (e.g., "1m", "5m")
            else:
                if is_subscribed(symbol, timeframe):
                    print(f"✅ Candle is subscribed: {symbol}_{timeframe}")
                    if do_clear:
                        remove_candle_subscription(symbol, timeframe)
                        print(f"🧹 Removed candle: {symbol}_{timeframe}")
                        await remove_subs(client_id, key)
                        print(f"🗑️ Cleared Redis cache entry for {key} (client_id: {client_id})")
                else:
                    print(f"❌ Candle not in registry: {symbol}_{timeframe}")

            print("")

        if not found:
            print(f"❓ No match found in all_subs for d_sub req_id {d_req_id}")

    print("✅ Cleanup process complete.\n")


def print_subscription_debug_info(d_sub, all_subs):
    print("\n🧩 Debugging Subscription Maps...")

    print("\n📦 d_sub (req_id → sub_id):")
    if not d_sub:
        print("  🚫 No entries in d_sub")
    else:
        for req_id, sub_id in d_sub.items():
            print(f"  🔑 {req_id} → {sub_id}")

    print("\n📦 all_subs (req_id → subscription details):")
    if not all_subs:
        print("  🚫 No entries in all_subs")
    else:
        for req_id, details in all_subs.items():
            print(f"  🔍 {req_id}:")
            for key, val in details.items():
                print(f"     {key}: {val}")

    print("\n✅ End of subscription debug info.\n")

def print_and_clean_subscriptions(d_sub, all_subs, do_clear=False):
    """
    d_sub: dict of req_id → sub_id
    all_subs: dict of req_id → {symbol, type, timeframe}
    do_clear: if True, it will also remove them from registry
    """
    print("🔎 Checking current tracked subscriptions...\n")

    print_subscription_debug_info(d_sub, all_subs)

    for req_id, sub_id in d_sub.items():
        sub_data = all_subs.get(req_id)

        if not sub_data:
            print(f"❓ No sub info found for req_id {req_id}")
            continue

        symbol = sub_data.get("symbol")
        sub_type = sub_data.get("type")  # "tick" or "candlestick"
        tf = sub_data.get("timeframe", "")

        print(f"🔑 {req_id}: {symbol} ({sub_type}, {tf})")

        if sub_type == "tick":
            if is_tick_subscribed(symbol):
                print(f"✅ Tick is subscribed: {symbol}")
                if do_clear:
                    remove_tick_subscription(symbol)
                    print(f"🧹 Removed tick subscription: {symbol}")
            else:
                print(f"❌ Tick NOT found in registry: {symbol}")

        elif sub_type == "candlestick":
            if is_subscribed(symbol, tf):
                print(f"✅ Candle is subscribed: {symbol}_{tf}")
                if do_clear:
                    remove_candle_subscription(symbol, tf)
                    print(f"🧹 Removed candle subscription: {symbol}_{tf}")
            else:
                print(f"❌ Candle NOT found in registry: {symbol}_{tf}")

        print("")

    print("✅ Subscription registry cleanup done.\n")


async def clear_matching_queues(client_id, d_sub):
    """
    Clears queues in `shared_instance` that are associated with active d_sub entries.

    - client_id: str → used to fetch all subscriptions
    - d_sub: dict → req_id: sub_id mapping from live WebSocket session
    - shared_instance: object → must have `.clear_queue(queue_name)` method
    """
    all_subs = await get_all_subscriptions(client_id)  # Get all Redis-stored subs for client

    print(f"📦 All subscriptions for {client_id}:")
    for key, val in all_subs.items():
        print(f"  🔑 {key} → {val}")

    print("🧠 Cross-referencing with d_sub to find matching queues...")
    for sub_key, sub_info in all_subs.items():
        req_id = sub_info.get("req_id")
        queue_name = sub_info.get("queue")

        if req_id in d_sub:
            print(f"🧹 Clearing queue: {queue_name} (req_id: {req_id})")
            shared_q.clear_queue(queue_name)
        else:
            print(f"⏭️ Skipping {queue_name} (req_id: {req_id}) — not in d_sub")


def slim_d_sub(d_sub: dict, chart_map: dict) -> dict:
    cleaned_d_sub = {
        req_id: sub_id
        for req_id, sub_id in d_sub.items()
        if chart_map.get(req_id) != sub_id
    }

    removed = set(d_sub) - set(cleaned_d_sub)
    if removed:
        print(f"🧹 Removed redundant req_ids from d_sub: {removed}")

    return cleaned_d_sub

# asyncio.create_task(print_live_tick_data(api, symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data))
# asyncio.create_task(start_tick_data_with_retry(symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data, latest_data))
# asyncio.create_task(subscribe_market_data(api, symbol, update_queue, df_queue, Roat1_result, indicator_df, tick_data))
# asyncio.create_task(print_live_contracts_data(cd_queue, contracts))
# asyncio.create_task(print_live_prop_data(cd_queue, contracts))
# asyncio.create_task(print_live_buy_data(buy_queue, buy_d))
# asyncio.create_task(print_live_cons_data(con_queue, con_d, Restart_trading_conditions_code))
# buy_event.clear()
