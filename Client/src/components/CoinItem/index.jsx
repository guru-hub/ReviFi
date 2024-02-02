import React from 'react'
import styles from "./styles.module.css"

const CoinItem = (props) => {
    return (
        <div className={`${styles["container"]} rounded-md`}>
            <div className="flex justify-center items-center gap-3" >
                <img style={{ width: '40px', height: '40px' }} src={props.coins.image} alt='' />
                <p>{props.coins.symbol.toUpperCase()}</p>
            </div>
            <p className={styles["text-center"]}>${props.coins.current_price.toLocaleString()}</p>
            <p className={styles["text-center"]}>{props.coins.price_change_percentage_7d_in_currency.toFixed(2)}%</p>
            <p className={styles["text-center"]}>{props.coins.price_change_percentage_30d_in_currency.toFixed(2)}%</p>
            <p className={styles["text-center"]}>{((props.coins.allocatedValue)/props.coins.current_price).toFixed(2)}</p>
            <p className={styles["text-center"]}>${(props.coins.allocatedValue).toFixed(2)}</p>
            <p className={styles["text-center"]}>{(props.coins.allocation)}%</p>
        </div>
    )
}

export default CoinItem
