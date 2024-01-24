import React from 'react'
import Portfolio from '../../components/Portfolio'
import PieChart from '../../components/PieChart'
import CryptoPrices from '../../components/CryptoPrices'
import FinMetrics from '../../components/FinMetrics'
import HistoricalPerformance from '../../components/HistoricalPerformance'

const Analysis = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '2em', padding: '1em' }}>
      <div style={{ display: 'flex', paddingTop: '2rem', justifyContent: 'space-evenly' }} >
        <div style={{ width: '40%' }} >
          <Portfolio />
        </div>
        <div style={{ width: '60%' }}>
          <PieChart />
        </div>
        <div style={{ width: '40%' }}>
          <FinMetrics />
        </div>
      </div>
      <div style={{ display: 'flex', width: '100%' }} >
        <div style={{ width: '50%'}}>
          <CryptoPrices />
        </div>
        <div style={{width: '50%', paddingLeft: '2em'}} >
          <HistoricalPerformance />
        </div>
      </div>
    </div>
  )
}

export default Analysis