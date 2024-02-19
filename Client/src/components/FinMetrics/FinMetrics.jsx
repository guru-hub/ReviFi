import React, { useState } from 'react';
import styles from './styles.module.css';
import CalculateFinMetrics from './CalculateFinMetrics';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const FinMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [varResult, setVarResult] = useState('');

  const metrics = [
    { name: 'Annualized returns', description: 'Returns over the last 4 years : Annualized returns measure the average yearly profit or loss of an investment, adjusted for the investment holding period. This metric helps portfolio managers compare the performance of different investments over varying time frames, enabling more informed decision-making for long-term strategy' },
    { name: 'Volatility', description: 'Measure of the dispersion of returns : Volatility represents the degree of variation in the price of an investment over time, indicating its risk level. It is crucial for portfolio managers to assess volatility to understand the potential for price swings, aiding in risk management and asset allocation decisions. ' },
    { name: 'Value at Risk', description: 'Estimated maximum loss under normal conditions : The 95% Value-at-Risk (VaR) quantifies the maximum expected loss on an investment over a specified period with 95% confidence. It helps portfolio managers gauge the risk of significant losses, serving as a critical tool for financial risk assessment and portfolio risk management' },
    { name: 'Expected Shortfall', description: 'Average loss beyond the Value at Risk : The 95% Expected Shortfall (ES) estimates the average loss that exceeds the 95% Value-at-Risk, focusing on the tail end of the loss distribution. It provides portfolio managers with insight into the extreme risk an investment might face, which is crucial for understanding and managing the potential for severe loss' },
    { name: 'Sharpe Ratio', description: 'Risk-adjusted measure of return : The Sharpe Ratio calculates the adjusted return of an investment relative to its risk, offering a measure of risk-adjusted performance. It helps portfolio managers identify investments that provide higher returns for the same level of risk, aiding in the selection of optimal assets for a portfolio' },
    { name: 'Drawdown Chart', description: 'Max drawdown measures : The largest single drop from peak to trough in the value of an investment or portfolio, without considering the time frame. It is key for portfolio managers to assess the risk of potential losses, guiding decisions on risk tolerance and investment strategy adjustment' }
  ];

  const handleSelectChange = (e) => {
    setVarResult('')
    const selectedMetric = e.target.value;
    setSelectedMetric(selectedMetric);
  };

  return (
    <div className={styles.container}>
      <div>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Select Metrics</InputLabel>
          <Select
            sx={{ minWidth: '15rem', backgroundColor: 'white' }}
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={selectedMetric}
            onChange={handleSelectChange}
            label="Selected Metrics"
          >
            {metrics.map((metric) => (
              <MenuItem key={metric.name} value={metric.name}>{metric.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        {selectedMetric && (
          <div>
            <ul className={styles.list}>
              <li >
                <div style={{ display: 'flex', flexDirection: 'column' }} className='rounded-md p-2'>
                  <div style={{ display: 'flex', width: '100%', overflow: 'auto', alignItems: 'center', gap: '10em', paddingLeft: '5rem' }} className='rounded - md p- 2'>
                    <div style={{ display: 'flex', width: '30%' }} >
                      {metrics.map((metric) => (
                        <div key={metric.name}>
                          {metric.name === selectedMetric && (
                            <td>{metric.description}</td>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '100%', paddingBottom: '2rem' }}>
                      <CalculateFinMetrics setVarResult={setVarResult} metricKey={selectedMetric} />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div >
  );
};

export default FinMetrics;
