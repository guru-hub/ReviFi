import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np

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