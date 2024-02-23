import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlotlyPlot = () => {
    const [plotHtml, setPlotHtml] = useState('');

    useEffect(() => {
        // Replace the URL with your Flask API endpoint
       const apiUrl = 'http://192.168.56.1:5000/historical_performance_i';
        //const apiUrl = 'http://127.0.0.1:5000/annualized_returns_i';
        // const apiUrl = 'http://192.168.56.1:5000/future_performance_i';
        
        const payload = {
            coins:["BTC", "ETH", "SOL", "BNB"],
            allocations: [0.20, 0.30, 0.25, 0.25],
            initial_portfolio_value: 100000,
            time_frame: "1Y",
            benchmark: "BTC"
        };

        axios.post(apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.data.plot_html) {
                setPlotHtml(response.data.plot_html);
            }
        })
        .catch(error => console.error('Error fetching the plot:', error));
    }, []);

   
    return (
        <div dangerouslySetInnerHTML={{ __html: plotHtml }} />
    );
};

export default PlotlyPlot;
