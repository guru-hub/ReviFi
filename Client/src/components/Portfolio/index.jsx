import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCrypto, editCrypto, updateIsConfirm } from "../../store/slices/dataSlice";
import { Table } from "../Table/index";
import { Modal } from "../Modal";
import Alert from '@mui/material/Alert';
import styles from "./styles.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Portfolio = () => {
  const dispatch = useDispatch();
  const cryptoData = useSelector((state) => state.data.crypto);
  let isConfirmed = useSelector((state) => state.data.isConfirmed);
  const totalValue = 100000;

  const [modalOpen, setModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);

  useEffect(() => {
    const totalAllocation = cryptoData.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);
    if (totalAllocation === 100 && isConfirmed == true) {
      console.log("Total Allocation is 100%, update PieChart with:", cryptoData);
      dispatch(updateIsConfirm(true));
      console.log("hello");
    } else if (totalAllocation > 100) {
      toast("Total allocation cannot exceed 100%.")
      dispatch(updateIsConfirm(false));
    } else {
      dispatch(updateIsConfirm(false));
    }
  }, []);

  const onConfirm = () => {
    const totalAllocation = cryptoData.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);
    if (totalAllocation === 100) {
      console.log("Total Allocation is 100%, update PieChart with:", cryptoData);
      dispatch(updateIsConfirm(true));
    } else if (totalAllocation > 100) {
      toast("Total allocation cannot exceed 100%.")
      dispatch(updateIsConfirm(false));
    } else {
      dispatch(updateIsConfirm(false));
    }
  }

  const remainingAllocation = 100 - cryptoData.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);

  const handleEditRow = (asset) => {
    const index = cryptoData.findIndex((crypto) => crypto.asset === asset);
    setRowToEdit(index);
    setModalOpen(true);
  };

  const handleShowAlert = (message) => {
    toast(message)
  };

  const handleSubmit = (newRow) => {
    const isDuplicate = cryptoData.some(
      (row, index) => index !== rowToEdit && row.asset === newRow.asset
    );

    if (isDuplicate) {
      handleShowAlert("Duplicate Cryptocurrency is not allowed.");
      return;
    }

    const totalAllocation = cryptoData.reduce(
      (acc, curr, index) =>
        index === rowToEdit ? acc : acc + parseFloat(curr.allocation),
      parseFloat(newRow.allocation)
    );

    if (totalAllocation > 100) {
      handleShowAlert("Total allocation cannot exceed 100%.");
      return;
    }

    if (rowToEdit === null) {
      dispatch(addCrypto(newRow));
    } else {
      dispatch(editCrypto(newRow));
    }

    setModalOpen(false);
    setRowToEdit(null);
  };

  const setModalOpenFunc = () => {
    setModalOpen(true);
  }

  return (
    <div>
      <Table rows={cryptoData} editRow={handleEditRow} totalValue={totalValue} setModalOpenFunc={setModalOpenFunc} onConfirm={onConfirm} />
      {modalOpen && (
        <Modal
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && cryptoData[rowToEdit]}
        />
      )}
      <div style={{ color: "red", borderRadius: "5px" }}>
        {
          <div>
            <ToastContainer />
          </div>
        }
        {remainingAllocation !== 0 && (
          <div>
            <Alert severity="error">Remaining Allocation: {remainingAllocation}%</Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
