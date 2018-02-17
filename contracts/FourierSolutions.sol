pragma solidity ^0.4.18;

import "./Ownable.sol";

/**
 * @title FourierSolutions
 * @dev Contract for FourierSolutions payment model
 */
contract FourierSolutions is Ownable{

    struct Retailer {
        string name;
        uint id;
        // balance in wei
        uint balance;
        address retailerOwner;
        uint numTransactions;
    }

    struct Transaction {
        uint transactionId;
        uint time;
        uint totalCostInWei;
        uint fourierCut;
        uint retailerCut;
        string costInUSD;
    }

    // Mapping of retailer id to retailers
    mapping (uint => Retailer) retailerMapping;
    // Also allows users to find the name of a retailer from the id
    mapping (uint => string) retailerNameMapping;
    // Mapping to find the id of a retailer from the name
    mapping (string => uint) retailerIdMapping;

    // Mapping of retailer id to transaction id
    mapping (uint => mapping (uint => Transaction)) transactionMapping;

    // Number to keep track of the # of retailers as well as set new retailer ids
    uint public numRetailers;
    // Mapping of retailer id to number of transactions for that retailer
    mapping (uint => uint) numTransactions;

    // FourierSolution's balance
    uint fourierSolutionsBalance;

    // EVENTS
    event RetailerRegistered(address indexed owner, string retailerName, uint retailerId);
    event TransactionReceived(address indexed sender, uint indexed retailerId, uint amount, uint transactionId);
    event RetailerWithdrawal(uint indexed retailerId, uint amount);
    event FourierWithdrawal(uint amount);


    /**
     * @dev Function to register a retailer with fourier solutions
     * @param _retailerName string the name that the retailer wishes to use
     */
    function registerRetailer(string _retailerName) public {

        // Some checking
        require(bytes(_retailerName).length > 0);
        require(retailerIdMapping[_retailerName] == 0);

        // Increment the num retailers counter to set custom id for new retailer
        numRetailers++;

        // Create the retailer and assign it in the mapping
        retailerMapping[numRetailers] = Retailer({
            name: _retailerName,
            id: numRetailers,
            balance: 0,
            retailerOwner: msg.sender,
            numTransactions: 0
        });

        // Set the name to id
        retailerNameMapping[numRetailers] = _retailerName;
        // Set the id to name
        retailerIdMapping[_retailerName] = numRetailers;

        // Emit the event
        RetailerRegistered(msg.sender, _retailerName, numRetailers);

    }

    /**
     * @dev Function used to create a transaction where a customer pays a retailer
     * @param _retailerId uint id of the retailer that is being paid.
     * @param _fourierCut uint fee that is charged by fourier
     * @param _retailerCut uint amount that is given to the retailer
     * @param _costInUSD string amount in USD that the transaction is charging
     */
    function payRetailer(uint _retailerId, uint _fourierCut, uint _retailerCut, string _costInUSD) public payable {

        // Make sure that the payment amounts add up
        require(msg.value > 0);
        require(msg.value == _fourierCut + _retailerCut);
        require(_fourierCut > 0 && _retailerCut > 0);

        // Get a storage pointer to the retailer
        Retailer storage retailer = retailerMapping[_retailerId];

        // Make sure that the retailer exists
        require(retailer.id > 0);
        // Overflow protection
        require(retailer.balance + msg.value > retailer.balance);

        // Increment the number of transactions this retailer owns
        numTransactions[_retailerId] += 1;
        transactionMapping[_retailerId][numTransactions[_retailerId]] = Transaction({
            transactionId: numTransactions[_retailerId],
            time: now,
            totalCostInWei: msg.value,
            fourierCut: _fourierCut,
            retailerCut: _retailerCut,
            costInUSD: _costInUSD
        });

        // Add the balance to the retailer
        retailer.balance += _retailerCut;
        // Add the balance to fourier solutions
        fourierSolutionsBalance += _fourierCut;

        // Fire the event that we have received a transaction
        TransactionReceived(msg.sender, _retailerId, msg.value, numTransactions[_retailerId]);

    }

    /**
     * @dev Function for retailers to withdraw their funds from the contract
     * @param _retailerId uint id of the retailer.
     * @param _amount uint amount that the retailer wishes to withdraw
     */
    function retailerWithdraw(uint _retailerId, uint _amount) external {

        Retailer memory retailer = retailerMapping[_retailerId];

        // Make sure the numbers add up
        require(_amount > 0 && _retailerId > 0);
        require(retailer.balance >= _amount);
        // overflow check
        require(retailer.balance - _amount < retailer.balance);
        require(retailer.retailerOwner == msg.sender);

        // Subtract the amount first
        retailerMapping[_retailerId].balance -= _amount;

        // If everything is good then transfer that amount over to the retailer owner
        msg.sender.transfer(_amount);

        // Emit the event
        RetailerWithdrawal(_retailerId, _amount);

    }

    /**
     * @dev Function for Fourier Solutions to withdraw their funds from the contract
     * @param _amount uint amount that is to be withdrawn
     */
    function fourierWithdraw(uint _amount) onlyOwner external {

        require(_amount > 0);
        require(fourierSolutionsBalance >= _amount);
        // overflow check
        require(fourierSolutionsBalance - _amount < fourierSolutionsBalance);

        // Subtract the amount first
        fourierSolutionsBalance -= _amount;

        // If everything is good then transfer the amount ot fourier solutions
        owner.transfer(_amount);

        // Emit the event
        FourierWithdrawal(_amount);

    }



    // HELPER METHODS

    /**
     * @dev Function to get the retailer details from it's id
     * @param _retailerId the id of the retailer
     */
    function getRetailer(uint _retailerId) public constant returns (
        string _retailerName,
        uint _balance,
        address _retailerOwner,
        uint _numTransactions
    ) {

        Retailer memory retailer = retailerMapping[_retailerId];

        _retailerName = retailer.name;
        _balance = retailer.balance;
        _retailerOwner = retailer.retailerOwner;
        _numTransactions = retailer.numTransactions;

    }

    /**
     * @dev Function to get the retailer details from it's id
     * @param _retailerName the name of the retailer
     */
    function getRetailerByName(string _retailerName) public constant returns (
        uint _retailerId,
        uint _balance,
        address _retailerOwner,
        uint _numTransactions
    ) {

        Retailer memory retailer = retailerMapping[retailerIdMapping[_retailerName]];

        _retailerId = retailer.id;
        _balance = retailer.balance;
        _retailerOwner = retailer.retailerOwner;
        _numTransactions = retailer.numTransactions;

    }

    /**
     * @dev Function to get the retailer's current balance
     * @param _retailerId the id of the retailer
     */
    function getRetailerBalance(uint _retailerId) public constant returns (uint _balance) {
        return retailerMapping[_retailerId].balance;
    }

    /**
     * @dev Function to get FourierSolution's balance. Only callable by fourier solutions
     */
    function getFourierBalance() onlyOwner public constant returns (uint _balance) {
        return fourierSolutionsBalance;
    }

    /**
     * @dev Function to get the total number of transactions a retailer has incurred
     * @param _retailerId the id of the retailer
     */
    function getNumTransactions(uint _retailerId) public constant returns (uint _numTransactions) {
        return numTransactions[_retailerId];
    }

    /**
     * @dev Used to get a certain transaction for a retailer. This can be used with the getNumTransactions
     *      method to fetch a list of most current transactions.
     * @param _retailerId uint the id of the retailer that needs to be searched up
     * @param _transactionId uint the specific id of the transaction you are looking for
     */
    function getTransaction(uint _retailerId, uint _transactionId) public constant returns (
        uint _time,
        uint _costInWei,
        uint _fourierCut,
        uint _retailerCut,
        string _costInUSD
    ) {

        Transaction memory transaction = transactionMapping[_retailerId][_transactionId];

        _time = transaction.time;
        _costInWei = transaction.totalCostInWei;
        _fourierCut = transaction.fourierCut;
        _retailerCut = transaction.retailerCut;
        _costInUSD = transaction.costInUSD;

    }

}
