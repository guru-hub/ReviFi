// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


contract Portfolio {
    struct Asset {
        string symbol;
        uint allocation; // Allocation in percentage
    }

    Asset[] public assets;
    uint public initialPortfolioValue;
    address public owner;
    string public portfolioName; // Add portfolio name variable

    constructor(string memory _portfolioName, uint  _initialPortfolioValue, string[] memory symbols, uint[] memory allocations) {
        owner = msg.sender;
        portfolioName = _portfolioName; // Initialize portfolio name
        initialPortfolioValue = _initialPortfolioValue; // Example value
        
       for (uint i = 0; i < symbols.length; i++) {
            assets.push(Asset(symbols[i], allocations[i]));
        }
    }

    function addMultipleAssets(string[] memory symbols, uint[] memory allocations) public {
        require(msg.sender == owner, "Only the owner can add assets.");
        require(symbols.length == allocations.length, "Symbols and allocations length must match.");

        for (uint i = 0; i < symbols.length; i++) {
            assets.push(Asset(symbols[i], allocations[i]));
        }
    }

    // Function to update portfolio name
    function updatePortfolioName(string memory _newName) public {
        require(msg.sender == owner, "Only the owner can change the portfolio name.");
        portfolioName = _newName;
    }


    function getPortfolioDetails() public view returns (string memory, uint, Asset[] memory) {
    return (portfolioName, initialPortfolioValue, assets);
}

}
