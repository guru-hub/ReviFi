
from PIL import Image
from io import BytesIO
import base64
import requests

apiEndpoint = 'http://localhost:5000/'

def getMetric(apiName,data):
      
    url = apiEndpoint + apiName
    # Sending post request to Flask API
    response = requests.post(url, json=data)

    if response.status_code == 200:
        response_data = response.json()
       

        # Decode the base64 graph image
        graph_image = base64.b64decode(response_data['graph'])
        image = Image.open(BytesIO(graph_image))
        
        # Display the image
        image.show()

        # Optionally, save the image to a file
        # image.save('portfolio_graph.png')

    else:
        print("Error:", response.status_code)

    return