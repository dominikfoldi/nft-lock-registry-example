// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.

  // Deploy the NFT contract
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy("NFT", "NFT", "ipfs://QmctTNPWZEqS9pUncB8USs3go6sbSz6RJanQpvzQFz1tiZ/");
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  // Deploy the Locker contract
  const Locker = await hre.ethers.getContractFactory("Locker");
  const locker = await Locker.deploy(nft.address);
  await locker.deployed();
  console.log("Locker deployed to:", locker.address);

  // Add Locker to the NFT's ApprovedContracts list
  await nft.updateApprovedContracts([locker.address], [true]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
