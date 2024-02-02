import APICall

apiName= 'future_performance'

#apiName= 'future_performance_arima'


 # Data to be sent to API
data = {
        "coins": ["BTC", "ETH", "SOL", "BNB"],
        "allocations": [0.20, 0.30, 0.25, 0.25],
        "initial_portfolio_value": 100000,
         "time_frame": "6M",
        }
 
APICall.getMetric(apiName,data)