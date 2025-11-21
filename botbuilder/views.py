from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Bot, Trade
from .serializers import BotSerializer, TradeSerializer
from collections import defaultdict
# from _archive_unused.old_python.connection import get_active_symbols, get_active_assets, fetch_contracts_for
from .services.strategy_processor import process_blocks

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import asyncio


@csrf_exempt
def run_bot_view(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON
            data = json.loads(request.body)
            python_code = data.get('pythonCode')

            if not python_code:
                return JsonResponse({'status': 'error', 'message': 'pythonCode field is required.'}, status=400)

            # Call the asynchronous process_blocks function in a sync-safe context
            processing_result = asyncio.run(process_blocks(python_code))

            # Return success response
            return JsonResponse({
                'status': 'success',
                'message': 'Python code processed successfully.',
                'result': processing_result,
            })

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format.'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Error processing request: {str(e)}'}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

'''
@csrf_exempt
async def run_bot_view(request):
    """
    Asynchronous view to handle the 'run bot' request.
    """
    if request.method == 'POST':
        try:
            # Parse incoming JSON
            data = json.loads(request.body)
            python_code = data.get('pythonCode')

            if not python_code:
                return JsonResponse({'status': 'error', 'message': 'pythonCode field is required.'}, status=400)

            # Call the asynchronous process_blocks function
            processing_result = await process_blocks(python_code)

            # Return success response
            return JsonResponse({
                'status': 'success',
                'message': 'Python code processed successfully.',
                'result': processing_result,
            })

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format.'}, status=400)

        except Exception as e:
            # Return a detailed error message in case of other exceptions
            return JsonResponse({'status': 'error', 'message': f'Error processing request: {str(e)}'}, status=500)

    # Return an error response for unsupported request methods
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
'''

'''
@csrf_exempt
async def run_bot_view(request):
    import asyncio
    await asyncio.sleep(1)  # Simulate async operation
    if request.method == 'POST':
        try:
            # Parse incoming JSON
            data = json.loads(request.body)
            python_code = data.get('pythonCode', None)

            if not python_code:
                return JsonResponse({'status': 'error', 'message': 'pythonCode field is required.'}, status=400)

            # Call the asynchronous process_blocks and await its result
            try:
                processing_result = await process_blocks(python_code)
                return JsonResponse({'status': 'success', 'message': 'Python code processed successfully.', 'result': processing_result})
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': f'Error in processing: {str(e)}'}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
'''
'''
@csrf_exempt
def run_bot_view(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON
            data = json.loads(request.body)
            python_code = data.get('pythonCode', None)

            if not python_code:
                return JsonResponse({'status': 'error', 'message': 'pythonCode field is required.'}, status=400)

            # Log the received code for debugging
            #print("Received Python Code:", python_code)

            # Pass the Python code to the strategy processor
            try:
                processing_result = process_blocks(python_code)
                return JsonResponse({'status': 'success', 'message': 'Python code processed successfully.', 'result': processing_result})
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': f'Error in processing: {str(e)}'}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
'''
'''
@csrf_exempt
def run_bot_view(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON
            data = json.loads(request.body)
            python_code = data.get('pythonCode', None)

            if not python_code:
                return JsonResponse({'status': 'error', 'message': 'pythonCode field is required.'}, status=400)

            # Log the received code for debugging
            print("Received Python Code:", python_code)

            return JsonResponse({'status': 'success', 'message': 'Python code received and processed.'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
'''
# Utility function to parse contracts
def parse_contracts(data):
    available_contracts = data.get("contracts_for", {}).get("available", [])
    contract_categories = {}

    for contract in available_contracts:
        # Extract details
        category = contract["contract_category"]
        category_display = contract["contract_category_display"]
        contract_type = contract["contract_type"]
        contract_display = contract["contract_display"]
        contract_category = contract["contract_category"]
        sentiment = contract.get("sentiment")
        barriers = contract.get("barriers", 0)
        barrier_category = contract.get("barrier_category")
        barrier_details = {
            "barrier": contract.get("barrier"),
            "high_barrier": contract.get("high_barrier"),
            "low_barrier": contract.get("low_barrier"),
        }
        growth_rate_range = contract.get("growth_rate_range")
        default_stake = contract.get("default_stake")
        max_contract_duration = contract.get("max_contract_duration")
        min_contract_duration = contract.get("min_contract_duration")
        multiplier_range = contract.get("multiplier_range")
        expiry_type = contract.get("expiry_type")
        start_type = contract.get("start_type")
        last_digit_range = contract.get("last_digit_range")
        exchange_name = contract.get("exchange_name")
        contract_category_display = contract.get("contract_category_display")

        # Group by contract category
        if category not in contract_categories:
            contract_categories[category] = {
                "category_display": category_display,
                "contracts": []
            }

        # Add contract details
        contract_categories[category]["contracts"].append({
            "contract_type": contract_type,
            "contract_display": contract_display,
            "contract_category": contract_category,
            "sentiment": sentiment,
            "barriers": barriers,
            "barrier_category": barrier_category,
            "barrier_details": barrier_details,
            "growth_rate_range": growth_rate_range,
            "default_stake": default_stake,
            "max_contract_duration": max_contract_duration,
            "min_contract_duration": min_contract_duration,
            "multiplier_range": multiplier_range,
            "expiry_type": expiry_type,
            "start_type": start_type,
            "last_digit_range": last_digit_range,
            "exchange_name": exchange_name,
            "contract_category_display": contract_category_display,

        })

    return contract_categories

