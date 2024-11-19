// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.12;

contract Transactions {
    uint256 transactionCount;
    
    // Mapping to store user balances
    mapping(address => uint256) public balances;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
    }

    TransferStruct[] transactions;

    // Function to add a transaction and transfer tokens
    function addToBlockchain(address payable receiver, uint amount, string memory message) public {
        require(balances[msg.sender] >= amount, "Insufficient balance"); // Ensure sender has enough balance

        // Update balances
        balances[msg.sender] -= amount;
        balances[receiver] += amount;

        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp));

        // Emit event for the transaction
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp);
    }

    // Function to get all transactions
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    // Function to get the transaction count
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    // Function to set an initial balance for a user (could be used for testing)
    function setBalance(address user, uint256 amount) public {
        balances[user] = amount;
    }

    // Function to check the balance of an address
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
