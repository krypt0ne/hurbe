import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";
import HurbeTokenModule from "./HurbeToken";

const HurbeModule = buildModule("HurbeModule", (m) => {
  const { hurbeToken } = m.useModule(HurbeTokenModule);

  const hurbe = m.contract("Hurbe", [hurbeToken]);

  return { hurbe };
});

export default HurbeModule;
