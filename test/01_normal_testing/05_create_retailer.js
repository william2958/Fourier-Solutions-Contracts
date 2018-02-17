let Retailer = artifacts.require('Retailer.sol');

contract('Retailer Creation testing', accounts => {

	let retailer = {};

	it ('Should be able to create a retailer', function() {

		return Retailer.new(1, "testStore")
			.then(function(instance) {
				retailer = instance;
				return retailer.retailerName()
			}).then(function(name) {
				assert.equal(name, "testStore", "The name of the store should be testStore");
				return retailer.retailerId()
			}).then(function(id) {
				assert.equal(id, 1, "The id of the store should be 1");
			})

	})

});