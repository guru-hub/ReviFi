import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const HistoricalPerformance = () => {
  const [value, setValue] = useState('1W');
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const cryptoData = useSelector((state) => state.data.crypto);
  const [varResult, setVarResult] = useState('');
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);
  const totalValue = useSelector((state) => state.data.totalValue);


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
    if (isConfirmed == true) {
      setLoading(true);
      const coins = cryptoData.map((crypto) => SymbolToId[crypto.asset]);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
      const data = {
        coins,
        allocations,
        initial_portfolio_value: parseInt(totalValue),
        time_frame: value,
      };
      const devServer = "http://localhost:5000/historical_performance"
      const prodServer = "https://api.revifi.xyz/historical_performance"
      // console.log(data)
      // console.log(prodServer)
      axios
        .post(prodServer, data)
        .then((response) => {
          setVarResult(response.data["historical_performance"]);
          setGraph(`data:image/png;base64,${response.data.graph}`);
        })
        .catch((error) => {
          console.error(`Error fetching Historical Performance data`, error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isConfirmed, value, totalValue])


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
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
            <div className='text-lg' style={{ color: '#00DF51' }} >
              +23.47%
            </div>
            <div className='text-lg' style={{ color: '#727272' }}>
              Past {value}
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
        {loading ? (
          <div className='flex justify-center'>
            <CircularProgress />
          </div>
        ) : (
          <div className='flex '>
            {graph && <img className='rounded-lg' src={graph} alt={`Historical Performance Graph`} />}
          </div>
        )}
      </div>
    </div >
  )
}

export default HistoricalPerformance