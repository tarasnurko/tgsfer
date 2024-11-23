// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/types/Time.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./fhevm/lib/TFHE.sol";

import "./interfaces/IEncryptedERC20.sol";

/**
 * @title Contrqacts to manage anonyous delayed transfers using EIP712
 */
contract Vault is EIP712 {
    // ERRORS
    error TooEarlyToWithdraw(uint48 unlockWithdrawalTime, uint48 currentTime);

    error DedlieIsNotSet();

    error TooLateToWithdraw(uint48 currentTime, uint48 deadline);

    error InvalidSigner();

    error SignatureAlreadyUsed();

    error SaltAlreadyUsed();

    // CONSTANTS
    bytes32 public constant WITHDRAW_TYPEHASH =
        keccak256(
            "Withdraw(address from,address to,address token,uint48 unlockWithdrawalTime,uint48 deadline,bytes32 withdrawAmount,bytes32 salt"
        );

    // STORAGE
    mapping(address owner => mapping(address token => euint64 balance))
        public deposits;

    mapping(bytes32 signatureHash => bool isUsed) public usedSignatures;
    mapping(address from => mapping(bytes32 salt => bool isUsed))
        public canceledSalt;

    // CONSTRUCTOR
    constructor() EIP712("Vault", "1") {}

    // EXTERNAL FUNCTIONS
    function deposit(
        address token,
        einput encryptedDeposit,
        bytes calldata inputProof
    ) external {
        euint64 currentBalance = deposits[msg.sender][token];
        IEncryptedERC20(token).transferFrom(
            msg.sender,
            address(this),
            encryptedDeposit,
            inputProof
        );
        euint64 newBalance = TFHE.add(
            currentBalance,
            TFHE.asEuint64(encryptedDeposit, inputProof)
        );
        deposits[msg.sender][token] = newBalance;

        TFHE.allow(newBalance, address(this));
        TFHE.allow(newBalance, msg.sender);
        TFHE.allow(newBalance, token);
    }

    /**
     * @notice funciton that is responsible for withdrawal by recepient.
     * @param from signature signer
     * @param to recepient
     * @param token token that recepent allowed to withdraw
     * @param unlockWithdrawalTime time before which recepient can not withdraw funds. If 0 then ignored. Can be used for example to make weekly peyments or as salary, etc.
     * @param deadline time after which withdrawal is not posible and signature become useless
     * @param withdrawAmount encypted amount of tokens that recepient allowed to withdraw
     * @param salt unique salt, mainly used to cancel signature if it's needed. It's used instead of nonces because we allow to create ultiple signatures for sigle or multiple persons.
     * @param inputProof inputProof
     * @param signature depositor signed withdrawal signature
    */
    function withdraw(
        address from,
        address to,
        address token,
        uint48 unlockWithdrawalTime,
        uint48 deadline,
        einput withdrawAmount,
        bytes32 salt,
        bytes calldata inputProof,
        bytes calldata signature
    ) external {
        if (canceledSalt[from][salt]) {
            revert SaltAlreadyUsed();
        }

        bytes32 structHash = keccak256(
            abi.encode(
                WITHDRAW_TYPEHASH,
                from,
                to,
                token,
                unlockWithdrawalTime,
                deadline,
                withdrawAmount,
                salt
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);

        if (usedSignatures[digest]) {
            revert SignatureAlreadyUsed();
        }

        address signer = ECDSA.recover(digest, signature);

        if (signer != from) {
            revert InvalidSigner();
        }

        uint48 currentTimestamp = Time.timestamp();

        if (
            unlockWithdrawalTime != 0 && currentTimestamp > unlockWithdrawalTime
        ) {
            revert TooEarlyToWithdraw(unlockWithdrawalTime, currentTimestamp);
        }

        if (deadline == 0) {
            revert DedlieIsNotSet();
        }

        if (currentTimestamp > deadline) {
            revert TooLateToWithdraw(currentTimestamp, deadline);
        }

        usedSignatures[digest] = true;

        _transferTokensTo(from, to, token, withdrawAmount, inputProof);
    }

    function refund(
        address token,
        einput encryptedWithdrawal,
        bytes calldata inputProof
    ) external {
        _transferTokensTo(
            msg.sender,
            msg.sender,
            token,
            encryptedWithdrawal,
            inputProof
        );
    }

    function cancel(bytes32 salt) external {
        canceledSalt[msg.sender][salt] = true;
    }

    // INTERNAL FUNCTIONS
    function _transferTokensTo(
        address from,
        address to,
        address token,
        einput encryptedAmount,
        bytes calldata inputProof
    ) internal returns (euint64 newBalance) {
        require(to != address(this));

        euint64 currentBalance = deposits[from][token];
        IEncryptedERC20(token).transferFrom(
            address(this),
            to,
            encryptedAmount,
            inputProof
        );
        newBalance = TFHE.sub(
            currentBalance,
            TFHE.asEuint64(encryptedAmount, inputProof)
        );

        deposits[from][token] = newBalance;

        TFHE.allow(newBalance, address(this));
        TFHE.allow(newBalance, from);
        TFHE.allow(newBalance, token);
    }
}
