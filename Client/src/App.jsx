import './App.css'
// import LandingNavbar from './components/LandingNavbar'
import HomeNavbar from './components/HomeNavbar'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Staking from './pages/Staking'
import Governance from './pages/Governance'
import Analysis from './pages/Analysis'

function App() {
  return (
    <>
      <HomeNavbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        {/* <Route path='/products' element={<Products/>} /> */}
        <Route path='/staking' element={<Staking/>} />
        <Route path='/governance' element={<Governance/>} />
        <Route path='/products/analysis' element={<Analysis/>} />
      </Routes>
    </>
  )
}

export default App
