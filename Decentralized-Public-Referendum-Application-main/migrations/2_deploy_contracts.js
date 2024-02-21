var Election = artifacts.require("./PublicReferendum.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
};
