// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentAccessManager is Ownable {
    constructor() Ownable(msg.sender) {}
    mapping(address => mapping(uint256 => bool)) public ownership;

    mapping(uint256 => mapping(address => bool)) public privateAccess;

    event AccessGranted(uint256 agentId, address user);
    event OwnershipSet(uint256 agentId, address user);

    function grantPrivateAccess(uint256 agentId, address user)
        external
        onlyOwner
    {
        privateAccess[agentId][user] = true;

        emit AccessGranted(agentId, user);
    }

    function setOwnership(address user, uint256 agentId)
        external
        onlyOwner
    {
        ownership[user][agentId] = true;

        emit OwnershipSet(agentId, user);
    }

    function hasAccess(address user, uint256 agentId)
        external
        view
        returns (bool)
    {
        return ownership[user][agentId];
    }
}