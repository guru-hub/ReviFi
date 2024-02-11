import React from 'react'
import CoinItem from '../CoinItem/index'
import styles from "./styles.module.css"
import { Link } from 'react-router-dom'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tableCellClasses } from "@mui/material/TableCell";

const Coins = (props) => {
    return (
        <div className={styles["container"]}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, backgroundColor: '#F6F6F6' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Change 7D</TableCell>
                            <TableCell align="right">Change 30D</TableCell>
                            <TableCell align="right">Balance</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell align="right">Allocation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none"
                        }
                    }} >
                        {props.coins.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} >
                                    <img style={{ width: '40px', height: '40px' }} src={row.image} alt='' />
                                    <div>
                                        {row.name}
                                    </div>
                                </TableCell>
                                <TableCell align="right">${row.current_price.toLocaleString()}</TableCell>
                                <TableCell align="right">{row.price_change_percentage_7d_in_currency.toFixed(2)}%</TableCell>
                                <TableCell align="right">{row.price_change_percentage_30d_in_currency.toFixed(2)}%</TableCell>
                                <TableCell align="right">{((row.allocatedValue) / row.current_price).toFixed(2)}</TableCell>
                                <TableCell align="right">${(row.allocatedValue).toFixed(2)}</TableCell>
                                <TableCell align="right">{row.allocation}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Coins
