module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	networks: {
		development: {
			host: 'localhost',
			port: 8545,
			network_id: '*'
		},
		live: {
			network_id: 1,
			host: "localhost",
			port: 8546,
			from: "0xc5aad3b44b48230ae387bad2ac39e272b21090d8"
		},
		rinkeby: {
			host: "localhost", // Connect to geth on the specified
			port: 8545,
			// default address to use for any transaction Truffle makes during migrations
			from: "0x9dd5ae6d95d1e7cd88c0b79a4cdbc0d84a800ca7",
			network_id: 4,
			gas: 4612388 // Gas limit used for deploys
		}
	}
};
