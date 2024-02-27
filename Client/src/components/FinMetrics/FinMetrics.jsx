import React, { useState } from 'react';
import styles from './styles.module.css';
import CalculateFinMetrics from './CalculateFinMetrics';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';

const FinMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [varResult, setVarResult] = useState(0);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);

  const metrics = [
    {
      name: 'Annualized returns',
      description: 'Annualized returns measure the average yearly profit or loss of an investment, adjusted for the investment holding period. This metric helps portfolio managers compare the performance of different investments over varying time frames, enabling more informed decision-making for long-term strategy',
      descriptionStart: 'Average annual return over the investment period : '
    },
    {
      name: 'Volatility',
      description: 'Volatility represents the degree of variation in the price of an investment over time, indicating its risk level. It is crucial for portfolio managers to assess volatility to understand the potential for price swings, aiding in risk management and asset allocation decisions.',
      descriptionStart: 'Measure of the dispersion of returns : '
    },
    {
      name: 'Value at Risk',
      description: 'The 95% Value-at-Risk (VaR) quantifies the maximum expected loss on an investment over a specified period with 95% confidence. It helps portfolio managers gauge the risk of significant losses, serving as a critical tool for financial risk assessment and portfolio risk management',
      descriptionStart: 'Estimated maximum loss under normal conditions : '
    },
    {
      name: 'Expected Shortfall',
      description: 'The 95% Expected Shortfall (ES) estimates the average loss that exceeds the 95% Value-at-Risk, focusing on the tail end of the loss distribution. It provides portfolio managers with insight into the extreme risk an investment might face, which is crucial for understanding and managing the potential for severe loss',
      descriptionStart: 'Average loss beyond the Value at Risk : '
    },
    {
      name: 'Sharpe Ratio',
      description: 'The Sharpe Ratio calculates the adjusted return of an investment relative to its risk, offering a measure of risk-adjusted performance. It helps portfolio managers identify investments that provide higher returns for the same level of risk, aiding in the selection of optimal assets for a portfolio',
      descriptionStart: 'Risk-adjusted measure of return : '
    },
    {
      name: 'Drawdown Chart',
      description: 'The largest single drop from peak to trough in the value of an investment or portfolio, without considering the time frame. It is key for portfolio managers to assess the risk of potential losses, guiding decisions on risk tolerance and investment strategy adjustment',
      descriptionStart: 'Max drawdown measures : '
    }
  ];

  const handleSelectChange = (e) => {
    setVarResult(0)
    const selectedMetric = e.target.value;
    setSelectedMetric(selectedMetric);
  };

  return (
    <div className={`${styles.container} relative`}>
      <div>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="metrics">Select Metrics</InputLabel>
          <Select
            sx={{ minWidth: '15rem', backgroundColor: 'white' }}
            labelId="metrics"
            id="metrics"
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
      <div className={`${isConfirmed ? 'blur-none' : 'blur-md'}`}>
        {selectedMetric && (
          <div>
            <ul className={styles.list}>
              <li >
                <div className='rounded-md p-2 flex'>
                  <div className='rounded-md flex items-center justify-evenly overflow-auto'>
                    <div className='flex w-[30%]'>
                      {metrics.map((metric) => (
                        <div className="flex-col" key={metric.name}>
                          <div>
                            {metric.name === selectedMetric && (
                              <div className='font-bold flex' >
                                <td>
                                  {metric.descriptionStart}
                                  <span className='text-[#007bff]'>
                                    {varResult.toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </span>
                                  {metric.name === 'Value at Risk' ? '%' : ''}
                                </td>
                              </div>
                            )}
                          </div>
                          <div>
                            {metric.name === selectedMetric && (
                              <div className=''>
                                <td>{metric.description}</td>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ paddingBottom: '2rem' }}>
                      <CalculateFinMetrics setVarResult={setVarResult} metricKey={selectedMetric} />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
      {
        !isConfirmed &&
        <Alert severity="info" style={{ margin: '0 auto', backdropFilter: 'none', top: '50%', left: '50%', position: 'absolute', transform: "translate(-50%, -50%)" }}>
          <p className="font-bold text-[15px] font-serif">
            Please click on confirm allocation to access Analysis
          </p>
        </Alert>
      }
    </div >
  );
};

export default FinMetrics;