async def fetch_contracts_view(request):
    symbol = request.GET.get('symbol')  # or request.POST.get('symbol') for POST requests
    if not symbol:
        return JsonResponse({'error': 'Symbol parameter is required.'}, status=400)

    try:
        #print(f"fetch_contracts_view called for symbol: {symbol}")  # Debug log

        # Fetch contracts for the given symbol from connection.py
        raw_contracts_data = await fetch_contracts_for(symbol)  # Fetch the raw data

        if not raw_contracts_data:
            print("No data received from fetch_contracts_for")  # Debugging log
            return JsonResponse({'success': False, 'error': 'No contract data found.'})

        # Debug: Log raw contract data
        #print(f"Raw Contracts Data: {raw_contracts_data}")  # Debug log

        # Directly return raw contracts data
        return JsonResponse({'success': True, 'data': raw_contracts_data})

    except Exception as e:
        # Log any error that occurs and return an error response
        print(f"Error in fetch_contracts_view: {e}")  # Debug log
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def parse_asset_data(asset_data):
    parsed_assets = []

    # Check if asset_data has 'asset_index' and it's a list
    if 'asset_index' in asset_data and isinstance(asset_data['asset_index'], list):
        for asset in asset_data['asset_index']:
            # Asset should have [symbol, display_name, options_list]
            if isinstance(asset, list) and len(asset) >= 3:
                symbol, display_name, options = asset[0], asset[1], asset[2]
                parsed_options = []

                # Process options list
                if isinstance(options, list):
                    for option in options:
                        if isinstance(option, list) and len(option) >= 4:
                            # Extract option details (contract type, name, duration_min, duration_max)
                            contract_type, name, duration_min, duration_max = option[:4]
                            parsed_options.append({
                                'contract_type': contract_type,
                                'name': name,
                                'duration_min': duration_min,
                                'duration_max': duration_max
                            })

                parsed_assets.append({
                    'symbol': symbol,
                    'display_name': display_name,
                    'options': parsed_options
                })
            else:
                print(f"Unexpected asset format: {asset}")

    return parsed_assets


async def get_asset_data():
    try:
        assets = await get_active_assets()
        #print("Raw Assets Data:", assets)  # Debugging line

        parsed_assets = parse_asset_data(assets)  # Make sure parse_asset_data is defined

        asset_data = []

        for asset in parsed_assets:
            options = [
                {
                    "contract_type": option["contract_type"],
                    "name": option["name"],
                    "duration_min": option["duration_min"],
                    "duration_max": option["duration_max"]
                }
                for option in asset["options"]
            ]
            asset_data.append({
                "symbol": asset["symbol"],
                "display_name": asset["display_name"],
                "options": options
            })

        return asset_data
    except Exception as e:
        print("Error in get_asset_data:", e)  # Log error for debugging
        raise

