import numpy as np
import yfinance as yf
import pandas as pd


def get_historical_data(coins, start_date, end_date):
    # Convert the coin symbols for use with yfinance
    coin_symbols = [f"{coin}-USD" for coin in coins]
    # Fetch historical data
    historical_data = yf.download(coin_symbols, start=start_date, end=end_date)['Close']
   
    return historical_data

