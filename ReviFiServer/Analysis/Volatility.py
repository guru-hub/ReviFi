import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils

def calculate_volatility(data, allocations, initial_portfolio_value):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation
    portfolio_values = combined.sum(axis=1)

    # Normalize portfolio values
    normalized_portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * initial_portfolio_value
    daily_returns = normalized_portfolio_values.pct_change().dropna()
    volatility = daily_returns.std() * np.sqrt(252)  # Annualize the volatility
    return volatility, normalized_portfolio_values

def create_volatility_graph(normalized_portfolio_values, title):
    plt.figure(figsize=(10, 6))
    normalized_portfolio_values.plot(title=title)
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()

def get_volatility(request,historical_data):
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])

   # historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date,cg)
    volatility, normalized_portfolio_values = calculate_volatility(historical_data, allocations,
                                                                              initial_portfolio_value)
    graph = create_volatility_graph(normalized_portfolio_values, 'Portfolio Volatility')

    return jsonify({'volatility': volatility, 'graph': graph})
