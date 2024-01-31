import React from 'react'
import Portfolio from '../../components/Portfolio'
import PieChart from '../../components/PieChart'
import CryptoPrices from '../../components/CryptoPrices'
import FinMetrics from '../../components/FinMetrics'
import HistoricalPerformance from '../../components/HistoricalPerformance'
import FuturePerformance from '../../components/FuturePerformance/FuturePerformance'

const Analysis = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className="gap-6" >
      <div style={{ display: 'flex', paddingTop: '2rem', justifyContent: 'space-evenly' }} >
        <div>
          <Portfolio />
        </div>
        <div>
          <PieChart />
        </div>
      </div>
      <div>
        <CryptoPrices />
      </div>
      <div style={{display: 'flex'}} >
        <div style={{ width: '70%' }}>
          <FinMetrics />
        </div>
      </div>
      <div style={{ display: 'flex', width: '100%' }} >
        <div style={{ width: '50%' }}>
          <HistoricalPerformance />
        </div>
        <div style={{ width: '50%', paddingLeft: '2em' }} >
          <FuturePerformance />
        </div>
      </div>
    </div>
  )
}

export default Analysis