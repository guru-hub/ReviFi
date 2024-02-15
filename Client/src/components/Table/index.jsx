import React, { useState, useEffect, useRef } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { removeCrypto, editCrypto, updateInitialValue } from "../../store/slices/dataSlice";
import styles from "./styles.module.css";
import BTCLogo from "../../assets/images/bitcoin-btc-logo.png";
import ETHLogo from "../../assets/images/ethereum-eth-logo.png";
import BNBLogo from "../../assets/images/bnb-bnb-logo.png";
import USDTLogo from "../../assets/images/tether-usdt-logo.png";
import SOLLogo from "../../assets/images/solana-sol-logo.png";
import LTCLogo from "../../assets/images/litecoin-ltc-logo.png";
import XRPLogo from "../../assets/images/xrp-xrp-logo.png";
import TRXLogo from "../../assets/images/tron-trx-logo.png";
import ADALogo from "../../assets/images/cardano-ada-logo.png";
import DOTLogo from "../../assets/images/polkadot-new-dot-logo.png";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Table = ({ rows, editRow, totalValue, setModalOpenFunc, onConfirm }) => {
  const dispatch = useDispatch();
  const currentTotalAllocation = useSelector((state) => state.data.currentTotalAllocation);
  const cryptoData = useSelector((state) => state.data.crypto);
  const handleDeleteRow = (asset) => {
    dispatch(removeCrypto(asset));
  };

  const SymbolLogo = {
    "BTC": <img src={BTCLogo} height={30} width={30}></img>,
    "ETH": <img src={ETHLogo} height={30} width={30}></img>,
    "BNB": <img src={BNBLogo} height={30} width={30}></img>,
    "USDT": <img src={USDTLogo} height={30} width={30}></img>,
    "SOL": <img src={SOLLogo} height={30} width={30}></img>,
    "LTC": <img src={LTCLogo} height={30} width={30}></img>,
    "XRP": <img src={XRPLogo} height={30} width={30}></img>,
    "TRX": <img src={TRXLogo} height={30} width={30}></img>,
    "ADA": <img src={ADALogo} height={30} width={30}></img>,
    "DOT": <img src={DOTLogo} height={30} width={30}></img>,
  }

  const [editingRow, setEditingRow] = useState(null);
  const [editAllocationValue, setEditAllocationValue] = useState(0);
  const [newAllocation, setNewAllocation] = useState(editAllocationValue);
  const [editingTotalBalance, setEditingTotalBalance] = useState(false);
  const [newTotalBalance, setNewTotalBalance] = useState(totalValue);

  const inputRef = useRef(null); // Ref to the input field

  const currentTotalValue = useSelector((state) => state.data.totalValue);

  const handleConfirm = () => {
    rows.forEach((crypto) => {
      const allocatedValue = (parseFloat(crypto.allocation) / 100) * totalValue;
      dispatch(editCrypto({ ...crypto, allocatedValue }));
    });
  };

  useEffect(() => {
    handleConfirm();
  }, []);

  const handleEditClick = (asset, allocationValue) => {
    setEditingRow(asset);
    setNewAllocation(allocationValue);
    setEditAllocationValue(allocationValue);
    console.log("Hello Working?");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAllocationChange = (e, asset) => {
    const newAllocation = e.target.value;
    setNewAllocation(newAllocation);
  };

  const handleAllocationBlur = (e, asset) => {
    const newAllocation = parseFloat(e.target.value);
    var oldAllocation = 0;
    const totalAllocationExceptCurrent = cryptoData.reduce((acc, crypto) => {
      if (crypto.asset !== asset) {
        return acc + parseFloat(crypto.allocation);
      }
      else {
        oldAllocation = parseFloat(crypto.allocation);
      }
      return acc;
    }, 0);
    const totalAllocation = totalAllocationExceptCurrent + newAllocation;

    if (totalAllocation <= 100) {
      setEditingRow(null);
      dispatch(editCrypto({ asset, allocation: newAllocation }));
    } else {
      setNewAllocation(oldAllocation);
      toast("Total allocation cannot exceed 100%");
    }
    setEditingTotalBalance(false);
  };

  const handleTotalBalanceClick = () => {
    setEditingTotalBalance(true);
  };

  const handleTotalBalanceChange = (e) => {
    setNewTotalBalance(e.target.value);
  };

  const handleTotalBalanceBlur = () => {
    // Remove currency formatting (e.g., $) and commas from the new total balance
    const formattedTotalBalanceWithoutCurrency = newTotalBalance.replace(/[$,]/g, '');

    // Convert the formatted balance to a number
    const newTotalBalanceAsNumber = parseFloat(formattedTotalBalanceWithoutCurrency);

    // Check if the conversion was successful (not NaN)
    if (!isNaN(newTotalBalanceAsNumber)) {
      setEditingTotalBalance(false);
      dispatch(updateInitialValue(newTotalBalanceAsNumber));
    } else {
      // Handle the case where the input couldn't be converted to a number (NaN)
      console.error("Invalid total balance input");
      // Optionally, you could provide feedback to the user here
    }

  };

  return (
    <div style={{ minWidth: '470px' }} >
      <div className={`${styles["btn"]} flex-col items-center my-5 font-sans`} >
        <div className="text-center">
          Total Balance:
        </div>
        <div className="text-center text-4xl color-black" onClick={handleTotalBalanceClick}>
          {editingTotalBalance ? (
            <input
              type="text"
              value={newTotalBalance}
              onChange={handleTotalBalanceChange}
              onBlur={handleTotalBalanceBlur}
              style={{ color: "black" }}
            />
          ) : (
            `$${currentTotalValue.toLocaleString()}`
          )}
        </div>
      </div>
      <table className="shadow-[inset_0_0_4px_rgba(0,0,0,0.15)] rounded-xl w-full bg-white">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Allocation</th>
            <th>Allocated Value</th>
          </tr>
        </thead>
        <tbody style={{ color: "black" }}>
          {rows.map((row) => (
            <React.Fragment key={row.asset}>
              <tr>
                <td className="flex justify-evenly" >
                  <div>
                    {SymbolLogo[row.asset]}
                  </div>
                  <span>{row.asset}</span>
                </td>
                <td>
                  {editingRow === row.asset ? (
                    <input
                      ref={inputRef}
                      value={newAllocation}
                      onChange={(e) => handleAllocationChange(e, row.asset)}
                      onBlur={(e) => handleAllocationBlur(e, row.asset)}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }} className="cursor-pointer" onClick={() => handleEditClick(row.asset, row.allocation)}>{row.allocation}%</div>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>${row.allocatedValue}</td>
                <td>
                  <span style={{ color: "red", display: 'flex', justifyContent: 'center' }} className="cursor-pointer">
                    <BsFillTrashFill onClick={() => handleDeleteRow(row.asset)} />
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="0" style={{ textAlign: 'center' }} >
              <strong>Total Allocation:</strong>
            </td>
            <td style={{ textAlign: 'center' }}>{currentTotalAllocation}%</td>
            <td>
              <button className="font-sans font-bold text-black p-1 rounded-md w-full" style={{ border: '2px solid #0047aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={setModalOpenFunc}>
                <div>
                  <AddIcon fontSize="small" />
                </div>
                <div> Add Asset </div>
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      <div>
        <button className="font-sans font-bold text-black p-1 rounded-md mt-4 w-full mb-12 bg-white" style={{ border: '2px solid #0047aa' }} onClick={onConfirm}>
          Confirm Allocation
        </button>
      </div>
    </div>
  );
};
