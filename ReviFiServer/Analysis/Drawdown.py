
from flask import Flask, request, jsonify
from flask_cors import CORS
from pycoingecko import CoinGeckoAPI
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, timedelta




def calculate_values(data, allocations=None, initial_value=1):
    combined = pd.DataFrame()
    if allocations:
        for coin, df in data.items():
            numeric_data = pd.to_numeric(df[coin], errors='coerce')
            combined[coin] = numeric_data * allocations.get(coin, 0)
    else:
        # For benchmark (single asset)
        coin = list(data.keys())[0]
        numeric_data = pd.to_numeric(data[coin][coin], errors='coerce')
        combined[coin] = numeric_data
    portfolio_values = combined.sum(axis=1)
    normalized_values = (portfolio_values / portfolio_values.iloc[0]) * initial_value
    return normalized_values


def calculate_drawdown(values):
    cumulative_max = values.cummax()
    drawdown = (values - cumulative_max) / cumulative_max
    return drawdown

def create_drawdown_chart(portfolio_drawdown, benchmark_drawdown, title):
    plt.figure(figsize=(10, 6))
    portfolio_drawdown.plot(label='Portfolio', color='blue')
    benchmark_drawdown.plot(label='Benchmark (BTC-USD)', color='orange')
    plt.title(title)
    plt.xlabel('Date')
    plt.ylabel('Drawdown')
    plt.legend()
    plt.grid(True)
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()