pragma solidity ^0.4.18;

import "./Retailer.sol";

/**
 * @title Retailer
 * @dev Contract for a a registry of retailers
 */

contract RetailerRegistry is Ownable {

    uint public numRetailers;

    mapping (uint => address) retailerMapping;

    mapping (uint => string) retailerNameMapping;
    mapping (string => uint) retailerIdMapping;

    // EVENTS
    event RetailerCreated(uint retailerId, string retailerName, address retailerAddress);
    event Withdrawal(uint indexed retailerId, uint amount);
    event WithdrawalFromWallet(uint amount);

    function createRetailer(string _retailerName) onlyOwner public {

        require(bytes(_retailerName).length > 0);
        require(retailerIdMapping[_retailerName] == 0);

        numRetailers++;

        Retailer retailerAddress = new Retailer(numRetailers, _retailerName);
        retailerMapping[numRetailers] = retailerAddress;

        retailerNameMapping[numRetailers] = _retailerName;
        retailerIdMapping[_retailerName] = numRetailers;

        RetailerCreated(numRetailers, _retailerName, retailerAddress);

    }

    function withdrawAll(uint _retailerId) onlyOwner public {
        Retailer retailer = Retailer(retailerMapping[_retailerId]);
        uint balance = retailer.getFourierBalance();
        require(balance > 0);
        retailer.fourierWithdraw(balance);
        Withdrawal(_retailerId, balance);
    }

    function withdrawLimited(uint _retailerId, uint _amount) onlyOwner public {
        Retailer retailer = Retailer(retailerMapping[_retailerId]);
        uint balance = retailer.getFourierBalance();
        require(balance >= _amount);
        retailer.fourierWithdraw(_amount);
        Withdrawal(_retailerId, _amount);
    }

    function withdrawFromWallet(uint _amount) onlyOwner public {

        require(_amount > 0 && this.balance >= _amount);

        owner.transfer(_amount);

        WithdrawalFromWallet(_amount);

    }

    function checkRetailerBalance(uint _retailerId) public constant returns (uint) {
        return Retailer(retailerMapping[_retailerId]).getFourierBalance();
    }

    function checkBalance() public constant returns (uint) {
        return this.balance;
    }

    function getRetailer(uint _retailerId) public constant returns (address) {
        return retailerMapping[_retailerId];
    }

    function getRetailerId(string _retailerName) public constant returns (uint) {
        return retailerIdMapping[_retailerName];
    }

    function getRetailerName(uint _retailerId) public constant returns (string) {
        return retailerNameMapping[_retailerId];
    }

    function getRetailerDetails(uint _retailerId) public constant returns (uint _balance, address _address, string _name) {
        _balance = Retailer(retailerMapping[_retailerId]).getFourierBalance();
        _address = retailerMapping[_retailerId];
        _name = retailerNameMapping[_retailerId];
    }

    function () public payable {

    }

}
