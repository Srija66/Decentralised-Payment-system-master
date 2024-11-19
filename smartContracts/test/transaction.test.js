const assert = require('assert');
const Transactions = artifacts.require('Transactions');

contract('Transactions', (accounts) => {
  let transactions;

  before(async () => {
    transactions = await Transactions.deployed();
  });

  it('should transfer tokens between accounts', async () => {
    // Example test case
    const balanceBefore = await transactions.balanceOf(accounts[0]);
    await transactions.transfer(accounts[1], 100);
    const balanceAfter = await transactions.balanceOf(accounts[0]);
    assert.equal(balanceBefore - balanceAfter, 100);
  });
});

  