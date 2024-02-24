import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Plot from 'react-plotly.js';

const PieChart = () => {
  const cryptoData = useSelector((state) => state.data.crypto);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [loading, setLoading] = useState(false);
  const [plotData, setPlotData] = useState({});


  let apiName = 'https://api.revifi.xyz/generate_pie'

  useEffect(() => {
    setLoading(true);
    const coins = cryptoData.map((crypto) => crypto.asset);
    const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
    let payload = {
      "coins": coins,
      "allocations": allocations,
      "initial_portfolio_value": totalValue
    }
    axios.post(apiName, payload)
      .then(response => {
        const plotData = JSON.parse(response.data.graph);
        console.log(plotData.data);
        console.log(plotData.layout);
        setPlotData({
          data: plotData.data,
          layout: plotData.layout
        });
      })
      .catch(error => console.error('Error fetching pie chart data:', error));
    setLoading(false);
  }, [totalValue, cryptoData]);


  return (
    <div className="pt-[1.2rem]" style={{ position: 'relative' }}>
      {loading ?
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
        : <div className="">
          {plotData &&
            <div className="relative">
              <Plot
                data={plotData.data}
                layout={plotData.layout}
                style={{ width: '10%', height: '10%' }}
              />
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
