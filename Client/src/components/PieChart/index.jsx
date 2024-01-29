import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from 'react-redux';
import FinMetrics from '../../components/FinMetrics'
import styles from "./styles.module.css";

const PieChart = () => {
  const cryptoData = useSelector((state) => state.data.crypto);
  const [chartData, setChartData] = useState([["Asset", "Allocation"]]);
  const currentTotalAllocation = useSelector((state) => state.data.currentTotalAllocation);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);


  useEffect(() => {
    if (isConfirmed == true) {
      const newData = cryptoData.map(({ asset, allocatedValue }) => [asset, +allocatedValue]);
      setChartData([["Asset", "Allocation"], ...newData]);
    }
  }, [isConfirmed]);

  const options = {
    'height': 500,
    'width': 600,
    "is3D": true
  };

  return (
    <div className={styles["container"]}>
      <div className={`${styles["title"]} font-bold pl-8`}>
        Pie Chart
      </div>
      <Chart
        chartType="PieChart"
        options={options}
        data={chartData}
      />
    </div>
  );
};

export default PieChart;
