// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Portfolio.sol";

// /**
//  * @title PortfolioFactoryEngine
//  * @author ReviFi
//  * @notice This is the factory contract to create a new portfolio for the users
//  */
contract PortfolioFactoryEngine {

    event NewPortfolioCreated(address portfolioAddress);
    event AssetsUpdated(string[] symbol, uint[] allocation);
    event PortfolioNameUpdated(string newName);
    event PortfolioValueUpdated(uint newValue);


    error PortfolioFactoryEngine__NoPortfolioFound();

    mapping(address user => address portfolio) private userToPortfolio;
    mapping(address user => uint256 noOfTransactions) private userToNoOfTransactions;

    constructor() {}

    // /**
    //  * @dev Function to create a new portfolio for the users
    //  * @param _portfolioName
    //  * @param _portfolioValue 
    //  * @param _symbols 
    //  * @param _allocations 
    //  * @return New portfolio address
    //  */
    function createPortfolio(
        string memory _portfolioName,
        uint _portfolioValue,
        string[] memory _symbols,
        uint[] memory _allocations
    ) public returns (address) {
        Portfolio newPortfolio = new Portfolio(_portfolioName, _portfolioValue, _symbols, _allocations, msg.sender);
        userToPortfolio[msg.sender] = address(newPortfolio);
        emit NewPortfolioCreated(address(newPortfolio));
        return address(newPortfolio);
    }


    // /**
    //  * @dev Function to update the portfolio Assets
    //  * @param _symbols 
    //  * @param _allocations 
    //  */
    function updatePortfolio(
        string[] memory _symbols,
        uint[] memory _allocations
        ) external {
        if(userToPortfolio[msg.sender]==address(0)){
            revert PortfolioFactoryEngine__NoPortfolioFound();
        }
        Portfolio portfolioContract = Portfolio(userToPortfolio[msg.sender]);
        portfolioContract.updateAssets(_symbols, _allocations, msg.sender);
        emit AssetsUpdated(_symbols, _allocations);
    }

    // /**
    //  * @dev Function to update the portfolio Name
    //  * @param _newName 
    //  */
    function updatePortfolioName(string memory _newName) external {
        if(userToPortfolio[msg.sender]==address(0)){
            revert PortfolioFactoryEngine__NoPortfolioFound();
        }
        Portfolio portfolioContract = Portfolio(userToPortfolio[msg.sender]);
        portfolioContract.updatePortfolioName(_newName, msg.sender);
        emit PortfolioNameUpdated(_newName);
    }

    // /**
    //  * @dev Function to get the portfolio address of the user
    //  * @return Portfolio address of the user calling the function
    //  */
    function getUserPortfolioAddress() public view returns (address) {
        return userToPortfolio[msg.sender];
    }

    // /**
    //  * @dev Function to get the portfolio details of the user calling the function
    //  * @return Name of the Portfolio
    //  * @return Portfolio Value
    //  * @return Assets in the Portfolio
    //  */
    function getUserPortfolioAssets() public view returns (string memory, uint, Portfolio.Asset[] memory) {
        if(userToPortfolio[msg.sender]==address(0)){
            revert PortfolioFactoryEngine__NoPortfolioFound();
        }
        Portfolio portfolioContract = Portfolio(userToPortfolio[msg.sender]);
        (string memory portfolioName, uint portfolioValue, Portfolio.Asset[] memory assets) = portfolioContract.getPortfolioDetails();
        return (portfolioName, portfolioValue, assets);
    }

    // /**
    //  * @dev Function to check if the user has a portfolio
    //  * @return true if the user has a portfolio else false
    //  */
    function hasPortfolio() public view returns (bool) {
        return userToPortfolio[msg.sender] != address(0);
    }
}