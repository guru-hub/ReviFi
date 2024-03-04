import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';
import Plot from 'react-plotly.js';
import Alert from '@mui/material/Alert';



const CalculateFinMetrics = ({ metricKey, setVarResult }) => {
  const [loading, setLoading] = useState(false);
  const cryptoData = useSelector((state) => state.data.crypto);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [plot, setPlot] = useState(null);

  const layout = {
    width: 700,
    height: 400,
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 50,
      pad: 4
    },
    xaxis: {
      showgrid: false,
      zeroline: false
    },
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    yaxis: {
      showgrid: false,
      zeroline: false
    },
    plot_bgcolor: "#F6F6F6",
    paper_bgcolor: "#F6F6F6"
  }


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
      let endDate = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
      let startDate = moment(endDate).subtract(1, 'year').format('YYYY-MM-DD');
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
        start_date: startDate,
        end_date: endDate,
        risk_free_rate: 0.1,
        benchmark: "BTC"
      };

      axios.post(requestURL, data)
        .then(response => {
          const plotData = JSON.parse(response?.data.graph);
          setPlot({
            data: plotData.data,
            layout: plotData.layout
          });
          setVarResult(response.data._value);
        })
    }
    setLoading(false);
  }, [metricKey, cryptoData, totalValue, setVarResult, MetricToURL, SymbolToId]);

  return (
    <div>
      {loading ? (
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      ) : (
        <Plot
          config={{ displayModeBar: false, responsive: true }}
          data={plot?.data || []}
          layout={layout}
        />
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