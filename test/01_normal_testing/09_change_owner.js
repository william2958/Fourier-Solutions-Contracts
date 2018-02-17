let RetailerRegistry = artifacts.require('RetailerRegistry.sol');

contract('Retailer Owner Change testing', accounts => {

	let retailerRegistry = {};
	let retailerAddress;
	let initialBalance;

	before (function() {

		return RetailerRegistry.deployed().then(function(instance) {
			retailerRegistry = instance;

			return retailerRegistry.createRetailer('testStore');
		}).then(function(txReceipt) {
			retailerAddress = txReceipt.logs[0].args.retailerAddress;

			return web3.eth.sendTransaction({from: accounts[1], to: retailerAddress, value: web3.toWei(0.1, "ether")})
		})

	});

	it('Should be able to transfer ownership to accounts[4]', function() {
		return retailerRegistry.changeOwner(accounts[4])
	});

	it('Should be able to withdraw the 0.1 ether from the retailer', function() {

		return retailerRegistry.checkBalance()
			.then(function(balance) {
				initialBalance = balance;
				return retailerRegistry.withdrawAll(1, {from:accounts[4]})
			})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been 1 event fired");
				assert.equal(txReceipt.logs[0].event, "Withdrawal", "The event should have been Withdrawal");
				assert.equal(txReceipt.logs[0].args.retailerId, 1, "The retailer id should be 1");
				assert.equal(txReceipt.logs[0].args.amount, web3.toWei(0.1, "ether"), "The withdrawal amount should be " + web3.toWei(0.1, "ether"));
				return retailerRegistry.checkBalance()
			})
			.then(function(balance) {
				assert.equal(balance.toNumber(), initialBalance + web3.toWei(0.1, "ether"), "The wallet should be 0.1 ether richer");
				return web3.eth.sendTransaction({from: accounts[1], to: retailerAddress, value: web3.toWei(0.1, "ether")});
			})

	});

	it('Should be able to withdraw 0.05 ether out from the retailer', function() {

		return retailerRegistry.checkBalance()
			.then(function(balance) {
				initialBalance = balance;
				return retailerRegistry.withdrawLimited(1, web3.toWei(0.05, "ether"), {from: accounts[4]})
			})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been 1 event fired");
				assert.equal(txReceipt.logs[0].event, "Withdrawal", "The event should have been Withdrawal");
				assert.equal(txReceipt.logs[0].args.retailerId, 1, "The retailer id should be 1");
				assert.equal(txReceipt.logs[0].args.amount, web3.toWei(0.05, "ether"), "The withdrawal amount should be " + web3.toWei(0.05, "ether"));
				return retailerRegistry.checkBalance()
			})
			.then(function(balance) {
				assert.equal(balance - initialBalance, web3.toWei(0.05, "ether"), "The wallet should be 0.05 ether richer");
			})

	});

	it('Should be able to withdraw from the wallet', function() {

		return retailerRegistry.withdrawFromWallet(web3.toWei(0.15, "ether"), {from: accounts[4]})
			.then(function(txReceipt) {
				assert.equal(txReceipt.logs.length, 1, "There should have been one event emitted");
				assert.equal(txReceipt.logs[0].event, "WithdrawalFromWallet", "The event fired should have been WithdrawalFromWallet");
				assert.equal(txReceipt.logs[0].args.amount, web3.toWei(0.15, "ether"), "the withdrawn amount should be " + web3.toWei(0.15, "ether"));
			})

	})

});
