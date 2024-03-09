// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


// /**
//  * @title Portfolio Contract
//  * @author ReviFi
//  */
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

    // /**
    //  * @dev Constructor to create a new portfolio
    //  * @param _portfolioName 
    //  * @param _portfolioValue 
    //  * @param _symbols 
    //  * @param _allocations 
    //  */
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

    // /**
    //  * @dev Modifier to check if the caller is the owner of the contract
    //  */
    modifier onlyOwner(address _owner) {
        if(_owner != owner) {
            revert Portfolio__OnlyOwnerAllowed();
        }
        _;
    }

    // /**
    //  * @dev Function to add multiple assets to the portfolio
    //  * @param _symbols 
    //  * @param _allocations 
    //  */
    function updateAssets(
        string[] memory _symbols,
        uint[] memory _allocations,
        address _owner
    ) public onlyOwner(_owner) {
        if(_symbols.length != _allocations.length) {
            revert Portfolio__SymbolLengthAndAllocationLengthMismatch();
        }
        delete assets;
        for (uint i = 0; i < _symbols.length; i++) {
            assets.push(Asset(_symbols[i], _allocations[i]));
        }
    }

    // /**
    //  * @dev Function to update the name of the portfolio
    //  * @param _newName
    //  */
    function updatePortfolioName(string memory _newName, address _owner) public onlyOwner(_owner) {
        portfolioName = _newName;
    }

    // /**
    //  * @dev Function to get the details of the portfolio
    //  * @return (Portfolio Name, Initial Portfolio Value, Assets)
    //  */
    function getPortfolioDetails()
        public
        view
        returns (string memory, uint, Asset[] memory)
    {
        return (portfolioName, portfolioValue, assets);
    }
}
