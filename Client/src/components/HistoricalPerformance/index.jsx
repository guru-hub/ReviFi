import React, { useEffect, useState } from 'react'
import styles from "./styles.module.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import axios from 'axios';

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
        initial_portfolio_value: totalValue,
        time_frame: value,
      };
      const devServer = "http://localhost:5000/historical_performance"
      const prodServer = "https://api.revifi.xyz/historical_performance"
      axios
        .post(prodServer, data)
        .then((response) => {
          console.log(response.data.graph);
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
      <div>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
            sx={{ width: '39rem', border: '1px solid black', backgroundColor: 'white' }}
            className='rounded-md'
          >
            <Tab value="1D" label="1D" />
            <Tab value="1W" label="1W" />
            <Tab value="1M" label="1M" />
            <Tab value="3M" label="3M" />
            <Tab value="6M" label="6M" />
            <Tab value="1Y" label="1Y" />
            <Tab value="3Y" label="ALL" />
          </Tabs>
        </Box>
      </div>
      <div className='pt-4' >
        {loading ? (
          'Calculating...'
        ) : (
          <div className='flex '>
            {graph && <img className='rounded-lg w-4/6' src={graph} alt={`Historical Performance Graph`} />}
          </div>
        )}
      </div>
    </div >
  )
}

export default HistoricalPerformance