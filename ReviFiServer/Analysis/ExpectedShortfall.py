import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils


def calculate_expected_shortfall(data, allocations, initial_portfolio_value, confidence_level=0.95):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation
    portfolio_values = combined.sum(axis=1)

    # Adjust portfolio values based on the initial portfolio value
    normalized_portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * initial_portfolio_value
    portfolio_returns = normalized_portfolio_values.pct_change().dropna()
    var = np.percentile(portfolio_returns, (1 - confidence_level) * 100)
    expected_shortfall = portfolio_returns[portfolio_returns <= var].mean()
    return expected_shortfall, normalized_portfolio_values

def create_expected_shortfall_graph(normalized_portfolio_values, title):
    plt.figure(figsize=(10, 6))
    normalized_portfolio_values.plot(title=title)
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')
   
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()

def get_expected_shortfall(request,historical_data):
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    start_date = datetime.now() - pd.DateOffset(years=1)  # Last 1 year
    end_date = datetime.now()

    #historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date,cg)
    expected_shortfall, normalized_portfolio_values = calculate_expected_shortfall(historical_data,
                                                                                                     allocations,
                                                                                                     initial_portfolio_value)
    graph = create_expected_shortfall_graph(normalized_portfolio_values,
                                                              'Portfolio Expected Shortfall')

    return jsonify({'expected_shortfall': expected_shortfall, 'graph': graph})