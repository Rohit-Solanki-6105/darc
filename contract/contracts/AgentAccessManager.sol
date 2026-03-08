// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentAccessManager is Ownable {
    mapping(address => mapping(uint256 => bool)) public ownership;

    mapping(address => mapping(uint256 => uint256)) public subscriptionExpiry;

    constructor() Ownable(msg.sender) {}

    function setOwnership(address user, uint256 agentId) external onlyOwner {
        ownership[user][agentId] = true;
    }

    function setSubscription(
        address user,
        uint256 agentId,
        uint256 expiry
    ) external onlyOwner {
        subscriptionExpiry[user][agentId] = expiry;
    }

    function hasAccess(
        address user,
        uint256 agentId
    ) public view returns (bool) {
        if (ownership[user][agentId]) {
            return true;
        }

        if (block.timestamp < subscriptionExpiry[user][agentId]) {
            return true;
        }

        return false;
    }
}
