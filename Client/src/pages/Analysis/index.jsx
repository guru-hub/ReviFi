import React from 'react'
import Portfolio from '../../components/Portfolio'
import PieChart from '../../components/PieChart'
import CryptoPrices from '../../components/CryptoPrices'
import FinMetrics from '../../components/FinMetrics'
import HistoricalPerformance from '../../components/HistoricalPerformance'
import FuturePerformance from '../../components/FuturePerformance/FuturePerformance'

const Analysis = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '2em', padding: '1em' }} className="gap-6" >
      <div style={{ display: 'flex', paddingTop: '2rem', justifyContent: 'space-evenly' }} >
        <div style={{ width: '50%' }}>
          <Portfolio />
        </div>
        <div style={{ width: '60%' }}>
          <PieChart />
        </div>
        <div style={{ width: '40%' }}>
          <FinMetrics />
        </div>
      </div>
      <div>
        <CryptoPrices />
      </div>
      <div style={{ display: 'flex', width: '100%' }} >
        <div style={{ width: '50%' }}>
          <FuturePerformance />
        </div>
        <div style={{ width: '50%', paddingLeft: '2em' }} >
          <HistoricalPerformance />
        </div>
      </div>
    </div>
  )
}

export default Analysis