import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom'
import Coins from '../Coins/index'
import styles from "./styles.module.css"
import { useSelector, useDispatch } from 'react-redux'

const CryptoPrices = () => {

  const [coins, setCoins] = useState([])
  const crypto = useSelector(state => state.data.crypto)
  console.log(crypto);
  const isConfirmed = useSelector((state) => state.data.isConfirmed);


  const SymbolToId = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "BNB": "binancecoin",
    "USDT": "tether",
    "SOL": "solana",
    "LTC": "litecoin",
    "XRP": "ripple",
    "TRX": "tron",
    "ADA": "cardano",
    "DOT": "polkadot",
    ",": "%2C%20"
  }

  console.log(SymbolToId["BTC"]);

  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20polkadot%2C%20ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d%2C%2030d&locale=en'

  useEffect(() => {
    if (isConfirmed == true) {
      const assetIds = crypto.map(({ asset }) => SymbolToId[asset]).join('%2C%20');
      const dynamicUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${assetIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d%2C30d&locale=en`;

      axios.get(dynamicUrl)
        .then((response) => {
          // Map the response data with crypto data and add allocation and allocatedValue
          const updatedCoins = response.data.map((coinData, index) => ({
            ...coinData,
            allocation: crypto[index].allocation,
            allocatedValue: crypto[index].allocatedValue,
          }));
          console.log(updatedCoins);

          setCoins(updatedCoins);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isConfirmed]);


  return (
    <div className={styles["container"]}>
      <div className={styles["inner-container"]}>
        <h1 className={styles.title}>Token Holdings</h1>
        <Routes>
          <Route path='/' element={<Coins coins={coins} />} />
        </Routes>
      </div>
    </div>
  );
}

export default CryptoPrices;
