const fms = artifacts.require("fms");

module.exports = function(deployer) {
  deployer.deploy(fms);
};
