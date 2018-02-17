let FourierSolutions = artifacts.require('FourierSolutions.sol');

contract('FourierSolutions Registration testing', accounts => {

	let fourierSolutions = {};

	it('Should be able to register a retailer', function() {

		let storeName = 'testStore';

		return FourierSolutions.deployed().then(function(instance) {
			fourierSolutions = instance;
			return fourierSolutions.registerRetailer(storeName);
		}).then(function(txReceipt) {
			assert.equal(txReceipt.logs.length, 1, "There should have been one event fired");
			assert.equal(txReceipt.logs[0].event, "RetailerRegistered", "The event fired should have been RetailerRegistered");
			assert.equal(txReceipt.logs[0].args.owner, accounts[0], "The owner of the retailer should have been " + accounts[0]);
			assert.equal(txReceipt.logs[0].args.retailerName, "testStore", "The name of the retailer should have been " + storeName);
			assert.equal(txReceipt.logs[0].args.retailerId, 1, "The first retailer id should be 1");

			return fourierSolutions.getRetailerByName(storeName);
		}).then(function(retailer) {
			assert.equal(retailer[0], 1, "The retailer id should have been 1");
			assert.equal(retailer[1], 0, "The beginning balance should be 0");
			assert.equal(retailer[2], accounts[0], "The retailer owner should be " + accounts[0]);
			assert.equal(retailer[3], 0, "There should be 0 transactions");

			return fourierSolutions.getRetailer(1);
		}).then(function(retailer) {
			assert.equal(retailer[0], storeName, "The store name should be " + storeName);
			assert.equal(retailer[1], 0, "The beginning balance should be 0");
			assert.equal(retailer[2], accounts[0], "The retailer owner should be " + accounts[0]);
			assert.equal(retailer[3], 0, "There should be 0 transactions");

			return fourierSolutions.getRetailerBalance(1);
		}).then(function(retailerBalance) {
			assert.equal(retailerBalance, 0, "The initial balance should be 0");
		})

	})

});
