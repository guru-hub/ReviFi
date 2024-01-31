import React from 'react'
import CoinItem from '../CoinItem/index'
import styles from "./styles.module.css"
import { Link } from 'react-router-dom'

const Coins = (props) => {
    return (
        <div className={styles["container"]}>
            <div className={styles["inner-container"]}>
                <p >Asset</p>
                <p>Price</p>
                <p>Change 7D</p>
                <p>Change 30D</p>
                <p>Balance</p>
                <p>Value</p>
                <p>Allocation</p>
            </div>
            <div className={styles["coins"]}>
                {props.coins.map((coins, idx) => {
                    return (
                        <CoinItem key={idx} coins={coins} />
                    )
                })}
            </div>

        </div>
    )
}

export default Coins
