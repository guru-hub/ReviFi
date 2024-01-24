import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np

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
