// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HurbeToken is ERC20 {
    constructor() ERC20("Hurbe Token", "HUB") {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }
}
