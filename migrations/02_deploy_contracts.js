// const FourierSolutions = artifacts.require('FourierSolutions');
const RetailerRegistry = artifacts.require('RetailerRegistry');

module.exports = function(deployer) {
	// deployer.deploy(FourierSolutions);
	deployer.deploy(RetailerRegistry);
};
