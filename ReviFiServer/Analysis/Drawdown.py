
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

    # Return Expected Shortfall and graph
    response = jsonify({
        'graph': base64_image
    })
    return response