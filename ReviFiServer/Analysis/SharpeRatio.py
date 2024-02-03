
import matplotlib.pyplot as plt
import io
import base64
from io import BytesIO
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils

def calculate_sharpe_ratio(data, allocations, risk_free_rate, initial_portfolio_value):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation * initial_portfolio_value
    portfolio_value = combined.sum(axis=1)
    portfolio_returns = portfolio_value.pct_change().dropna()
    excess_returns = portfolio_returns - risk_free_rate / 252
    return excess_returns.mean() / excess_returns.std() * np.sqrt(252)

def create_sharpe_ratio_graph(data, allocations, initial_portfolio_value, title):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation
    portfolio_values = combined.sum(axis=1)

    # Adjust portfolio values based on the initial portfolio value
    normalized_portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * initial_portfolio_value

    plt.figure(figsize=(10, 6))
    normalized_portfolio_values.plot(title=title ,color='green')


    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()

def get_sharpe_ratio(request,cg):
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    risk_free_rate = float(content['risk_free_rate'])
    start_date = datetime.strptime(content['start_date'], '%Y-%m-%d')
    end_date = datetime.strptime(content['end_date'], '%Y-%m-%d')

    historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date,cg)
    sharpe_ratio = calculate_sharpe_ratio(historical_data, allocations, risk_free_rate,
                                                      initial_portfolio_value)
    graph = create_sharpe_ratio_graph(historical_data, allocations, initial_portfolio_value,
                                                  'Portfolio Sharpe Ratio')

    print(f"sharpe_ratio: {sharpe_ratio}")  # Debugging
    return jsonify({'sharpe_ratio': sharpe_ratio, 'graph': graph})

def portfolio_sharpe_ratio(request):
    data = request.json
    coins = data['coins']
    allocations = np.array(data['allocations'])
    initial_portfolio_value = data['initial_portfolio_value']
    start_date = data['start_date']
    end_date = data['end_date']
    risk_free_rate = data.get('risk_free_rate', 0.02)  # Default risk-free rate, e.g., 2% annual

    # Fetch historical data
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    data = yf.download(ticker_string, start=start_date, end=end_date, group_by='ticker')

    # Process data and calculate portfolio returns
    prices = pd.DataFrame()
    for coin in coins:
        prices[coin] = data[f"{coin}-USD"]['Close']
    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations)

    # Calculate portfolio returns in value terms
    portfolio_value = (1 + portfolio_returns).cumprod() * initial_portfolio_value
    portfolio_daily_returns = portfolio_value.pct_change().dropna()

    # Calculate annualized return and volatility
    avg_daily_return = portfolio_daily_returns.mean()
    std_daily_return = portfolio_daily_returns.std()
    annualized_return = (1 + avg_daily_return) ** 252 - 1  # Assuming 252 trading days in a year
    annualized_volatility = std_daily_return * np.sqrt(252)

    # Calculate Sharpe Ratio
    sharpe_ratio = (annualized_return - risk_free_rate) / annualized_volatility

    # Plotting portfolio value over time
    fig, ax = plt.subplots(figsize=(10, 6))
    portfolio_value.plot(ax=ax)
    ax.set_title("Portfolio Value Over Time")
    ax.set_xlabel("Date")
    ax.set_ylabel("Portfolio Value")

    # Convert plot to base64 string
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    base64_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Return Sharpe Ratio and graph
    response = jsonify({
        'sharpe_ratio': sharpe_ratio,
        'graph': base64_image
    })
    return response