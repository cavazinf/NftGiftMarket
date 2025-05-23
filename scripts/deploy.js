const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying NFTGiftCard contract...");

  // Get the contract factory
  const NFTGiftCard = await ethers.getContractFactory("NFTGiftCard");

  // Deploy the contract
  const nftGiftCard = await NFTGiftCard.deploy();

  await nftGiftCard.waitForDeployment();

  const contractAddress = await nftGiftCard.getAddress();
  
  console.log("NFTGiftCard deployed to:", contractAddress);
  
  // Save the contract address for frontend integration
  const fs = require("fs");
  const contractInfo = {
    address: contractAddress,
    abi: nftGiftCard.interface.fragments
  };
  
  fs.writeFileSync(
    "client/src/contracts/NFTGiftCard.json",
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to client/src/contracts/NFTGiftCard.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });