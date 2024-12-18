import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const { HEDERA_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: HEDERA_RPC_URL,
      chainId: 296,
      accounts: [PRIVATE_KEY],
    },
  },
};
