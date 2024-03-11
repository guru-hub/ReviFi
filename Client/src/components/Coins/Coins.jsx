import React from 'react';
import styles from "./styles.module.css";
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tableCellClasses } from "@mui/material/TableCell";
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import {useMetaMask} from "../../Hooks/useMetamask";

const Coins = (props) => {
    const { hasPortfolio } = useMetaMask();
    return (
        <div className={styles["container"]} style={{ boxShadow: 'none', border: 'none', position: "relative" }}>
            <TableContainer component={Paper} style={{ boxShadow: 'none', border: 'none' }} className={`${!hasPortfolio ? 'blur-sm' : 'blur-none'}`}>
                <Table sx={{ minWidth: 650, backgroundColor: '#F6F6F6', boxShadow: 'none', border: 'none', minHeight: '36vh' }} aria-label="simple table">
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
                                <TableCell align="right">${row.current_price.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}</TableCell>
                                <TableCell align="right">{row.price_change_percentage_7d_in_currency.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}%</TableCell>
                                <TableCell align="right">{row.price_change_percentage_30d_in_currency.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}%</TableCell>
                                <TableCell align="right">{((row.allocatedValue) / row.current_price).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}</TableCell>
                                <TableCell align="right">${(parseFloat(row.allocatedValue).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }))}</TableCell>
                                <TableCell align="right">{(row.allocation).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {!hasPortfolio && !props.loading && (
                <Alert severity="info" style={{ top: "50%", left: "50%", position: 'absolute', transform: "translate(-50%, -50%)" }}>
                    <p className="font-bold text-[15px] font-serif">
                        Please click on confirm allocation to access Analysis
                    </p>
                </Alert>
            )}
        </div>
    )
}

export default Coins;
