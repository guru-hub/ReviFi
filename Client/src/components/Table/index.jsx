import React, { useState, useEffect, useRef } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { removeCrypto, editCrypto, updateInitialValue } from "../../store/slices/dataSlice";
import styles from "./styles.module.css";

export const Table = ({ rows, editRow, totalValue, setModalOpenFunc, onConfirm }) => {
  const dispatch = useDispatch();
  const currentTotalAllocation = useSelector((state) => state.data.currentTotalAllocation);

  const handleDeleteRow = (asset) => {
    dispatch(removeCrypto(asset));
  };

  const [value, setValue] = useState(0);
  const [editingRow, setEditingRow] = useState(null);
  const [editAllocationValue, setEditAllocationValue] = useState(0);
  const [newAllocation, setNewAllocation] = useState(editAllocationValue);

  const inputRef = useRef(null); // Ref to the input field

  const currentTotalValue = useSelector((state) => state.data.totalValue);

  // const handleValueSubmit = () => {
  //   dispatch(updateInitialValue(value));
  // };

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

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAllocationChange = (e, asset) => {
    const newAllocation = e.target.value;
    setNewAllocation(newAllocation);
  };

  const handleAllocationBlur = (e, asset) => {
    setEditingRow(null);
    dispatch(editCrypto({ asset, allocation: newAllocation }));
  };

  return (
    <div>
      <div>
        <h2 className={`text-3xl font-bold ${styles["title"]}`}> Portfolio Allocation </h2>
      </div>
      <div className={`${styles["btn"]} flex-col items-center my-5 font-sans`}>
        <div className="text-center">
          Total Balance:
        </div>
        <div className="text-center text-4xl" >
          ${currentTotalValue}
        </div>
      </div>
      <table className="shadow-[inset_0_0_4px_rgba(0,0,0,0.15)] rounded-xl">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Allocation %</th>
            <th>Allocated Value $</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody style={{ color: "black" }}>
          {rows.map((row) => (
            <React.Fragment key={row.asset}>
              <tr>
                <td>
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
                    <span onClick={() => handleEditClick(row.asset, row.allocation)}>{row.allocation}%</span>
                  )}
                </td>
                <td>${row.allocatedValue}</td>
                <td>
                  <span>
                    <BsFillPencilFill onClick={() => editRow(row.asset)} />
                  </span>
                </td>
                <td>
                  <span style={{ color: "red" }}>
                    <BsFillTrashFill onClick={() => handleDeleteRow(row.asset)} />
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="0">
              <strong>Total Allocation %:</strong>
            </td>
            <td>{currentTotalAllocation}%</td>
            <td>
              <button className="font-sans font-bold bg-gradient-to-r from-[#0047aa] to-[#0085b6] text-white p-1 w-20 rounded-md" onClick={setModalOpenFunc}>Add Asset</button>
            </td>
            <div className="w-1 p-3" >
              <button className="font-sans font-bold bg-gradient-to-r from-[#0047aa] to-[#0085b6] text-white p-1 w-24 rounded-md" onClick={onConfirm}>
                Confirm Balance
              </button>
            </div>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
