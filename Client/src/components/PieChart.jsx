import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
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
  }, [totalValue, cryptoData]);

  let apiName = 'https://api.revifi.xyz/generate_pie_chart'

  return (
    <div className="pt-[1.2rem]" style={{ position: 'relative' }}>
      {loading ?
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
        : <div className="">
          {graph &&
            <div className="relative blur-none">
              <img height={600} width={600} src={graph} alt={`PieChart Graph`} className={`rounded-lg ${isConfirmed ? 'blur-none' : 'blur-md'}`} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {!isConfirmed && <Alert severity="info">
                  <p className="font-bold text-[15px] font-serif">Please click on confirm allocation to access Analysis</p>
                </Alert>}
              </div>
            </div>
          }
        </div>}
    </div>
  );
};

export default PieChart;
