var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var tokens = require('../modules/tools');

//-- ERC20 token contract generic abi
var contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];
var contractAddress = '0xB68c40b9770a97431F1a9630Df66F7f8f8596A87'; // DLPT ropsten address
var secondAddress = '0xdf1bf302ab5a97a8c4435d2061c41b43a8a30a42'; // User 1 ropsten address

//-- my smart contract abi
var transferContractABI = [{"constant":true,"inputs":[],"name":"getContractAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}];
var byteCode = '0x606060405273b68c40b9770a97431f1a9630df66f7f8f8596a876000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550341561006357600080fd5b61024e806100726000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680639e45593914610051578063beabacc8146100a6575b600080fd5b341561005c57600080fd5b6100646100fc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100fa600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610104565b005b600030905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8484846040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15156101fb57600080fd5b5af1151561020857600080fd5b50505060405180519050151561021d57600080fd5b5050505600a165627a7a7230582015c6d9adddf04ced6764dd590149ec7248b0ae9f8e97d4afd30a55c498445a230029';
var transferContractAddress = '0x2d0a862cb09ab8d0585b82f505a399d91d074f93';

web3 = new Web3(new Web3.providers.HttpProvider("http://136.243.38.66:8545"));
var addr = web3.eth.accounts[0];
var web3Message = '';

// -- token part -- //
router.post('/getTokenBalance', function(req, res, next){
	var dlptToken = web3.eth.contract(contractABI).at(contractAddress);

	var balanceOf = req.body.address;
	web3Message = tokens.tBalance(dlptToken, balanceOf);

	res.json({balance:web3Message});
});

router.post('/coinToEscrow', function(req, res, next){
	//--dealing with my contract--//
	var trxcoin = web3.eth.contract(transferContractABI).at(transferContractAddress);

	var fromAddr = req.body.from,
		escrowAcc = req.body.to,
		mainAddr = fromAddr,
		mainPass = req.body.senderPass,
		coinUnit = req.body.unit;
		gasLimit = 4700000; //-- minimum gasLimit = 21000
		gasPrice = 41000000000; //-- 41 Gwei		

	web3.personal.unlockAccount(mainAddr, mainPass, 1500);
	web3Message = tokens.cTransfer(trxcoin, mainAddr, fromAddr, escrowAcc, coinUnit, gasLimit, gasPrice);
	
	res.json({"transactionHash": web3Message});
});

router.post('/coinTransaction', function(req, res, next){
	//--dealing with my contract--//
	var trxcoin = web3.eth.contract(transferContractABI).at(transferContractAddress);

	var fromAddr = req.body.from,
		toAddr = req.body.to,
		mainAddr = fromAddr,
		mainPass = req.body.pass,
		coinUnit = req.body.unit;
		gasLimit = 4700000; //-- minimum gasLimit = 21000
		gasPrice = 41000000000; //-- 41 Gwei		
	
	web3.personal.unlockAccount(mainAddr, mainPass, 1500);
	web3Message = tokens.cTransfer(trxcoin, mainAddr, fromAddr, toAddr, coinUnit, gasLimit, gasPrice);
	
	res.json({"transactionHash": web3Message});
});

router.post('/retryCoinTransaction', function(req, res, next){
	//--dealing with my contract--//
	var trxcoin = web3.eth.contract(transferContractABI).at(transferContractAddress);

	var fromAddr = req.body.from,
		toAddr = req.body.to,
		mainAddr = fromAddr,
		mainPass = req.body.pass,
		coinUnit = req.body.unit;
		nonce = req.body.nonce,
		gasLimit = 4700000; //-- minimum gasLimit = 21000
		gasPrice = 90000000000; //-- 90 Gwei		
	
	web3.personal.unlockAccount(mainAddr, mainPass, 1500);
	web3Message = tokens.cTransfer(trxcoin, mainAddr, fromAddr, toAddr, coinUnit, nonce, gasLimit, gasPrice);
	
	res.json({"transactionHash": web3Message});
});



// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
