
import { getSigners } from "./utils/signers";
import { Vault } from "../typechain-types";
import { ethers } from "hardhat";

async function deployVaultFixture(): Promise<Vault> {
    const signers = await getSigners();

    const contractFactory = await ethers.getContractFactory("Vault");
    const contract = await contractFactory.connect(signers.alice).deploy();
    await contract.waitForDeployment();

    return contract;
}