import {
    useState,
    useEffect,
    createContext,
    useContext,
    useCallback,
} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import PortfolioFactoryEngineABI from "../abi/PortfolioFactoryEngine.sol/PortfolioFactoryEngine.json";
import { ethers } from "ethers";

const disConnectedState = {
    accounts: "",
    balance: "",
    chainId: ""
}

import { formatBalance } from "../utils/utils";

const MetamaskContext = createContext(null);

export const MetamaskContextProvider = ({ children }) => {
    const [hasProvider, setHasProvider] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const clearError = () => setErrorMessage("");
    const [wallet, setWallet] = useState(disConnectedState);
    const [PortfolioFactoryEngineContract, setPortfolioFactoryEngineContract] = useState(null);

    const _updateWallet = useCallback(async (providedAccounts) => {
        const accounts = providedAccounts || await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
            setWallet(disConnectedState);
            return;
        }
        const balance = formatBalance(await window.ethereum.request({
            method: 'eth_getBalance', params: [accounts[0], "latest"]
        }));
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        // Make sure that User is on Sepolia Network
        console.log(chainId);
        if (chainId != "0xaa36a7") {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }]
            });
        }
        setWallet({ accounts: accounts[0], balance, chainId });
        setPortfolioFactoryEngineContract(new ethers.Contract(PortfolioFactoryEngineABI.address, PortfolioFactoryEngineABI.abi, new ethers.providers.Web3Provider(window.ethereum).getSigner()));
    }, [])

    const updateWalletAndAccounts = useCallback(
        () => {
            _updateWallet();
        },
        [_updateWallet]
    );

    const updateWallet = useCallback(
        (accounts) => _updateWallet(accounts),
        [_updateWallet]
    )

    useEffect(() => {
        console.log("Detecting Metamask Provider");
        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true });
            setHasProvider(Boolean(provider));
            if (provider) {
                updateWalletAndAccounts();
                window.ethereum.on("accountsChanged", updateWallet);
                window.ethereum.on("chainChanged", updateWalletAndAccounts);
            }
        }
        getProvider();
        return () => {
            window.ethereum?.removeListener("accountsChanged", updateWallet);
            window.ethereum?.removeListener("chainChanged", updateWalletAndAccounts);
        }
    }, [updateWallet, updateWalletAndAccounts]);

    const connectMetamask = async () => {
        setIsConnecting(true);

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            clearError();
            updateWallet(accounts);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <MetamaskContext.Provider value={{
            wallet,
            hasProvider,
            error: !!errorMessage,
            errorMessage,
            isConnecting,
            connectMetamask,
            clearError,
            PortfolioFactoryEngineContract
        }}>
            {children}
        </MetamaskContext.Provider>
    );
};

export const useMetaMask = () => {
    const context = useContext(MetamaskContext);
    if (!context) {
        throw new Error("useMetamask must be used within a MetamaskContextProvider");
    }
    return context;
}