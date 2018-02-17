pragma solidity ^0.4.18;

import "./Ownable.sol";

/**
 * @title Retailer
 * @dev Contract for a single retailer
 */
contract Retailer is Ownable {

    string public retailerName;
    uint public retailerId;

    uint numTransactions;

    // EVENTS
    event TransactionReceived(uint indexed retailerId, uint transactionId, uint amount, address sender);
    event FourierWithdrawal(uint amount);

    function Retailer(uint _retailerId, string _retailerName) public {
        retailerId = _retailerId;
        retailerName = _retailerName;
    }

    function payRetailer() public payable {
        numTransactions++;
        TransactionReceived(retailerId, numTransactions, msg.value, msg.sender);
    }

    function () public payable {
        payRetailer();
    }

    /**
     * @dev Function for Fourier Solutions to withdraw their funds from the contract
     * @param _amount uint amount that is to be withdrawn
     */
    function fourierWithdraw(uint _amount) onlyOwner external {

        require(_amount > 0);
        require(this.balance >= _amount);

        // If everything is good then transfer the amount ot fourier solutions
        owner.transfer(_amount);

        // Emit the event
        FourierWithdrawal(_amount);

    }

    // HELPER METHODS

    /**
    * @dev Function to get FourierSolution's balance. Only callable by fourier solutions
    */
    function getFourierBalance() onlyOwner public constant returns (uint _balance) {
        return this.balance;
    }

    /**
     * @dev Function to get the total number of transactions a retailer has incurred
     */
    function getNumTransactions() public constant returns (uint) {
        return numTransactions;
    }

}