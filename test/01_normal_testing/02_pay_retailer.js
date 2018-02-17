let FourierSolutions = artifacts.require('FourierSolutions.sol');

contract('FourierSolutions Pay Retailer testing', accounts => {

	let fourierSolutions = {};
	let storeName = 'testStore';

	before(function() {
		return FourierSolutions.deployed().then(function(instance) {
			fourierSolutions = instance;
			return fourierSolutions.registerRetailer(storeName)
		});
	});

	it('Should be able to pay a retailer', function() {

		return fourierSolutions.payRetailer(1, web3.toWei(0.1, "ether"), web3.toWei(0.9, "ether"), "one thousand dollars", {value: web3.toWei(1, "ether")})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
				assert.equal(txReceipt.logs[0].event, "TransactionReceived", "The event should have been TransactionReceived");
				assert.equal(txReceipt.logs[0].args.sender, accounts[0], "The sender should have been " + accounts[0]);
				assert.equal(txReceipt.logs[0].args.retailerId, 1, "The store id should have been 1");
				assert.equal(txReceipt.logs[0].args.amount, web3.toWei(1, "ether"), "Amount paid should have been ", web3.toWei(1, "ether"));
				assert.equal(txReceipt.logs[0].args.transactionId, 1, "The transaction id should be 1");
			})

	});

	it('Should be able to get the correct balance of a retailer', function() {

		return fourierSolutions.getRetailerBalance(1)
			.then(function(balance) {
				assert.equal(balance.toNumber(), web3.toWei(0.9, "ether"), "The retailer's balance should be ", web3.toWei(0.9, "ether"));
				return fourierSolutions.getFourierBalance()
			}).then(function(balance) {
				assert.equal(balance.toNumber(), web3.toWei(0.1, "ether"), "Fourier's balance should be ", web3.toWei(0.1, "ether"));
			})

	})

});
