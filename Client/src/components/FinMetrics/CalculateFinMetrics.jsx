import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';



const CalculateFinMetrics = ({ metricKey }) => {
  
  const [varResult, setVarResult] = useState('');
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('2023-02-04');
  const [endDate, setEndDate] = useState('2024-02-04');
  const cryptoData = useSelector((state) => state.data.crypto);

  const MetricToURL = {
    'Annualized returns': 'annualized_returns',
    Volatility: 'volatility',
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
     const endDate = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
     const startDate = moment(endDate).subtract(1, 'year').format('YYYY-MM-DD');


      const requestURL = `https://api.revifi.xyz/${metricURL}`;

      const devUrl = `http://localhost:5000/${metricURL}`;

      const data = {
        coins,
        allocations,
        initial_portfolio_value: 100000,
        confidence_level: 0.95,
        start_date: startDate,
        end_date: endDate,
        risk_free_rate: 0.1,
        time_frame: '1W',
      };

      axios
        .post(requestURL, data)
        .then((response) => {
          setVarResult(response.data[metricURL]);
          console.log(response.data.graph);
          setGraph(`data:image/png;base64,${response.data.graph}`);
        })
        .catch((error) => {
          console.error(`Error fetching ${metricKey} data`, error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [metricKey, startDate, endDate, cryptoData]); // Dependency array ensures the effect runs when these values change

  return (
    <div style={{ width: '' }}>
      {loading ? (
        'Calculating...'
      ) : (
        <div>
          {varResult && <p>{`${metricKey}: ${varResult}`}</p>}
          {graph && <img height={650} width={650} src={graph} alt={`${metricKey} Graph`} />}
        </div>
      )}
    </div>
  );
};

export default CalculateFinMetrics;
