import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import FinMetrics from '../../components/FinMetrics'
import styles from "./styles.module.css";

const PieChart = () => {
  const cryptoData = useSelector((state) => state.data.crypto);
  const [chartData, setChartData] = useState([["Asset", "Allocation"]]);
  const totalValue = useSelector((state) => state.data.totalValue);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);

  useEffect(() => {
    if (isConfirmed == true) {
      const newData = cryptoData.map(({ asset, allocatedValue }) => [asset, +allocatedValue]);
      setChartData([["Asset", "Allocation"], ...newData]);
    }
  }, [isConfirmed, totalValue]);

  const options = {
    'height': 500,
    'width': 600,
    'backgroundColor': '#F6F6F6'
  };

  return (
    <div className={styles["container"]}>
      <Chart
        chartType="PieChart"
        options={options}
        data={chartData}
      />
    </div>
  );
};

export default PieChart;
