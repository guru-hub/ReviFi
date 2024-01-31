import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils
import matplotlib

matplotlib.use('agg')


def calculate_historical_performance(data, allocations, initial_portfolio_value):
    combined = pd.DataFrame()
    for coin, allocation in zip(data.keys(), allocations):
        combined[coin] = data[coin][coin] * allocation
    portfolio_values = combined.sum(axis=1)

    # Normalize and scale portfolio values
    normalized_portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * initial_portfolio_value
    return normalized_portfolio_values

def create_performance_graph(normalized_portfolio_values, title):
    plt.figure(figsize=(10, 6))
    normalized_portfolio_values.plot(title=title)
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    graph = base64.b64encode(img.getvalue()).decode()
    return graph

def get_historical_performance(request,cg):
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    time_frame = content.get('time_frame', '12M')  # Default to 12M if not specified
    end_date = datetime.now()
    start_date = end_date - get_time_frame_delta(time_frame)

    historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date,cg)
    historical_performance = calculate_historical_performance(historical_data, allocations,
                                                                          initial_portfolio_value)
    graph = create_performance_graph(historical_performance,
                                                 f'Portfolio Historical Performance - {time_frame}')

    print(f"Start Date: {start_date}, End Date: {end_date}")  # Debugging
  
    return jsonify({'graph': graph})


def get_time_frame_delta(time_frame):
    if time_frame == "1D":
        return timedelta(days=1)
    elif time_frame == "1W":
        return timedelta(weeks=1)
    elif time_frame == "1M":
        return timedelta(days=30)
    elif time_frame == "3M":
        return timedelta(days=90)
    elif time_frame == "6M":
        return timedelta(days=180)
    elif time_frame == "12M":
        return timedelta(days=365)
    else:
        return timedelta(days=365)  # Default to 1 year if unknown time frame
