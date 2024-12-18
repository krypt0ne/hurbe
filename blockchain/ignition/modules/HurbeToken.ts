import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";

const HurbeTokenModule = buildModule("HurbeTokenModule", (m) => {
  const hurbeToken = m.contract("HurbeToken", []);

  return { hurbeToken };
});

export default HurbeTokenModule;