async def asset_data_view(request):
    try:
        # Fetch asset data asynchronously
        asset_data = await get_asset_data()
        #print("Generated asset data:", asset_data)  # Debug print
        return JsonResponse(asset_data, safe=False)  # safe=False if asset_data is a list
    except Exception as e:
        print("Error in asset_data_view:", e)  # Log the error in Django console
        return JsonResponse({"error": str(e)}, status=500)


# Make get_market_structure async
async def get_market_structure():
    active_symbols = await get_active_symbols()  # Assumes this is defined asynchronously

    if not active_symbols:
        print("No active symbols returned.")
        return {}

    market_structure = defaultdict(
        lambda: {"status": "closed", "submarkets": defaultdict(lambda: {"status": "closed", "symbols": []})})

    for symbol in active_symbols['active_symbols']:
        market = symbol['market_display_name']
        submarket = symbol['submarket_display_name']
        is_open = symbol['exchange_is_open'] == 1

        # Update market and submarket statuses based on exchange_is_open
        if is_open:
            market_structure[market]["status"] = "open"
            market_structure[market]["submarkets"][submarket]["status"] = "open"

        # Add symbol to the appropriate market and submarket
        market_structure[market]["submarkets"][submarket]["symbols"].append({
            "display_name": symbol['display_name'],
            "symbol": symbol['symbol'],
            "is_open": "open" if is_open else "closed"
        })

    # Construct market_structure_data dictionary here as needed for JSON response.
    market_structure_data = {}
    # ... (construct market_structure_data based on your logic)

    async def get_market_structure():
        active_symbols = await get_active_symbols()
        if not active_symbols:
            print("No active symbols returned.")
            return {}

        market_structure = defaultdict(
            lambda: {"status": "closed", "submarkets": defaultdict(lambda: {"status": "closed", "symbols": []})}
        )

        for symbol in active_symbols['active_symbols']:
            market = symbol.get('market_display_name')
            submarket = symbol.get('submarket_display_name')
            is_open = symbol.get('exchange_is_open') == 1

            if market and submarket:  # Ensure values are present
                # Update market and submarket statuses
                if is_open:
                    market_structure[market]["status"] = "open"
                    market_structure[market]["submarkets"][submarket]["status"] = "open"

                # Append symbol info
                market_structure[market]["submarkets"][submarket]["symbols"].append({
                    "display_name": symbol.get('display_name'),
                    "symbol": symbol.get('symbol'),
                    "is_open": "open" if is_open else "closed"
                })

    # Convert defaultdict to a regular dict to avoid serialization issues
    return {k: dict(v) for k, v in market_structure.items()}


# Update market_data_view to handle async calls
async def market_data_view(request):
    market_structure_json = await get_market_structure()
    #print("Generated market structure:", market_structure_json)  # Debug print
    return JsonResponse(market_structure_json)


def save_bot(request):
    if request.method == 'POST':
        # Process the bot configuration data here
        return JsonResponse({'status': 'success', 'message': 'Bot saved successfully'}, status=200)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


class BotViewSet(viewsets.ModelViewSet):
    queryset = Bot.objects.all()
    serializer_class = BotSerializer


class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer


def index(request):
    return render(request, 'botbuilder/index.html')


def dashboard(request):
    # Your logic for the dashboard view
    return render(request, 'botbuilder/dashboard.html')


def create_bot(request):
    if request.method == 'POST':
        # Logic for creating and saving bot strategies
        pass
    return render(request, 'botbuilder/create_bot.html')


def load_bot(request):
    if request.method == 'POST':
        # Logic for loading bot from local storage or Google Drive
        pass
    return render(request, 'botbuilder/load_bot.html')


def load_bot_google_drive(request):
    # Handle bot loading from Google Drive
    return HttpResponse("Load bot from Google Drive")

@ login_required()
def run_bot(request):
    if not request.user.is_authenticated:
        return redirect('users:login')
    # Handle bot running logic
    return render(request, 'botbuilder/run_bot.html')

def charts(request):
    return render(request, 'botbuilder/chart.html')



def quick_strategy(request):
    return render(request, 'botbuilder/quick_strategy.html')

def tutorials(request):
    return render(request, 'botbuilder/tutorials.html')


def botbuilder_view(request):
    return render(request, 'botbuilder/index.html')
