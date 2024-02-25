import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';
import Plot from 'react-plotly.js';
import Alert from '@mui/material/Alert';

const CalculateFinMetrics = ({ metricKey, setVarResult }) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const cryptoData = useSelector((state) => state.data.crypto);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [plot, setPlot] = useState(null);
  

  const MetricToURL = {
    'Annualized returns': 'annualized_returns',
    'Volatility': 'volatility',
    'Value at Risk': 'var',
    'Expected Shortfall': 'expected_shortfall',
    'Sharpe Ratio': 'sharpe_ratio',
    'Drawdown Chart': 'drawdown_chart',
  };

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

  useEffect(() => {
    setLoading(true);
    if (metricKey) {
      const coins = cryptoData.map((crypto) => SymbolToId[crypto.asset]);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
      const metricURL = MetricToURL[metricKey];
      setEndDate(moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD'));
      setStartDate(moment(endDate).subtract(1, 'year').format('YYYY-MM-DD'));
      // console.log(moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD'));
      // console.log(startDate, endDate);
      // console.log(typeof (moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD')));

      const requestURL = `https://api.revifi.xyz/${metricURL}`;

      // const devUrl = `http://localhost:5000/${metricURL}`;

      const data = {
        coins,
        allocations,
        initial_portfolio_value: totalValue,
        confidence_level: 0.95,
        start_date: "2023-01-01",
        end_date: "2024-01-01",
        risk_free_rate: 0.1,
        time_frame: '1W',
        benchmark: "BTC"
      };

      console.log(data);
      axios.post(requestURL, data)
        .then(response => {
          const plotData = JSON.parse(response.data.graph);
          setPlot({
            data: plotData.data,
            layout: plotData.layout
          });
          setVarResult(response.data._value);
        })
    }
    setLoading(false);
  }, [metricKey, startDate, endDate, cryptoData, totalValue]);

  return (
    <div>
      {loading ? (
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      ) : (
        !plot ? (
          <div className='flex justify-center'>
            <CircularProgress />
          </div>
        ) : (
          <Plot
            data={plot?.data || []}
            layout={plot?.layout || {}}
          />
        )
      )}
      {!isConfirmed && !loading && plot && (
        <Alert severity="info" style={{ top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)' }}>
          <p className="font-bold text-[15px] font-serif">
            Please click on confirm allocation to access Analysis
          </p>
        </Alert>
      )}
    </div>
  );
};

export default CalculateFinMetrics;
