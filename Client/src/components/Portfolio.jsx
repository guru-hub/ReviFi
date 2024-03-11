import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCrypto, editCrypto, updateIsConfirm } from "../store/slices/dataSlice";
import { Table } from "./Table";
import { Modal } from "./Modal/Modal";
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import { useMetaMask } from "../Hooks/useMetamask";
const Portfolio = () => {
  const dispatch = useDispatch();
  const { PortfolioFactoryEngineContract } = useMetaMask();
  const cryptoData = useSelector((state) => state.data.crypto);
  let isConfirmed = useSelector((state) => state.data.isConfirmed);
  const totalValue = useSelector((state) => state.data.totalValue);

  const [modalOpen, setModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);

  useEffect(() => {
    const totalAllocation = cryptoData ? cryptoData?.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0) : 0;
    if (totalAllocation === 100 && isConfirmed == true) {
      console.log("Total Allocation is 100%, update PieChart with:", cryptoData);
      dispatch(updateIsConfirm(true));
    } else if (totalAllocation > 100) {
      toast("Total allocation cannot exceed 100%.")
      dispatch(updateIsConfirm(false));
    } else {
      dispatch(updateIsConfirm(false));
    }
  }, []);

  const createPortfolio = async (totalValue, symbols, allocations) => {
    const loadingToastId = toast.loading("Please wait while we create your portfolio", { position: "top-center" });
    try {
      const tx = await PortfolioFactoryEngineContract.createPortfolio("My Portfolio", totalValue, symbols, allocations);
      await tx.wait();
      toast.update(loadingToastId, {
        render: "Your portfolio has been created successfully!",
        type: "success",
        position: "top-right",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Transaction cancelled. Portfolio creation failed.");
    }
  }

  const updatePortfolio = async (symbols, allocations) => {
    const loadingToastId = toast.loading("Please wait while we update your portfolio", { position: "top-center" });
    try {
      const tx = await PortfolioFactoryEngineContract.updatePortfolio(symbols, allocations);
      await tx.wait();
      
      toast.update(loadingToastId, {
        render: "Your portfolio has been updated successfully!",
        type: "success",
        position: "top-right",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Transaction cancelled. Portfolio update failed.");
    }
  }

  const onConfirm = async () => {
    const hasPortfolio = await PortfolioFactoryEngineContract.hasPortfolio();
    const totalAllocation = cryptoData.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);
    console.log(hasPortfolio);
    let symbols = cryptoData.map((crypto) => crypto.asset);
    let allocations = cryptoData.map((crypto) => +crypto.allocation);
    console.log(symbols, allocations);
    if (totalAllocation === 100) {
      hasPortfolio ? updatePortfolio(symbols, allocations) : createPortfolio(totalValue, symbols, allocations)
      console.log("Total Allocation is 100%, update PieChart with:", cryptoData);
      dispatch(updateIsConfirm(true));
    } else if (totalAllocation > 100) {
      toast("Total allocation cannot exceed 100%.")
      dispatch(updateIsConfirm(false));
    } else {
      toast("Total allocation should be 100%.")
      dispatch(updateIsConfirm(false));
    }
  }

  const remainingAllocation = 100 - cryptoData?.reduce((acc, curr) => acc + parseFloat(curr.allocation), 0);

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
        {remainingAllocation !== 0 && (
          <div className="pb-10" >
            <Alert severity="error">Remaining Allocation: {remainingAllocation.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}%</Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
