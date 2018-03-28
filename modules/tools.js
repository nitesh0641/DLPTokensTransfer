module.exports = {
	tName: function (token) {
		return token.name.call();
	},
	tBalance: function(token, addr) {
		return token.balanceOf.call(addr).toString(10);
	},
	cAddress: function(contract) {
		return contract.getContractAddr.call();
	},
	cTransfer: function(contract, mainAddr, fromAddress, toAddress, units) {
		return contract.transfer.sendTransaction(fromAddress,toAddress,units,{from:mainAddr,gas:4700000,gasPrice:41000000000});
		// return contract.transfer(fromAddress, toAddress, units);
	}
};

