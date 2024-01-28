import React, { useState } from 'react';
import styles from './styles.module.css';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';
import CalculateFinMetrics from './CalculateFinMetrics';

const FinMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [tooltip, setTooltip] = useState('');

  const metrics = [
    { name: 'Annualized returns', description: 'Returns over the last 4 years' },
    { name: 'Volatility', description: 'Measure of the dispersion of returns' },
    { name: 'Value at Risk', description: 'Estimated maximum loss under normal conditions' },
    { name: 'Expected Shortfall', description: 'Average loss beyond the Value at Risk' },
    { name: 'Sharpe Ratio', description: 'Risk-adjusted measure of return' },
    { name: 'Drawdown Chart', description: 'Drawdown chart' }
  ];

  const handleSelectChange = (e) => {
    const selectedMetric = e.target.value;
    setSelectedMetric(selectedMetric);
    const metric = metrics.find((m) => m.name === selectedMetric);
    setTooltip(metric?.description || '');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Financial Metrics</h2>
      <div>
        <select className={styles.select} onChange={handleSelectChange}>
          <option>Select Metric</option>
          {metrics.map((metric) => (
            <option key={metric.name} value={metric.name}>
              {metric.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {selectedMetric && (
          <div>
            <ul className={styles.list}>
              <Tooltip title={tooltip} placement="top-start">
                <QuestionMarkIcon fontSize="small" />
              </Tooltip>
              <li className={styles.listItem}>
                <div style={{ maxWidth: '100%' }}>
                  <CalculateFinMetrics metricKey={selectedMetric} />
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinMetrics;
