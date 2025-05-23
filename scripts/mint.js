
const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  
  // Carregar contrato deployado
  const NFTGiftCard = await ethers.getContractFactory("NFTGiftCard");
  const contractAddress = require("../client/src/contracts/NFTGiftCard.json").address;
  const nftGiftCard = NFTGiftCard.attach(contractAddress);

  console.log("Mintando NFT Gift Card...");

  const tx = await nftGiftCard.mintGiftCard(
    owner.address,
    "Amazon",
    "E-commerce",
    ethers.parseEther("0.1"),
    true,
    Math.floor(Date.now() / 1000) + 31536000, // 1 ano
    "ipfs://placeholder/metadata.json",
    JSON.stringify({customData: "Test NFT"})
  );

  await tx.wait();
  console.log("NFT mintado com sucesso!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
