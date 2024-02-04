import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils
import matplotlib
import yfinance as yf

matplotlib.use('agg')



from flask import Flask, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from io import BytesIO
import base64

def get_start_date(time_frame):
    """Calculate the start date based on the specified time frame."""
    end_date = datetime.now()
    if time_frame == "1D":
        return end_date - timedelta(days=1)
    elif time_frame == "1W":
        return end_date - timedelta(weeks=1)
    elif time_frame == "1M":
        return end_date - timedelta(days=30)
    elif time_frame == "3M":
        return end_date - timedelta(days=90)
    elif time_frame == "6M":
        return end_date - timedelta(days=180)
    elif time_frame == "12M":
        return end_date - timedelta(days=365)
    else:
        raise ValueError("Invalid time frame specified")

def plot_portfolio_performance(portfolio_growth):
    """Plot the portfolio performance and return the plot as a base64 encoded string."""
    plt.figure(figsize=(10, 6))
   # portfolio_growth.plot(title='Portfolio Performance Over Time')

    portfolio_growth.plot(title='Portfolio Performance Over Time', color='green')  # Set color to green here
    plt.fill_between(portfolio_growth.index, 0, portfolio_growth, color='green', alpha=0.3)  # Shade area under the line in green

    plt.xlabel('Date')
    plt.ylabel('Cumulative Returns')
    plt.grid(False)
    # Save the plot to a BytesIO buffer
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.getvalue()).decode('utf-8')


def portfolio_performance(request):
    data = request.json
    coins = data['coins']
    allocations = np.array(data['allocations'])
    initial_portfolio_value = data['initial_portfolio_value']
    time_frame = data['time_frame']

    try:
        start_date = get_start_date(time_frame)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = datetime.now().strftime('%Y-%m-%d')

    # Fetch historical data
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    data = yf.download(ticker_string, start=start_date_str, end=end_date_str, group_by='ticker')

    # Calculate portfolio performance
    prices = pd.DataFrame({coin: data[f"{coin}-USD"]['Close'] for coin in coins})
    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations)
    portfolio_growth = (1 + portfolio_returns).cumprod()
    final_value = initial_portfolio_value * portfolio_growth.iloc[-1]

    # Plot portfolio performance
    plot_base64 = plot_portfolio_performance(portfolio_growth * initial_portfolio_value)

    return jsonify({
        "final_portfolio_value": final_value,
        "time_frame": time_frame,
        "graph": plot_base64
    })

