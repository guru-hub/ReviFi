// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Portfolio.sol";

/**
 * @title PortfolioFactoryEngine
 * @author ReviFi
 * @notice This is the factory contract to create a new portfolio for the users, update the portfolio assets, name and value
 */
contract PortfolioFactoryEngine {

    event NewPortfolioCreated(address portfolioAddress);
    event PortfolioUpdated(string[] symbol, uint[] allocation, uint256 newValue, string newName);

    error PortfolioFactoryEngine__NoPortfolioFound();

    mapping(address user => address portfolio) private userToPortfolio;
    mapping(address user => uint256 noOfTransactions) private userToNoOfTransactions;

    constructor() {}

    /**
     * @dev Function to create a new portfolio for the users
     * @param _portfolioName Name of the portfolio
     * @param _portfolioValue Value of the portfolio
     * @param _symbols Symbols of the CryptoCurrencies i.e BTC, ETH, etc
     * @param _allocations Allocation of the CryptoCurrencies in the portfolio
     * @return Deployed portfolio address
     */
    function createPortfolio(
        string memory _portfolioName,
        uint _portfolioValue,
        string[] memory _symbols,
        uint[] memory _allocations
    ) external returns (address) {
        Portfolio newPortfolio = new Portfolio(_portfolioName, _portfolioValue, _symbols, _allocations, msg.sender);
        userToPortfolio[msg.sender] = address(newPortfolio);
        userToNoOfTransactions[msg.sender] += 1;
        emit NewPortfolioCreated(address(newPortfolio));
        return address(newPortfolio);
    }

    /**
     * @dev Function to update the portfolio Assets, Name and Value
     * @param _symbols Symbols of the CryptoCurrencies i.e BTC, ETH, etc
     * @param _allocations Allocation of the CryptoCurrencies in the portfolio
     * @param _newName New name of the portfolio
     * @param _newValue New value of the portfolio
     */
    function updatePortfolio(
        string[] memory _symbols,
        uint[] memory _allocations,
        string memory _newName,
        uint256 _newValue
        ) external {
        if(userToPortfolio[msg.sender]==address(0)){
            revert PortfolioFactoryEngine__NoPortfolioFound();
        }
        Portfolio portfolioContract = Portfolio(userToPortfolio[msg.sender]);
        portfolioContract.updateAssets(_symbols, _allocations, _newValue, _newName, msg.sender);
        userToNoOfTransactions[msg.sender] += 1;
        emit PortfolioUpdated(_symbols, _allocations, _newValue, _newName);
    }

    /**
     * @dev Function to get the portfolio address of the user
     * @return Portfolio address of the user calling the function
     */
    function getUserPortfolioAddress() external view returns (address) {
        return userToPortfolio[msg.sender];
    }

    /**
     * @dev Function to get the portfolio details of the user calling the function
     * @return Name of the Portfolio
     * @return Portfolio Value
     * @return Assets in the Portfolio
     */
    function getUserPortfolioAssets() external view returns (string memory, uint, Portfolio.Asset[] memory) {
        if(userToPortfolio[msg.sender]==address(0)){
            revert PortfolioFactoryEngine__NoPortfolioFound();
        }
        Portfolio portfolioContract = Portfolio(userToPortfolio[msg.sender]);
        (string memory portfolioName, uint portfolioValue, Portfolio.Asset[] memory assets) = portfolioContract.getPortfolioDetails();
        return (portfolioName, portfolioValue, assets);
    }

    /**
     * @dev Function to get the number of transactions done by the user
     * @return Number of transactions done by the user
     */
    function getNoOfTransactions() external view returns (uint256) {
        return userToNoOfTransactions[msg.sender];
    }

    /**
     * @dev Function to check if the user has a portfolio
     * @return true if the user has a portfolio else false
     */
    function hasPortfolio() external view returns (bool) {
        return userToPortfolio[msg.sender] != address(0);
    }
}