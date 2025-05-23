// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTGiftCard is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    struct GiftCard {
        string merchantName;
        string category;
        uint256 valueInWei;
        uint256 balanceInWei;
        bool isRedeemable;
        bool isRechargeable;
        uint256 expirationDate;
        string metadata;
    }
    
    mapping(uint256 => GiftCard) public giftCards;
    mapping(address => uint256[]) public userGiftCards;
    
    event GiftCardMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string merchantName,
        uint256 value
    );
    
    event GiftCardRedeemed(
        uint256 indexed tokenId,
        address indexed user,
        uint256 amount
    );
    
    event GiftCardRecharged(
        uint256 indexed tokenId,
        address indexed user,
        uint256 amount
    );
    
    constructor() ERC721("NFT Gift Card", "NFTGC") Ownable(msg.sender) {}
    
    function mintGiftCard(
        address to,
        string memory merchantName,
        string memory category,
        uint256 valueInWei,
        bool isRechargeable,
        uint256 expirationDate,
        string memory _tokenURI,
        string memory metadata
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        giftCards[tokenId] = GiftCard({
            merchantName: merchantName,
            category: category,
            valueInWei: valueInWei,
            balanceInWei: valueInWei,
            isRedeemable: true,
            isRechargeable: isRechargeable,
            expirationDate: expirationDate,
            metadata: metadata
        });
        
        userGiftCards[to].push(tokenId);
        
        emit GiftCardMinted(tokenId, to, merchantName, valueInWei);
        
        return tokenId;
    }
    
    function redeemGiftCard(uint256 tokenId, uint256 amount) public {
        require(_ownerOf(tokenId) != address(0), "Gift card does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this gift card");
        require(giftCards[tokenId].isRedeemable, "Gift card is not redeemable");
        require(giftCards[tokenId].balanceInWei >= amount, "Insufficient balance");
        require(block.timestamp <= giftCards[tokenId].expirationDate, "Gift card has expired");
        
        giftCards[tokenId].balanceInWei -= amount;
        
        if (giftCards[tokenId].balanceInWei == 0) {
            giftCards[tokenId].isRedeemable = false;
        }
        
        emit GiftCardRedeemed(tokenId, msg.sender, amount);
    }
    
    function rechargeGiftCard(uint256 tokenId) public payable {
        require(_ownerOf(tokenId) != address(0), "Gift card does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this gift card");
        require(giftCards[tokenId].isRechargeable, "Gift card is not rechargeable");
        require(msg.value > 0, "Must send some value to recharge");
        
        giftCards[tokenId].balanceInWei += msg.value;
        giftCards[tokenId].isRedeemable = true;
        
        emit GiftCardRecharged(tokenId, msg.sender, msg.value);
    }
    
    function getGiftCard(uint256 tokenId) public view returns (GiftCard memory) {
        require(_ownerOf(tokenId) != address(0), "Gift card does not exist");
        return giftCards[tokenId];
    }
    
    function getUserGiftCards(address user) public view returns (uint256[] memory) {
        return userGiftCards[user];
    }
    
    function getBalance(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Gift card does not exist");
        return giftCards[tokenId].balanceInWei;
    }
    
    function isExpired(uint256 tokenId) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Gift card does not exist");
        return block.timestamp > giftCards[tokenId].expirationDate;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}