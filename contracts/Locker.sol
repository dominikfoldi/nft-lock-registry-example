// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./ERC721LockRegistry/interfaces/ILockERC721.sol";

contract Locker {
    ILockERC721 public nft;

    mapping(uint256 => bool) public lockedNfts;

    event NFTLocked(address owner, uint256 id);
    event NFTUnlocked(address owner, uint256 id);

    constructor(address _nft) {
        nft = ILockERC721(_nft);
    }

    function lockNFT(uint256 tokenId) external {
        require(nft.ownerOf(tokenId) == msg.sender, "Only owner can lock");
        require(!lockedNfts[tokenId], "Already locked");

        nft.lockId(tokenId);
        lockedNfts[tokenId] = true;

        emit NFTLocked(msg.sender, tokenId);
    }

    function unlockNFT(uint256 tokenId) external {
        require(nft.ownerOf(tokenId) == msg.sender, "Only owner can unlock");
        require(lockedNfts[tokenId], "Already unlocked");

        nft.unlockId(tokenId);
        lockedNfts[tokenId] = false;

        emit NFTUnlocked(msg.sender, tokenId);
    }
}
