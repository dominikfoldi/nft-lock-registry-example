const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Locker", function () {
  let owner;
  let addresses;
  let NFT;
  let nft;
  let Locker;
  let locker;

  beforeEach(async function () {
    [owner, ...addresses] = await ethers.getSigners();
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy("NFT", "NFT", "ipfs://QmctTNPWZEqS9pUncB8USs3go6sbSz6RJanQpvzQFz1tiZ/");
    Locker = await hre.ethers.getContractFactory("Locker");
    locker = await Locker.deploy(nft.address);
    
    await nft.updateApprovedContracts([locker.address], [true]);
  });

  it("Should lock a minted NFT", async function () {
    const tokenId = 1;

    const mintTx = await nft.mint(tokenId);
    await mintTx.wait();

    expect(await nft.ownerOf(tokenId)).to.equal(owner.address);

    const lockNFTTx = await locker.lockNFT(tokenId)
    await lockNFTTx.wait();
  });

  it("Should prevent a locked NFT to be transferred", async function () {
    const tokenId = 1;

    const mintTx = await nft.mint(tokenId);
    await mintTx.wait();

    expect(await nft.ownerOf(tokenId)).to.equal(owner.address);

    const lockNFTTx = await locker.lockNFT(tokenId)
    await lockNFTTx.wait();

    await expect(
      nft["safeTransferFrom(address,address,uint256)"](owner.address, addresses[0].address, 1)
      ).to.be.revertedWith("Token is locked");
  });

  it("Should unlock a locked NFT", async function () {
    const tokenId = 1;

    const mintTx = await nft.mint(tokenId);
    await mintTx.wait();

    expect(await nft.ownerOf(tokenId)).to.equal(owner.address);

    const lockNFTTx = await locker.lockNFT(tokenId)
    await lockNFTTx.wait();
    
    const unlockNFTTx = await locker.unlockNFT(tokenId);
    await unlockNFTTx.wait();
  });
});
