import React, { useState } from "react";
import styles from "./styles.module.css";

export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      allocation: "",
      asset: "BTC",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (
      formState.allocation !== undefined &&
      formState.asset !== undefined &&
      formState.allocation !== null &&
      formState.asset !== null
    ) {
      const trimmedAllocation = String(formState.allocation).trim();

      if (trimmedAllocation !== "" && trimmedAllocation !== "0" && formState.asset.trim() !== "") {
        setErrors("");
        return true;
      } else {
        setErrors("Allocation or Asset is missing or allocation cannot be 0");
        return false;
      }
    } else {
      setErrors("Allocation or Asset is missing");
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: (e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formState);

    closeModal();
  };

  return (
    <div className={styles["modal-container"]} onClick={(e) => { if (e.target.className === styles["modal-container"]) closeModal(); }}>
      <div className={styles["modal-content"]}>
        <form className={styles["modal-form"]}>
          <div className={styles["modal-asset"]} >
            <label htmlFor="asset">Asset</label>
            <select
              name="asset"
              onChange={handleChange}
              value={formState.asset}
            >
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="BNB">BNB</option>
              <option value="USDT">USDT</option>
              <option value="LTC">LTC</option>
              <option value="SOL">SOL</option>
              <option value="XRP">XRP</option>
              <option value="TRX">TRX</option>
              <option value="ADA">ADA</option>
              <option value="DOT">DOT</option>
            </select>
          </div>
          <div>
            <label htmlFor="allocation">Allocation %</label>
            <input
              name="allocation"
              className="w-full p-[8px] box-border border-[1px] border-[#ddd] rounded-[5px]"
              onChange={handleChange}
              type="number"
              step={0.01}
              min={0}
              max={100}
              value={formState.allocation}
            />
          </div>
          {errors && <div className={styles["modal-error"]}>{`Please include: ${errors}`}</div>}
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
