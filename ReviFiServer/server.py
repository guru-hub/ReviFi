from flask import Flask, request, jsonify
from flask_cors import CORS
from pycoingecko import CoinGeckoAPI
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import logging
import io
import base64
from datetime import datetime, timedelta
import Analysis.Volatility  as Volatility
import Analysis.Var as Var
import Analysis.SharpeRatio as SharpeRatio
import Analysis.AnnualizedReturns as AnnualizedReturns
import Analysis.ExpectedShortfall as ExpectedShortfall
import Analysis.Performance as Performance
import Analysis.FuturePerformance as FuturePerformance
import Analysis.Drawdown as Drawdown
import Analysis.SharpeRatio1 as SharpeRatio1

import matplotlib
matplotlib.use('agg')

app = Flask(__name__)
CORS(app)
cg = CoinGeckoAPI()

def get_historical_data(coins, start_date, end_date):
    all_data = {}
    for coin in coins:
        data = cg.get_coin_market_chart_range_by_id(
            id=coin, vs_currency='usd', 
            from_timestamp=start_date.timestamp(), 
            to_timestamp=end_date.timestamp())
        prices = data['prices']
        df = pd.DataFrame(prices, columns=['timestamp', coin])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df.set_index('timestamp', inplace=True)
        all_data[coin] = df
    return all_data


@app.route('/volatility', methods=['POST'])
def get_volatility():
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    start_date = datetime.now() - pd.DateOffset(years=1)  # Last four years
    end_date = datetime.now()

    historical_data = get_historical_data(coins, start_date, end_date)
    volatility, normalized_portfolio_values = Volatility.calculate_volatility(historical_data, allocations, initial_portfolio_value)
    graph = Volatility.create_volatility_graph(normalized_portfolio_values, 'Portfolio Volatility')

    return jsonify({'volatility': volatility, 'graph': graph})



@app.route('/var', methods=['POST'])
def get_var():
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    confidence_level = float(content.get('confidence_level', 0.95))
    start_date = datetime.now() - pd.DateOffset(years=1)  # Last four years
    end_date = datetime.now()

    historical_data = get_historical_data(coins, start_date, end_date)
    var, normalized_portfolio_values = Var.calculate_var(historical_data, allocations, initial_portfolio_value, confidence_level)
    graph = Var.create_var_graph(normalized_portfolio_values, 'Portfolio VaR', confidence_level)

    return jsonify({'var': var, 'graph': graph})


