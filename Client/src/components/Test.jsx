import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Test = () => {
    const [plot, setPlot] = useState(null); // Initialize to null

    const payload = {
        coins: ["BTC", "ETH", "SOL", "BNB"],
        allocations: [0.20, 0.30, 0.25, 0.25],
        initial_portfolio_value: 100000,
        time_frame: "1Y",
        benchmark: "BTC"
    };
    const apiUrl ='https://api.revifi.xyz/historical_performance_i'
    //const apiUrl = 'http://127.0.0.1:5000/historical_performance_i';

    useEffect(() => {
        // Correctly send the payload with fetch
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload) // Correctly stringify the payload
        })
        .then(res => res.json())
        .then(data => {
            setPlot(data); // Set the plot data
        })
        .catch(error => console.error('Error fetching the plot:', error));
    }, []); // Dependency array left empty to run only once on mount

    // Conditional rendering to avoid rendering the Plot component when plot data is not available
    return (
        <div className='content'>
            {plot ? (
                <Plot
                    data={plot.data || []}
                    layout={plot.layout || {}}
                />
            ) : (
                <p>Loading plot...</p>
            )}
        </div>
    );
};

export default Test;
