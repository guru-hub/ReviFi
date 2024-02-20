
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Portfolio", function () {
  it("should correctly update the portfolio name", async function () {
    const Portfolio = await ethers.getContractFactory("Portfolio");
    const portfolio = await Portfolio.deploy("Initial Portfolio Name");
    await portfolio.deployed();

    const updateTx = await portfolio.updatePortfolioName("New Portfolio Name");

    // wait until the transaction is mined
    await updateTx.wait();

    expect(await portfolio.portfolioName()).to.equal("New Portfolio Name");
  });

  // Additional tests here
});
