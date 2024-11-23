import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: 'cancun'
    },
  },
  networks: {
    z1labs: {
      chainId: 9000,
      url: "http://46.101.206.70:8449",
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;
