import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const PieChart = () => {
    const [plotData, setPlotData] = useState({});
    const [initialValue, setInitialValue] = useState(0);

    useEffect(() => {
        // const apiUrl = 'http://127.0.0.1:5000/generate_pie';
        const apiUrl = 'https://api.revifi.xyz/generate_pie'
        const payload = {
            coins: ["BTC", "ETH", "SOL", "BNB"],
            allocations: [0.20, 0.30, 0.25, 0.25],
            initial_portfolio_value: 100000
        };

        axios.post(apiUrl, payload)
            .then(response => {
                const plotData = JSON.parse(response.data.graph);
                setPlotData({
                    data: plotData.data,
                    layout: plotData.layout
                });
                setInitialValue(response.data._value);
            })
            .catch(error => console.error('Error fetching pie chart data:', error));
    }, []);

    return (
        <div>
            <h2>Initial Portfolio Value: ${initialValue.toFixed(2)}</h2>
            <Plot
                data={plotData.data}
                layout={plotData.layout}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default PieChart;
