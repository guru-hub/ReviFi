from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import logging
import io
import base64
from datetime import datetime, timedelta
import yfinance as yf


import Analysis.Volatility  as Volatility
import Analysis.SharpeRatio as SharpeRatio
import Analysis.AnnualizedReturns as AnnualizedReturns
import Analysis.ExpectedShortfall as ExpectedShortfall
import Analysis.HistoricalPerformance as HistoricalPerformance
import Analysis.FuturePerformance as FuturePerformance
import Analysis.Drawdown as Drawdown
import Analysis.CalculateVar as CalculateVar 


application  = Flask(__name__)
CORS(application)


@application.route('/')
def index():
    return jsonify(status=200, message='ReviFi AP Server')

@application.route('/health', methods=['POST'])
def health():
    return jsonify(status=200, message='Test  AP Server')

@application.route('/var', methods=['POST'])
def portfolio_var():
 return CalculateVar.portfolio_var(request)


@application.route('/volatility', methods=['POST'])
def get_volatility():
    return Volatility.portfolio_volatility(request)
 

@application.route('/expected_shortfall', methods=['POST'])
def get_expected_shortfall():
      return ExpectedShortfall.portfolio_expected_shortfall(request)

@application.route('/sharpe_ratio', methods=['POST'])
def get_sharpe_ratio():
    return SharpeRatio.portfolio_sharpe_ratio(request)

@application.route('/drawdown_chart', methods=['POST'])
def get_drawdown_chart():
     return Drawdown.portfolio_drawdown(request)

@application.route('/annualized_returns', methods=['POST'])
def get_annualized_returns():
    return AnnualizedReturns.portfolio_annualized_return(request)


@application.route('/historical_performance', methods=['POST'])
def get_historical_performance():
    return HistoricalPerformance.portfolio_performance(request)
  
@application.route('/future_performance', methods=['POST'])
def get_future_performance():
    return FuturePerformance.predict_portfolio_performance(request)
    

if __name__ == '__main__':
    application.run()
   

