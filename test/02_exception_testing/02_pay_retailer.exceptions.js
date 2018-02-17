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

	it('Shouldnt be able to pay a 0 amount', function() {

		return fourierSolutions.payRetailer(1, web3.toWei(0.1, "ether"), web3.toWei(0.9, "ether"), "one thousand dollars", {value: 0})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Should be able to fail with a mismatched fourier cut', function() {

		return fourierSolutions.payRetailer(1, web3.toWei(0.05, "ether"), web3.toWei(0.9, "ether"), "one thousand dollars", {value: web3.toWei(1, "ether")})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Should be able to fail with any zero values', function() {

		return fourierSolutions.payRetailer(1, 0, web3.toWei(0.9, "ether"), "one thousand dollars", {value: web3.toWei(1, "ether")})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Should be able to fail with any zero values', function() {

		return fourierSolutions.payRetailer(1, web3.toWei(0.1, "ether"), 0, "one thousand dollars", {value: web3.toWei(1, "ether")})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Should be able to fail to pay a non-existing retailer', function() {

		return fourierSolutions.payRetailer(2, web3.toWei(0.1, "ether"), web3.toWei(0.9, "ether"), "one thousand dollars", {value: web3.toWei(1, "ether")})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	})

});
