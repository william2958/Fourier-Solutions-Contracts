let FourierSolutions = artifacts.require('FourierSolutions.sol');

contract('FourierSolutions Pay Retailer testing', accounts => {

	let fourierSolutions = {};
	let storeName = 'testStore';

	before(function() {
		return FourierSolutions.deployed().then(function(instance) {
			fourierSolutions = instance;
			return fourierSolutions.registerRetailer(storeName, {from: accounts[1]})
		}).then(function(txReceipt) {
			return fourierSolutions.payRetailer(1, web3.toWei(0.1, "ether"), web3.toWei(0.9, "ether"), "one thousand dollars", {value: web3.toWei(1, "ether")})
		})
	});

	it('Retailers shouldnt be able to withdraw nothing', function() {

		return fourierSolutions.retailerWithdraw(1, web3.toWei(0, "ether"), {from: accounts[1]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Shouldnt let withdraw from a retailer that doesnt exist yet', function() {

		return fourierSolutions.retailerWithdraw(4, web3.toWei(0.1, "ether"), {from: accounts[1]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it ('Shouldnt let retailers withdraw more than they have in balance', function() {

		return fourierSolutions.retailerWithdraw(1, web3.toWei(1, "ether"), {from: accounts[1]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it ('Shouldnt let non owner withdraw from retailer', function() {

		return fourierSolutions.retailerWithdraw(1, web3.toWei(0.1, "ether"), {from: accounts[0]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	});

	it('Shouldnt let anyone but fourier solutions withdraw from their balance', function() {

		return fourierSolutions.fourierWithdraw(web3.toWei(0.1, "ether"), {from: accounts[3]})
			.then(assert.fail)
			.catch(function(error) {
				assert(error.message.indexOf('revert') >= 0, "error should be revert");
			})

	})



});
