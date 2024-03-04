import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TestFin = () => {
    const [plotData, setPlotData] = useState({});
    const [initialValue, setInitialValue] = useState(0);
    const cryptoData = useSelector((state) => state.data.crypto);

    const SymbolToId = {
        "BTC": "BTC",
        "ETH": "ETH",
        "BNB": "BNB",
        "USDT": "USDT",
        "SOL": "SOL",
        "LTC": "LTC",
        "XRP": "XRP",
        "TRX": "TRX",
        "ADA": "ADA",
        "DOT": "DOT",
        ",": "%2C%20"
    }

    const coins = cryptoData.map((crypto) => SymbolToId[crypto.asset]);
    const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
    const totalValue = useSelector((state) => state.data.totalValue);

    useEffect(() => {
        const local = 'http://127.0.0.1:5000/'
        const server = 'https://api.revifi.xyz/'

        const pie = 'generate_pie'
        const hp = 'historical_performance'
        const fp = 'future_performance'
        const ar = 'annualized_returns'
        const varc = 'var'
        const shortfall = 'expected_shortfall'
        const volatility = 'volatility'
        const drawdown = 'drawdown_chart'
        const sharpeRatio = 'sharpe_ratio'


        const apiUrl = server + hp

        const payload = {
            coins: coins,
            allocations: allocations,
            initial_portfolio_value: totalValue,
            benchmark: "BTC",
            time_frame: "3M",
            start_date: "2023-01-01",
            end_date: "2024-01-01",
            confidence_level: 0.95,
            risk_free_rate: 0.05

        };
        console.log('Pay Load:', payload);
        console.log('URL:', apiUrl);

        axios.post(apiUrl, payload)
            .then(response => {
                const plotData = JSON.parse(response.data.graph);
                setPlotData({
                    data: plotData.data,
                    layout: plotData.layout
                });
                console.log(plotData);
                setInitialValue(response.data._value);
            })
            .catch(error => console.error('Error fetching pie chart data:', error));
    }, []);

    return (
        <div>
            <h2> Value: {initialValue}</h2>
            <Plot
                data={plotData.data}
                layout={plotData.layout}
            />
        </div>
    );
};

export default TestFin;
