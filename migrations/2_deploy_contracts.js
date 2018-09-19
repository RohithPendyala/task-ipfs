var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HappyTokenSale = artifacts.require("./HappyTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage, 1000000).then(function(){
  		var tokenPrice = 1000000000000000;
  		return deployer.deploy(HappyTokenSale, SimpleStorage.address, tokenPrice);
  	});
};



