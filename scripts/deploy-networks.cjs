const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log(`Deploying NFTGiftCard to ${network}...`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const NFTGiftCard = await hre.ethers.getContractFactory("NFTGiftCard");
  console.log("Deploying contract...");
  
  const nftGiftCard = await NFTGiftCard.deploy();
  await nftGiftCard.waitForDeployment();
  
  const contractAddress = await nftGiftCard.getAddress();
  console.log("NFTGiftCard deployed to:", contractAddress);
  
  // Save contract info for frontend
  const contractsDir = path.join(__dirname, "../client/src/contracts");
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const contractInfo = {
    address: contractAddress,
    network: network,
    chainId: hre.network.config.chainId,
    abi: JSON.parse(NFTGiftCard.interface.formatJson())
  };
  
  const fileName = network === 'hardhat' || network === 'localhost' 
    ? "NFTGiftCard.json" 
    : `NFTGiftCard-${network}.json`;
    
  fs.writeFileSync(
    path.join(contractsDir, fileName),
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log(`Contract info saved to ${fileName}`);
  
  // Verify contract on Etherscan/Polygonscan (for testnets)
  if (network === 'sepolia' || network === 'amoy') {
    console.log("Waiting for block confirmations...");
    await nftGiftCard.deploymentTransaction().wait(5);
    
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deploy failed:", error);
    process.exit(1);
  });