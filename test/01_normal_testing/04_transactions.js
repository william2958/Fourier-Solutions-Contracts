let FourierSolutions = artifacts.require('FourierSolutions.sol');

contract('FourierSolutions Pay Retailer testing', accounts => {

	let fourierSolutions = {};
	let storeName = 'testStore';
	let transactionId;

	before(function() {
		return FourierSolutions.deployed().then(function(instance) {
			fourierSolutions = instance;
			return fourierSolutions.registerRetailer(storeName, {from: accounts[1]})
		}).then(function(txReceipt) {
			return fourierSolutions.payRetailer(1, web3.toWei(0.1, "ether"), web3.toWei(0.9, "ether"), "one thousand dollars", {value: web3.toWei(1, "ether")})
		}).then(function(txReceipt) {
			transactionId = txReceipt.logs[0].args.transactionId;
		})
	});

	it('Should be able to get the number of transactions for a retailer', function() {

		return fourierSolutions.getNumTransactions(1)
			.then(function(numTransactions) {
				assert.equal(numTransactions, 1, "There should be a total of 1 transaction for retailer 1");
			})

	});

	it('Should be able to get a specific transaction', function() {

		return fourierSolutions.getTransaction(1, transactionId)
			.then(function(transaction) {
				assert.equal(transaction[1], web3.toWei(1, "ether"), "The cost in wei should have been " + web3.toWei(1, "ether"));
				assert.equal(transaction[2], web3.toWei(0.1, "ether"), "Fouriers cut should be " + web3.toWei(0.1, "ether"));
				assert.equal(transaction[3], web3.toWei(0.9, "ether"), "The retailers cut should be " + web3.toWei(0.9, "ether"));
				assert.equal(transaction[4], "one thousand dollars", "The price in usd should be one thousand dollars");
			})

	});



});