@app.route('/sharpe_ratio1', methods=['POST'])
def get_sharpe_ratio1():
    try:
        content = request.json
        coins = content['coins']
        allocations = {coin: float(allocation) for coin, allocation in zip(coins, content['allocations'])}
        initial_portfolio_value = content['initial_portfolio_value']
        start_date = datetime.now() - timedelta(days=365)
        end_date = datetime.now()

        historical_data = get_historical_data(coins, start_date, end_date)
        print(f"historical_data: {historical_data}")  # Debugging
        portfolio_values = SharpeRatio1.calculate_values(historical_data, allocations, initial_portfolio_value)
        
        # Calculate daily returns and Sharpe Ratio
        daily_returns = portfolio_values.pct_change().dropna()
        print(f"daily_returns: {daily_returns}")  # Debugging
        sharpe_ratio = SharpeRatio1.calculate_sharpe_ratio(daily_returns)

        print(f"sharpe_ratio: {sharpe_ratio}")  # Debugging
        # Create graph with Sharpe Ratio annotation
        graph = SharpeRatio1.create_graph_with_sharpe_ratio(portfolio_values, 'Portfolio Performance with Sharpe Ratio', sharpe_ratio)
        return jsonify({'graph': graph})

    except Exception as e:
        app.logger.error('Error in Sharpe Ratio calculation: %s', str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/sharpe_ratio', methods=['POST'])
def get_sharpe_ratio():
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    risk_free_rate = float(content['risk_free_rate'])
    start_date = datetime.strptime(content['start_date'], '%Y-%m-%d')
    end_date = datetime.strptime(content['end_date'], '%Y-%m-%d')

    historical_data = get_historical_data(coins, start_date, end_date)
    sharpe_ratio = SharpeRatio.calculate_sharpe_ratio(historical_data, allocations, risk_free_rate, initial_portfolio_value)
    graph = SharpeRatio.create_sharpe_ratio_graph(historical_data, allocations, initial_portfolio_value, 'Portfolio Sharpe Ratio')

    print(f"sharpe_ratio: {sharpe_ratio}")  # Debugging
    return jsonify({'sharpe_ratio': sharpe_ratio, 'graph': graph})



@app.route('/annualized_returns', methods=['POST'])
def get_annualized_returns():
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    start_date = datetime.now() - pd.DateOffset(years=4)  # Last four years
    end_date = datetime.now()

    historical_data = get_historical_data(coins, start_date, end_date)
    annualized_returns, normalized_portfolio_values = AnnualizedReturns.calculate_annualized_returns(historical_data, allocations, initial_portfolio_value)
    graph = AnnualizedReturns.create_annualized_returns_graph(normalized_portfolio_values, 'Portfolio Annualized Returns')

    return jsonify({'annualized_returns': annualized_returns, 'graph': graph})



@app.route('/expected_shortfall', methods=['POST'])
def get_expected_shortfall():
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    start_date = datetime.now() - pd.DateOffset(years=1)  # Last four years
    end_date = datetime.now()

    historical_data = get_historical_data(coins, start_date, end_date)
    expected_shortfall, normalized_portfolio_values = ExpectedShortfall.calculate_expected_shortfall(historical_data, allocations, initial_portfolio_value)
    graph = ExpectedShortfall.create_expected_shortfall_graph(normalized_portfolio_values, 'Portfolio Expected Shortfall')

    return jsonify({'expected_shortfall': expected_shortfall, 'graph': graph})




@app.route('/historical_performance', methods=['POST'])
def get_historical_performance():
    content = request.json
    coins = content['coins']
    allocations = [float(a) for a in content['allocations']]
    initial_portfolio_value = float(content['initial_portfolio_value'])
    time_frame = content.get('time_frame', '12M')  # Default to 12M if not specified
    end_date = datetime.now()
    start_date = end_date - Performance.get_time_frame_delta(time_frame)

    historical_data = get_historical_data(coins, start_date, end_date)
    historical_performance = Performance.calculate_historical_performance(historical_data, allocations, initial_portfolio_value)
    graph = Performance.create_performance_graph(historical_performance, f'Portfolio Historical Performance - {time_frame}')

    print(f"Start Date: {start_date}, End Date: {end_date}")  # Debugging
    


    return jsonify({'historical_performance': historical_performance.tolist(), 'graph': graph})

@app.route('/future_performance', methods=['POST'])
def get_future_performance():
    content = request.json
    coins = content['coins']
    allocations = content['allocations']
    initial_portfolio_value = content['initial_portfolio_value']
    historical_time_frame = content.get('historical_time_frame', '12M')
    future_time_frame = content.get('future_time_frame', '1M')

    end_date = datetime.now()
    start_date = end_date - FuturePerformance.get_time_frame_delta(historical_time_frame)
    days_in_future = FuturePerformance.get_time_frame_delta(future_time_frame).days

    historical_data = get_historical_data(coins, start_date, end_date)
    future_data = FuturePerformance.project_future_performance(historical_data, allocations, initial_portfolio_value, days_in_future)
    graph = FuturePerformance.create_future_graph(future_data, f'Projected Future Portfolio Value - Next {days_in_future} Days')

    return jsonify({'graph': graph})


@app.route('/future_performance_arima', methods=['POST'])
def get_future_performance_arima():
    content = request.json
    coins = content['coins']
    allocations = dict(zip(coins, content['allocations']))
    initial_portfolio_value = content['initial_portfolio_value']
    historical_time_frame = content.get('historical_time_frame', '12M')
    future_time_frame = content.get('future_time_frame', '1M')

    end_date = datetime.now()
    start_date = end_date -FuturePerformance. get_time_frame_delta(historical_time_frame)
    days_in_future = FuturePerformance.get_time_frame_delta(future_time_frame).days

    historical_data = get_historical_data(coins, start_date, end_date)
    future_data = FuturePerformance.project_future_performance_arima(historical_data, allocations, days_in_future)
    future_data_scaled = future_data * initial_portfolio_value / future_data['Total'].iloc[0]  # Scale based on initial value
    graph =FuturePerformance.create_future_graph(future_data_scaled, 'Projected Future Portfolio Value')

    return jsonify({'graph': graph})



@app.route('/drawdown_chart', methods=['POST'])
def get_drawdown_chart():
    try:
        content = request.json
        coins = content['coins']
        allocations = {coin: float(allocation) for coin, allocation in zip(coins, content['allocations'])}
        initial_portfolio_value = content['initial_portfolio_value']
        benchmark_coin = content.get('benchmark', 'bitcoin')
        start_date = datetime.now() - timedelta(days=365)
        end_date = datetime.now()

        # Fetch historical data
        historical_data = get_historical_data(coins + [benchmark_coin], start_date, end_date)

        # Separate benchmark data
        benchmark_data = {benchmark_coin: historical_data.pop(benchmark_coin)}

        # Calculate portfolio values
        portfolio_values = Drawdown.calculate_values(historical_data, allocations, initial_portfolio_value)

        # Calculate benchmark values
        benchmark_values = Drawdown.calculate_values(benchmark_data, initial_value=initial_portfolio_value)

        # Calculate drawdowns
        portfolio_drawdown = Drawdown.calculate_drawdown(portfolio_values)
        benchmark_drawdown = Drawdown.calculate_drawdown(benchmark_values)

        # Create and return the drawdown chart
        graph = Drawdown.create_drawdown_chart(portfolio_drawdown, benchmark_drawdown, 'Portfolio vs. Benchmark Drawdown')
        return jsonify({'graph': graph})

    except Exception as e:
        app.logger.error('Error occurred during drawdown chart creation: %s', str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
