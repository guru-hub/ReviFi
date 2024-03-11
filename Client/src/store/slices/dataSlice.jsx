// dataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
    name: "data",
    initialState: {
        totalValue: 100000,
        currentTotalAllocation: 100,
        crypto: null,
        isConfirmed: false,
    },
    reducers: {
        updateInitialValue: (state, action) => {
            state.totalValue = action.payload;
            state.crypto.forEach((crypto) => {
                const allocatedValue = (parseFloat(crypto.allocation) / 100) * state.totalValue;
                crypto.allocatedValue = allocatedValue;
            });
        },
        initializeCrypto: (state, action) => {
            state.crypto = action.payload;
        },
        addCrypto: (state, action) => {
            let { asset, allocation } = action.payload;
            allocation = parseFloat(allocation).toFixed(2);
            const totalValue = state.totalValue || 100000;
            const currentTotalAllocation = state.currentTotalAllocation + parseFloat(allocation);
            const allocatedValue = (parseFloat(allocation) / currentTotalAllocation) * totalValue;
            state.currentTotalAllocation = currentTotalAllocation;
            state.crypto.push({ asset, allocation, allocatedValue });
            state.crypto.forEach((crypto) => {
                const allocatedValue = ((parseFloat(crypto.allocation) / 100) * totalValue);
                crypto.allocatedValue = allocatedValue.toFixed(2);
                console.log(crypto.allocatedValue);
            });
            if (state.currentTotalAllocation !== 100) {
                state.isConfirmed = false;
            }
        },
        removeCrypto: (state, action) => {
            const removedCrypto = state.crypto.find((crypto) => crypto.asset === action.payload);
            const currentTotalAllocation = state.currentTotalAllocation - parseFloat(removedCrypto.allocation);
            state.currentTotalAllocation = currentTotalAllocation;
            state.crypto = state.crypto.filter((crypto) => crypto.asset !== action.payload);
            state.crypto.forEach((crypto) => {
                const allocatedValue = (parseFloat(crypto.allocation) / 100) * state.totalValue;
                crypto.allocatedValue = allocatedValue;
            });
            if (state.currentTotalAllocation !== 100) {
                state.isConfirmed = false;
            }
        },
        editCrypto: (state, action) => {
            let { asset, allocation } = action.payload;
            allocation = parseFloat(allocation).toFixed(2);
            const index = state.crypto.findIndex((crypto) => crypto.asset === asset);

            if (index !== -1) {
                const totalValue = state.totalValue || 100000;
                const currentTotalAllocation = state.currentTotalAllocation + (parseFloat(allocation) - parseFloat(state.crypto[index].allocation));
                const allocatedValue = (parseFloat(allocation) / currentTotalAllocation) * totalValue;
                state.currentTotalAllocation = currentTotalAllocation;
                state.crypto[index] = { asset, allocation, allocatedValue };
                state.crypto.forEach((crypto) => {
                    const allocatedValue = ((parseFloat(crypto.allocation) / 100) * totalValue).toFixed(2);
                    crypto.allocatedValue = allocatedValue;
                });
                if (state.currentTotalAllocation !== 100) {
                    state.isConfirmed = false;
                }
            }
        },
        updateIsConfirm: (state, action) => {
            state.isConfirmed = action.payload;
        },
    },
});

export const { addCrypto, removeCrypto, editCrypto, updateInitialValue, updateIsConfirm, initializeCrypto } = dataSlice.actions;
export default dataSlice.reducer;
