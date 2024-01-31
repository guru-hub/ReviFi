import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CalculateFinMetrics = ({ metricKey }) => {
  const [varResult, setVarResult] = useState('');
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('2022-12-11');
  const [endDate, setEndDate] = useState('2023-12-15');
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
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    USDT: 'tether',
    SOL: 'solana',
    LTC: 'litecoin',
    XRP: 'ripple',
    TRX: 'tron',
    ADA: 'cardano',
    DOT: 'polkadot',
    ',': '%2C%20',
  };

  useEffect(() => {
    if (metricKey) {
      setLoading(true);

      const coins = cryptoData.map((crypto) => SymbolToId[crypto.asset]);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);

      const metricURL = MetricToURL[metricKey];
     
      //const requestURL = `http://revfi.us-east-1.elasticbeanstalk.com/${metricURL}`;

    const requestURL = `http://localhost:5000/${metricURL}`;

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
          {graph && <img height={300} width={500} src={graph} alt={`${metricKey} Graph`} />}
        </div>
      )}
    </div>
  );
};

export default CalculateFinMetrics;
