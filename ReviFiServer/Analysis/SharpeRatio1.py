import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
from datetime import datetime
import numpy as np

def calculate_sharpe_ratio(returns, risk_free_rate=0.01):
    excess_returns = returns - risk_free_rate
    sharpe_ratio = excess_returns.mean() / excess_returns.std()
    return sharpe_ratio

def create_graph_with_sharpe_ratio(data, title, sharpe_ratio):
    plt.figure(figsize=(10, 6))
    data.plot(title=title)
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')

    # Annotate Sharpe Ratio on the graph
    plt.text(0.05, 0.95, f'Sharpe Ratio: {sharpe_ratio:.2f}', transform=plt.gca().transAxes,
             fontsize=12, verticalalignment='top')

    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    graph = base64.b64encode(img.getvalue()).decode()
    return graph

def calculate_values(data, allocations, initial_value=1):
    combined = pd.DataFrame()

    for coin, df in data.items():
        # Assuming the first column of each DataFrame is the price data
        price_data = pd.to_numeric(df.iloc[:, 0], errors='coerce')
        asset_value = price_data * allocations.get(coin, 0)
        combined[coin] = asset_value

    portfolio_values = combined.sum(axis=1)
    normalized_values = (portfolio_values / portfolio_values.iloc[0]) * initial_value
    return normalized_values




