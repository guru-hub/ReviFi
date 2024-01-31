import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils


def calculate_annualized_returns(data, allocations, initial_portfolio_value):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation
    portfolio_values = combined.sum(axis=1)

    # Adjust portfolio values based on the initial portfolio value
    normalized_portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * initial_portfolio_value

    # Calculate the annualized returns
    total_period_in_years = ((normalized_portfolio_values.index[-1] - normalized_portfolio_values.index[0]).days) / 365.25
    final_portfolio_value = normalized_portfolio_values.iloc[-1]
    annualized_return = (final_portfolio_value / initial_portfolio_value) ** (1/total_period_in_years) - 1
    return annualized_return, normalized_portfolio_values

def create_annualized_returns_graph(normalized_portfolio_values, title):
    plt.figure(figsize=(10, 6))
    normalized_portfolio_values.plot(title=title)
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()

def get_annualized_returns(request,cg):
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    start_date = datetime.now() - pd.DateOffset(years=4)  # Last four years
    end_date = datetime.now()

    historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date,cg)
    annualized_returns, normalized_portfolio_values = calculate_annualized_returns(historical_data,
                                                                                                     allocations,
                                                                                                     initial_portfolio_value)
    graph = create_annualized_returns_graph(normalized_portfolio_values,
                                                              'Portfolio Annualized Returns')

    return jsonify({'annualized_returns': annualized_returns, 'graph': graph})