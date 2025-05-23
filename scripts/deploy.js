
const { ethers } = require("hardhat");

async function main() {
  console.log("Iniciando deploy do NFTGiftCard...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const NFTGiftCard = await ethers.getContractFactory("NFTGiftCard");
  const nftGiftCard = await NFTGiftCard.deploy();
  
  await nftGiftCard.waitForDeployment();
  const contractAddress = await nftGiftCard.getAddress();
  
  console.log("NFTGiftCard deployed to:", contractAddress);
  
  // Salvar endereço e ABI para o frontend
  const fs = require("fs");
  const contractsDir = "./client/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const contractInfo = {
    address: contractAddress,
    abi: JSON.parse(NFTGiftCard.interface.formatJson())
  };
  
  fs.writeFileSync(
    `${contractsDir}/NFTGiftCard.json`,
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to", `${contractsDir}/NFTGiftCard.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
