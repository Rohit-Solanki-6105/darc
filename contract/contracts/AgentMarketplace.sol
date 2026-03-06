// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./AgentRegistry.sol";
import "./AgentAccessManager.sol";
import "./libraries/AgentStructs.sol";

contract AgentMarketplace is Ownable, ReentrancyGuard {
    AgentRegistry public registry;
    AgentAccessManager public accessManager;

    uint256 public platformFee = 5;

    event AgentPurchased(uint256 agentId, address buyer);
    event TaskExecuted(uint256 agentId, address user);

    constructor(
        address registryAddress,
        address accessAddress
    ) Ownable(msg.sender) {
        registry = AgentRegistry(registryAddress);
        accessManager = AgentAccessManager(accessAddress);
    }

    function buyAgent(uint256 agentId) external payable nonReentrant {
        AgentStructs.Agent memory agent = registry.getAgent(agentId);

        require(agent.active, "Inactive");
        require(!agent.payPerTask, "Use task payment");
        require(msg.value >= agent.price, "Insufficient");

        uint256 fee = (msg.value * platformFee) / 100;
        uint256 developerAmount = msg.value - fee;

        // payable(agent.developer).transfer(developerAmount);
        (bool success, ) = payable(agent.developer).call{
            value: developerAmount
        }("");
        require(success, "Payment failed");

        accessManager.setOwnership(msg.sender, agentId);

        emit AgentPurchased(agentId, msg.sender);
    }

    function payPerTask(uint256 agentId) external payable nonReentrant {
        AgentStructs.Agent memory agent = registry.getAgent(agentId);

        require(agent.payPerTask, "Not pay-per-task");
        require(msg.value >= agent.taskPrice, "Insufficient");

        uint256 fee = (msg.value * platformFee) / 100;
        uint256 developerAmount = msg.value - fee;

        // payable(agent.developer).transfer(developerAmount);
        (bool success, ) = payable(agent.developer).call{
            value: developerAmount
        }("");
        require(success, "Payment failed");

        emit TaskExecuted(agentId, msg.sender);
    }

    function setPlatformFee(uint256 fee) external onlyOwner {
        platformFee = fee;
    }
}
