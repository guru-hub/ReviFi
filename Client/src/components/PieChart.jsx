import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import FinMetrics from './FinMetrics/FinMetrics'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const PieChart = () => {
  const cryptoData = useSelector((state) => state.data.crypto);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConfirmed == true) {
      setLoading(true);
      const coins = cryptoData.map((crypto) => crypto.asset);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
      let payload = {
        "coins": coins,
        "allocations": allocations,
        "initial_portfolio_value": totalValue
      }
      axios
        .post(apiName, payload)
        .then((response) => {
          setGraph(`data:image/png;base64,${response.data.graph}`)
        })
        .catch((error) => {
          console.error(`Error fetching data`, error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isConfirmed, totalValue, cryptoData]);


  let apiName = 'https://api.revifi.xyz/generate_pie_chart'

  return (
    <div className="pt-[1.2rem]" >
      {loading ?
        <div className="flex justify-center items-center pt-48 pr-80" >
          <CircularProgress />
        </div>
        : <div className="" >
          {graph ?
            <img height={650} width={650} src={graph} alt={`PeiChart Graph`} className='rounded-lg' />
            :
            <div className="pt-40">
              <Alert severity="info">
                <p className="font-bold text-[20px] font-serif">Please click on confirm allocation to access Analysis</p>
              </Alert>
            </div>
          }
        </div>}
    </div>
  );
};

export default PieChart;
