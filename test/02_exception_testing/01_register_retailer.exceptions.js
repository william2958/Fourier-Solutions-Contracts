let FourierSolutions = artifacts.require('FourierSolutions.sol');

contract('FourierSolutions Registration Exception testing', accounts => {

	let fourierSolutions = {};

	it('Should fail to register two retailers with the same name', function() {

		let storeName = 'testStore';

		return FourierSolutions.deployed().then(function(instance) {
			fourierSolutions = instance;
			return fourierSolutions.registerRetailer(storeName);
		}).then(function(txReceipt) {
			return fourierSolutions.registerRetailer(storeName);
		})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Should fail to register a retailer with no name', function() {

		return fourierSolutions.registerRetailer('')
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

});
