import matplotlib.pyplot as plt
import io
import base64
from io import BytesIO
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import yfinance as yf
import Analysis.RevFiUtils as RevFiUtils



def portfolio_expected_shortfall(request):
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
        if f"{coin}-USD" in data.columns:
            prices[coin] = data[f"{coin}-USD"]['Close']
    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations)

    # Calculate VaR and Expected Shortfall
    var_threshold = np.percentile(portfolio_returns, (1 - confidence_level) * 100)
    expected_shortfall = portfolio_returns[portfolio_returns <= var_threshold].mean()
    expected_shortfall_value = initial_portfolio_value * expected_shortfall

    # Plotting Expected Shortfall
    fig, ax = plt.subplots(figsize=(10, 6))
    portfolio_returns.hist(bins=50, alpha=0.6, color='green', ax=ax)
    ax.axvline(expected_shortfall, color='red', linestyle='--', label=f'Expected Shortfall: {expected_shortfall_value:.2f}')
    ax.set_title("Portfolio Returns Distribution with Expected Shortfall")
    ax.set_xlabel("Daily Returns")
    ax.set_ylabel("Frequency")
    ax.legend()

    # Convert plot to base64 string
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    base64_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Return Expected Shortfall and graph
    response = jsonify({
        'expected_shortfall': expected_shortfall_value,
        'graph': base64_image
    })
    return response