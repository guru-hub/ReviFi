
import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils




def calculate_values(data, allocations=None, initial_value=1):
    combined = pd.DataFrame()
    if allocations:
        for coin, df in data.items():
            numeric_data = pd.to_numeric(df[coin], errors='coerce')
            combined[coin] = numeric_data * allocations.get(coin, 0)
    else:
        # For benchmark (single asset)
        coin = list(data.keys())[0]
        numeric_data = pd.to_numeric(data[coin][coin], errors='coerce')
        combined[coin] = numeric_data
    portfolio_values = combined.sum(axis=1)
    normalized_values = (portfolio_values / portfolio_values.iloc[0]) * initial_value
    return normalized_values


def calculate_drawdown(values):
    cumulative_max = values.cummax()
    drawdown = (values - cumulative_max) / cumulative_max
    return drawdown

def create_drawdown_chart(portfolio_drawdown, benchmark_drawdown, title):
    plt.figure(figsize=(10, 6))
    portfolio_drawdown.plot(label='Portfolio', color='blue')
    benchmark_drawdown.plot(label='Benchmark (BTC-USD)', color='orange')
    plt.title(title)
    plt.xlabel('Date')
    plt.ylabel('Drawdown')
    plt.legend()
    plt.grid(True)
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()


def get_drawdown_chart(request,cg):
    content = request.json
    coins = content['coins']
    allocations = {coin: float(allocation) for coin, allocation in zip(coins, content['allocations'])}
    initial_portfolio_value = content['initial_portfolio_value']
    benchmark_coin = content.get('benchmark', 'bitcoin')
    start_date = datetime.now() - timedelta(days=365)
    end_date = datetime.now()

    # Fetch historical data
    historical_data = RevFiUtils.get_historical_data(coins + [benchmark_coin], start_date, end_date,cg)

    # Separate benchmark data
    benchmark_data = {benchmark_coin: historical_data.pop(benchmark_coin)}

    # Calculate portfolio values
    portfolio_values = calculate_values(historical_data, allocations, initial_portfolio_value)

    # Calculate benchmark values
    benchmark_values = calculate_values(benchmark_data, initial_value=initial_portfolio_value)

    # Calculate drawdowns
    portfolio_drawdown = calculate_drawdown(portfolio_values)
    benchmark_drawdown = calculate_drawdown(benchmark_values)

    # Create and return the drawdown chart
    graph = create_drawdown_chart(portfolio_drawdown, benchmark_drawdown,
                                            'Portfolio vs. Benchmark Drawdown')
    return jsonify({'graph': graph})

