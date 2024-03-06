// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./Portfolio.sol";

contract PortfolioFactoryEngine {

    error PortfolioFactoryEngine__NoPortfolioFound();

    mapping(address user => address portfolio) private userToPortfolio;

    function createPortfolio(
        string memory _portfolioName,
        uint _portfolioValue,
        string[] memory _symbols,
        uint[] memory _allocations
    ) public returns (address) {
        Portfolio newPortfolio = new Portfolio(_portfolioName, _portfolioValue, _symbols, _allocations, msg.sender);
        userToPortfolio[msg.sender] = address(newPortfolio);
        return address(newPortfolio);
    }

    function getUserPortfolioAddress() public view returns (address) {
        return userToPortfolio[msg.sender];
    }

    function getUserPortfolioAssets() public view returns (string memory, uint, Portfolio.Asset[] memory) {
        if(userToPortfolio[msg.sender]==address(0)){
            revert PortfolioFactoryEngine__NoPortfolioFound();
        }
        Portfolio portfolioContract = Portfolio(userToPortfolio[msg.sender]);
        (string memory portfolioName, uint portfolioValue, Portfolio.Asset[] memory assets) = portfolioContract.getPortfolioDetails();
        return (portfolioName, portfolioValue, assets);
    }

    function hasPortfolio() public view returns (bool) {
        return userToPortfolio[msg.sender] != address(0);
    }


}