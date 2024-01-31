from flask import Flask, request, jsonify
from flask_cors import CORS
from pycoingecko import CoinGeckoAPI
import pandas as pd
import numpy as np
import logging
import io
import base64
from typing import Final
from dataclasses import dataclass
from flask_caching import Cache 
from datetime import datetime, timedelta


import Analysis.Volatility  as Volatility
import Analysis.Var as Var
import Analysis.SharpeRatio as SharpeRatio
import Analysis.AnnualizedReturns as AnnualizedReturns
import Analysis.ExpectedShortfall as ExpectedShortfall
import Analysis.HistoricalPerformance as HistoricalPerformance
import Analysis.FuturePerformance as FuturePerformance
import Analysis.Drawdown as Drawdown


application  = Flask(__name__)
CORS(application)
application.config['CACHE_TYPE'] = 'SimpleCache'
application.config['CACHE_DEFAULT_TIMEOUT'] = 300

cache = Cache()
cache.init_app(application)
cg = CoinGeckoAPI()



@cache.cached(timeout=60)
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

def get_data():
    content = request.json
    coins = content['coins']
    start_date = datetime.now() - pd.DateOffset(years=1)  # Last one year
    end_date = datetime.now()
    return get_historical_data(coins, start_date, end_date)


@application.route('/')
def index():
    return jsonify(status=200, message='ReviFi AP Server')

@application.route('/health', methods=['POST'])
def health():
    return jsonify(status=200, message='Test  AP Server')



@application.route('/var', methods=['POST'])
def get_var():
  data = get_data()
  return Var.get_var(request,data)

@application.route('/volatility', methods=['POST'])
def get_volatility():
    data = get_data()
    return Volatility.get_volatility(request,data)

@application.route('/expected_shortfall', methods=['POST'])
def get_expected_shortfall():
     data = get_data()
     return ExpectedShortfall.get_expected_shortfall(request,data)

@application.route('/sharpe_ratio', methods=['POST'])
def get_sharpe_ratio():
    return SharpeRatio.get_sharpe_ratio(request,cg)

@application.route('/annualized_returns', methods=['POST'])
def get_annualized_returns():
    return AnnualizedReturns.get_annualized_returns(request,cg)


@application.route('/drawdown_chart', methods=['POST'])
def get_drawdown_chart():
     return Drawdown.get_drawdown_chart(request,cg)

@application.route('/historical_performance', methods=['POST'])
def get_historical_performance():
    return HistoricalPerformance.get_historical_performance(request,cg)
  
@application.route('/future_performance', methods=['POST'])
def get_future_performance():
    return FuturePerformance.get_future_performance(request,cg)
    

if __name__ == '__main__':
    application.run()
