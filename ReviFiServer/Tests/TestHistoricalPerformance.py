import APICall

apiName= 'historical_performance'




 # Data to be sent to API
data = {
        "coins": ["BTC", "ETH", "SOL", "BNB"],
        "allocations": [0.20, 0.30, 0.25, 0.25],
        "risk_free_rate": 0.01,  
        "initial_portfolio_value": 100000,
        "start_date": "2023-01-01",
        "end_date": "2024-01-01",
        "confidence_level": 0.95,
        "time_frame": "3M"
     }
 
APICall.getMetric(apiName,data)