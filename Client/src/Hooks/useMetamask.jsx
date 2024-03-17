import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import PortfolioFactoryEngineABI from "../ABI/PortfolioFactoryEngine.sol/PortfolioFactoryEngine.json";
import { ethers } from "ethers";
import { initializeCrypto, updateInitialValue } from "../store/slices/dataSlice";
import { useDispatch } from "react-redux";
import { formatBalance } from "../utils/utils";

const disConnectedState = {
    accounts: "",
    balance: "",
    chainId: ""
}

const initialData = [
    { asset: "BTC", allocation: 25, allocatedValue: 0 },
    { asset: "ETH", allocation: 25, allocatedValue: 0 },
    { asset: "BNB", allocation: 25, allocatedValue: 0 },
    { asset: "USDT", allocation: 25, allocatedValue: 0 },
]

const MetamaskContext = createContext(null);

export const MetamaskContextProvider = ({ children }) => {
    const [hasProvider, setHasProvider] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const clearError = () => setErrorMessage("");
    const [wallet, setWallet] = useState(disConnectedState);
    const [crypto, setCrypto] = useState([]);
    const [name, setName] = useState("");
    const [PortfolioFactoryEngineContract, setPortfolioFactoryEngineContract] = useState(null);
    const [portfolioValue, setPortfolioValue] = useState(100000);
    const [hasPortfolio, setHasPortfolio] = useState(false);
    const dispatch = useDispatch();

    const updateWalletAndAccounts = useCallback(async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length === 0) {
                setWallet(disConnectedState);
                return;
            }

            const balance = formatBalance(await window.ethereum.request({
                method: 'eth_getBalance', params: [accounts[0], "latest"]
            }));

            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== "0xaa36a7") {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }]
                });
            }

            setWallet({ accounts: accounts[0], balance, chainId });
            let PortfolioFactoryEngine = new ethers.Contract(PortfolioFactoryEngineABI.address, PortfolioFactoryEngineABI.abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
            setPortfolioFactoryEngineContract(PortfolioFactoryEngine);
            const hasPortfolioC = await PortfolioFactoryEngine.hasPortfolio();
            setHasPortfolio(hasPortfolioC);

            let updatedCrypto = [];
            let portfolioValue;
            if (hasPortfolioC) {
                const assets = await PortfolioFactoryEngine.getUserPortfolioAssets();
                setPortfolioValue(parseFloat(assets[1]));
                updatedCrypto = assets[2].map((asset) => ({
                    asset: asset[0],
                    allocation: parseFloat(asset[1]),
                    allocatedValue: (parseFloat(asset[1]) / 100) * parseFloat(assets[1])
                }));
                setName(assets[0]);
                portfolioValue = parseFloat(assets[1]);
            } else {
                updatedCrypto = initialData;
                portfolioValue = 100000;
            }
            setCrypto(updatedCrypto);
            dispatch(initializeCrypto(updatedCrypto));
            dispatch(updateInitialValue(portfolioValue));
        } catch (error) {
            console.error("Error updating wallet and accounts:", error);
            setErrorMessage(error.message);
        }
    }, []);


    const connectMetamask = async () => {
        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to Metamask:", accounts[0]);
            clearError();
            updateWalletAndAccounts(accounts);
        } catch (error) {
            console.error("Error connecting Metamask:", error);
            setErrorMessage(error.message);
        } finally {
            setIsConnecting(false);
        }
    }

    useEffect(() => {
        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true });
            setHasProvider(Boolean(provider));
            if (provider) {
                updateWalletAndAccounts();
                window.ethereum.on("accountsChanged", updateWalletAndAccounts);
                window.ethereum.on("chainChanged", updateWalletAndAccounts);
            }
        }
        getProvider();
        return () => {
            window.ethereum?.removeListener("accountsChanged", updateWalletAndAccounts);
            window.ethereum?.removeListener("chainChanged", updateWalletAndAccounts);
        }
    }, [updateWalletAndAccounts]);

    return (
        <MetamaskContext.Provider value={{
            wallet,
            hasProvider,
            error: !!errorMessage,
            errorMessage,
            isConnecting,
            connectMetamask,
            clearError,
            PortfolioFactoryEngineContract,
            crypto,
            setCrypto,
            portfolioValue,
            hasPortfolio,
            setPortfolioValue
        }}>
            {children}
        </MetamaskContext.Provider>
    );
};

export const useMetaMask = () => {
    const context = useContext(MetamaskContext);
    if (!context) {
        throw new Error("useMetaMask must be used within a MetamaskContextProvider");
    }
    return context;
}
