import matplotlib.pyplot as plt
import io
import base64
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import request, jsonify
import Analysis.RevFiUtils as RevFiUtils
from sklearn.linear_model import LinearRegression
import pmdarima as pm

def project_future_performance(data, allocations, initial_portfolio_value, days_in_future=30):
    combined_future = pd.DataFrame()
    for coin, df in data.items():
        df['days'] = (df.index - df.index[0]).days
        model = LinearRegression()
        model.fit(df[['days']], df[coin])

        future_days = df['days'].max() + np.arange(1, days_in_future + 1)
        prediction = model.predict(future_days.reshape(-1, 1))
        df_future = pd.DataFrame(prediction, index=df.index[0] + pd.to_timedelta(future_days, unit='D'), columns=[coin])
        combined_future[coin] = df_future[coin]

    # Calculate combined portfolio future value
    combined_future = combined_future * allocations
    combined_future['Total'] = combined_future.sum(axis=1)
    combined_future['Total'] = combined_future['Total'] / combined_future['Total'].iloc[0] * initial_portfolio_value
    return combined_future

def create_future_graph(combined_future, title):
    plt.figure(figsize=(10, 6))
    combined_future['Total'].plot(title=title)
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value')
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode()



def get_time_frame_delta(time_frame):
    time_mapping = {
        "1D": timedelta(days=1),
        "1W": timedelta(weeks=1),
        "1M": timedelta(days=30),
        "3M": timedelta(days=90),
        "6M": timedelta(days=180),
        "12M": timedelta(days=365)
    }
    return time_mapping.get(time_frame, timedelta(days=365))  # Default to 1 year

def project_future_performance_arima(data, allocations, days_in_future=30):
    combined_future = pd.DataFrame()
    for coin, df in data.items():
        model = pm.auto_arima(df[coin], seasonal=False, stepwise=True, suppress_warnings=True)
        forecast = model.predict(n_periods=days_in_future)

        # Ensure the last date of df is included and then add future dates
        last_date = df.index[-1]
        future_dates = [last_date + timedelta(days=x) for x in range(1, days_in_future + 1)]
        future_index = pd.DatetimeIndex(future_dates)
        
        combined_future[coin] = pd.Series(forecast, index=future_index) * allocations[coin]

    combined_future['Total'] = combined_future.sum(axis=1)
    return combined_future


def get_future_performance(request,cg):
    content = request.json
    coins = content['coins']
    allocations = content['allocations']
    initial_portfolio_value = content['initial_portfolio_value']
    historical_time_frame = content.get('historical_time_frame', '12M')
    future_time_frame = content.get('future_time_frame', '1M')

    end_date = datetime.now()
    start_date = end_date - get_time_frame_delta(historical_time_frame)
    days_in_future = get_time_frame_delta(future_time_frame).days

    historical_data = RevFiUtils.get_historical_data(coins, start_date, end_date,cg)
    future_data = project_future_performance(historical_data, allocations, initial_portfolio_value,
                                                               days_in_future)
    graph = create_future_graph(future_data,
                                                  f'Projected Future Portfolio Value - Next {days_in_future} Days')

    return jsonify({'graph': graph})
