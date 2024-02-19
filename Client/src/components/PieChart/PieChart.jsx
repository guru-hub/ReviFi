import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import FinMetrics from '../FinMetrics/FinMetrics'
import styles from "./styles.module.css";
import axios from 'axios';

const PieChart = () => {
  const cryptoData = useSelector((state) => state.data.crypto);
  console.log(cryptoData);
  const [chartData, setChartData] = useState([["Asset", "Allocation"]]);
  const [coins, setCoins] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);
  const [graph, setGraph] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConfirmed == true) {
      setLoading(true);
      const coins = cryptoData.map((crypto) => crypto.asset);
      setCoins(coins);
      const allocations = cryptoData.map((crypto) => crypto.allocation / 100);
      setAllocations(allocations);
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
    <div className={styles["container"]}>
      <div>
        {graph && <img height={650} width={650} src={graph} alt={`PeiChart Graph`} className='rounded-lg' />}
      </div>
    </div>
  );
};

export default PieChart;
