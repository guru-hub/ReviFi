import React from 'react'
import Portfolio from '../components/Portfolio'
import PieChart from '../components/PieChart'
import CryptoPrices from '../components/CryptoPrices/CryptoPrices'
import FinMetrics from '../components/FinMetrics/FinMetrics'
import HistoricalPerformance from '../components/HistoricalPerformance'
import FuturePerformance from '../components/FuturePerformance'
import styles from './pages.module.css';
import { useState } from 'react';
import { useMetaMask } from "../Hooks/useMetamask";
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';

const Analysis = () => {
  const { hasPortfolio } = useMetaMask();
  const cryptoData = useSelector((state) => state.data.crypto);
  return (
    (!cryptoData && hasPortfolio) ?
      <div className='flex justify-center'>
        <CircularProgress />
      </div> :
      <div style={{ display: 'flex', flexDirection: 'column' }} className="gap-20 px-32">
        <div>
          <div>
            <h2 className={`${styles.title} font-bold`}> Portfolio Allocation </h2>
          </div>
          <div className='rounded-lg' style={{ display: 'flex', paddingTop: '2rem', backgroundColor: '#F6F6F6', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <div>
              <Portfolio />
            </div>
            <div>
              <PieChart />
            </div>
          </div>
        </div>
        <div>
          <CryptoPrices />
        </div>
        <div style={{ display: 'flex-col', alignItems: 'center' }} >
          <h2 className={`${styles["title"]} font-bold`}>Financial Metrics</h2>
          <div style={{ width: '100%', backgroundColor: '#F6F6F6' }}>
            <FinMetrics />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '1rem' }}>
          <div style={{ width: '100%' }}>
            <div>
              <h1 className={`${styles.title} font-bold`}>Historical Performance</h1>
            </div>
            <div style={{ width: '100%', backgroundColor: '#F6F6F6' }} className='p-8 rounded-lg'>
              <HistoricalPerformance />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '1rem' }} >
          <div style={{ width: '100%' }}>
            <div>
              <h1 className={`${styles.title} font-bold`}>Future Performance</h1>
            </div>
            <div style={{ width: '100%', backgroundColor: '#F6F6F6' }} className='p-8 rounded-lg'>
              <FuturePerformance />
            </div>
          </div>
        </div>
      </div>
  )
}

export default Analysis