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

	it('Should be able to withdraw a retailers funds', function() {

		return fourierSolutions.retailerWithdraw(1, web3.toWei(0.2, "ether"), {from: accounts[1]})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
				assert.equal(txReceipt.logs[0].event, "RetailerWithdrawal", "The fired event should have been RetailerWithdrawal");
				assert.equal(txReceipt.logs[0].args.retailerId, 1, "The retailer Id should be 1");
				assert.equal(txReceipt.logs[0].args.amount, web3.toWei(0.2, "ether"), "The withdrawn amount should be 0.2 ether");

				return fourierSolutions.getRetailerBalance(1)
			}).then(function(balance) {
				assert.equal(balance, web3.toWei(0.7, "ether"), "The remaining balance should be " + web3.toWei(0.7, "ether"));
			})

	});

	it('Should be able to withdraw fourier solutions funds', function() {

		return fourierSolutions.fourierWithdraw(web3.toWei(0.1, "ether"))
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
				assert.equal(txReceipt.logs[0].event, "FourierWithdrawal", "The fired event should have been FourierWithdrawal");
				assert.equal(txReceipt.logs[0].args.amount, web3.toWei(0.1, "ether"), "The withdrawn amount should be 0.1 ether");

				return fourierSolutions.getFourierBalance()
			}).then(function(balance) {
				assert.equal(balance, 0, "There shouldn't be any balance remaining.");
			})

	})



});
