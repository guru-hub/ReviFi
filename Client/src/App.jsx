import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Staking from './pages/Staking'
import Governance from './pages/Governance'
import Products from './pages/Products'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/staking' element={<Staking />} />
        <Route path='/governance' element={<Governance />} />
        <Route path='/products' element={<Products />} />
      </Routes>
    </>
  )
}

export default App
