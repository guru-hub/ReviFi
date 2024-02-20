import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import FinMetrics from './FinMetrics/FinMetrics'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const PieChart = () => {
  const cryptoData = useSelector((state) => state.data.crypto);
  console.log(cryptoData);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConfirmed == true) {
      setLoading(true);
      const coins = cryptoData.map((crypto) => crypto.asset);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
      console.log(coins);
      console.log(allocations);
      let payload = {
        "coins": coins,
        "allocations": allocations,
        "initial_portfolio_value": totalValue
      }
      axios
        .post(apiName, payload)
        .then((response) => {
          setGraph(`data:image/png;base64,${response.data.graph}`);
        })
        .catch((error) => {
          console.error(`Error fetching data`, error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isConfirmed, totalValue]);


  let apiName = 'https://api.revifi.xyz/generate_pie_chart'

  return (
    <div>
      {loading ?
        <div className="flex justify-center items-center pt-52" >
          <CircularProgress />
        </div>
        : <div>
          {graph && <img height={650} width={650} src={graph} alt={`PeiChart Graph`} className='rounded-lg' />}
        </div>}
    </div>
  );
};

export default PieChart;
