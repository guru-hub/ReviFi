import APICall

import requests
import base64
from PIL import Image
from io import BytesIO

# Endpoint URL


url = 'http://localhost:5000/drawdown_chart'

apiName='drawdown_chart'



 # Data to be sent to API
data = {
        "coins": ["BTC", "ETH", "SOL", "BNB"],
        "allocations": [0.20, 0.30, 0.25, 0.25],
        "risk_free_rate": 0.01,  
        "initial_portfolio_value": 100000,
        "start_date": "2023-01-01",
        "end_date": "2024-01-01",
        "confidence_level": 0.95,
        "benchmark": "BTC-USD"
     }
 


 # Send a POST request to the Flask API
response = requests.post(url, json=data)

print(response.text)

# Check if the request was successful
if response.status_code == 200:
    # Decode the base64 image
    content = response.json()
    image_data = base64.b64decode(content['graph'])
    image = Image.open(BytesIO(image_data))
    
    # Display the image
    image.show()

    # Optionally, save the image to a file
   # image.save("drawdown_plot.png")
else:
    print("Failed to retrieve data:", response.text)

#APICall.getMetric(apiName,data)