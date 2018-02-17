# Fourier Solutions


## Interface for use:

### Registering a retailer
Register a retailer by calling `contractInstance.registerRetailer(yourStoreName);`
This will fire the event `RetailerRegistered(address indexed owner, string retailerName, uint retailerId);`
Please keep track of the retailerId as it will be used to interface with the retailer in the future.

### Paying a retailer
You can pay a retailer by calling `contractInstance.payRetailer(retailerId, fourierCut, retailerCut, costInUSD)`
Make sure that the cost in USD is kept as a string for permanent storage.
This will fire the event `TransactionReceived(address indexed sender, uint indexed retailerId, uint amount, uint transactionId);`
Make sure you keep track of the transactionId if you want to look it up later.

### Withdrawing funds
You can withdraw funds from the contract as a retailer or as fourier solutions with the following functions:
1. `contractInstance.retailerWithdraw(retailerId, amount)`
2. `contractInstance.fourierWithdraw(amount)`
Make sure that you are calling these functions from either the retailer owner account or the fourier solutions account.
These functions will fire these events respectively:
1. `RetailerWithdrawal(uint indexed retailerId, uint amount);`
2. `FourierWithdrawal(uint amount);`

### Helpers
The following helper methods are there to help the web3.js front end interface with the smart contract easier:

#### Retailer Helpers
1. `contractInstance.getRetailer(uint retailerId)`
will return all of the retailer's details in an array in the following order:
[string retailerName, uint balance, address owner, uint numTransactions]
2. `contractInstance.getRetailerByName(string retailerName)`
will return the retailer's details using the name and will return the array
[uint retailerId, uint balance, address owner, uint numTransactions]

#### Balance Helpers
1. `contractInstance.getRetailerBalance(uint retailerId)`
will return the balance of the retailer as an uint
2. `contractInstance.getFourierBalance()`
will return the balance of fourierSolution's account. Note that this can only be called by fourier solutions.

#### Transaction Helpers
1. `contractInstance.getNumTransactions(uint retailerId)`
will return the number of transactions that a retailer has incurred. 
2. `contractInstance.getTransaction(uint retailerId, uint transactionId)`
will return the details of a transaction in an array with the format:
[uint time, uint costInWei, uint fourierCut, uint retailerCut, string costInUSD]
This function can be used with getNumTransactions to list the most recent transactions for a retailer.




## Development

To run tests:
1. Install all the necessary packages with `npm install`
2. Run the testrpc with `testrpc`
3. Open a new window and execute `npm run test` to run all the automated tests
or execute `npm run coverage` to see what the test coverage is.

 