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


def portfolio_volatility(request):
    data = request.json
    coins = data['coins']
    allocations = np.array(data['allocations'])
    initial_portfolio_value = data['initial_portfolio_value']
    start_date = data['start_date']
    end_date = data['end_date']

    # Fetch historical data
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    data = yf.download(ticker_string, start=start_date, end=end_date, group_by='ticker')

    # Process data and calculate portfolio returns in value
    prices = pd.DataFrame()
    for coin in coins:
        prices[coin] = data[f"{coin}-USD"]['Close']
    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations) * initial_portfolio_value

    # Calculate annualized volatility (in value terms)
    daily_volatility = portfolio_returns.std()
    annualized_volatility = daily_volatility * np.sqrt(252)  # Assuming 252 trading days in a year

    # Plotting rolling volatility (in value terms)
    rolling_volatility = portfolio_returns.rolling(window=30).std() * np.sqrt(252)  # 30-day rolling volatility
    fig, ax = plt.subplots(figsize=(10, 6))
    rolling_volatility.plot(ax=ax)
    ax.set_title("30-Day Rolling Volatility (in Value)")
    ax.set_xlabel("Date")
    ax.set_ylabel("Annualized Volatility (in Value)")

    # Convert plot to base64 string for the graph
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    base64_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Return volatility and graph
    response = jsonify({
        'annualized_volatility_in_value': annualized_volatility,
        'graph': base64_image
    })
    return response