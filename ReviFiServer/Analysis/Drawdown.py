
import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np


import yfinance as yf

from io import BytesIO
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


def portfolio_drawdown(request):
    data = request.json
    coins = data['coins']  # List of coin tickers e.g., ['BTC', 'ETH']
    allocations = np.array(data['allocations'])  # Allocation percentages e.g., [0.25, 0.75]
    initial_portfolio_value = data['initial_portfolio_value']
    start_date = data['start_date']
    end_date = data['end_date']
    benchmark = data.get('benchmark', 'BTC-USD')  # Benchmark ticker

    # Fetch historical data for portfolio
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    portfolio_data = yf.download(ticker_string, start=start_date, end=end_date)

    # Fetch historical data for benchmark
    benchmark_data = yf.download(benchmark, start=start_date, end=end_date)

    if portfolio_data.empty or benchmark_data.empty:
        return jsonify({'error': 'No data available for the specified tickers and date range.'})

    # Process portfolio data and calculate returns
    prices = pd.DataFrame({coin: portfolio_data[f"{coin}-USD"]['Close'] for coin in coins if f"{coin}-USD" in portfolio_data.columns})
    
    if prices.empty or len(prices.columns) != len(allocations):
        return jsonify({'error': 'Mismatch in the number of assets and allocations or no data for specified assets.'})

    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations)

    # Calculate portfolio value
    portfolio_value = (1 + portfolio_returns).cumprod() * initial_portfolio_value

    # Process benchmark data and calculate value
    benchmark_returns = benchmark_data['Close'].pct_change().dropna()
    benchmark_value = (1 + benchmark_returns).cumprod() * initial_portfolio_value

    # Calculate drawdowns
    portfolio_drawdown = (portfolio_value - portfolio_value.cummax()) / portfolio_value.cummax()
    benchmark_drawdown = (benchmark_value - benchmark_value.cummax()) / benchmark_value.cummax()

    # Plotting drawdowns
    fig, ax = plt.subplots(figsize=(10, 6))
    portfolio_drawdown.plot(ax=ax, color='red', label='Portfolio Drawdown')
    benchmark_drawdown.plot(ax=ax, color='blue', label=f'{benchmark} Drawdown')
    ax.fill_between(portfolio_drawdown.index, portfolio_drawdown.values, 0, alpha=0.3, color='red')
    ax.fill_between(benchmark_drawdown.index, benchmark_drawdown.values, 0, alpha=0.3, color='blue')
    ax.set_title("Portfolio and Benchmark Drawdown")
    ax.set_xlabel("Date")
    ax.set_ylabel("Drawdown")
    ax.legend()

    # Convert plot to base64 string
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    base64_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Return drawdown graph
    response = jsonify({
        'graph': base64_image
    })
    return response