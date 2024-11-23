// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "../fhevm/lib/TFHE.sol";

interface IEncryptedERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function totalSupply() external view returns (uint64);

    function mint(uint64 mintedAmount) external;

    function transfer(
        address to,
        einput encryptedAmount,
        bytes calldata inputProof
    ) external returns (bool);

    function balanceOf(address wallet) external view returns (euint64);

    function approve(
        address spender,
        einput encryptedAmount,
        bytes calldata inputProof
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (euint64);

    function transferFrom(
        address from,
        address to,
        einput encryptedAmount,
        bytes calldata inputProof
    ) external returns (bool);
}
