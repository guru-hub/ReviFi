import pandas as pd
import numpy as np

def get_historical_data(coins, start_date, end_date,cg):
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
