let RetailerRegistry = artifacts.require('RetailerRegistry.sol');

contract('Retailer creation testing', accounts => {

	let retailerRegistry = {};
	let retailerAddress;

	it ('Should be able to create a retailer in the registry', function() {

		return RetailerRegistry.deployed().then(function(instance) {
			retailerRegistry = instance;

			return retailerRegistry.createRetailer('testStore');
		}).then(function(txReceipt) {
			assert.equal(txReceipt.logs.length, 1, "There should have been one event fired");
			assert.equal(txReceipt.logs[0].event, "RetailerCreated", "The event fired should have been RetailerCreated");
			assert.equal(txReceipt.logs[0].args.retailerId, 1, "The retailer Id should be 1");
			assert.equal(txReceipt.logs[0].args.retailerName, "testStore", "The store name should be testStore");
			retailerAddress = txReceipt.logs[0].args.retailerAddress;

			return retailerRegistry.getRetailer(1);
		}).then(function(address) {
			assert.equal(address, retailerAddress, "The addresses should be matched");

			return retailerRegistry.getRetailerId('testStore');
		}).then(function(retailerId) {
			assert.equal(retailerId, 1, "The retailer Id should be 1");
		})

	})

});