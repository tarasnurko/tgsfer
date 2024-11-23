import { ethers } from "hardhat";

// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    // Get the contract factory
    const MyContract = await ethers.getContractFactory('');

    // Deploy the contract
    const myContract = await MyContract.deploy('Hello, Hardhat!');

    console.log('Contract deployed to address:', myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
