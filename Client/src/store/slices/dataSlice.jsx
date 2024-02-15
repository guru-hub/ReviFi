// dataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
    name: "data",
    initialState: {
        totalValue: 100000,
        currentTotalAllocation: 100,
        crypto: [
            { asset: "BTC", allocation: 25, allocatedValue: 0 },
            { asset: "ETH", allocation: 25, allocatedValue: 0 },
            { asset: "BNB", allocation: 25, allocatedValue: 0 },
            { asset: "USDT", allocation: 25, allocatedValue: 0 },
        ],
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
        addCrypto: (state, action) => {
            const { asset, allocation } = action.payload;
            const totalValue = state.totalValue || 100000;
            const currentTotalAllocation = state.currentTotalAllocation + parseFloat(allocation);
            const allocatedValue = (parseFloat(allocation) / currentTotalAllocation) * totalValue;
            state.currentTotalAllocation = currentTotalAllocation;
            state.crypto.push({ asset, allocation, allocatedValue });
            state.crypto.forEach((crypto) => {
                const allocatedValue = (parseFloat(crypto.allocation) / 100) * totalValue;
                crypto.allocatedValue = allocatedValue;
            });
            if(state.currentTotalAllocation!==100){
                state.isConfirmed=false;
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
            if(state.currentTotalAllocation!==100){
                state.isConfirmed=false;
            }
        },
        editCrypto: (state, action) => {
            const { asset, allocation } = action.payload;
            const index = state.crypto.findIndex((crypto) => crypto.asset === asset);

            if (index !== -1) {
                const totalValue = state.totalValue || 100000;
                const currentTotalAllocation = state.currentTotalAllocation + (parseFloat(allocation) - parseFloat(state.crypto[index].allocation));
                const allocatedValue = (parseFloat(allocation) / currentTotalAllocation) * totalValue;
                state.currentTotalAllocation = currentTotalAllocation;
                state.crypto[index] = { asset, allocation, allocatedValue };
                state.crypto.forEach((crypto) => {
                    const allocatedValue = (parseFloat(crypto.allocation) / 100) * totalValue;
                    crypto.allocatedValue = allocatedValue;
                });
                if(state.currentTotalAllocation!==100){
                    state.isConfirmed=false;
                }
            }
        },
        updateIsConfirm: (state, action) => {
            state.isConfirmed = action.payload;
        },
    },
});

export const { addCrypto, removeCrypto, editCrypto, updateInitialValue, updateIsConfirm} = dataSlice.actions;
export default dataSlice.reducer;
