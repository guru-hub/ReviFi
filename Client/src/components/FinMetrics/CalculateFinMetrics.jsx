import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';

const CalculateFinMetrics = ({ metricKey, setVarResult }) => {

  // const [varResult, setVarResult] = useState('');
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const cryptoData = useSelector((state) => state.data.crypto);
  const totalValue = useSelector((state) => state.data.totalValue);

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
    if (metricKey) {
      setLoading(true);

      const coins = cryptoData.map((crypto) => SymbolToId[crypto.asset]);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);

      const metricURL = MetricToURL[metricKey];
      setEndDate(moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD'));
      setStartDate(moment(endDate).subtract(1, 'year').format('YYYY-MM-DD'));

      const requestURL = `https://api.revifi.xyz/${metricURL}`;

      const devUrl = `http://localhost:5000/${metricURL}`;

      const data = {
        coins,
        allocations,
        initial_portfolio_value: parseInt(totalValue),
        confidence_level: 0.95,
        start_date: startDate,
        end_date: endDate,
        risk_free_rate: 0.1,
        time_frame: '1W',
        benchmark: "BTC-USD"
      };

      console.log(data);

      axios
        .post(requestURL, data)
        .then((response) => {
          console.log(response);
          setVarResult(response.data.value);
          setGraph(`data:image/png;base64,${response.data.graph}`);
        })
        .catch((error) => {
          console.error(`Error fetching ${metricKey} data`, error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [metricKey, startDate, endDate, cryptoData, totalValue]);

  return (
    <div style={{ width: '' }}>
      {loading ? (
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {graph && <img height={700} width={750} src={graph} alt={`${metricKey} Graph`} className='rounded-lg' />}
        </div>
      )}
    </div>
  );
};

export default CalculateFinMetrics;
