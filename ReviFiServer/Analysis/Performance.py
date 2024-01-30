import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

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
