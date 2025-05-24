const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Iniciando deploy do NFTGiftCard...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const NFTGiftCard = await hre.ethers.getContractFactory("NFTGiftCard");
  const nftGiftCard = await NFTGiftCard.deploy();
  
  await nftGiftCard.waitForDeployment();
  const contractAddress = await nftGiftCard.getAddress();
  
  console.log("NFTGiftCard deployed to:", contractAddress);
  
  // Salvar endereço e ABI para o frontend
  const contractsDir = path.join(__dirname, "../client/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const contractInfo = {
    address: contractAddress,
    abi: JSON.parse(NFTGiftCard.interface.formatJson())
  };
  
  fs.writeFileSync(
    path.join(contractsDir, "NFTGiftCard.json"),
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to", path.join(contractsDir, "NFTGiftCard.json"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });