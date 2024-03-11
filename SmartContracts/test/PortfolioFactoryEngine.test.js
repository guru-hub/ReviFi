const { expect } = require("chai");
const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("PortfolioFactoryEngine", function () {
  let PortfolioFactoryEngine;
  let portfolioFactory;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    PortfolioFactoryEngine = await ethers.getContractFactory(
      "PortfolioFactoryEngine"
    );
    portfolioFactory = await PortfolioFactoryEngine.deploy();
  });

  it("Should create a new portfolio", async function () {
    const portfolioName = "Test Portfolio";
    const portfolioValue = 1000;
    const symbols = ["BTC", "ETH"];
    const allocations = [50, 50];

    await portfolioFactory.createPortfolio(
      portfolioName,
      portfolioValue,
      symbols,
      allocations
    );
    const userPortfolio = await portfolioFactory.getUserPortfolioAddress();

    expect(userPortfolio).to.not.equal("0x");
  });

  it("Should update portfolio assets", async function () {
    const portfolioName = "Test Portfolio";
    const portfolioValue = 1000;
    const symbols = ["BTC", "ETH"];
    const allocations = [50, 50];

    await portfolioFactory.createPortfolio(
      portfolioName,
      portfolioValue,
      symbols,
      allocations
    );
    await portfolioFactory.updatePortfolio(
      ["BTC", "ETH"],
      [60, 40],
      "New Portfolio Name",
      2000
    );

    const userPortfolio = await portfolioFactory.getUserPortfolioAddress();
    const [, updatedPortfolioValue, updatedAssets] =
      await portfolioFactory.getUserPortfolioAssets();

    expect(updatedPortfolioValue).to.equal(2000); // Portfolio value updated
    expect(updatedAssets[0].allocation).to.equal(60); // BTC allocation updated
    expect(updatedAssets[1].allocation).to.equal(40); // ETH allocation updated
  });

  it("Should get number of transactions", async () => {
    const [owner, addr1] = await ethers.getSigners();

    // Create a new portfolio
    await portfolioFactory.createPortfolio(
      "Test Portfolio",
      1000,
      ["BTC", "ETH"],
      [50, 50]
    );

    // Update portfolio assets
    await portfolioFactory.updatePortfolio(
      ["BTC", "ETH"],
      [60, 40],
      "Updated Portfolio",
      2000
    );

    // Get the number of transactions
    const noOfTransactions = await portfolioFactory.getNoOfTransactions();

    assert.equal(noOfTransactions, 2, "Incorrect number of transactions");
  });

  it("Should check if user has portfolio", async function () {
    const hasPortfolioBefore = await portfolioFactory.hasPortfolio();
    expect(hasPortfolioBefore).to.equal(false);

    // Create a portfolio for the user
    const portfolioName = "Test Portfolio";
    const portfolioValue = 1000;
    const symbols = ["BTC", "ETH"];
    const allocations = [50, 50];

    await portfolioFactory.createPortfolio(
      portfolioName,
      portfolioValue,
      symbols,
      allocations
    );

    const hasPortfolioAfter = await portfolioFactory.hasPortfolio();
    expect(hasPortfolioAfter).to.equal(true);
  });
});
