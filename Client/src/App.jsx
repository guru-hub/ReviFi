import './App.css'
import HomeNavbar from './components/HomeNavbar'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Staking from './pages/Staking'
import Governance from './pages/Governance'
import Analysis from './pages/Analysis'
import Products from './pages/Products'

function App() {
  return (
    <>
      <HomeNavbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/staking' element={<Staking/>} />
        <Route path='/governance' element={<Governance/>} />
        {/* <Route path='/products/analysis' element={<Analysis/>} /> */}
        <Route path='/products' element={<Products/>}/>
      </Routes>
    </>
  )
}

export default App
