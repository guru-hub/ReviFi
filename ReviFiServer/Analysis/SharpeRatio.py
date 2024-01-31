
import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
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
    normalized_portfolio_values.plot(title=title)
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
