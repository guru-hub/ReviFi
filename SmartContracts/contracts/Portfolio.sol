// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


/**
 * @title Portfolio Contract
 * @author ReviFi
 */
contract Portfolio {

    error Portfolio__OnlyOwnerAllowed();
    error Portfolio__SymbolLengthAndAllocationLengthMismatch();

    struct Asset {
        string symbol;
        uint allocation;
    }

    Asset[] public assets;
    uint public portfolioValue;
    address public owner;
    string public portfolioName;

    /**
     * @dev Constructor to create a new portfolio
     * @param _portfolioName Name of the portfolio
     * @param _portfolioValue Value of the portfolio
     * @param _symbols Symbols of the CryptoCurrencies i.e BTC, ETH, etc
     * @param _allocations Allocation of the CryptoCurrencies in the portfolio
     */
    constructor(
        string memory _portfolioName,
        uint _portfolioValue,
        string[] memory _symbols,
        uint[] memory _allocations,
        address _owner
    ) {
        owner = _owner;
        portfolioName = _portfolioName;
        portfolioValue = _portfolioValue;
        for (uint i = 0; i < _symbols.length; i++) {
            assets.push(Asset(_symbols[i], _allocations[i]));
        }
    }

    /**
     * @dev Modifier to check if the caller is the owner of the contract
     */
    modifier onlyOwner(address _owner) {
        if(_owner != owner) {
            revert Portfolio__OnlyOwnerAllowed();
        }
        _;
    }

    /**
     * @dev Function to add multiple assets to the portfolio
     * @param _symbols Symbols of the CryptoCurrencies i.e BTC, ETH, etc
     * @param _allocations Allocations of the CryptoCurrencies in the portfolio
     */
    function updateAssets(
        string[] memory _symbols,
        uint[] memory _allocations,
        address _owner
    ) external onlyOwner(_owner) {
        if(_symbols.length != _allocations.length) {
            revert Portfolio__SymbolLengthAndAllocationLengthMismatch();
        }
        delete assets;
        for (uint i = 0; i < _symbols.length; i++) {
            assets.push(Asset(_symbols[i], _allocations[i]));
        }
    }

    /**
     * @dev Function to update the value of the portfolio
     * @param _portfolioValue New value of the portfolio
     * @param _owner The owner of the portfolio
     */
    function updatePortfolioValue(uint _portfolioValue, address _owner) external onlyOwner(_owner) {
        portfolioValue = _portfolioValue;
    }

    /**
     * @dev Function to update the name of the portfolio
     * @param _newName New name of the portfolio
     */
    function updatePortfolioName(string memory _newName, address _owner) external onlyOwner(_owner) {
        portfolioName = _newName;
    }

    /**
     * @dev Function to get the details of the portfolio
     * @return (Portfolio Name, Initial Portfolio Value, Assets)
     */
    function getPortfolioDetails()
        external
        view
        returns (string memory, uint, Asset[] memory)
    {
        return (portfolioName, portfolioValue, assets);
    }
}
