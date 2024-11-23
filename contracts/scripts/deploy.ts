import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners()
    const contractFactory = await ethers.getContractFactory("Vault");
    const contract = await contractFactory.connect(deployer).deploy();
    await contract.waitForDeployment();

    console.log('Contract deployed to address:', await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
