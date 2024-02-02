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
      <div style={{ display: 'flex', justifyContent: 'space-around' }} >
        <div style={{ width: '90%' }}>
          <FinMetrics />
        </div>
      </div>
      <div className='flex justify-center' >
        <div style={{ display: 'flex', width: '90%', justifyContent: 'space-around', border: '1px solid #ddd' }} className='rounded-md'>
          <div>
            <HistoricalPerformance />
          </div>
          <div>
            <FuturePerformance />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis