from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from io import BytesIO
import base64


def get_prediction_days(time_frame):
    """Convert time_frame into number of days for prediction."""
    if time_frame == "1D":
        return 1
    elif time_frame == "1W":
        return 7
    elif time_frame == "1M":
        return 30
    elif time_frame == "3M":
        return 90
    elif time_frame == "6M":
        return 180
    elif time_frame == "12M":
        return 365
    else:
        raise ValueError("Invalid time frame specified")


def predict_portfolio_performance(request):
    data = request.json
    coins = data['coins']
    allocations = np.array(data['allocations'])
    initial_portfolio_value = data['initial_portfolio_value']
    time_frame = data['time_frame']

    try:
        prediction_days = get_prediction_days(time_frame)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Fetch historical data (1 year of history for prediction)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    historical_data = yf.download(ticker_string, start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'), group_by='ticker')

    # Initialize an empty DataFrame for prices
    prices = pd.DataFrame()

    # Extract closing prices for each coin
    for coin in coins:
        try:
            prices[coin] = historical_data[f"{coin}-USD"]['Close']
        except KeyError:
            return jsonify({"error": f"No data found for {coin}. Check ticker symbol and data availability."}), 400

    if prices.empty:
        return jsonify({"error": "Failed to fetch data for specified coins."}), 400

    # Calculate daily returns and portfolio's daily returns
    daily_returns = prices.pct_change().dropna()
    portfolio_daily_returns = daily_returns.dot(allocations)

    # Predict future performance (simplified model)
    mean_daily_return = portfolio_daily_returns.mean()
    std_daily_return = portfolio_daily_returns.std()
    future_returns = np.random.normal(mean_daily_return, std_daily_return, prediction_days)
    future_portfolio_values = (1 + future_returns).cumprod() * initial_portfolio_value

    # Generate and encode the performance graph
    plt.figure(figsize=(10, 6))
    plt.plot(future_portfolio_values, color='green')
    #plt.fill_between(future_portfolio_values.index, 0, future_portfolio_values, color='green', alpha=0.3)  # Shade area under the line in green

    plt.title(f'Predicted Portfolio Performance Over {time_frame}')
    plt.xlabel('Days')
    plt.ylabel('Portfolio Value')
    plt.grid(False)
   



    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    encoded_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    return jsonify({
        "predicted_portfolio_value": future_portfolio_values[-1],
        "graph": encoded_image
    })


