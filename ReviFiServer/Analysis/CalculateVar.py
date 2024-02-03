from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64



def portfolio_var(request):

    data = request.json
    coins = data['coins']
    allocations = np.array(data['allocations'])
    initial_portfolio_value = data['initial_portfolio_value']
    start_date = data['start_date']
    end_date = data['end_date']
    confidence_level = data.get('confidence_level', 0.95)

    # Fetch historical data
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    data = yf.download(ticker_string, start=start_date, end=end_date, group_by='ticker')

    # Process data and calculate portfolio returns
    prices = pd.DataFrame()
    for coin in coins:
        prices[coin] = data[f"{coin}-USD"]['Close']
    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations)

    # Calculate VaR
    portfolio_returns_sorted = portfolio_returns.sort_values()
    var_index = int((1 - confidence_level) * len(portfolio_returns_sorted))
    var_value = portfolio_returns_sorted.iloc[var_index]
    var = initial_portfolio_value * var_value

    # Plotting
    fig, ax = plt.subplots(figsize=(10, 6))
    portfolio_returns_sorted.hist(bins=50, alpha=0.6, color='green', ax=ax)
    ax.axvline(var_value, color='red', linestyle='--', label=f'VaR at {confidence_level * 100}%: {var:.2f}')
    ax.set_title("Portfolio Returns Distribution with VaR")
    ax.set_xlabel("Daily Returns")
    ax.set_ylabel("Frequency")
    ax.legend()

    # Convert plot to base64 string
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    base64_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Return VaR and graph
    response = jsonify({
        'VaR': var,
        'graph': base64_image
    })
    return response
