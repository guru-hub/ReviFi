import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Plot from 'react-plotly.js';
import { useMetaMask } from "../Hooks/useMetamask";

const PieChart = () => {
  const dispatch = useDispatch();
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [loading, setLoading] = useState(false);
  const [plotData, setPlotData] = useState({});
  const { hasPortfolio, crypto, PortfolioFactoryEngineContract, setCrypto, setPortfolioValue, portfolioValue } = useMetaMask();

  const layout = {
    width: 500,
    height: 400,
    margin: {
      l: 50,  // Left margin
      r: 50,  // Right margin
      t: 50,  // Top margin
      b: 50,  // Bottom margin
      pad: 4  // Padding
    },
    backgroundColor: '#F6F6F6',
    plot_bgcolor: "#F6F6F6",
    paper_bgcolor: "#F6F6F6"
  }

  let apiName = 'https://api.revifi.xyz/generate_pie';

  const fetchData = useCallback(() => {
    setLoading(true);
    const coins = crypto?.map((crypto) => crypto.asset);
    const allocations = crypto?.map((crypto) => crypto.allocation / 100);
    console.log(coins, allocations, portfolioValue);
    let payload = {
      "coins": coins,
      "allocations": allocations,
      "initial_portfolio_value": parseFloat(portfolioValue)
    }
    axios.post(apiName, payload)
      .then(response => {
        const plotData = JSON.parse(response.data.graph);
        setPlotData({
          data: plotData.data,
          layout: plotData.layout
        });
      })
      .catch(error => console.error('Error fetching pie chart data:', error))
      .finally(() => {
        setLoading(false);
      });
  }, [crypto, portfolioValue, apiName]);

  const fetchDataFromSolidity = useCallback(async (symbol, allocation, newValue, newName) => {
    setLoading(true);
    const crypto = [];
    // Add new data to crypto array and dispatch it (Symbol is an array of symbols of crypto i.e ['BTC', 'ETH'], allocation is an array of allocation i.e [50, 50] for each particular symbol)
    for (let i = 0; i < symbol.length; i++) {
      crypto.push({ asset: symbol[i], allocation: parseFloat(allocation[i]), allocatedValue: (parseFloat(allocation[i]) / 100) * parseFloat(newValue) });
    }
    setCrypto(crypto);
    setPortfolioValue(parseFloat(newValue));
    fetchData();
  },[fetchData, setCrypto, setPortfolioValue]);

  useEffect(() => {
    fetchData();
    const handlePortfolioUpdated = (symbol, allocation, newValue, newName) => {
      console.log(symbol, allocation, newValue, newName);
      // When PortfolioUpdated event is triggered, fetch new data
      fetchDataFromSolidity(symbol, allocation, newValue, newName);
    };

    // Listen to PortfolioUpdated event
    PortfolioFactoryEngineContract?.on("PortfolioUpdated", handlePortfolioUpdated);

    return () => {
      // Clean up event listener when component unmounts
      PortfolioFactoryEngineContract?.removeListener("PortfolioUpdated", handlePortfolioUpdated);
    };
  }, [portfolioValue, crypto, PortfolioFactoryEngineContract, fetchData, fetchDataFromSolidity]);

  return (
    <div style={{ position: 'relative' }}>
      {loading ?
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
        : <div className="">
          {
            <div>
              <div className={`${hasPortfolio ? 'blur-none' : 'blur-md'} relative`}>
                <Plot
                  config={{ displayModeBar: false, responsive: true }}
                  data={plotData.data}
                  layout={layout}
                />
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {!hasPortfolio &&
                  <Alert severity="info">
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
