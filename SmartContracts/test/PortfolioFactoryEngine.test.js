const { expect } = require("chai");

describe("PortfolioFactoryEngine", function () {
  let PortfolioFactoryEngine;
  let Portfolio;
  let portfolioFactory;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    PortfolioFactoryEngine = await ethers.getContractFactory("PortfolioFactoryEngine");
    Portfolio = await ethers.getContractFactory("Portfolio");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    portfolioFactory = await PortfolioFactoryEngine.deploy();
  });

  it("Should create a new portfolio", async function () {
    const portfolioName = "My Portfolio";
    const portfolioValue = 1000;
    const symbols = ["BTC", "ETH"];
    const allocations = [50, 50];

    await portfolioFactory.createPortfolio(portfolioName, portfolioValue, symbols, allocations);

    const userPortfolioAddress = await portfolioFactory.getUserPortfolioAddress();
    expect(userPortfolioAddress).to.not.equal("0x0000000000000000000000000000000000000000");

    const portfolioContract = await Portfolio.attach(userPortfolioAddress);
    const [name, value, assets] = await portfolioContract.getPortfolioDetails();

    expect(name).to.equal(portfolioName);
    expect(value).to.equal(portfolioValue);
    expect(assets.length).to.equal(symbols.length);

    for (let i = 0; i < symbols.length; i++) {
      expect(assets[i].symbol).to.equal(symbols[i]);
      expect(assets[i].allocation).to.equal(allocations[i]);
    }
  });

  it("Should update portfolio assets", async function () {
    const portfolioName = "My Portfolio";
    const portfolioValue = 1000;
    const symbols = ["BTC", "ETH"];
    const initialAllocations = [50, 50];
    const updatedAllocations = [60, 40];

    await portfolioFactory.createPortfolio(portfolioName, portfolioValue, symbols, initialAllocations);

    await portfolioFactory.updatePortfolio(["AAPL", "GOOGL"], updatedAllocations);

    const userPortfolioAddress = await portfolioFactory.getUserPortfolioAddress();
    const portfolioContract = await Portfolio.attach(userPortfolioAddress);
    const [, , assets] = await portfolioContract.getPortfolioDetails();

    for (let i = 0; i < symbols.length; i++) {
      expect(assets[i].allocation).to.equal(updatedAllocations[i]);
    }
  });

  it("Should update portfolio name", async function () {
    const initialPortfolioName = "My Portfolio";
    const newPortfolioName = "New Portfolio Name";
    const portfolioValue = 1000;
    const symbols = ["AAPL", "GOOGL"];
    const allocations = [50, 50];

    await portfolioFactory.createPortfolio(initialPortfolioName, portfolioValue, symbols, allocations);

    await portfolioFactory.updatePortfolioName(newPortfolioName);

    const userPortfolioAddress = await portfolioFactory.getUserPortfolioAddress();
    const portfolioContract = await Portfolio.attach(userPortfolioAddress);
    const [name, ,] = await portfolioContract.getPortfolioDetails();

    expect(name).to.equal(newPortfolioName);
  });

  it("Should check if user has a portfolio", async function () {
    const portfolioName = "My Portfolio";
    const portfolioValue = 1000;
    const symbols = ["AAPL", "GOOGL"];
    const allocations = [50, 50];

    expect(await portfolioFactory.hasPortfolio()).to.be.false;

    await portfolioFactory.createPortfolio(portfolioName, portfolioValue, symbols, allocations);

    expect(await portfolioFactory.hasPortfolio()).to.be.true;
  });
});
