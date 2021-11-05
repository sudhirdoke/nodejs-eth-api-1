const myList = artifacts.require("MyList");

module.exports = function (deployer) {
  deployer.deploy(myList);
};