import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils

def calculate_var(data, allocations, initial_portfolio_value, confidence_level=0.95):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation
    portfolio_values = combined.sum(axis=1)

    # Normalize portfolio values
    normalized_portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * initial_portfolio_value
    portfolio_returns = normalized_portfolio_values.pct_change().dropna()
    var = np.percentile(portfolio_returns, (1 - confidence_level) * 100)
    return var, normalized_portfolio_values

def create_var_graph(normalized_portfolio_values, title, confidence_level):
    plt.figure(figsize=(10, 6))
    portfolio_returns = normalized_portfolio_values.pct_change().dropna()
    plt.hist(portfolio_returns, bins=30, alpha=0.7)
    plt.axvline(np.percentile(portfolio_returns, (1 - confidence_level) * 100), color='r', linestyle='dashed', linewidth=2)
    plt.title(title)
    plt.xlabel('Returns')
    plt.ylabel('Frequency')
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()

def get_var(request,historical_data):
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    confidence_level = float(content.get('confidence_level', 0.95))
  
    #historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date, cg)
    var, normalized_portfolio_values = calculate_var(historical_data, allocations, initial_portfolio_value,
                                                         confidence_level)
    graph = create_var_graph(normalized_portfolio_values, 'Portfolio VaR', confidence_level)

    return jsonify({'var': var, 'graph': graph})

