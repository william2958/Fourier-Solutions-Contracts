let Retailer = artifacts.require('Retailer.sol');

contract('Retailer Creation testing', accounts => {

	let retailer = {};

	before (function() {
		return Retailer.new(1, "testStore")
			.then(function(instance) {
				retailer = instance;
			})
	});

	it('Should be able to pay a retailer', function() {

		return retailer.payRetailer({from: accounts[0], to: retailer.address, value: web3.toWei(0.1, "ether")})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
				assert.equal(txReceipt.logs[0].event, "TransactionReceived", "The event should be TransactionReceived");
			})

	});

	it('Should be able to pay a retailer with direct send transaction', function() {

		return web3.eth.sendTransaction({from: accounts[0], to: retailer.address, value: web3.toWei(0.1, "ether")});

	})

});