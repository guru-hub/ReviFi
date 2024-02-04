import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf
from io import BytesIO
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils


def portfolio_annualized_return(request):
    data = request.json
    coins = data['coins']
    allocations = np.array(data['allocations'])
    initial_portfolio_value = data['initial_portfolio_value']
    start_date = data['start_date']
    end_date = data['end_date']

    # Fetch historical data
    ticker_string = ' '.join([f"{coin}-USD" for coin in coins])
    data = yf.download(ticker_string, start=start_date, end=end_date, group_by='ticker')

    # Calculate daily returns
    prices = pd.DataFrame({coin: data[f"{coin}-USD"]['Close'] for coin in coins})
    daily_returns = prices.pct_change().dropna()
    portfolio_returns = daily_returns.dot(allocations)

    # Calculate portfolio value
    portfolio_value = (1 + portfolio_returns).cumprod() * initial_portfolio_value
    
    # Calculate annual returns
    portfolio_value_yearly = portfolio_value.resample('Y').last()  # Resample to get the last value each year
    annual_returns = portfolio_value_yearly.pct_change().dropna() * 100  # Convert to percentage
    

    # Assuming start_date and end_date are strings in YYYY-MM-DD format
    start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
    end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')

    # Calculate the total duration in years as a float
    total_duration_days = (end_date_dt - start_date_dt).days
    total_years = total_duration_days / 365.25  # Using 365.25 accounts for leap years

    # Safeguard against division by zero
    if total_years <= 0:
        total_years = 1  # This sets a minimum duration of 1 year to prevent division by zero

    # Now calculate the annualized return using total_years
    annualized_return = ((portfolio_value_yearly[-1] / initial_portfolio_value) ** (1 / total_years) - 1) * 100


    # Calculate the overall annualized return
    #total_years = (portfolio_value_yearly.index[-1] - portfolio_value_yearly.index[0]).days / 365.25
    #annualized_return = ((portfolio_value_yearly[-1] / initial_portfolio_value) ** (1 / total_years) - 1) * 100

    # Plotting
    fig, ax = plt.subplots(figsize=(10, 6))
    portfolio_value.plot(ax=ax)
    plt.fill_between(portfolio_value.index, 0, portfolio_value, color='green', alpha=0.3)  # Shade area under the line in green
    ax.set_title("Portfolio Value Over Time")
    ax.set_ylabel("Portfolio Value")
    ax.grid(True)

    # Save plot to a BytesIO buffer
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    plot_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Prepare the response
    response = {
        'annual_returns': annual_returns.to_dict(),
        'annualized_return': annualized_return,
        'graph': plot_base64
    }
    
    return jsonify(response)
