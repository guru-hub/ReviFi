import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Plot from 'react-plotly.js';

const HistoricalPerformance = () => {
  const [plot, setPlot] = useState(null);
  const [value, setValue] = useState('1W');
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const cryptoData = useSelector((state) => state.data.crypto);
  const [loading, setLoading] = useState(false);
  const totalValue = useSelector((state) => state.data.totalValue);
  const [initialValue, setInitialValue] = useState(0);

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

  const layout = {
    width: 1100,
    height: 400,
    margin: {
      l: 50,  // Left margin
      r: 50,  // Right margin
      t: 50,  // Top margin
      b: 50,  // Bottom margin
      pad: 4  // Padding
    },
    backgroundColor: '#F6F6F6',
    xaxis: {
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      showgrid: false,
      zeroline: false
    },
    color: 'black',
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    plot_bgcolor: "#F6F6F6",
    paper_bgcolor: "#F6F6F6"
  }


  useEffect(() => {
    // if (isConfirmed == true) {
    setLoading(true);
    const coins = cryptoData.map((crypto) => SymbolToId[crypto.asset]);
    const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
    const data = {
      coins,
      allocations,
      initial_portfolio_value: totalValue,
      time_frame: value,
    };
    console.log(data);
    const devServer = "http://localhost:5000/historical_performance"
    const prodServer = "https://api.revifi.xyz/historical_performance"
    axios.post(prodServer, data)
      .then(response => {
        const plotData = JSON.parse(response.data.graph);
        setPlot({
          data: plotData.data,
          layout: plotData.layout
        });
        setInitialValue(response.data._value);
      })
    setLoading(false);
  }, [value, totalValue, cryptoData])


  const handleChange = (event, newValue) => {
    setLoading(true);
    setValue(newValue);
    setLoading(false);
  };

  return (
    <div className='relative'>
      <div className='flex justify-between items-end'>
        <div className='flex-col'>
          <div>
            Total Value
          </div>
          <div className='flex items-end gap-4'>
            <div className='text-5xl font-bold' >
              ${totalValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
            sx={{ width: '34rem', border: '1px solid black', backgroundColor: 'white', "& button.Mui-selected": { background: "linear-gradient(#0047AA, #0085B6)", color: 'white' } }}
            className='rounded-md'
            TabIndicatorProps={{ style: { background: 'linear-gradient(#0047AA, #0085B6)' } }}
          >
            <Tab value="1W" label="1W" />
            <Tab value="1M" label="1M" />
            <Tab value="3M" label="3M" />
            <Tab value="6M" label="6M" />
            <Tab value="1Y" label="1Y" />
            <Tab value="3Y" label="ALL" />
          </Tabs>
        </Box>
      </div>
      <div className='pt-16 flex justify-center' >
        {loading ?
          (
            <div className='flex justify-center'>
              <CircularProgress />
            </div>
          ) : (
            <div className={`${!isConfirmed ? 'blur-md' : 'blur-none'}`}>
              <Plot
                config={{ displayModeBar: false, responsive: true }}
                data={plot?.data}
                layout={layout}
                style={{ backgroundColor: '#F6F6F6' }}
              />
            </div>
          )}
      </div>
      {!isConfirmed && !loading && plot && (
        <Alert severity="info" style={{ top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)' }}>
          <p className="font-bold text-[15px] font-serif">
            Please click on confirm allocation to access Analysis
          </p>
        </Alert>
      )}
    </div>
  )
}

export default HistoricalPerformance